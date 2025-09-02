import { Link, useLocation } from "wouter";
import { Brain, Bell, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Dashboard", active: location === "/" },
    { href: "/tasks", label: "Tasks", active: location === "/tasks" },
    { href: "/calendar", label: "Calendar", active: location === "/calendar" },
    { href: "/focus-timer", label: "Focus Timer", active: location === "/focus-timer" },
    { href: "/notes", label: "Notes", active: location === "/notes" },
    { href: "/progress", label: "Progress", active: location === "/progress" },
  ];

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50" data-testid="navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" data-testid="link-home">
                <h1 className="text-xl font-semibold text-primary flex items-center">
                  <Brain className="mr-2 h-6 w-6" />
                  FocusFlow
                </h1>
              </Link>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    data-testid={`link-${item.label.toLowerCase().replace(" ", "-")}`}
                  >
                    <span
                      className={cn(
                        "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        item.active
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-muted-foreground hover:text-foreground" data-testid="button-notifications">
              <Bell className="h-5 w-5" />
            </button>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center" data-testid="avatar-user">
              <User className="h-4 w-4 text-primary-foreground" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
