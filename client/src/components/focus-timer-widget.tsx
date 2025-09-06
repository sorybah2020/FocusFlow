import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Pause, SkipForward, Edit, Settings } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Task } from "@shared/schema";

interface FocusTimerWidgetProps {
  taskTitle?: string;
  onComplete?: () => void;
  onTaskChange?: (taskTitle: string) => void;
}

export default function FocusTimerWidget({ taskTitle, onComplete, onTaskChange }: FocusTimerWidgetProps) {
  const [sessionDuration, setSessionDuration] = useState(25); // Duration in minutes
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [currentSession, setCurrentSession] = useState(1);
  const [totalSessions] = useState(4);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const [tempDuration, setTempDuration] = useState(25);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [sessionSaved, setSessionSaved] = useState(false);
  const onCompleteRef = useRef(onComplete);

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: tasks = [] } = useQuery<Task[]>({ queryKey: ["/api/tasks"] });

  // Update the ref when onComplete changes
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Mutation to save focus session to database
  const saveFocusSessionMutation = useMutation({
    mutationFn: async (sessionData: any) => {
      const response = await apiRequest("POST", "/api/focus-sessions", sessionData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/focus-sessions"] });
      // Update user's focus time in localStorage
      const savedUser = localStorage.getItem('focusflow_user');
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          user.totalFocusTime = (user.totalFocusTime || 0) + sessionDuration;
          localStorage.setItem('focusflow_user', JSON.stringify(user));
        } catch (error) {
          console.error('Error updating user focus time:', error);
        }
      }
    },
    onError: (error: any) => {
      console.error("Failed to save focus session:", error);
      toast({
        title: "Failed to save focus session",
        description: "Your session wasn't recorded properly",
        variant: "destructive"
      });
    },
  });

  // Request notification permission on component mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Show notification when session completes
  const showNotification = (isBreak: boolean = false) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const title = isBreak ? 'Break Time Complete! 🌟' : 'Focus Session Complete! 🎯';
      const body = isBreak 
        ? 'Time to get back to focused work!'
        : `Great job! You completed ${sessionDuration} minutes of focused work.`;
      
      const notification = new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico'
      });

      // Auto close notification after 5 seconds
      setTimeout(() => notification.close(), 5000);

      // Play notification sound
      try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAL QAAAmr AAAEABAAAAF mVdDIAuF DQBH0XAADQAAA AQAFQACQABAEqQAAAAAB RQUAABkBAABAAQAAAAAA BBAAEAAQAEoAAoABAAqgA');
        audio.play().catch(() => {}); // Ignore audio errors
      } catch (error) {
        // Ignore audio errors
      }
    }
  };

  // Handle session completion
  const handleSessionComplete = useCallback(() => {
    if (!sessionStartTime || sessionSaved) return;
    
    setIsActive(false);
    setSessionSaved(true); // Prevent multiple submissions
    
    // Save the completed session to database
    const actualDuration = Math.round((Date.now() - sessionStartTime.getTime()) / 1000 / 60); // in minutes
    saveFocusSessionMutation.mutate({
      duration: actualDuration,
      taskTitle: taskTitle || "Focus Session",
      type: "focus",
      completedAt: new Date()
    });

    // Show notification
    showNotification(false);
    
    // Show success toast
    toast({
      title: "Focus Session Complete! 🎯",
      description: `Great job! You focused for ${sessionDuration} minutes.`,
    });

    onCompleteRef.current?.();
  }, [sessionStartTime, sessionSaved, taskTitle, sessionDuration]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => time - 1);
      }, 1000);
    } else if (timeRemaining === 0 && sessionStartTime && !sessionSaved) {
      handleSessionComplete();
    }

    return () => clearInterval(interval);
  }, [isActive, timeRemaining, sessionStartTime, sessionSaved, handleSessionComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((sessionDuration * 60 - timeRemaining) / (sessionDuration * 60)) * 100;
  const circumference = 2 * Math.PI * 15.9155;
  const strokeDasharray = `${(progress / 100) * circumference}, ${circumference}`;

  const toggleTimer = () => {
    if (!isActive && timeRemaining === sessionDuration * 60) {
      // Starting a new session
      setSessionStartTime(new Date());
      setSessionSaved(false); // Reset the saved flag for new session
    }
    setIsActive(!isActive);
  };

  const skipBreak = () => {
    setTimeRemaining(sessionDuration * 60);
    setIsActive(false);
    setCurrentSession(prev => Math.min(prev + 1, totalSessions));
  };

  const handleDurationChange = () => {
    setSessionDuration(tempDuration);
    setTimeRemaining(tempDuration * 60);
    setIsActive(false);
    setSessionStartTime(null);
    setSessionSaved(false); // Reset the saved flag
    setIsSettingsDialogOpen(false);
  };

  const resetTimer = () => {
    setTimeRemaining(sessionDuration * 60);
    setIsActive(false);
    setSessionStartTime(null);
    setSessionSaved(false); // Reset the saved flag
  };

  const handleTaskChange = () => {
    if (selectedTaskId) {
      const selectedTask = tasks.find(task => task.id === selectedTaskId);
      if (selectedTask && onTaskChange) {
        onTaskChange(selectedTask.title);
      }
    }
    setIsEditDialogOpen(false);
  };

  const incompleteTasks = tasks.filter(task => !task.completed);

  return (
    <Card data-testid="focus-timer-widget">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-foreground">Focus Session</h3>
          <div className="flex items-center space-x-2">
            <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" data-testid="button-timer-settings">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent data-testid="dialog-timer-settings">
                <DialogHeader>
                  <DialogTitle>Timer Settings</DialogTitle>
                  <DialogDescription>
                    Customize your focus session duration.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Focus Session Duration:
                    </label>
                    <Select value={tempDuration.toString()} onValueChange={(value) => setTempDuration(parseInt(value))}>
                      <SelectTrigger data-testid="select-session-duration">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="20">20 minutes</SelectItem>
                        <SelectItem value="25">25 minutes (Pomodoro)</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setTempDuration(sessionDuration);
                        setIsSettingsDialogOpen(false);
                      }}
                      data-testid="button-cancel-settings"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleDurationChange}
                      data-testid="button-save-settings"
                    >
                      Apply Changes
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" data-testid="button-edit-focus-task">
                  <Edit className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent data-testid="dialog-edit-focus-task">
                <DialogHeader>
                  <DialogTitle>Change Focus Task</DialogTitle>
                  <DialogDescription>
                    Select a different task to focus on during your session.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Select a task to focus on:
                    </label>
                    <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
                      <SelectTrigger data-testid="select-focus-task">
                        <SelectValue placeholder="Choose a task..." />
                      </SelectTrigger>
                      <SelectContent>
                        {incompleteTasks.length === 0 ? (
                          <SelectItem value="no-tasks" disabled>No pending tasks available</SelectItem>
                        ) : (
                          incompleteTasks.map((task) => (
                            <SelectItem key={task.id} value={task.id}>
                              <div className="flex items-center space-x-2">
                                <div
                                  className={`w-2 h-2 rounded-full ${
                                    task.priority === 'urgent' ? 'bg-red-500' :
                                    task.priority === 'medium' ? 'bg-orange-500' : 'bg-green-500'
                                  }`}
                                />
                                <span>{task.title}</span>
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditDialogOpen(false)}
                      data-testid="button-cancel-edit"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleTaskChange}
                      disabled={!selectedTaskId}
                      data-testid="button-save-focus-task"
                    >
                      Change Task
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Badge variant={isActive ? "default" : "secondary"} data-testid="timer-status">
              {isActive ? "Active" : "Paused"}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 timer-circle" viewBox="0 0 36 36" data-testid="timer-circle">
              <path 
                className="text-muted stroke-current" 
                strokeWidth="2" 
                fill="none" 
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path 
                className="text-primary stroke-current" 
                strokeWidth="2" 
                fill="none" 
                strokeDasharray={strokeDasharray}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground" data-testid="time-remaining">
                  {formatTime(timeRemaining)}
                </div>
                <div className="text-xs text-muted-foreground">remaining</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mb-6">
          <p className="text-lg font-medium text-foreground mb-2" data-testid="task-title">
            {taskTitle || "Focus Session"}
          </p>
          <p className="text-muted-foreground" data-testid="session-info">
            Pomodoro Session {currentSession} of {totalSessions}
          </p>
        </div>
        
        <div className="flex justify-center space-x-4">
          <Button
            variant="destructive"
            onClick={toggleTimer}
            data-testid="button-toggle-timer"
          >
            <Pause className="mr-2 h-4 w-4" />
            {isActive ? "Pause" : "Start"}
          </Button>
          <Button
            variant="secondary"
            onClick={resetTimer}
            disabled={isActive}
            data-testid="button-reset-timer"
          >
            <SkipForward className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
