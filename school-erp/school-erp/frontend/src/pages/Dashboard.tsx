import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <div>
      <h2>Welcome, {user?.email}</h2>
      <p>Role: {user?.role}</p>
      <p style={{ color: '#666' }}>
        Use the sidebar to manage students, admissions, attendance, fees, exams, staff, library, transport,
        and hostel records.
      </p>
    </div>
  );
}
