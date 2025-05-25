import { createRootRoute, Link, Outlet } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: () => (
    <>
      <nav style={{ marginBottom: 16 }}>
        <Link to="/auth" style={{ marginRight: 8 }}>
          Login
        </Link>
        <Link to="/dashboard">Dashboard</Link>
      </nav>
      <Outlet />
    </>
  ),
});
