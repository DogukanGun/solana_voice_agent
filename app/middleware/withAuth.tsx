import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { enqueueSnackbar } from 'notistack'
import { RegisteredUsers } from '@prisma/client';
import Loader from '../components/LoaderIcon';
import { apiService } from '../services/ApiService';


export function withAuth<T extends object>(WrappedComponent: React.ComponentType<T>) {
  const WithAuth = (props: T) => {
    const router = useRouter();
    const [user, setUser] = useState<boolean>(false);
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

          if (!response.data.isAdmin) {
            enqueueSnackbar('User is not authenticated', { variant: 'error' });
            router.replace('/');
          }

          setUser(response.data.isAdmin);
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

    return <WrappedComponent {...props} />;
  };

  return WithAuth;
}
