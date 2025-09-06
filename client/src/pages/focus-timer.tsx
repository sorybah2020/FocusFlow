import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Pause, Square, Settings } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import BreakReminderModal from "@/components/break-reminder-modal";
import type { FocusSession } from "@shared/schema";

export default function FocusTimer() {
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // 25 minutes
  const [isActive, setIsActive] = useState(false);
  const [sessionType, setSessionType] = useState<"focus" | "break">("focus");
  const [sessionLength, setSessionLength] = useState(25);
  const [breakLength, setBreakLength] = useState(5);
  const [showBreakModal, setShowBreakModal] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch focus sessions to calculate real total focus time
  const { data: focusSessions = [] } = useQuery<FocusSession[]>({
    queryKey: ["/api/focus-sessions"]
  });

  // Request notification permission on component mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Show browser notification when timer completes
  const showNotification = (title: string, message: string) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, {
        body: message,
        icon: "/favicon.ico",
        tag: "focus-timer"
      });
    }
    
    // Also play a sound if possible
    try {
      const audio = new Audio();
      audio.src = "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+D4vWoaByJYT1xLuJMsOjZ8VmVZgZOeXMQ8pV4==";
      audio.play().catch(() => {}); // Ignore errors if sound fails
    } catch (e) {
      // Ignore audio errors
    }
  };

  const createSessionMutation = useMutation({
    mutationFn: async (sessionData: any) => {
      const response = await apiRequest("POST", "/api/focus-sessions", sessionData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/focus-sessions"] });
    },
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => time - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      handleSessionComplete();
    }

    return () => clearInterval(interval);
  }, [isActive, timeRemaining]);

  const handleSessionComplete = () => {
    setIsActive(false);
    
    // Record the session
    createSessionMutation.mutate({
      duration: sessionType === "focus" ? sessionLength : breakLength,
      type: sessionType,
    });

    if (sessionType === "focus") {
      setSessionsCompleted(prev => prev + 1);
      setShowBreakModal(true);
      const message = "Time for a break!";
      toast({ title: "Focus session complete!", description: message });
      showNotification("🎯 Focus Session Complete!", message);
    } else {
      setSessionType("focus");
      setTimeRemaining(sessionLength * 60);
      const message = "Ready for another focus session?";
      toast({ title: "Break complete!", description: message });
      showNotification("🌟 Break Complete!", message);
    }
  };

  const startTimer = () => {
    setIsActive(true);
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const stopTimer = () => {
    setIsActive(false);
    setTimeRemaining(sessionType === "focus" ? sessionLength * 60 : breakLength * 60);
  };

  const startBreak = () => {
    setSessionType("break");
    setTimeRemaining(breakLength * 60);
    setShowBreakModal(false);
    setIsActive(true);
  };

  const skipBreak = () => {
    setSessionType("focus");
    setTimeRemaining(sessionLength * 60);
    setShowBreakModal(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = sessionType === "focus" 
    ? ((sessionLength * 60 - timeRemaining) / (sessionLength * 60)) * 100
    : ((breakLength * 60 - timeRemaining) / (breakLength * 60)) * 100;

  const circumference = 2 * Math.PI * 15.9155;
  const strokeDasharray = `${(progress / 100) * circumference}, ${circumference}`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="focus-timer-page">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="text-page-title">Focus Timer</h1>
        <p className="text-muted-foreground">Use the Pomodoro technique to boost your productivity</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Timer */}
        <div className="lg:col-span-2">
          <Card data-testid="timer-main">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="flex items-center justify-center mb-8">
                  <Badge 
                    variant={sessionType === "focus" ? "default" : "secondary"}
                    className="text-lg px-4 py-2"
                    data-testid="badge-session-type"
                  >
                    {sessionType === "focus" ? "Focus Session" : "Break Time"}
                  </Badge>
                </div>

                <div className="flex items-center justify-center mb-8">
                  <div className="relative w-64 h-64">
                    <svg className="w-64 h-64 timer-circle" viewBox="0 0 36 36" data-testid="timer-circle">
                      <path 
                        className="text-muted stroke-current" 
                        strokeWidth="1" 
                        fill="none" 
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path 
                        className={`${sessionType === "focus" ? "text-primary" : "text-green-500"} stroke-current`} 
                        strokeWidth="1" 
                        fill="none" 
                        strokeDasharray={strokeDasharray}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl font-bold text-foreground mb-2" data-testid="text-time-remaining">
                          {formatTime(timeRemaining)}
                        </div>
                        <div className="text-muted-foreground" data-testid="text-session-info">
                          Session {sessionsCompleted + 1}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  {!isActive ? (
                    <Button 
                      size="lg" 
                      onClick={startTimer}
                      data-testid="button-start-timer"
                    >
                      <Play className="mr-2 h-5 w-5" />
                      Start
                    </Button>
                  ) : (
                    <Button 
                      size="lg" 
                      variant="secondary" 
                      onClick={pauseTimer}
                      data-testid="button-pause-timer"
                    >
                      <Pause className="mr-2 h-5 w-5" />
                      Pause
                    </Button>
                  )}
                  <Button 
                    size="lg" 
                    variant="outline" 
                    onClick={stopTimer}
                    data-testid="button-stop-timer"
                  >
                    <Square className="mr-2 h-5 w-5" />
                    Stop
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings */}
        <div className="space-y-6">
          <Card data-testid="timer-settings">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Settings className="mr-2 h-5 w-5" />
                <h3 className="text-lg font-semibold">Timer Settings</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Focus Length</label>
                  <Select 
                    value={sessionLength.toString()} 
                    onValueChange={(value) => {
                      const newLength = parseInt(value);
                      setSessionLength(newLength);
                      if (sessionType === "focus" && !isActive) {
                        setTimeRemaining(newLength * 60);
                      }
                    }}
                  >
                    <SelectTrigger data-testid="select-focus-length">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="25">25 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Break Length</label>
                  <Select 
                    value={breakLength.toString()} 
                    onValueChange={(value) => {
                      const newLength = parseInt(value);
                      setBreakLength(newLength);
                      if (sessionType === "break" && !isActive) {
                        setTimeRemaining(newLength * 60);
                      }
                    }}
                  >
                    <SelectTrigger data-testid="select-break-length">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 minutes</SelectItem>
                      <SelectItem value="10">10 minutes</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="20">20 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Session Stats */}
          <Card data-testid="session-stats">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Today's Progress</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sessions Today</span>
                  <span className="font-medium" data-testid="text-sessions-completed">{sessionsCompleted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Focus Time</span>
                  <span className="font-medium" data-testid="text-total-focus-time">
                    {(() => {
                      const totalMinutes = focusSessions
                        .filter(session => session.type === 'focus')
                        .reduce((sum, session) => sum + session.duration, 0);
                      const hours = Math.floor(totalMinutes / 60);
                      const minutes = totalMinutes % 60;
                      return `${hours}h ${minutes}m`;
                    })()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Sessions</span>
                  <span className="font-medium" data-testid="text-total-sessions">
                    {focusSessions.filter(session => session.type === 'focus').length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card data-testid="focus-tips">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Focus Tips</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Remove distractions from your workspace</li>
                <li>• Choose one specific task to focus on</li>
                <li>• Take your breaks seriously - they help you recharge</li>
                <li>• Stay hydrated during your sessions</li>
                <li>• After 4 sessions, take a longer 15-30 minute break</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <BreakReminderModal
        isOpen={showBreakModal}
        onClose={() => setShowBreakModal(false)}
        onStartBreak={startBreak}
        onSkipBreak={skipBreak}
      />
    </div>
  );
}
