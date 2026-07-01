import { useEffect, useState } from 'react';
import client from '../api/client';
import DataTable from '../components/DataTable';

interface StaffRow {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  designation: string;
  employmentStatus: string;
}

export default function Staff() {
  const [staff, setStaff] = useState<StaffRow[]>([]);
  const [form, setForm] = useState({
    employeeCode: '',
    firstName: '',
    lastName: '',
    staffType: 'TEACHING',
    designation: '',
    dateOfJoining: '',
  });
  const [payroll, setPayroll] = useState({ staffId: '', month: '1', year: '2026', basicSalary: '' });

  async function load() {
    const { data } = await client.get('/staff');
    setStaff(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function addStaff() {
    await client.post('/staff', form);
    setForm({ employeeCode: '', firstName: '', lastName: '', staffType: 'TEACHING', designation: '', dateOfJoining: '' });
    load();
  }

  async function runPayroll() {
    await client.post('/staff/payroll/run', {
      staffId: payroll.staffId,
      month: Number(payroll.month),
      year: Number(payroll.year),
      basicSalary: Number(payroll.basicSalary),
    });
    alert('Payroll run recorded.');
  }

  return (
    <div>
      <h2>Staff & payroll</h2>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        <input placeholder="Employee code" value={form.employeeCode} onChange={(e) => setForm({ ...form, employeeCode: e.target.value })} />
        <input placeholder="First name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
        <input placeholder="Last name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
        <select value={form.staffType} onChange={(e) => setForm({ ...form, staffType: e.target.value })}>
          <option value="TEACHING">Teaching</option>
          <option value="ADMIN">Admin</option>
          <option value="ACCOUNTANT">Accountant</option>
          <option value="LIBRARIAN">Librarian</option>
          <option value="DRIVER">Driver</option>
          <option value="SUPPORT">Support</option>
        </select>
        <input placeholder="Designation" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} />
        <input type="date" value={form.dateOfJoining} onChange={(e) => setForm({ ...form, dateOfJoining: e.target.value })} />
        <button onClick={addStaff}>Add staff</button>
      </div>
      <DataTable
        columns={[
          { header: 'Code', render: (s) => s.employeeCode },
          { header: 'Name', render: (s) => `${s.firstName} ${s.lastName}` },
          { header: 'Designation', render: (s) => s.designation },
          { header: 'Status', render: (s) => s.employmentStatus },
        ]}
        rows={staff}
      />

      <h3 style={{ marginTop: 24 }}>Run payroll</h3>
      <div style={{ display: 'flex', gap: 8 }}>
        <input placeholder="Staff ID" value={payroll.staffId} onChange={(e) => setPayroll({ ...payroll, staffId: e.target.value })} />
        <input placeholder="Month (1-12)" type="number" value={payroll.month} onChange={(e) => setPayroll({ ...payroll, month: e.target.value })} />
        <input placeholder="Year" type="number" value={payroll.year} onChange={(e) => setPayroll({ ...payroll, year: e.target.value })} />
        <input placeholder="Basic salary" type="number" value={payroll.basicSalary} onChange={(e) => setPayroll({ ...payroll, basicSalary: e.target.value })} />
        <button onClick={runPayroll}>Run payroll</button>
      </div>
    </div>
  );
}
