// مكوّن LeadsTable: جدول العملاء بأزرار View/Edit/Delete وأزرار التنقل بين الصفحات
const fmtDate = (d) => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

export default function LeadsTable({ leads, meta, error, onAction, onPage }) {
  return (
    <>
      <div className="tw">
        <table>
          <thead>
            <tr><th>Name</th><th>Company</th><th>Service</th><th>Phone</th><th>Status</th><th>Created</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {leads.length === 0 && (
              <tr><td colSpan="7" className="empty">
                {error || 'No leads match. Clear the search or filters to see all leads.'}
              </td></tr>
            )}
            {leads.map((l) => (
              <tr key={l.id}>
                <td>{l.name}</td>
                <td>{l.company || '—'}</td>
                <td>{l.service}</td>
                <td>{l.phone}</td>
                <td><span className={'pill s-' + l.status.replace(/\s/g, '')}>{l.status}</span></td>
                <td>{fmtDate(l.created_at)}</td>
                <td>
                  <div className="acts">
                    <button className="btn sm ghost" type="button" onClick={() => onAction('view', l)}>View</button>
                    <button className="btn sm ghost" type="button" onClick={() => onAction('edit', l)}>Edit</button>
                    <button className="btn sm bad" type="button" onClick={() => onAction('delete', l)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pg">
        <span>{meta.total} lead{meta.total === 1 ? '' : 's'} · page {meta.page} of {meta.pages}</span>
        <button className="btn sm ghost" type="button" disabled={meta.page <= 1} onClick={() => onPage(-1)}>Previous</button>
        <button className="btn sm ghost" type="button" disabled={meta.page >= meta.pages} onClick={() => onPage(1)}>Next</button>
      </div>
    </>
  );
}
