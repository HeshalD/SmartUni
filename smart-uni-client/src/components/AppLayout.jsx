import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function AppLayout() {
  return (
    <div className="app-shell">
      <Sidebar />

      <div className="app-shell__content">
        <Navbar />
        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}