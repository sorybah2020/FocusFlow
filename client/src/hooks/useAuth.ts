import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    refetchInterval: false,
    refetchOnMount: false,
  });

  // Check if the error indicates the user is not authenticated
  const isAuthError = error && (
    (error as any).message?.includes("401") || 
    (error as any).message?.includes("Unauthorized")
  );

  return {
    user,
    isLoading: isLoading && !isAuthError,
    isAuthenticated: !!user && !isAuthError,
  };
}