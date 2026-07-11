import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { Cpu, Eye, EyeOff, Sparkles } from 'lucide-react';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Form values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // States
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Determine redirect page path
  interface LocationState {
    from?: {
      pathname?: string;
    };
  }
  const from = (location.state as LocationState)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Dynamic validations
    if (!email) {
      setError('Please input your registered email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      await login({ email, password });
      // Successfully authenticated, navigate to dashboard
      navigate(from, { replace: true });
    } catch (err: unknown) {
      console.error('Authentication error details:', err);
      const errorObj = err as {
        response?: {
          data?: {
            message?: string;
          };
        };
        message?: string;
      };
      const errorMessage = errorObj.response?.data?.message || errorObj.message || 'Verification failed. Please check credentials.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to load credentials for easy testing
  const autofill = (type: 'admin' | 'club' | 'faculty') => {
    setEmail(`${type}@campusos.dev`);
    setPassword('password123');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
      
      {/* Background ambient glow shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none dark:bg-indigo-600/5" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[450px] h-[450px] rounded-full bg-violet-500/10 blur-[100px] pointer-events-none dark:bg-violet-600/5" />

      <Card className="max-w-md w-full border border-border/40 bg-card/60 backdrop-blur-md shadow-xl relative z-10 p-2">
        <CardHeader className="flex flex-col items-center text-center pb-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-md mb-3">
            <Cpu className="w-5 h-5" />
          </div>
          <CardTitle className="text-xl font-bold tracking-tight">Console Initialization</CardTitle>
          <CardDescription>
            Enter credentials to open your CampusOS environment
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="CONSOLE EMAIL"
              type="email"
              placeholder="name@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />

            <div className="relative">
              <Input
                label="ACCESS PASSWORD"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-[32px] text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Button type="submit" variant="primary" className="w-full mt-2" isLoading={isLoading}>
              Establish Connection
            </Button>
          </form>

          {/* Quick Demo Credentials Panel for Hackathon */}
          <div className="border-t border-border/20 pt-4 mt-6">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-violet-500" />
              <span>Developer Quick Sandbox</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => autofill('admin')}
                className="text-[10px] py-1 px-2 font-medium"
                disabled={isLoading}
              >
                Admin
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => autofill('club')}
                className="text-[10px] py-1 px-2 font-medium"
                disabled={isLoading}
              >
                Club
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => autofill('faculty')}
                className="text-[10px] py-1 px-2 font-medium"
                disabled={isLoading}
              >
                Faculty
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 text-center">
              * Click credentials buttons to load sandbox profiles.
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center text-xs text-muted-foreground pt-0 mt-2">
          <span>New user? </span>
          <Link to="/register" className="text-foreground hover:underline ml-1 font-semibold">
            Register console credentials
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
export { Login };
