import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Edit, CheckCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import type { Task } from "@shared/schema";

interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  const [isCompleted, setIsCompleted] = useState(task.completed);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description || "",
    priority: task.priority,
    dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "",
    dueTime: task.dueDate ? new Date(task.dueDate).toTimeString().split(' ')[0].slice(0, 5) : ""
  });
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

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let dueDateTime = null;
    if (editData.dueDate) {
      dueDateTime = new Date(editData.dueDate);
      if (editData.dueTime) {
        const [hours, minutes] = editData.dueTime.split(':');
        dueDateTime.setHours(parseInt(hours), parseInt(minutes));
      }
    }
    updateTaskMutation.mutate({
      title: editData.title,
      description: editData.description,
      priority: editData.priority,
      dueDate: dueDateTime
    });
    setIsEditDialogOpen(false);
  };

  const resetEditData = () => {
    setEditData({
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "",
      dueTime: task.dueDate ? new Date(task.dueDate).toTimeString().split(' ')[0].slice(0, 5) : ""
    });
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
    
    const timeString = dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const hasTime = dueDate.getHours() !== 0 || dueDate.getMinutes() !== 0;
    
    if (diffHours < 0) {
      return hasTime ? `Overdue (was ${timeString})` : "Overdue";
    } else if (diffHours < 24) {
      return hasTime ? `Due in ${diffHours} hours (${timeString})` : `Due in ${diffHours} hours`;
    } else {
      const diffDays = Math.ceil(diffHours / 24);
      return hasTime ? `Due in ${diffDays} days (${timeString})` : `Due in ${diffDays} days`;
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
            {isCompleted ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <Dialog 
                open={isEditDialogOpen} 
                onOpenChange={(open) => {
                  setIsEditDialogOpen(open);
                  if (!open) resetEditData();
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    data-testid={`button-edit-${task.id}`}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent data-testid={`dialog-edit-task-${task.id}`}>
                  <DialogHeader>
                    <DialogTitle>Edit Task</DialogTitle>
                    <DialogDescription>
                      Update your task details and priority.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleEditSubmit} className="space-y-4">
                    <div>
                      <Input
                        placeholder="Task title"
                        value={editData.title}
                        onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                        data-testid={`input-edit-title-${task.id}`}
                        required
                      />
                    </div>
                    <div>
                      <Textarea
                        placeholder="Description (optional)"
                        value={editData.description}
                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                        data-testid={`textarea-edit-description-${task.id}`}
                      />
                    </div>
                    <div className="space-y-4">
                      <Select
                        value={editData.priority}
                        onValueChange={(value) => setEditData({ ...editData, priority: value })}
                      >
                        <SelectTrigger data-testid={`select-edit-priority-${task.id}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low Priority</SelectItem>
                          <SelectItem value="medium">Medium Priority</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          type="date"
                          value={editData.dueDate}
                          onChange={(e) => setEditData({ ...editData, dueDate: e.target.value })}
                          data-testid={`input-edit-due-date-${task.id}`}
                          placeholder="Due date"
                        />
                        <Input
                          type="time"
                          value={editData.dueTime}
                          onChange={(e) => setEditData({ ...editData, dueTime: e.target.value })}
                          data-testid={`input-edit-due-time-${task.id}`}
                          placeholder="Due time"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditDialogOpen(false)}
                        data-testid={`button-cancel-edit-${task.id}`}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        data-testid={`button-save-edit-${task.id}`}
                        disabled={updateTaskMutation.isPending}
                      >
                        {updateTaskMutation.isPending ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
