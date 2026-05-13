import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div>
      <h1>AgroApp Auth</h1>

      <Outlet />
    </div>
  );
}
