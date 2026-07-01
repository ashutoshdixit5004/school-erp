import { useEffect, useState } from 'react';
import client from '../api/client';
import DataTable from '../components/DataTable';

interface ApplicationRow {
  id: string;
  applicantName: string;
  status: string;
  applicationDate: string;
  applyingClass?: { name: string };
}

export default function Admissions() {
  const [applications, setApplications] = useState<ApplicationRow[]>([]);

  async function load() {
    const { data } = await client.get('/admissions');
    setApplications(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function decide(id: string, status: 'APPROVED' | 'REJECTED' | 'WAITLISTED') {
    if (status === 'APPROVED') {
      const sectionId = prompt('Enter section ID to assign this student to:');
      if (!sectionId) return;
      await client.patch(`/admissions/${id}/decide`, { status, sectionId });
    } else {
      await client.patch(`/admissions/${id}/decide`, { status });
    }
    load();
  }

  return (
    <div>
      <h2>Admission applications</h2>
      <p style={{ color: '#666' }}>
        Approving an application automatically creates the Student record and links the guardian.
      </p>
      <DataTable
        columns={[
          { header: 'Applicant', render: (a) => a.applicantName },
          { header: 'Applying for', render: (a) => a.applyingClass?.name ?? '-' },
          { header: 'Status', render: (a) => a.status },
          {
            header: 'Actions',
            render: (a) =>
              a.status === 'PENDING' ? (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => decide(a.id, 'APPROVED')}>Approve</button>
                  <button onClick={() => decide(a.id, 'WAITLISTED')}>Waitlist</button>
                  <button onClick={() => decide(a.id, 'REJECTED')}>Reject</button>
                </div>
              ) : (
                '-'
              ),
          },
        ]}
        rows={applications}
      />
    </div>
  );
}
