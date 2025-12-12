import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useFiles } from '@/hooks/useFiles';
import { useChat } from '@/hooks/useChat';
import { useProgress } from '@/hooks/useProgress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  BookOpen,
  Upload,
  Send,
  FileText,
  Trash2,
  LogOut,
  MessageSquare,
  TrendingUp,
  Loader2,
  X,
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { files, loading: filesLoading, uploading, uploadFile, deleteFile } = useFiles();
  const { messages, loading: chatLoading, sending, sendMessage, clearChat } = useChat();
  const { progress, loading: progressLoading } = useProgress();
  const [input, setInput] = useState('');
  const [showFiles, setShowFiles] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    const message = input;
    setInput('');
    await sendMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadFile(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-primary">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold">StudyMate</span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowFiles(!showFiles)}>
              <FileText className="w-4 h-4 mr-2" />
              Files ({files.length})
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex max-w-6xl mx-auto w-full">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Stats Bar */}
          <div className="p-4 border-b border-border flex gap-4 overflow-x-auto">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary min-w-fit">
              <MessageSquare className="w-4 h-4" />
              <span className="font-medium">{progress?.questions_asked || 0} Questions</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/20 text-accent-foreground min-w-fit">
              <FileText className="w-4 h-4" />
              <span className="font-medium">{progress?.files_uploaded || 0} Files</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground min-w-fit">
              <TrendingUp className="w-4 h-4" />
              <span className="font-medium">{progress?.study_streak || 0} Day Streak</span>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="p-4 rounded-2xl bg-gradient-primary mb-4">
                  <BookOpen className="w-10 h-10 text-primary-foreground" />
                </div>
                <h2 className="text-xl font-display font-bold mb-2">Welcome to StudyMate!</h2>
                <p className="text-muted-foreground max-w-md mb-6">
                  Upload your study materials and start asking questions. I'll help you learn from
                  your own course content!
                </p>
                <Button onClick={() => fileInputRef.current?.click()} className="bg-gradient-primary">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Your First File
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        msg.role === 'user'
                          ? 'bg-gradient-primary text-primary-foreground'
                          : 'bg-card border border-border'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content || '...'}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
              </Button>
              <Input
                placeholder="Ask a question about your study materials..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={sending}
                className="flex-1"
              />
              <Button onClick={handleSend} disabled={sending || !input.trim()} className="bg-gradient-primary">
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".txt,.md,.pdf,.doc,.docx"
              onChange={handleFileUpload}
            />
          </div>
        </div>

        {/* Files Sidebar */}
        {showFiles && (
          <div className="w-80 border-l border-border bg-card flex flex-col">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-display font-bold">Your Files</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowFiles(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <ScrollArea className="flex-1 p-4">
              {filesLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : files.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No files uploaded yet
                </p>
              ) : (
                <div className="space-y-2">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="flex-1 text-sm truncate">{file.file_name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteFile(file.id, file.file_path)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
            <div className="p-4 border-t border-border">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                Upload File
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
