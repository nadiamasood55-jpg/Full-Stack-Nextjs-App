import { useState, useEffect, useCallback } from 'react';

export const useSessionTracking = (userId) => {
  const [sessionData, setSessionData] = useState(null);
  const [currentSession, setCurrentSession] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Track login time
  const trackLogin = useCallback(async () => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          action: 'login',
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        console.log('Login time tracked successfully');
      }
    } catch (error) {
      console.error('Error tracking login:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Track logout time and get session duration
  const trackLogout = useCallback(async () => {
    if (!userId) return null;
    
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          action: 'logout',
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Session duration:', data.sessionData?.formattedDuration);
        return data.sessionData;
      }
    } catch (error) {
      console.error('Error tracking logout:', error);
    } finally {
      setIsLoading(false);
    }
    return null;
  }, [userId]);

  // Get session history
  const getSessionHistory = useCallback(async () => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(`/api/auth/session?userId=${userId}`);
      
      if (response.ok) {
        const data = await response.json();
        setSessionData(data.sessionHistory);
        setCurrentSession(data.currentSession);
      }
    } catch (error) {
      console.error('Error fetching session history:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Format duration helper
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  // Get current session duration
  const getCurrentSessionDuration = useCallback(() => {
    if (!currentSession) return 0;
    return Math.floor((new Date() - new Date(currentSession.loginTime)) / 1000);
  }, [currentSession]);

  useEffect(() => {
    if (userId) {
      getSessionHistory();
    }
  }, [userId, getSessionHistory]);

  return {
    sessionData,
    currentSession,
    isLoading,
    trackLogin,
    trackLogout,
    getSessionHistory,
    formatDuration,
    getCurrentSessionDuration,
  };
};

