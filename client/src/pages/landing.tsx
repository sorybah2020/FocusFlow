import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Timer, CheckSquare, FileText, Calendar, TrendingUp, Zap, Brain, Heart } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="text-white h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-foreground">FocusFlow</span>
          </div>
          <Button 
            onClick={() => window.location.href = '/api/login'}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            data-testid="button-login"
          >
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-foreground mb-6 leading-tight">
            Master Your Focus,<br />
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Transform Your Life
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Built specifically for students with ADHD, FocusFlow combines science-backed focus techniques 
            with intuitive productivity tools to help you achieve your academic goals with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => window.location.href = '/api/login'}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-6 text-lg"
              data-testid="button-get-started"
            >
              Get Started Free
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="px-8 py-6 text-lg border-2"
              data-testid="button-learn-more"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-foreground mb-12">
          Everything You Need to Succeed
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Timer className="text-blue-500 h-6 w-6" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Smart Focus Timer</h3>
              <p className="text-muted-foreground text-sm">
                Customizable Pomodoro sessions that adapt to your attention span and energy levels.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <CheckSquare className="text-green-500 h-6 w-6" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Task Management</h3>
              <p className="text-muted-foreground text-sm">
                Priority-based task organization with visual cues and deadline tracking.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <FileText className="text-purple-500 h-6 w-6" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Smart Notes</h3>
              <p className="text-muted-foreground text-sm">
                Organized note-taking with tags and search to keep your thoughts structured.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Calendar className="text-orange-500 h-6 w-6" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Visual Calendar</h3>
              <p className="text-muted-foreground text-sm">
                Color-coded calendar view that makes deadlines and schedules crystal clear.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ADHD-Specific Benefits */}
      <section className="container mx-auto px-4 py-16 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl mx-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Designed for ADHD Minds
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="text-white h-8 w-8" />
              </div>
              <h3 className="font-semibold text-foreground mb-3">Hyperfocus Friendly</h3>
              <p className="text-muted-foreground">
                Flexible timer durations that work with your natural attention patterns, from 15 minutes to 2+ hours.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="text-white h-8 w-8" />
              </div>
              <h3 className="font-semibold text-foreground mb-3">Executive Function Support</h3>
              <p className="text-muted-foreground">
                Visual cues, priority colors, and structured workflows that support planning and organization.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-white h-8 w-8" />
              </div>
              <h3 className="font-semibold text-foreground mb-3">Stress-Free Progress</h3>
              <p className="text-muted-foreground">
                Celebration of small wins, gentle reminders, and progress tracking that builds confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            Join Students Who've Transformed Their Academic Life
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-blue-500 mb-2">89%</div>
              <p className="text-muted-foreground">improved focus time</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-500 mb-2">3.2x</div>
              <p className="text-muted-foreground">more tasks completed</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-500 mb-2">94%</div>
              <p className="text-muted-foreground">reduced study stress</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 border-0">
          <CardContent className="p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Academic Journey?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of students who've discovered their potential with FocusFlow.
            </p>
            <Button 
              size="lg"
              variant="secondary"
              onClick={() => window.location.href = '/api/login'}
              className="px-8 py-6 text-lg bg-white text-blue-600 hover:bg-gray-100"
              data-testid="button-start-journey"
            >
              Start Your Journey Today
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-muted-foreground">
        <p>© 2025 FocusFlow. Designed with ❤️ for students with ADHD.</p>
      </footer>
    </div>
  );
}