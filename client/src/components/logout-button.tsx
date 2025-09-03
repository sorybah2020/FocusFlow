import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LogoutButton() {
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem('focusflow_user');
    toast({
      title: "Logged out successfully",
      description: "See you next time!"
    });
    window.location.href = '/';
  };

  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={handleLogout}
      data-testid="button-logout"
    >
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>
  );
}