import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/navigation";
import Dashboard from "@/pages/dashboard";
import Tasks from "@/pages/tasks";
import Calendar from "@/pages/calendar";
import FocusTimer from "@/pages/focus-timer";
import Notes from "@/pages/notes";
import Progress from "@/pages/progress";
import Landing from "@/pages/landing";
import Login from "@/pages/login";
import NotFound from "@/pages/not-found";

function FreshApp() {
  // Simple localStorage check without any hooks to avoid React errors
  const checkAuth = () => {
    try {
      const user = localStorage.getItem('focusflow_user');
      return !!user;
    } catch {
      return false;
    }
  };

  const isAuthenticated = checkAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          {isAuthenticated && <Navigation />}
          <Switch>
            {!isAuthenticated ? (
              <>
                <Route path="/" component={Landing} />
                <Route path="/login" component={Login} />
                <Route path="/signup" component={Login} />
                <Route component={Landing} />
              </>
            ) : (
              <>
                <Route path="/" component={Dashboard} />
                <Route path="/tasks" component={Tasks} />
                <Route path="/calendar" component={Calendar} />
                <Route path="/focus-timer" component={FocusTimer} />
                <Route path="/notes" component={Notes} />
                <Route path="/progress" component={Progress} />
                <Route path="/login" component={Dashboard} />
                <Route path="/signup" component={Dashboard} />
                <Route component={NotFound} />
              </>
            )}
          </Switch>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default FreshApp;