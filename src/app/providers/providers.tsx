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
            staleTime: 5 * 1000, // 5 seconds
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  // User data state
  const [userData, setUserData] = useState<UserData>({});

  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      setUserData(JSON.parse(storedData));
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <UserContext.Provider value={userData}>
        {children}
      </UserContext.Provider>
    </QueryClientProvider>
  );
}