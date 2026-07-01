import { useEffect, useState, FormEvent } from 'react';
import client from '../api/client';
import DataTable from '../components/DataTable';

interface StudentRow {
  id: string;
  admissionNo: string;
  firstName: string;
  lastName: string;
  status: string;
  section?: { name: string; class: { name: string } } | null;
}

export default function Students() {
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [form, setForm] = useState({ admissionNo: '', firstName: '', lastName: '', dob: '', gender: 'MALE' });
  const [error, setError] = useState('');

  async function load() {
    const { data } = await client.get('/students');
    setStudents(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await client.post('/students', form);
      setForm({ admissionNo: '', firstName: '', lastName: '', dob: '', gender: 'MALE' });
      load();
    } catch {
      setError('Could not create student. Check the fields and try again.');
    }
  }

  return (
    <div>
      <h2>Students</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        <input placeholder="Admission no" value={form.admissionNo} onChange={(e) => setForm({ ...form, admissionNo: e.target.value })} required />
        <input placeholder="First name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
        <input placeholder="Last name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
        <input type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} required />
        <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>
        <button type="submit">Add student</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <DataTable
        columns={[
          { header: 'Admission no', render: (s) => s.admissionNo },
          { header: 'Name', render: (s) => `${s.firstName} ${s.lastName}` },
          { header: 'Class / section', render: (s) => (s.section ? `${s.section.class.name} - ${s.section.name}` : '-') },
          { header: 'Status', render: (s) => s.status },
        ]}
        rows={students}
      />
    </div>
  );
}
