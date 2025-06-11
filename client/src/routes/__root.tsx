import { useEffect, useState } from 'react';
import { createRootRoute, Outlet, useRouter, Link, useNavigate } from '@tanstack/react-router';
import { supabase } from '../lib/supabaseClient'; // Adjusted path
import type { Session } from '@supabase/supabase-js';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const router = useRouter();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();
      setSession(currentSession);
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      // If user logs out, newSession will be null.
      // If user logs in, newSession will be populated.
      if (_event === 'SIGNED_OUT' && newSession === null) {
        navigate({ to: '/auth', search: { redirect: '/dashboard' }, replace: true });
      } else if (_event === 'SIGNED_IN' && newSession !== null) {
        // Optionally navigate to dashboard on sign in if not already there
        // However, individual components (like AuthPage) might handle this better
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate]);

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
      // onAuthStateChange will handle redirect to /auth
    }
  };

  if (loading) {
    // You can replace this with a proper loading spinner component
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  // Determine if the navigation menu (and logout button) should be shown
  // For example, don't show it on the /auth page
  const showNav = session && router.state.location.pathname !== '/auth';

  return (
    <>
      {showNav && (
        <nav className="bg-gray-800 text-white p-4 mb-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/dashboard" className="text-xl font-bold hover:text-gray-300">
              Dashboard
            </Link>
            <div>
              <span className="mr-4">Welcome, {session?.user?.email}</span>
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
    </>
  );
}
