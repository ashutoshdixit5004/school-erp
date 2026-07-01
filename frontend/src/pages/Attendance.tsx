import { useState } from 'react';
import client from '../api/client';

export default function Attendance() {
  const [sectionId, setSectionId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [studentIds, setStudentIds] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit() {
    const entries = studentIds
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((studentId) => ({ studentId, status: 'PRESENT' as const }));

    await client.post('/attendance', { sectionId, date, entries });
    setMessage('Attendance saved.');
  }

  return (
    <div>
      <h2>Attendance</h2>
      <p style={{ color: '#666' }}>
        Marks every listed student ID as present for the given section and date. Extend this form to
        toggle per-student status once you wire it to the section roster endpoint.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 480 }}>
        <input placeholder="Section ID" value={sectionId} onChange={(e) => setSectionId(e.target.value)} />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <textarea
          placeholder="Comma-separated student IDs present today"
          value={studentIds}
          onChange={(e) => setStudentIds(e.target.value)}
          rows={4}
        />
        <button onClick={handleSubmit}>Save attendance</button>
        {message && <p style={{ color: 'green' }}>{message}</p>}
      </div>
    </div>
  );
}
