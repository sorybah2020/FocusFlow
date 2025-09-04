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

function CleanApp() {
  const isAuthenticated = !!localStorage.getItem('focusflow_user');

  if (!isAuthenticated) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="min-h-screen bg-background">
            <Switch>
              <Route path="/" component={Landing} />
              <Route path="/login" component={Login} />
              <Route path="/signup" component={Login} />
            </Switch>
          </div>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <Navigation />
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/tasks" component={Tasks} />
            <Route path="/calendar" component={Calendar} />
            <Route path="/focus-timer" component={FocusTimer} />
            <Route path="/notes" component={Notes} />
            <Route path="/progress" component={Progress} />
          </Switch>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default CleanApp;