import { createContext, useState, useEffect } from 'react';
import { websocketClient, isTokenExpired } from '../services/websocket-client';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore session
    const storedToken = localStorage.getItem('token');
    if (storedToken && !isTokenExpired(storedToken)) {
      setToken(storedToken);
      setUser({ username: 'trader' }); 
      websocketClient.connect(storedToken);
    } else {
      if (storedToken) {
        localStorage.removeItem('token');
      }
      // Connect unauthenticated to stream public index updates (landing page etc.)
      websocketClient.connect();
    }
    setIsLoading(false);
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    websocketClient.authenticate(authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    websocketClient.clearAuth();
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
