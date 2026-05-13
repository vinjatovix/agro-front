import { Link, Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-brand">
          <Link to="/">AgroApp</Link>
        </div>

        <nav className="app-nav">
          <Link to="/plants">Plants</Link>
          <Link to="/families">Families</Link>
          {/* <Link to="/admin">Admin</Link> */}
        </nav>
      </header>

      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
}
