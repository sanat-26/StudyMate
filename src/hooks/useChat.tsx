import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';
import { useProgress } from './useProgress';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

const CHAT_URL = `${
  import.meta.env.VITE_SUPABASE_URL
}/functions/v1/chat?api_key=${
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
}`;

export const useChat = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { incrementQuestions } = useProgress();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [chatCleared, setChatCleared] = useState(localStorage.getItem('chatCleared') === 'true');

  const fetchMessages = async () => {
    if (!user || localStorage.getItem('chatCleared') === 'true') return;

    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      setMessages(data as Message[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, [user]);

  const sendMessage = async (content: string) => {
    if (!user || !content.trim()) return;

    setSending(true);
    setChatCleared(false);
    localStorage.removeItem('chatCleared');

    // Add user message to UI immediately
    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);

    // Save user message to database
    await supabase.from('chat_messages').insert({
      user_id: user.id,
      role: 'user',
      content,
    });

    // Add placeholder for assistant message
    let assistantContent = '';
    const assistantId = `assistant-${Date.now()}`;
    setMessages(prev => [
      ...prev,
      { id: assistantId, role: 'assistant', content: '', created_at: new Date().toISOString() },
    ]);

    try {
      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ message: content, userId: user.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const { answer } = await response.json();
      assistantContent = answer;
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantId ? { ...m, content: assistantContent } : m
        )
      );

      // Save assistant message to database
      await supabase.from('chat_messages').insert({
        user_id: user.id,
        role: 'assistant',
        content: assistantContent,
      });
      await incrementQuestions();

      // No need to refresh messages to get proper IDs, local state is sufficient
    } catch (error: any) {
      console.error('Chat error:', error);
      toast({
        title: 'Chat Error',
        description: error.message,
        variant: 'destructive',
      });
      // Remove placeholder message on error
      setMessages(prev => prev.filter(m => m.id !== assistantId));
    } finally {
      setSending(false);
    }
  };

  const clearChat = async () => {
    if (!user) return;

    setMessages([]); // Clear messages immediately for visual feedback
    toast({ title: 'Chat cleared', description: 'Your conversation history has been deleted.' });

    const { error: deleteError } = await supabase.from('chat_messages').delete().eq('user_id', user.id);
    
    if (deleteError) {
      console.error('Error clearing chat:', deleteError);
      toast({ title: 'Error', description: 'Could not clear chat history permanently.', variant: 'destructive' });
      // If there's an error, attempt to re-fetch messages to show what's still there
      await fetchMessages();
      return;
    }
    setChatCleared(true);
    localStorage.setItem('chatCleared', 'true');
    // No need to fetchMessages here, as the local state is already cleared and DB should be empty
  };

  return { messages, loading, sending, sendMessage, clearChat };
};
