import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { supabase } from '../lib/supabaseClient';

export const Route = createFileRoute('/_app')({
  beforeLoad: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw redirect({
        to: '/auth',
        search: {
          redirect: window.location.pathname || '/dashboard',
        },
      });
    }

    return { session };
  },
  component: AppLayout,
});

function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Outlet />
    </div>
  );
}
