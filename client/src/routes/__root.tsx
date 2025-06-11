import { createRootRoute, Outlet, useRouter } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: function RootComponent() {
    const router = useRouter();
    if (typeof window !== 'undefined' && window.location.pathname === '/') {
      router.history.replace('/auth');
    }
    return (
      <div className="w-screen max-w-[100vw] h-screen max-h-[100vh] overflow-hidden">
        <Outlet />
      </div>
    );
  },
});
