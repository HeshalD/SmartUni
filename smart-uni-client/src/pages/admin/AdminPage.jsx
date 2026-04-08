import { useEffect, useState } from 'react';
import { adminApi } from '../../api/adminApi';
import './AdminPage.css';

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
    return <div className="admin-page"><p>Loading admin panel...</p></div>;
  }

  return (
    <div className="admin-page">
    <div className="admin-header">
    <div>
        <p className="dashboard-hero__eyebrow">Administration</p>
        <h1>Admin Panel</h1>
        <p>Manage users, technician accounts, and access from one place.</p>
    </div>
    </div>

      {pageError && <div className="alert alert-error">{pageError}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{users.length}</p>
        </div>
        <div className="stat-card">
          <h3>Technicians</h3>
          <p>{technicians.length}</p>
        </div>
        <div className="stat-card">
          <h3>Admins</h3>
          <p>{totalAdmins}</p>
        </div>
      </div>

      <div className="admin-grid">
        <div className="card">
          <h2>Create Technician</h2>
          <form onSubmit={handleCreateTechnician} className="tech-form">
            <input
              type="text"
              name="name"
              placeholder="Full name"
              value={techForm.name}
              onChange={handleTechInputChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={techForm.email}
              onChange={handleTechInputChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={techForm.password}
              onChange={handleTechInputChange}
              required
            />
            <button type="submit" className="primary-btn">
              Create Technician
            </button>
          </form>
        </div>

        <div className="card">
          <h2>Technicians</h2>
          {technicians.length === 0 ? (
            <p className="empty-text">No technicians found.</p>
          ) : (
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {technicians.map((tech) => {
                    const techId = tech._id || tech.id;
                    const role = getRoleText(tech);

                    return (
                      <tr key={techId}>
                        <td>{tech.name}</td>
                        <td>{tech.email}</td>
                        <td>
                          <span className={`role-badge ${role.toLowerCase()}`}>
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

      <div className="card full-width-card">
        <h2>All Users</h2>
        {users.length === 0 ? (
          <p className="empty-text">No users found.</p>
        ) : (
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const userId = user._id || user.id;
                  const role = getRoleText(user);

                  return (
                    <tr key={userId}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge ${role.toLowerCase()}`}>
                          {role}
                        </span>
                      </td>
                      <td>
                        {role === 'ADMIN' ? (
                          <span className="protected-text">Protected</span>
                        ) : (
                          <button
                            className="danger-btn"
                            onClick={() => handleDeleteUser(userId, role)}
                          >
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