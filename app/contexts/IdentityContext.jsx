'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

const IdentityContext = createContext(null);

export function IdentityProvider({ children }) {
  const { data: session, status } = useSession();
  const [identity, setIdentity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchIdentity = useCallback(async () => {
    if (status === 'authenticated') {
      setIsLoading(true);
      try {
        const response = await fetch('/api/identity');
        if (response.ok) {
          const data = await response.json();
          setIdentity(data);
          localStorage.setItem('opalaIdentity', JSON.stringify(data));
        } else {
          // Clear local storage if fetching fails (e.g., user has no identity yet)
          localStorage.removeItem('opalaIdentity');
          setIdentity({ gemSeed: null, username: session.user.name });
        }
      } catch (error) {
        console.error("Failed to fetch identity", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [status, session]);

  useEffect(() => {
    if (status === 'authenticated') {
      const cachedIdentity = localStorage.getItem('opalaIdentity');
      if (cachedIdentity) {
        const parsedCache = JSON.parse(cachedIdentity);
        // Basic validation: does the cached username match the session username?
        if (session.user.name === parsedCache.username) {
            setIdentity(parsedCache);
            setIsLoading(false);
        } else {
            // If not, the cache is stale (e.g., different user logged in)
            localStorage.removeItem('opalaIdentity');
            fetchIdentity();
        }
      } else {
        fetchIdentity();
      }
    } else if (status === 'unauthenticated') {
      setIdentity(null);
      localStorage.removeItem('opalaIdentity');
      setIsLoading(false);
    }
  }, [status, session, fetchIdentity]);

  const createIdentity = async () => {
    try {
      const response = await fetch('/api/identity', { method: 'POST' });
      if (response.ok || response.status === 409) { // 409 means it already exists, which is fine
        const data = await response.json();
        // Refetch to get the canonical data from the server
        await fetchIdentity();
        return data;
      }
    } catch (error) {
      console.error("Failed to create identity", error);
    }
  };

  return (
    <IdentityContext.Provider value={{ identity, isLoading, createIdentity }}>
      {children}
    </IdentityContext.Provider>
  );
}

export function useIdentity() {
  const context = useContext(IdentityContext);
  if (context === undefined) {
    throw new Error('useIdentity must be used within an IdentityProvider');
  }
  return context;
}
