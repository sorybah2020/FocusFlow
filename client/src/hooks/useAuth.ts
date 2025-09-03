import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  // Disable auth for now - show landing page to all users
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    enabled: false, // Completely disable the query
  });

  return {
    user: null,
    isLoading: false,
    isAuthenticated: false, // Always show landing page
  };
}