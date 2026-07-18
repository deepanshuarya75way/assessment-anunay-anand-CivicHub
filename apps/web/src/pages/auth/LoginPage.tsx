import { useState } from 'react';
import { useAuthStore } from '../../stores/auth.store';
import { apiClient } from '../../api/client';
import { useNavigate, Link } from 'react-router-dom';
import { PageShell, SectionContainer, GlassButton, AmbientMesh, CivicIcon } from '@civichub/ui';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useAuthStore((state) => state.setAccessToken);
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await apiClient.post('/auth/login', { email, password });
      login(data.data.accessToken);
      setUser(data.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <PageShell withNav={false} className="justify-center items-center relative overflow-hidden">
      <AmbientMesh />
      
      <SectionContainer size="sm" className="relative z-10 w-full max-w-md mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-8 shadow-2xl"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <CivicIcon name="Globe" className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-h2 font-bold tracking-tight text-foreground">Welcome Back</h2>
            <p className="text-muted-foreground mt-2 text-center text-body">
              Sign in to continue to your CivicHub dashboard.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm text-center">
              {error}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <GlassButton
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
            >
              Sign In
            </GlassButton>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:underline font-medium">
              Create one now
            </Link>
          </p>
        </motion.div>
      </SectionContainer>
    </PageShell>
  );
}
