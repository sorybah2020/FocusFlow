import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Brain, Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "wouter";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);

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
              {isLogin ? "Sign In with Replit" : "Sign Up with Replit"}
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

            {/* Traditional Form (Disabled - Replit Auth Only) */}
            <div className="space-y-4 opacity-60 pointer-events-none">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter your email"
                    className="pl-10"
                    disabled
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
                    disabled
                  />
                </div>
              </div>

              <Button 
                size="lg"
                variant="outline" 
                className="w-full py-6 text-lg"
                disabled
              >
                {isLogin ? "Sign In" : "Create Account"}
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p className="mb-2">
                Currently using secure Replit authentication
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