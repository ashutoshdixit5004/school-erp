import { useEffect, useState } from 'react';
import client from '../api/client';
import DataTable from '../components/DataTable';

interface VehicleRow {
  id: string;
  registrationNo: string;
  capacity: number;
  routeName?: string;
}

export default function Transport() {
  const [vehicles, setVehicles] = useState<VehicleRow[]>([]);
  const [form, setForm] = useState({ registrationNo: '', capacity: '30', routeName: '' });
  const [allocation, setAllocation] = useState({ studentId: '', vehicleId: '', pickupPoint: '' });

  async function load() {
    const { data } = await client.get('/transport/vehicles');
    setVehicles(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function addVehicle() {
    await client.post('/transport/vehicles', { ...form, capacity: Number(form.capacity) });
    setForm({ registrationNo: '', capacity: '30', routeName: '' });
    load();
  }

  async function allocate() {
    await client.post('/transport/allocations', allocation);
    setAllocation({ studentId: '', vehicleId: '', pickupPoint: '' });
  }

  return (
    <div>
      <h2>Transport</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input placeholder="Registration no" value={form.registrationNo} onChange={(e) => setForm({ ...form, registrationNo: e.target.value })} />
        <input placeholder="Capacity" type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
        <input placeholder="Route name" value={form.routeName} onChange={(e) => setForm({ ...form, routeName: e.target.value })} />
        <button onClick={addVehicle}>Add vehicle</button>
      </div>
      <DataTable
        columns={[
          { header: 'Registration', render: (v) => v.registrationNo },
          { header: 'Capacity', render: (v) => v.capacity },
          { header: 'Route', render: (v) => v.routeName ?? '-' },
        ]}
        rows={vehicles}
      />

      <h3 style={{ marginTop: 24 }}>Allocate a student</h3>
      <div style={{ display: 'flex', gap: 8 }}>
        <input placeholder="Student ID" value={allocation.studentId} onChange={(e) => setAllocation({ ...allocation, studentId: e.target.value })} />
        <input placeholder="Vehicle ID" value={allocation.vehicleId} onChange={(e) => setAllocation({ ...allocation, vehicleId: e.target.value })} />
        <input placeholder="Pickup point" value={allocation.pickupPoint} onChange={(e) => setAllocation({ ...allocation, pickupPoint: e.target.value })} />
        <button onClick={allocate}>Allocate</button>
      </div>
    </div>
  );
}
