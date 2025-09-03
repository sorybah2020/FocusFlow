import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  // Temporarily disable auth check - show landing page for all users
  // This stops the endless 401 loop while we fix the authentication setup
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    enabled: false, // Disable the query completely for now
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });

  return {
    user: null, // No user data for now
    isLoading: false, // Not loading
    isAuthenticated: false, // Show landing page for everyone
  };
}