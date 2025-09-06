import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Brain, Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [, setLocation] = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simple validation
    if (!formData.email || !formData.password) {
      toast({
        title: "Please fill in all fields",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    // Simulate authentication - create a user object
    const userData = {
      id: Date.now().toString(),
      email: formData.email,
      firstName: formData.email.split('@')[0], // Use part before @ as name
      lastName: "",
      profileImageUrl: null,
      currentStreak: 0,
      totalFocusTime: 0,
      level: 1
    };

    // Save to localStorage
    localStorage.setItem('focusflow_user', JSON.stringify(userData));
    
    toast({
      title: isLogin ? "Welcome back!" : "Account created successfully!",
      description: "Redirecting to your dashboard..."
    });

    // Redirect to dashboard
    setTimeout(() => {
      setLocation('/');
      window.location.reload(); // Force refresh to update auth state
    }, 1500);
    
    setIsLoading(false);
  };

  const handleReplitAuth = () => {
    window.location.href = '/api/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Brain className="text-white h-7 w-7" />
            </div>
            <span className="text-3xl font-bold text-foreground">FocusFlow</span>
          </div>
          <p className="text-muted-foreground">
            Your ADHD-friendly productivity companion
          </p>
        </div>

        <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl">
              {isLogin ? "Welcome Back!" : "Join FocusFlow"}
            </CardTitle>
            <CardDescription className="text-lg">
              {isLogin 
                ? "Sign in to access your productivity dashboard" 
                : "Create your account and start focusing better"
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Replit Auth Button */}
            <Button 
              onClick={handleReplitAuth}
              size="lg"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-6 text-lg"
              data-testid="button-replit-auth"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              {isLogin ? "Sign In with Google Email" : "Sign Up with Google Email"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter your email"
                    className="pl-10"
                    data-testid="input-email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Enter your password"
                    className="pl-10"
                    data-testid="input-password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <Input 
                      id="confirmPassword" 
                      type="password" 
                      placeholder="Confirm your password"
                      className="pl-10"
                      data-testid="input-confirm-password"
                      required={!isLogin}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <Button 
                type="submit"
                size="lg"
                variant="outline" 
                className="w-full py-6 text-lg"
                data-testid="button-email-auth"
                disabled={isLoading}
              >
                {isLoading ? "Please wait..." : (isLogin ? "Sign In" : "Create Account")}
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
              <p className="mb-2">
                Or try secure Replit authentication above
              </p>
              {isLogin ? (
                <p>
                  Don't have an account?{" "}
                  <button 
                    onClick={() => setIsLogin(false)}
                    className="text-blue-600 hover:text-blue-500 font-medium"
                    data-testid="switch-to-signup"
                  >
                    Sign up
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{" "}
                  <button 
                    onClick={() => setIsLogin(true)}
                    className="text-blue-600 hover:text-blue-500 font-medium"
                    data-testid="switch-to-login"
                  >
                    Sign in
                  </button>
                </p>
              )}
            </div>

            <div className="text-center">
              <Link href="/" className="text-muted-foreground hover:text-foreground text-sm">
                ← Back to home
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">Join thousands of students who've improved their focus</p>
          <div className="flex justify-center space-x-6 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Smart Timer</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Task Management</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Progress Tracking</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}