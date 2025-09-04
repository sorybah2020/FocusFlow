import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Eye, Edit, Trash2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Task } from "@shared/schema";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isViewEventDialogOpen, setIsViewEventDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    priority: "medium",
    time: "",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: tasks = [] } = useQuery<Task[]>({ queryKey: ["/api/tasks"] });

  const createTaskMutation = useMutation({
    mutationFn: async (taskData: any) => {
      const response = await apiRequest("POST", "/api/tasks", taskData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      setIsEventDialogOpen(false);
      setNewEvent({ title: "", description: "", priority: "medium", time: "" });
      toast({ title: "Event created successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to create event", variant: "destructive" });
    },
  });

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day &&
           today.getMonth() === currentDate.getMonth() &&
           today.getFullYear() === currentDate.getFullYear();
  };

  const getTasksForDate = (day: number) => {
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      return new Date(task.dueDate).toDateString() === dateStr;
    });
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
    setIsEventDialogOpen(true);
  };

  const handleTaskClick = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTask(task);
    setIsViewEventDialogOpen(true);
  };

  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      await apiRequest("DELETE", `/api/tasks/${taskId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      setIsViewEventDialogOpen(false);
      toast({ title: "Event deleted successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to delete event", variant: "destructive" });
    },
  });

  const toggleTaskMutation = useMutation({
    mutationFn: async (task: Task) => {
      const response = await apiRequest("PATCH", `/api/tasks/${task.id}`, {
        completed: !task.completed,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      setIsViewEventDialogOpen(false);
      toast({ title: "Event updated successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to update event", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title.trim() || !selectedDate) return;

    let dueDate = selectedDate;
    if (newEvent.time) {
      const [hours, minutes] = newEvent.time.split(':');
      dueDate = new Date(selectedDate);
      dueDate.setHours(parseInt(hours), parseInt(minutes));
    }

    createTaskMutation.mutate({
      title: newEvent.title.trim(),
      description: newEvent.description.trim() || null,
      priority: newEvent.priority,
      dueDate: dueDate,
    });
  };

  // Generate calendar grid
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const calendarDays = [];

  // Empty cells for days before the month starts
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="calendar-page">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="text-page-title">Calendar</h1>
          <p className="text-muted-foreground">Organize your tasks and schedule</p>
        </div>
        <div className="flex items-center space-x-4">
          {/* View Mode Selector */}
          <Select value={viewMode} onValueChange={(value: 'month' | 'week' | 'day') => setViewMode(value)}>
            <SelectTrigger className="w-32" data-testid="select-view-mode">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="day">Day</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={goToToday} variant="outline" data-testid="button-today">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Today
          </Button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigateMonth('prev')}
              data-testid="button-prev-month"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-2xl font-bold" data-testid="text-current-month">
              {getMonthName(currentDate)}
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigateMonth('next')}
              data-testid="button-next-month"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Calendar Grid */}
      <Card data-testid="calendar-grid">
        <CardContent className="p-6">
          <div className="grid grid-cols-7 gap-2 mb-4">
            {weekDays.map(day => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={index} className="h-24" />;
              }

              const dayTasks = getTasksForDate(day);
              const isCurrentDay = isToday(day);

              return (
                <div
                  key={day}
                  className={`h-24 border rounded-lg p-2 cursor-pointer transition-colors hover:bg-muted/50 ${
                    isCurrentDay ? 'bg-primary/10 border-primary' : 'border-border'
                  }`}
                  onClick={() => handleDateClick(day)}
                  data-testid={`calendar-day-${day}`}
                >
                  <div className={`text-sm font-medium mb-1 ${
                    isCurrentDay ? 'text-primary' : 'text-foreground'
                  }`}>
                    {day}
                  </div>
                  <div className="space-y-1">
                    {dayTasks.slice(0, 2).map((task) => (
                      <div
                        key={task.id}
                        className={`text-xs px-1 py-0.5 rounded text-white truncate cursor-pointer hover:opacity-80 ${
                          task.completed ? 'bg-gray-400 line-through' :
                          task.priority === 'urgent' ? 'bg-red-500' :
                          task.priority === 'medium' ? 'bg-orange-500' : 'bg-green-500'
                        }`}
                        title={task.title}
                        onClick={(e) => handleTaskClick(task, e)}
                      >
                        {task.title}
                      </div>
                    ))}
                    {dayTasks.length > 2 && (
                      <div className="text-xs text-muted-foreground">
                        +{dayTasks.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Event Creation Dialog */}
      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent data-testid="dialog-create-event">
          <DialogHeader>
            <DialogTitle>
              Create Event for {selectedDate?.toLocaleDateString()}
            </DialogTitle>
            <DialogDescription>
              Add a new event or task for the selected date.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                placeholder="Event title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                data-testid="input-event-title"
              />
            </div>
            <div>
              <Textarea
                placeholder="Description (optional)"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                data-testid="textarea-event-description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select
                value={newEvent.priority}
                onValueChange={(value) => setNewEvent({ ...newEvent, priority: value })}
              >
                <SelectTrigger data-testid="select-event-priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="time"
                value={newEvent.time}
                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                data-testid="input-event-time"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEventDialogOpen(false)}
                data-testid="button-cancel-event"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createTaskMutation.isPending}
                data-testid="button-create-event"
              >
                {createTaskMutation.isPending ? "Creating..." : "Create Event"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Event View/Edit Dialog */}
      <Dialog open={isViewEventDialogOpen} onOpenChange={setIsViewEventDialogOpen}>
        <DialogContent data-testid="dialog-view-event">
          <DialogHeader>
            <DialogTitle>
              {selectedTask?.title}
            </DialogTitle>
            <DialogDescription>
              View and manage this event or task details.
            </DialogDescription>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">Description</h4>
                <p className="text-sm">{selectedTask.description || "No description"}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Priority</h4>
                  <Badge
                    variant={
                      selectedTask.priority === 'urgent' ? 'destructive' :
                      selectedTask.priority === 'medium' ? 'default' : 'secondary'
                    }
                  >
                    {selectedTask.priority}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Due Date</h4>
                  <p className="text-sm">
                    {selectedTask.dueDate ? new Date(selectedTask.dueDate).toLocaleDateString() : "No due date"}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">Status</h4>
                <Badge variant={selectedTask.completed ? "default" : "outline"}>
                  {selectedTask.completed ? "Completed" : "Pending"}
                </Badge>
              </div>
              <div className="flex justify-between space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => toggleTaskMutation.mutate(selectedTask)}
                  disabled={toggleTaskMutation.isPending}
                  data-testid="button-toggle-completion"
                >
                  {selectedTask.completed ? "Mark Incomplete" : "Mark Complete"}
                </Button>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsViewEventDialogOpen(false)}
                    data-testid="button-close-event"
                  >
                    Close
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => deleteTaskMutation.mutate(selectedTask.id)}
                    disabled={deleteTaskMutation.isPending}
                    data-testid="button-delete-event"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {deleteTaskMutation.isPending ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}