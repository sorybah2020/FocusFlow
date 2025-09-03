import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pause, SkipForward, Edit } from "lucide-react";
import type { Task } from "@shared/schema";

interface FocusTimerWidgetProps {
  taskTitle?: string;
  onComplete?: () => void;
  onTaskChange?: (taskTitle: string) => void;
}

export default function FocusTimerWidget({ taskTitle, onComplete, onTaskChange }: FocusTimerWidgetProps) {
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [currentSession, setCurrentSession] = useState(1);
  const [totalSessions] = useState(4);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");

  const { data: tasks = [] } = useQuery<Task[]>({ queryKey: ["/api/tasks"] });

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => time - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setIsActive(false);
      onComplete?.();
    }

    return () => clearInterval(interval);
  }, [isActive, timeRemaining, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((25 * 60 - timeRemaining) / (25 * 60)) * 100;
  const circumference = 2 * Math.PI * 15.9155;
  const strokeDasharray = `${(progress / 100) * circumference}, ${circumference}`;

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const skipBreak = () => {
    setTimeRemaining(25 * 60);
    setIsActive(false);
    setCurrentSession(prev => Math.min(prev + 1, totalSessions));
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
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" data-testid="button-edit-focus-task">
                  <Edit className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent data-testid="dialog-edit-focus-task">
                <DialogHeader>
                  <DialogTitle>Change Focus Task</DialogTitle>
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
            {isActive ? "Pause" : "Resume"}
          </Button>
          <Button
            variant="secondary"
            onClick={skipBreak}
            data-testid="button-skip-break"
          >
            <SkipForward className="mr-2 h-4 w-4" />
            Skip Break
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
