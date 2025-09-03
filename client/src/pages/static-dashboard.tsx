import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Play, Coffee, StickyNote } from "lucide-react";

export default function StaticDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="dashboard">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2" data-testid="text-welcome">
          Welcome back, Student! 🌟
        </h2>
        <p className="text-muted-foreground text-lg">
          Ready to tackle your day with focus and clarity?
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">5</div>
            <p className="text-sm text-muted-foreground">Tasks Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">2h 15m</div>
            <p className="text-sm text-muted-foreground">Focus Time</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">7</div>
            <p className="text-sm text-muted-foreground">Day Streak</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">85%</div>
            <p className="text-sm text-muted-foreground">Weekly Goal</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Focus Timer */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">Focus Timer</h3>
              <div className="text-center py-8">
                <div className="text-4xl font-bold text-blue-600 mb-2">25:00</div>
                <p className="text-muted-foreground mb-4">Ready to start your focus session</p>
                <Button size="lg">
                  <Play className="mr-2 h-5 w-5" />
                  Start Focus Session
                </Button>
              </div>
            </CardContent>
          </Card>

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
                <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg">
                  <input type="checkbox" readOnly className="w-5 h-5 text-primary rounded" />
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">Complete project proposal</h4>
                    <p className="text-sm text-muted-foreground">Due in 2 hours</p>
                  </div>
                  <Badge variant="destructive">Urgent</Badge>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg">
                  <input type="checkbox" readOnly className="w-5 h-5 text-primary rounded" />
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">Review study notes</h4>
                    <p className="text-sm text-muted-foreground">Due today</p>
                  </div>
                  <Badge variant="secondary">Medium</Badge>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg">
                  <input type="checkbox" defaultChecked readOnly className="w-5 h-5 text-primary rounded" />
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground line-through opacity-60">Morning reading</h4>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                  <Badge variant="outline">Low</Badge>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg">
                  <input type="checkbox" readOnly className="w-5 h-5 text-primary rounded" />
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">Prepare presentation</h4>
                    <p className="text-sm text-muted-foreground">Due tomorrow</p>
                  </div>
                  <Badge variant="secondary">Medium</Badge>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg">
                  <input type="checkbox" readOnly className="w-5 h-5 text-primary rounded" />
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">Weekly planning</h4>
                    <p className="text-sm text-muted-foreground">Due Friday</p>
                  </div>
                  <Badge variant="outline">Low</Badge>
                </div>
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
                      12/15
                    </span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Focus Hours</span>
                    <span className="text-foreground font-medium" data-testid="text-focus-hours">
                      18h 30m
                    </span>
                  </div>
                  <Progress value={85} className="h-2 [&>div]:bg-green-500" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Habit Streak</span>
                    <span className="text-foreground font-medium" data-testid="text-habit-streak">
                      7 days
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
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-destructive" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Complete project proposal</p>
                    <p className="text-xs text-muted-foreground">Today</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Prepare presentation</p>
                    <p className="text-xs text-muted-foreground">Tomorrow</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Weekly planning</p>
                    <p className="text-xs text-muted-foreground">Friday</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Daily Habits */}
          <Card data-testid="daily-habits">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Daily Habits</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" defaultChecked readOnly className="w-4 h-4 text-primary rounded" />
                    <span className="text-sm text-foreground">Morning meditation</span>
                  </div>
                  <div className="w-4 h-4 bg-green-500 rounded-full" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" defaultChecked readOnly className="w-4 h-4 text-primary rounded" />
                    <span className="text-sm text-foreground">Daily reading</span>
                  </div>
                  <div className="w-4 h-4 bg-green-500 rounded-full" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" readOnly className="w-4 h-4 text-primary rounded" />
                    <span className="text-sm text-foreground">Evening reflection</span>
                  </div>
                  <div className="w-4 h-4 bg-muted rounded-full" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" readOnly className="w-4 h-4 text-primary rounded" />
                    <span className="text-sm text-foreground">Exercise</span>
                  </div>
                  <div className="w-4 h-4 bg-muted rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Extra content to test scrolling */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="text-sm">
                <span className="font-medium">Completed:</span> Morning reading
                <span className="text-muted-foreground ml-2">2 hours ago</span>
              </div>
              <div className="text-sm">
                <span className="font-medium">Started:</span> Focus session
                <span className="text-muted-foreground ml-2">3 hours ago</span>
              </div>
              <div className="text-sm">
                <span className="font-medium">Added:</span> New task - Review notes
                <span className="text-muted-foreground ml-2">5 hours ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Tips & Motivation</h3>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                "The key to productivity is to focus on what matters most and eliminate distractions."
              </p>
              <p className="text-sm text-muted-foreground">
                Take regular breaks to maintain high performance throughout the day.
              </p>
              <p className="text-sm text-muted-foreground">
                Remember: Progress over perfection. Every small step counts!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 text-center">
        <p className="text-muted-foreground">
          Keep scrolling to test - this content should stay visible without 404 errors! 🎉
        </p>
      </div>
    </div>
  );
}