import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/students', label: 'Students' },
  { to: '/admissions', label: 'Admissions' },
  { to: '/attendance', label: 'Attendance' },
  { to: '/fees', label: 'Fees' },
  { to: '/exams', label: 'Exams' },
  { to: '/staff', label: 'Staff & payroll' },
  { to: '/library', label: 'Library' },
  { to: '/transport', label: 'Transport' },
  { to: '/hostel', label: 'Hostel' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <nav style={{ width: 220, borderRight: '1px solid #ddd', padding: 16 }}>
        <h3>School ERP</h3>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            style={({ isActive }) => ({
              display: 'block',
              padding: '8px 0',
              textDecoration: 'none',
              color: isActive ? '#0c447c' : '#333',
              fontWeight: isActive ? 600 : 400,
            })}
          >
            {link.label}
          </NavLink>
        ))}
        <div style={{ marginTop: 24, fontSize: 13, color: '#666' }}>
          <div>{user?.email}</div>
          <div>{user?.role}</div>
          <button onClick={handleLogout} style={{ marginTop: 8 }}>
            Log out
          </button>
        </div>
      </nav>
      <main style={{ flex: 1, padding: 24 }}>
        <Outlet />
      </main>
    </div>
  );
}
