import { useState, useEffect } from 'react';
import { Link, Outlet, createRootRoute, useRouter, useNavigate } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { supabase } from '../lib/supabaseClient';
import type { Session } from '@supabase/supabase-js';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchCurrentUser, clearUser, setShouldLogout } from '../store/userSlice';
import { UserProfile } from '../components/UserProfile';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const Route = createRootRoute({
  component: () => <RootComponent />,
});

function RootComponent() {
  const router = useRouter();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading: userLoading, shouldLogout } = useAppSelector((state) => state.user);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();
      setSession(currentSession);
      setLoading(false);

      // If user is authenticated, fetch user data from database
      if (currentSession?.user) {
        dispatch(fetchCurrentUser());
      }
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);

      if (_event === 'SIGNED_OUT' && newSession === null) {
        // Clear user data from Redux store
        dispatch(clearUser());
        navigate({ to: '/auth', search: { redirect: '/dashboard' }, replace: true });
      } else if (_event === 'SIGNED_IN' && newSession !== null) {
        // Fetch user data from database
        dispatch(fetchCurrentUser());
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate, dispatch]);

  // Watch for shouldLogout flag and automatically log out user
  useEffect(() => {
    if (shouldLogout) {
      console.log('Auto-logout triggered due to authentication failure');
      setSession(null);
      dispatch(setShouldLogout(false)); // Reset the flag
      navigate({ to: '/auth', search: { redirect: '/dashboard' }, replace: true });
    }
  }, [shouldLogout, dispatch, navigate]);

  useEffect(() => {
    if (!loading) {
      const currentPath = router.state.location.pathname;
      if (!session && currentPath !== '/auth') {
        // If no session and not on auth page, redirect to auth
        navigate({ to: '/auth', search: { redirect: currentPath }, replace: true });
      } else if (session && currentPath === '/auth') {
        // If there is a session and on auth page, redirect to dashboard
        navigate({ to: '/dashboard', replace: true });
      } else if (currentPath === '/') {
        // If at root, redirect based on session
        navigate({
          to: session ? '/dashboard' : '/auth',
          search: session ? undefined : { redirect: '/dashboard' },
          replace: true,
        });
      }
    }
  }, [session, loading, router.state.location.pathname, navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
      // Optionally show an error to the user
    } else {
      // onAuthStateChange will handle redirect to /auth and clearing user data
    }
  };

  if (loading || userLoading) {
    return <LoadingSpinner />;
  }

  // Determine if the navigation menu (and logout button) should be shown
  // For example, don't show it on the /auth page
  const showNav = session && router.state.location.pathname !== '/auth';

  return (
    <>
      {showNav && (
        <nav className="bg-gray-800 text-white p-4 mb-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <Link to="/dashboard" className="text-xl font-bold hover:text-gray-300">
                Dashboard
              </Link>
              <Link to="/profile" className="text-lg hover:text-gray-300">
                Profile
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <UserProfile />
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>
      )}
      <div className="w-screen max-w-[100vw] h-screen max-h-[100vh] overflow-hidden">
        <Outlet />
      </div>
      <TanStackRouterDevtools />
    </>
  );
}
