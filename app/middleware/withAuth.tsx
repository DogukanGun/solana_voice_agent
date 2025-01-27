import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { enqueueSnackbar } from 'notistack'
import { RegisteredUsers } from '@prisma/client';
import Loader from '../components/LoaderIcon';
import { apiService } from '../services/ApiService';

interface AuthenticatedProps {
  user: RegisteredUsers;
}

export function withAuth<T>(WrappedComponent: React.ComponentType<T & AuthenticatedProps>) {
  const WithAuth = (props: T) => {
    const router = useRouter();
    const [user, setUser] = useState<RegisteredUsers | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchUser = async () => {
        try {
          if(!localStorage.getItem('token')){
            enqueueSnackbar('User is not authenticated', { variant: 'error' });
            router.replace('/');
            return;
          }
          const response = await apiService.checkAdmin(localStorage.getItem('token')!)

          if (!response) {
            enqueueSnackbar('User is not authenticated', { variant: 'error' });
            router.replace('/');
          }

          setUser(response);
        } catch (error) {
          console.error(error);
          router.replace('/');
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    }, [router]);

    if (loading) {
      return <Loader/>
    }

    if (!user) {
      return null; // Render nothing while redirecting
    }

    return <WrappedComponent {...props} user={user} />;
  };

  return WithAuth;
}
