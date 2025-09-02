import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Target, TrendingUp, Award, Flame } from "lucide-react";
import type { User, Task, FocusSession } from "@shared/schema";

export default function ProgressPage() {
  const { data: user } = useQuery<User>({ queryKey: ["/api/users/current"] });
  const { data: tasks = [] } = useQuery<Task[]>({ queryKey: ["/api/tasks"] });
  const { data: sessions = [] } = useQuery<FocusSession[]>({ queryKey: ["/api/focus-sessions"] });

  // Calculate stats
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Calculate weekly stats
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  
  const weeklyTasks = tasks.filter(task => 
    task.createdAt && new Date(task.createdAt) >= weekAgo
  );
  const weeklyCompletedTasks = weeklyTasks.filter(task => task.completed).length;
  
  const weeklySessions = sessions.filter(session =>
    session.completedAt && new Date(session.completedAt) >= weekAgo
  );
  const weeklyFocusTime = weeklySessions.reduce((total, session) => total + session.duration, 0);

  // Calculate daily stats for the past week
  const dailyStats = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toDateString();
    
    const dayTasks = tasks.filter(task => 
      task.createdAt && new Date(task.createdAt).toDateString() === dateStr
    );
    const dayCompleted = dayTasks.filter(task => task.completed).length;
    
    const daySessions = sessions.filter(session =>
      session.completedAt && new Date(session.completedAt).toDateString() === dateStr
    );
    const dayFocusTime = daySessions.reduce((total, session) => total + session.duration, 0);
    
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      completedTasks: dayCompleted,
      focusTime: dayFocusTime,
    };
  }).reverse();

  const achievements = [
    {
      title: "First Task",
      description: "Complete your first task",
      unlocked: completedTasks > 0,
      icon: Target,
    },
    {
      title: "Focus Master",
      description: "Complete 10 focus sessions",
      unlocked: sessions.length >= 10,
      icon: Clock,
    },
    {
      title: "Task Warrior",
      description: "Complete 25 tasks",
      unlocked: completedTasks >= 25,
      icon: Award,
    },
    {
      title: "Consistency King",
      description: "Maintain a 7-day streak",
      unlocked: (user?.currentStreak || 0) >= 7,
      icon: Flame,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="progress-page">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="text-page-title">Progress</h1>
        <p className="text-muted-foreground">Track your productivity and achievements</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card data-testid="card-level">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Current Level</p>
                <p className="text-2xl font-bold text-foreground" data-testid="text-user-level">
                  {user?.level || 1}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-total-focus">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Focus Time</p>
                <p className="text-2xl font-bold text-foreground" data-testid="text-total-focus-time">
                  {Math.floor((user?.totalFocusTime || 0) / 60)}h {(user?.totalFocusTime || 0) % 60}m
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-completed-tasks">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Tasks Completed</p>
                <p className="text-2xl font-bold text-foreground" data-testid="text-completed-tasks">
                  {completedTasks}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-current-streak">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Flame className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Current Streak</p>
                <p className="text-2xl font-bold text-foreground" data-testid="text-current-streak">
                  {user?.currentStreak || 0} days
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Progress */}
        <Card data-testid="weekly-progress">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              This Week's Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Tasks Completed</span>
                  <span className="font-medium" data-testid="text-weekly-tasks">
                    {weeklyCompletedTasks}/{weeklyTasks.length}
                  </span>
                </div>
                <Progress 
                  value={weeklyTasks.length > 0 ? (weeklyCompletedTasks / weeklyTasks.length) * 100 : 0} 
                  className="h-3"
                />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Focus Time</span>
                  <span className="font-medium" data-testid="text-weekly-focus">
                    {Math.floor(weeklyFocusTime / 60)}h {weeklyFocusTime % 60}m
                  </span>
                </div>
                <Progress value={Math.min((weeklyFocusTime / (7 * 60)) * 100, 100)} className="h-3" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Completion Rate</span>
                  <span className="font-medium" data-testid="text-completion-rate">
                    {completionRate.toFixed(1)}%
                  </span>
                </div>
                <Progress value={completionRate} className="h-3" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Activity */}
        <Card data-testid="daily-activity">
          <CardHeader>
            <CardTitle>Daily Activity (Past 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dailyStats.map((day, index) => (
                <div key={index} className="flex items-center justify-between" data-testid={`day-${index}`}>
                  <span className="text-sm font-medium text-foreground w-12">{day.date}</span>
                  <div className="flex-1 mx-4">
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <span data-testid={`tasks-${index}`}>{day.completedTasks} tasks</span>
                      <span data-testid={`focus-${index}`}>{Math.floor(day.focusTime / 60)}h {day.focusTime % 60}m</span>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i < Math.ceil((day.completedTasks + day.focusTime / 60) / 2)
                            ? 'bg-primary'
                            : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="lg:col-span-2" data-testid="achievements">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="mr-2 h-5 w-5" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    achievement.unlocked
                      ? 'border-primary bg-primary/5'
                      : 'border-muted bg-muted/20'
                  }`}
                  data-testid={`achievement-${index}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      achievement.unlocked
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      <achievement.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-foreground">{achievement.title}</h4>
                        {achievement.unlocked && (
                          <Badge variant="default" className="text-xs">Unlocked</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
