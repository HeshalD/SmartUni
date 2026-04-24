import { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { adminApi } from '../../api/adminApi';
import { 
  FaUsers, 
  FaTools, 
  FaUserShield, 
  FaPlus, 
  FaTrash, 
  FaChartBar, 
  FaUserTie,
  FaEnvelope,
  FaLock,
  FaIdCard,
  FaSpinner,
  FaCheckCircle,
  FaTimes
} from 'react-icons/fa';

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [techForm, setTechForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const getRoleText = (user) => {
    if (user?.role) return user.role;
    if (Array.isArray(user?.roles)) return user.roles.join(', ');
    return 'N/A';
  };

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setPageError('');

      const [usersRes, techsRes] = await Promise.all([
        adminApi.getUsers(),
        adminApi.getTechnicians(),
      ]);

      const usersData = usersRes.data || [];
      const techsData = techsRes.data || [];

      setUsers(usersData);
      setTechnicians(techsData);

      console.log('Users:', usersData);
      console.log('Technicians:', techsData);
    } catch (error) {
      console.error('Failed to load admin data:', error);
      setPageError(
        error?.response?.data?.message || 'Failed to load admin panel data'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleTechInputChange = (e) => {
    const { name, value } = e.target;
    setTechForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateTechnician = async (e) => {
    e.preventDefault();
    setPageError('');
    setSuccessMessage('');

    try {
      await adminApi.createTechnician(techForm);

      setSuccessMessage('Technician created successfully.');
      setTechForm({
        name: '',
        email: '',
        password: '',
      });

      await loadAdminData();
    } catch (error) {
      console.error('Failed to create technician:', error);
      setPageError(
        error?.response?.data?.message || 'Failed to create technician'
      );
    }
  };

  const handleDeleteUser = async (userId, role) => {
    setPageError('');
    setSuccessMessage('');

    if (role === 'ADMIN') {
      setPageError('Admin users cannot be deleted from this panel.');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to delete this user?');
    if (!confirmed) return;

    try {
      await adminApi.deleteUser(userId);
      setSuccessMessage('User deleted successfully.');
      await loadAdminData();
    } catch (error) {
      console.error('Failed to delete user:', error);
      setPageError(
        error?.response?.data?.message || 'Failed to delete user'
      );
    }
  };

  const totalAdmins = users.filter((u) => getRoleText(u).includes('ADMIN')).length;

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <FaSpinner size={32} color="#4f46e5" style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ color: '#6b7280', fontSize: '16px' }}>Loading admin panel...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: 800, 
          color: '#111827', 
          margin: 0, 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px' 
        }}>
          <FaUserShield size={32} color="#4f46e5" />
          Admin Panel
        </h1>
        <p style={{ fontSize: '16px', color: '#6b7280', margin: '8px 0 0 0' }}>
          Manage users, technician accounts, and access from one place.
        </p>
      </div>

      {/* Success/Error Messages */}
      {pageError && (
        <div style={{ 
          marginBottom: '24px', 
          padding: '16px 20px', 
          borderRadius: '12px', 
          background: '#fef2f2', 
          color: '#991b1b', 
          fontSize: '14px', 
          fontWeight: 600, 
          border: '1px solid #fee2e2', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px' 
        }}>
          <FaTimes size={16} />
          {pageError}
        </div>
      )}
      {successMessage && (
        <div style={{ 
          marginBottom: '24px', 
          padding: '16px 20px', 
          borderRadius: '12px', 
          background: '#d1fae5', 
          color: '#065f46', 
          fontSize: '14px', 
          fontWeight: 600, 
          border: '1px solid #6ee7b7', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px' 
        }}>
          <FaCheckCircle size={16} />
          {successMessage}
        </div>
      )}

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '24px', 
        marginBottom: '32px' 
      }}>
        <div style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          transition: 'transform 0.15s, box-shadow 0.15s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 12px -1px rgba(0, 0, 0, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.06)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
        }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <FaUsers size={24} color="#fff" />
            </div>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#6b7280', margin: 0, textTransform: 'uppercase' }}>
              Total Users
            </h3>
          </div>
          <p style={{ fontSize: '32px', fontWeight: 800, color: '#111827', margin: 0 }}>
            {users.length}
          </p>
        </div>

        <div style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          transition: 'transform 0.15s, box-shadow 0.15s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 12px -1px rgba(0, 0, 0, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.06)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
        }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <FaTools size={24} color="#fff" />
            </div>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#6b7280', margin: 0, textTransform: 'uppercase' }}>
              Technicians
            </h3>
          </div>
          <p style={{ fontSize: '32px', fontWeight: 800, color: '#111827', margin: 0 }}>
            {technicians.length}
          </p>
        </div>

        <div style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          transition: 'transform 0.15s, box-shadow 0.15s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 12px -1px rgba(0, 0, 0, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.06)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
        }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <FaUserShield size={24} color="#fff" />
            </div>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#6b7280', margin: 0, textTransform: 'uppercase' }}>
              Admins
            </h3>
          </div>
          <p style={{ fontSize: '32px', fontWeight: 800, color: '#111827', margin: 0 }}>
            {totalAdmins}
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '32px', 
        marginBottom: '32px' 
      }}>
        
        {/* Create Technician Card */}
        <div style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        }}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: 700, 
            color: '#111827', 
            margin: '0 0 24px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <FaUserTie size={20} color="#4f46e5" />
            Create Technician
          </h2>
          <form onSubmit={handleCreateTechnician} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                <FaIdCard size={12} style={{ marginRight: '6px' }} />
                Full name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Full name"
                value={techForm.name}
                onChange={handleTechInputChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.15s',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#4f46e5'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                <FaEnvelope size={12} style={{ marginRight: '6px' }} />
                Email address
              </label>
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={techForm.email}
                onChange={handleTechInputChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.15s',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#4f46e5'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                <FaLock size={12} style={{ marginRight: '6px' }} />
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={techForm.password}
                onChange={handleTechInputChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.15s',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#4f46e5'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; }}
              />
            </div>
            <button
              type="submit"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                borderRadius: '10px',
                background: '#4f46e5',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#4338ca'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#4f46e5'; }}
            >
              <FaPlus size={14} />
              Create Technician
            </button>
          </form>
        </div>

        {/* Technicians Card */}
        <div style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        }}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: 700, 
            color: '#111827', 
            margin: '0 0 24px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <FaTools size={20} color="#4f46e5" />
            Technicians
          </h2>
          {technicians.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}>
              <FaUserTie size={48} style={{ marginBottom: '16px' }} />
              <p style={{ fontSize: '16px', margin: 0 }}>No technicians found.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                      Name
                    </th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                      Email
                    </th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                      Role
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {technicians.map((tech) => {
                    const techId = tech._id || tech.id;
                    const role = getRoleText(tech);

                    return (
                      <tr key={techId} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '16px 12px', fontSize: '14px', color: '#111827' }}>
                          {tech.name}
                        </td>
                        <td style={{ padding: '16px 12px', fontSize: '14px', color: '#6b7280' }}>
                          {tech.email}
                        </td>
                        <td style={{ padding: '16px 12px' }}>
                          <span style={{
                            background: '#dbeafe',
                            color: '#1e40af',
                            fontSize: '12px',
                            fontWeight: 700,
                            padding: '4px 12px',
                            borderRadius: '999px',
                            textTransform: 'uppercase',
                          }}>
                            {role}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* All Users Card */}
      <div style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }}>
        <h2 style={{ 
          fontSize: '20px', 
          fontWeight: 700, 
          color: '#111827', 
          margin: '0 0 24px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <FaUsers size={20} color="#4f46e5" />
          All Users
        </h2>
        {users.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}>
            <FaUsers size={48} style={{ marginBottom: '16px' }} />
            <p style={{ fontSize: '16px', margin: 0 }}>No users found.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                    Name
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                    Email
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                    Role
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const userId = user._id || user.id;
                  const role = getRoleText(user);

                  return (
                    <tr key={userId} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '16px 12px', fontSize: '14px', color: '#111827' }}>
                        {user.name}
                      </td>
                      <td style={{ padding: '16px 12px', fontSize: '14px', color: '#6b7280' }}>
                        {user.email}
                      </td>
                      <td style={{ padding: '16px 12px' }}>
                        <span style={{
                          background: role === 'ADMIN' ? '#fef3c7' : role === 'TECHNICIAN' ? '#dbeafe' : '#e0e7ff',
                          color: role === 'ADMIN' ? '#92400e' : role === 'TECHNICIAN' ? '#1e40af' : '#3730a3',
                          fontSize: '12px',
                          fontWeight: 700,
                          padding: '4px 12px',
                          borderRadius: '999px',
                          textTransform: 'uppercase',
                        }}>
                          {role}
                        </span>
                      </td>
                      <td style={{ padding: '16px 12px' }}>
                        {role === 'ADMIN' ? (
                          <span style={{
                            color: '#9ca3af',
                            fontSize: '12px',
                            fontWeight: 500,
                          }}>
                            Protected
                          </span>
                        ) : (
                          <button
                            onClick={() => handleDeleteUser(userId, role)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              background: '#fef2f2',
                              color: '#ef4444',
                              fontSize: '12px',
                              fontWeight: 600,
                              border: '1px solid #fee2e2',
                              cursor: 'pointer',
                              transition: 'background 0.15s',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = '#fee2e2'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = '#fef2f2'; }}
                          >
                            <FaTrash size={10} />
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}