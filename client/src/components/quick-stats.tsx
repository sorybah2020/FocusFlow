import { useQuery } from "@tanstack/react-query";
import { CheckSquare, Clock, Flame, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { User, Task, FocusSession } from "@shared/schema";

export default function QuickStats() {
  const { data: user } = useQuery<User>({ queryKey: ["/api/users/current"] });
  const { data: tasks = [] } = useQuery<Task[]>({ queryKey: ["/api/tasks"] });
  const { data: sessions = [] } = useQuery<FocusSession[]>({ queryKey: ["/api/focus-sessions"] });

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  
  // Calculate today's focus time
  const today = new Date().toDateString();
  const todaysSessions = sessions.filter(session => 
    session.completedAt && new Date(session.completedAt).toDateString() === today
  );
  const todayFocusTime = todaysSessions.reduce((total, session) => total + session.duration, 0);

  const stats = [
    {
      icon: CheckSquare,
      label: "Tasks Today",
      value: `${completedTasks} of ${totalTasks}`,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Clock,
      label: "Focus Time",
      value: `${Math.floor(todayFocusTime / 60)}h ${todayFocusTime % 60}m`,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: Flame,
      label: "Streak",
      value: `${user?.currentStreak || 0} days`,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: Trophy,
      label: "Level",
      value: `Level ${user?.level || 1}`,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" data-testid="quick-stats">
      {stats.map((stat, index) => (
        <Card key={index} data-testid={`stat-${stat.label.toLowerCase().replace(" ", "-")}`}>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className={`p-2 ${stat.bgColor} rounded-lg`}>
                <stat.icon className={`${stat.color} text-xl h-6 w-6`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
