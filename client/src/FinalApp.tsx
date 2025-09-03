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

function FinalApp() {
  // Simple auth check
  const getUser = () => {
    try {
      return localStorage.getItem('focusflow_user');
    } catch {
      return null;
    }
  };

  const isAuthenticated = !!getUser();

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
                <Route>
                  <Landing />
                </Route>
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
                <Route>
                  <Dashboard />
                </Route>
              </>
            )}
          </Switch>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default FinalApp;