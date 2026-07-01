import { useState } from 'react';
import client from '../api/client';

export default function Exams() {
  const [result, setResult] = useState({ examSubjectId: '', studentId: '', marksObtained: '' });
  const [reportLookup, setReportLookup] = useState({ studentId: '', examTermId: '' });
  const [reportCard, setReportCard] = useState<any>(null);

  async function submitResult() {
    await client.post('/exams/results', {
      examSubjectId: result.examSubjectId,
      studentId: result.studentId,
      marksObtained: Number(result.marksObtained),
    });
    setResult({ examSubjectId: '', studentId: '', marksObtained: '' });
  }

  async function loadReportCard() {
    const { data } = await client.get(`/exams/report-card/${reportLookup.studentId}/${reportLookup.examTermId}`);
    setReportCard(data);
  }

  return (
    <div>
      <h2>Exams</h2>
      <h3>Record a result</h3>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <input placeholder="Exam subject ID" value={result.examSubjectId} onChange={(e) => setResult({ ...result, examSubjectId: e.target.value })} />
        <input placeholder="Student ID" value={result.studentId} onChange={(e) => setResult({ ...result, studentId: e.target.value })} />
        <input placeholder="Marks obtained" type="number" value={result.marksObtained} onChange={(e) => setResult({ ...result, marksObtained: e.target.value })} />
        <button onClick={submitResult}>Save result</button>
      </div>

      <h3>Report card</h3>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input placeholder="Student ID" value={reportLookup.studentId} onChange={(e) => setReportLookup({ ...reportLookup, studentId: e.target.value })} />
        <input placeholder="Exam term ID" value={reportLookup.examTermId} onChange={(e) => setReportLookup({ ...reportLookup, examTermId: e.target.value })} />
        <button onClick={loadReportCard}>Load report card</button>
      </div>
      {reportCard && (
        <div>
          <p>
            Overall: {reportCard.totalObtained}/{reportCard.totalMax} ({reportCard.overallPercentage}%) — grade{' '}
            {reportCard.overallGrade}
          </p>
          <ul>
            {reportCard.subjects.map((s: any, idx: number) => (
              <li key={idx}>
                {s.subject}: {s.marksObtained}/{s.maxMarks} ({s.grade})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
