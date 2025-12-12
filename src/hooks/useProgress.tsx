import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface UserProgress {
  id: string;
  questions_asked: number;
  files_uploaded: number;
  topics_studied: string[];
  study_streak: number;
  last_activity: string;
}

export const useProgress = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProgress = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching progress:', error);
    } else {
      setProgress(data as UserProgress | null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProgress();
  }, [user]);

  const incrementQuestions = async () => {
    if (!user || !progress) return;

    const { error } = await supabase
      .from('user_progress')
      .update({
        questions_asked: progress.questions_asked + 1,
        last_activity: new Date().toISOString(),
      })
      .eq('user_id', user.id);

    if (!error) {
      setProgress({ ...progress, questions_asked: progress.questions_asked + 1 });
    }
  };

  const incrementFiles = async () => {
    if (!user || !progress) return;

    const { error } = await supabase
      .from('user_progress')
      .update({
        files_uploaded: progress.files_uploaded + 1,
        last_activity: new Date().toISOString(),
      })
      .eq('user_id', user.id);

    if (!error) {
      setProgress({ ...progress, files_uploaded: progress.files_uploaded + 1 });
    }
  };

  const addTopic = async (topic: string) => {
    if (!user || !progress) return;

    const topics = progress.topics_studied || [];
    if (!topics.includes(topic)) {
      const newTopics = [...topics, topic].slice(-10); // Keep last 10 topics
      const { error } = await supabase
        .from('user_progress')
        .update({
          topics_studied: newTopics,
          last_activity: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (!error) {
        setProgress({ ...progress, topics_studied: newTopics });
      }
    }
  };

  return { progress, loading, incrementQuestions, incrementFiles, addTopic, refetch: fetchProgress };
};
