import { useEffect, useState } from 'react';
import client from '../api/client';

interface RoomRow {
  id: string;
  roomNo: string;
  capacity: number;
  allocations: { id: string }[];
}

interface HostelRow {
  id: string;
  name: string;
  type: string;
  rooms: RoomRow[];
}

export default function Hostel() {
  const [hostels, setHostels] = useState<HostelRow[]>([]);
  const [form, setForm] = useState({ name: '', type: 'BOYS' });
  const [allocation, setAllocation] = useState({ studentId: '', roomId: '' });

  async function load() {
    const { data } = await client.get('/hostel/hostels');
    setHostels(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function addHostel() {
    await client.post('/hostel/hostels', form);
    setForm({ name: '', type: 'BOYS' });
    load();
  }

  async function allocate() {
    await client.post('/hostel/allocations', allocation);
    setAllocation({ studentId: '', roomId: '' });
    load();
  }

  return (
    <div>
      <h2>Hostel</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input placeholder="Hostel name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
          <option value="BOYS">Boys</option>
          <option value="GIRLS">Girls</option>
        </select>
        <button onClick={addHostel}>Add hostel</button>
      </div>

      {hostels.map((h) => (
        <div key={h.id} style={{ marginBottom: 16 }}>
          <strong>
            {h.name} ({h.type})
          </strong>
          <ul>
            {h.rooms.map((r) => (
              <li key={r.id}>
                Room {r.roomNo} — {r.allocations.length}/{r.capacity} occupied
              </li>
            ))}
          </ul>
        </div>
      ))}

      <h3 style={{ marginTop: 24 }}>Allocate a student to a room</h3>
      <div style={{ display: 'flex', gap: 8 }}>
        <input placeholder="Student ID" value={allocation.studentId} onChange={(e) => setAllocation({ ...allocation, studentId: e.target.value })} />
        <input placeholder="Room ID" value={allocation.roomId} onChange={(e) => setAllocation({ ...allocation, roomId: e.target.value })} />
        <button onClick={allocate}>Allocate</button>
      </div>
    </div>
  );
}
