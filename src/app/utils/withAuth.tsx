import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { NextPage } from 'next';

export function withAuth<P extends object>(Component: NextPage<P>) {
  return function ProtectedRoute(props: P) {
    const router = useRouter();

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const response = await fetch('https://frontend-take-home-service.fetch.com/dogs/breeds', {
            credentials: 'include',
          });
          
          if (!response.ok) {
            throw new Error('Not authenticated');
          }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          router.push('/');
        }
      };
      
      checkAuth();
    }, []);

    return <Component {...props} />;
  };
}