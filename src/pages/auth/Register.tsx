import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { Cpu } from 'lucide-react';

const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  // Form values
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('attendee'); // Default role in User model
  
  // Status states
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!name.trim()) {
      setError('Please input your name.');
      return;
    }
    if (!email) {
      setError('Please input your email.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      await register({
        name,
        email,
        password,
        role,
      });

      setSuccess('Registration successful! Redirecting to login console...');
      // Clean inputs
      setName('');
      setEmail('');
      setPassword('');
      
      // Auto redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: unknown) {
      console.error('Registration error details:', err);
      const errorObj = err as {
        response?: {
          data?: {
            message?: string;
          };
        };
        message?: string;
      };
      const errorMessage = errorObj.response?.data?.message || errorObj.message || 'Registration failed. Try checking your parameters.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
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
          <CardTitle className="text-xl font-bold tracking-tight">Create Credentials</CardTitle>
          <CardDescription>
            Register your profile to access CampusOS resources
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert variant="success">
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="FULL NAME"
              type="text"
              placeholder="Alex Johnson"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading || !!success}
              required
            />

            <Input
              label="UNIVERSITY EMAIL"
              type="email"
              placeholder="alex@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading || !!success}
              required
            />

            <Input
              label="ACCESS PASSWORD"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading || !!success}
              required
            />

            {/* Role selection dropdown */}
            <div className="w-full flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground select-none">
                SYSTEM ACCESS ROLE
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={isLoading || !!success}
                className="w-full px-3 py-2 text-sm rounded-lg bg-background text-foreground border border-border/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
              >
                <option value="attendee">Student / Attendee</option>
                <option value="organizer">Club Organizer / Faculty</option>
                <option value="admin">System Administrator</option>
              </select>
              <p className="text-[10px] text-muted-foreground">
                * Select the access level relevant to your bookings.
              </p>
            </div>

            <Button type="submit" variant="primary" className="w-full mt-2" isLoading={isLoading} disabled={!!success}>
              Register Credentials
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center text-xs text-muted-foreground pt-0 mt-2">
          <span>Already registered? </span>
          <Link to="/login" className="text-foreground hover:underline ml-1 font-semibold">
            Sign in to Console
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
export { Register };
