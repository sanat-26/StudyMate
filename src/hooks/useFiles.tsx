import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';
import { useProgress } from './useProgress';

interface UserFile {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number | null;
  file_type: string | null;
  content: string | null;
  created_at: string;
}

export const useFiles = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { incrementFiles } = useProgress();
  const [files, setFiles] = useState<UserFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchFiles = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('user_files')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching files:', error);
    } else {
      setFiles(data as UserFile[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFiles();
  }, [user]);

  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          // Limit content to ~50KB for database storage
          resolve(text?.slice(0, 50000) || '');
        } catch (error) {
          console.error('Text extraction error:', error);
          resolve('');
        }
      };
      reader.onerror = () => resolve('');
      reader.readAsText(file);
    });
  };

  const uploadFile = async (file: File) => {
    if (!user) return;
    
    setUploading(true);
    
    try {
      // Extract text content for AI context
      let content = '';
      // Only process text-based files
      if (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        content = await extractTextFromFile(file);
      } else {
        toast({
          title: 'Partial Processing',
          description: 'Only text content from TXT/MD files can be used for questions. Other file types are stored but not analyzed.',
        });
      }

      // Upload to storage
      const filePath = `${user.id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('user-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Save file metadata to database
      const { error: dbError } = await supabase
        .from('user_files')
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          file_type: file.type,
          content,
        });

      if (dbError) throw dbError;

      await incrementFiles();
      await fetchFiles();
      
      toast({ title: 'File uploaded!', description: `${file.name} is now available for studying.` });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({ title: 'Upload failed', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (fileId: string, filePath: string) => {
    if (!user) return;

    try {
      await supabase.storage.from('user-files').remove([filePath]);
      await supabase.from('user_files').delete().eq('id', fileId);
      await fetchFiles();
      toast({ title: 'File deleted', description: 'The file has been removed.' });
    } catch (error: any) {
      toast({ title: 'Delete failed', description: error.message, variant: 'destructive' });
    }
  };

  return { files, loading, uploading, uploadFile, deleteFile, refetch: fetchFiles };
};
