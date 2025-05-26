import { createRootRoute, Outlet, useRouter } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: function RootComponent() {
    const router = useRouter();
    if (typeof window !== 'undefined' && window.location.pathname === '/') {
      router.history.replace('/auth');
    }
    return (
      <div className="m-2 sm:m-4 md:m-8">
        <Outlet />
      </div>
    );
  },
});
