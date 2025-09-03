import { useState, useEffect } from "react";

let globalAuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true
};

export function useAuth() {
  const [authState, setAuthState] = useState(globalAuthState);

  useEffect(() => {
    // Check localStorage for user data
    try {
      const savedUser = localStorage.getItem('focusflow_user');
      const newState = savedUser 
        ? { user: JSON.parse(savedUser), isAuthenticated: true, isLoading: false }
        : { user: null, isAuthenticated: false, isLoading: false };
      
      globalAuthState = newState;
      setAuthState(newState);
    } catch (error) {
      const newState = { user: null, isAuthenticated: false, isLoading: false };
      globalAuthState = newState;
      setAuthState(newState);
      localStorage.removeItem('focusflow_user');
    }
  }, []);

  return authState;
}