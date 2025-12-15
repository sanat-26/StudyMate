import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, ArrowLeft, Loader2 } from 'lucide-react';
import { z } from 'zod';

const authSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const Auth = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  // Handle OTP verification if token exists in URL
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      const verifyToken = async () => {
        try {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'magiclink',
          });
          if (error) throw error;
          navigate('/dashboard');
        } catch (error: any) {
          toast({
            title: 'Verification Error',
            description: error.message,
            variant: 'destructive',
          });
        }
      };
      verifyToken();
    }
  }, [searchParams, navigate, toast]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        navigate('/dashboard');
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const validateForm = () => {
    try {
      authSchema.parse({ email });
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.errors.forEach((e) => {
          if (e.path[0]) {
            newErrors[e.path[0] as string] = e.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin + '/auth',
        },
      });
      if (error) throw error;
      toast({
        title: 'Check your email',
        description: 'We sent you a magic link to sign in. Click the link in your email to continue.',
      });
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      <div className="p-4">
        <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="glass rounded-2xl p-8 shadow-lg">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="p-2 rounded-xl bg-gradient-primary">
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold">StudyMate</span>
            </div>

            <h1 className="text-2xl font-display font-bold text-center mb-2">
              Continue with Email
            </h1>
            <p className="text-muted-foreground text-center mb-6">
              Enter your email to get a magic login link
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-primary"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Send Magic Link
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
