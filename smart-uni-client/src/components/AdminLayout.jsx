import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout() {
  return (
    <div className="app-shell">
      <AdminSidebar />
      <div className="app-shell__content">
        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
