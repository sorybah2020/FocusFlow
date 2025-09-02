import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, CheckCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import type { Task } from "@shared/schema";

interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  const [isCompleted, setIsCompleted] = useState(task.completed);
  const queryClient = useQueryClient();

  const updateTaskMutation = useMutation({
    mutationFn: async (updates: Partial<Task>) => {
      const response = await apiRequest("PATCH", `/api/tasks/${task.id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
  });

  const handleToggleComplete = () => {
    const newCompleted = !isCompleted;
    setIsCompleted(newCompleted);
    updateTaskMutation.mutate({ completed: newCompleted });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-destructive/10 text-destructive";
      case "medium":
        return "bg-orange-100 text-orange-600";
      case "low":
        return "bg-green-100 text-green-600";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "priority-urgent";
      case "medium":
        return "priority-medium";
      case "low":
        return "priority-low";
      default:
        return "";
    }
  };

  const formatDueDate = (date: Date | string | null) => {
    if (!date) return null;
    const dueDate = new Date(date);
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    
    if (diffHours < 0) {
      return "Overdue";
    } else if (diffHours < 24) {
      return `Due in ${diffHours} hours`;
    } else {
      const diffDays = Math.ceil(diffHours / 24);
      return `Due in ${diffDays} days`;
    }
  };

  return (
    <Card 
      className={cn("transition-all duration-200", getPriorityClass(task.priority))}
      data-testid={`task-item-${task.id}`}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Checkbox
              checked={isCompleted || false}
              onCheckedChange={handleToggleComplete}
              data-testid={`checkbox-task-${task.id}`}
            />
            <div className={cn(isCompleted && "opacity-60")}>
              <p 
                className={cn(
                  "font-medium text-foreground",
                  isCompleted && "line-through"
                )}
                data-testid={`text-task-title-${task.id}`}
              >
                {task.title}
              </p>
              <p className="text-sm text-muted-foreground" data-testid={`text-task-due-${task.id}`}>
                {isCompleted ? "Completed" : formatDueDate(task.dueDate)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge 
              className={getPriorityColor(task.priority)}
              data-testid={`badge-priority-${task.id}`}
            >
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              data-testid={`button-edit-${task.id}`}
            >
              {isCompleted ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <Edit className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
