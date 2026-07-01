import { useState } from 'react';
import client from '../api/client';
import DataTable from '../components/DataTable';

interface InvoiceRow {
  id: string;
  totalAmount: string;
  status: string;
  dueDate: string;
}

export default function Fees() {
  const [studentId, setStudentId] = useState('');
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [payment, setPayment] = useState({ invoiceId: '', amount: '', method: 'CASH' });

  async function loadInvoices() {
    if (!studentId) return;
    const { data } = await client.get(`/fees/invoices/student/${studentId}`);
    setInvoices(data);
  }

  async function recordPayment() {
    await client.post('/fees/payments', {
      invoiceId: payment.invoiceId,
      amount: Number(payment.amount),
      method: payment.method,
    });
    loadInvoices();
  }

  return (
    <div>
      <h2>Fees</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input placeholder="Student ID" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
        <button onClick={loadInvoices}>Load invoices</button>
      </div>
      <DataTable
        columns={[
          { header: 'Invoice ID', render: (i) => i.id },
          { header: 'Total', render: (i) => i.totalAmount },
          { header: 'Status', render: (i) => i.status },
          { header: 'Due date', render: (i) => new Date(i.dueDate).toLocaleDateString() },
        ]}
        rows={invoices}
      />
      <h3 style={{ marginTop: 24 }}>Record a payment</h3>
      <div style={{ display: 'flex', gap: 8 }}>
        <input placeholder="Invoice ID" value={payment.invoiceId} onChange={(e) => setPayment({ ...payment, invoiceId: e.target.value })} />
        <input placeholder="Amount" type="number" value={payment.amount} onChange={(e) => setPayment({ ...payment, amount: e.target.value })} />
        <select value={payment.method} onChange={(e) => setPayment({ ...payment, method: e.target.value })}>
          <option value="CASH">Cash</option>
          <option value="CARD">Card</option>
          <option value="BANK_TRANSFER">Bank transfer</option>
          <option value="UPI">UPI</option>
          <option value="ONLINE_GATEWAY">Online gateway</option>
        </select>
        <button onClick={recordPayment}>Record payment</button>
      </div>
    </div>
  );
}
