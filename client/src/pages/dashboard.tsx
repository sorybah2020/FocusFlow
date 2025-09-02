import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Play, Coffee, StickyNote } from "lucide-react";
import QuickStats from "@/components/quick-stats";
import FocusTimerWidget from "@/components/focus-timer-widget";
import TaskItem from "@/components/task-item";
import type { User, Task, Habit } from "@shared/schema";

export default function Dashboard() {
  const { data: user } = useQuery<User>({ queryKey: ["/api/users/current"] });
  const { data: tasks = [] } = useQuery<Task[]>({ queryKey: ["/api/tasks"] });
  const { data: habits = [] } = useQuery<Habit[]>({ 
    queryKey: ["/api/habits"], 
    refetchInterval: 30000 
  });

  const todaysTasks = tasks.slice(0, 4); // Show first 4 tasks
  const upcomingDeadlines = tasks
    .filter(task => task.dueDate && !task.completed)
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 3);

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const tasksProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const completedHabits = habits.filter(habit => habit.completed).length;
  const totalHabits = habits.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="dashboard">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2" data-testid="text-welcome">
          Welcome back, {user?.firstName || "Student"}! 🌟
        </h2>
        <p className="text-muted-foreground text-lg">
          Ready to tackle your day with focus and clarity?
        </p>
      </div>

      {/* Quick Stats */}
      <QuickStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Focus Timer */}
          <FocusTimerWidget taskTitle="Math Assignment Review" />

          {/* Today's Tasks */}
          <Card data-testid="todays-tasks">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-foreground">Today's Tasks</h3>
                <Button data-testid="button-add-task">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Task
                </Button>
              </div>

              <div className="space-y-4">
                {todaysTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No tasks for today. Great job!</p>
                  </div>
                ) : (
                  todaysTasks.map((task) => (
                    <TaskItem key={task.id} task={task} />
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <Card data-testid="quick-actions">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button className="w-full" data-testid="button-start-focus">
                  <Play className="mr-2 h-4 w-4" />
                  Start Focus Session
                </Button>
                <Button variant="secondary" className="w-full" data-testid="button-take-break">
                  <Coffee className="mr-2 h-4 w-4" />
                  Take a Break
                </Button>
                <Button variant="secondary" className="w-full" data-testid="button-quick-note">
                  <StickyNote className="mr-2 h-4 w-4" />
                  Quick Note
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Progress This Week */}
          <Card data-testid="weekly-progress">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">This Week's Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Tasks Completed</span>
                    <span className="text-foreground font-medium" data-testid="text-tasks-progress">
                      {completedTasks}/{totalTasks}
                    </span>
                  </div>
                  <Progress value={tasksProgress} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Focus Hours</span>
                    <span className="text-foreground font-medium" data-testid="text-focus-hours">
                      {Math.floor((user?.totalFocusTime || 0) / 60)}h {(user?.totalFocusTime || 0) % 60}m
                    </span>
                  </div>
                  <Progress value={80} className="h-2 [&>div]:bg-green-500" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Habit Streak</span>
                    <span className="text-foreground font-medium" data-testid="text-habit-streak">
                      {user?.currentStreak || 0} days
                    </span>
                  </div>
                  <Progress value={100} className="h-2 [&>div]:bg-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Deadlines */}
          <Card data-testid="upcoming-deadlines">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Upcoming Deadlines</h3>
              <div className="space-y-3">
                {upcomingDeadlines.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No upcoming deadlines</p>
                ) : (
                  upcomingDeadlines.map((task) => (
                    <div 
                      key={task.id} 
                      className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg"
                      data-testid={`deadline-${task.id}`}
                    >
                      <div className={`w-2 h-2 rounded-full ${
                        task.priority === 'urgent' ? 'bg-destructive' :
                        task.priority === 'medium' ? 'bg-orange-500' : 'bg-green-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{task.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Daily Habits */}
          <Card data-testid="daily-habits">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Daily Habits</h3>
              <div className="space-y-3">
                {habits.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No habits tracked today</p>
                ) : (
                  habits.map((habit) => (
                    <div 
                      key={habit.id} 
                      className="flex items-center justify-between"
                      data-testid={`habit-${habit.id}`}
                    >
                      <div className="flex items-center space-x-3">
                        <input 
                          type="checkbox" 
                          checked={habit.completed}
                          readOnly
                          className="w-4 h-4 text-primary rounded border-border focus:ring-ring"
                        />
                        <span className="text-sm text-foreground">{habit.name}</span>
                      </div>
                      {habit.completed ? (
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      ) : (
                        <div className="w-4 h-4 bg-muted rounded-full" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
