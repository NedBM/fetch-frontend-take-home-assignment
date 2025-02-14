'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, createContext, useContext, useEffect } from 'react';

// User context types and creation
interface UserData {
  name?: string;
  email?: string;
}

const UserContext = createContext<UserData>({});

export const useUserData = () => useContext(UserContext);

export default function Providers({ children }: { children: React.ReactNode }) {
  // Query client initialization
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  // User data state with hydration handling
  const [userData, setUserData] = useState<UserData>({});
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Handle user data hydration
    try {
      const storedData = localStorage.getItem('userData');
      if (storedData) {
        setUserData(JSON.parse(storedData));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
    setIsHydrated(true);
  }, []);

  // Prevent flash of incorrect content during hydration
  if (!isHydrated) {
    return null; // or return a loading skeleton
  }

  return (
    <QueryClientProvider client={queryClient}>
      <UserContext.Provider value={userData}>
        {children}
      </UserContext.Provider>
    </QueryClientProvider>
  );
}