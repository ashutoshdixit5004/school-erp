import { useEffect, useState } from 'react';
import client from '../api/client';
import DataTable from '../components/DataTable';

interface BookRow {
  id: string;
  title: string;
  author?: string;
  totalCopies: number;
  availableCopies: number;
}

export default function Library() {
  const [books, setBooks] = useState<BookRow[]>([]);
  const [form, setForm] = useState({ title: '', author: '', totalCopies: '1' });
  const [loan, setLoan] = useState({ bookId: '', studentId: '', dueDate: '' });

  async function load() {
    const { data } = await client.get('/library/books');
    setBooks(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function addBook() {
    await client.post('/library/books', { ...form, totalCopies: Number(form.totalCopies) });
    setForm({ title: '', author: '', totalCopies: '1' });
    load();
  }

  async function issueBook() {
    await client.post('/library/loans', loan);
    setLoan({ bookId: '', studentId: '', dueDate: '' });
    load();
  }

  return (
    <div>
      <h2>Library</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input placeholder="Author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
        <input placeholder="Copies" type="number" value={form.totalCopies} onChange={(e) => setForm({ ...form, totalCopies: e.target.value })} />
        <button onClick={addBook}>Add book</button>
      </div>
      <DataTable
        columns={[
          { header: 'Title', render: (b) => b.title },
          { header: 'Author', render: (b) => b.author ?? '-' },
          { header: 'Available', render: (b) => `${b.availableCopies}/${b.totalCopies}` },
        ]}
        rows={books}
      />

      <h3 style={{ marginTop: 24 }}>Issue a book</h3>
      <div style={{ display: 'flex', gap: 8 }}>
        <input placeholder="Book ID" value={loan.bookId} onChange={(e) => setLoan({ ...loan, bookId: e.target.value })} />
        <input placeholder="Student ID" value={loan.studentId} onChange={(e) => setLoan({ ...loan, studentId: e.target.value })} />
        <input type="date" value={loan.dueDate} onChange={(e) => setLoan({ ...loan, dueDate: e.target.value })} />
        <button onClick={issueBook}>Issue</button>
      </div>
    </div>
  );
}
