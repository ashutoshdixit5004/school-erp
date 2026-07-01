interface Column<T> {
  header: string;
  render: (row: T) => React.ReactNode;
}

export default function DataTable<T extends { id: string }>({
  columns,
  rows,
  emptyLabel = 'No records yet',
}: {
  columns: Column<T>[];
  rows: T[];
  emptyLabel?: string;
}) {
  if (rows.length === 0) {
    return <p style={{ color: '#888' }}>{emptyLabel}</p>;
  }
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c.header} style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>
              {c.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            {columns.map((c) => (
              <td key={c.header} style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>
                {c.render(row)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
