import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      display: 'flex',
    }}>
      <AdminSidebar />
      <div style={{
        flex: 1,
        marginLeft: '280px',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}>
        <main style={{
          flex: 1,
          padding: '0',
          background: '#f8fafc',
          overflowY: 'auto',
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
