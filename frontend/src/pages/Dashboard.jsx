// صفحة الداشبورد: الإحصائيات، البحث والفلاتر، جدول العملاء مع الصفحات، النوافذ المنبثقة وتصدير CSV
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import StatsCards from '../components/StatsCards.jsx';
import LeadsTable from '../components/LeadsTable.jsx';
import LeadModal from '../components/LeadModal.jsx';
import { listLeads, getStats, logout, clearToken } from '../services/api';
import { downloadLeadsCsv } from '../utils/csv';
import { STATUSES, SERVICES } from '../utils/constants';

const LIMIT = 8;

export default function Dashboard() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, pages: 1 });
  const [stats, setStats] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [status, setStatus] = useState('');
  const [service, setService] = useState('');
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null);
  const [version, setVersion] = useState(0);

  // استنى 250ms بعد الكتابة قبل ما تبحث
  useEffect(() => {
    const t = setTimeout(() => { setDebounced(search.trim()); setPage(1); }, 250);
    return () => clearTimeout(t);
  }, [search]);

  const filters = useCallback(() => {
    const f = {};
    if (debounced) f.search = debounced;
    if (status) f.status = status;
    if (service) f.service = service;
    return f;
  }, [debounced, status, service]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [list, st] = await Promise.all([listLeads({ page, limit: LIMIT, ...filters() }), getStats()]);
      if (cancelled) return;
      if (!list.ok) { setError(list.error || 'Could not load leads.'); return; }
      if (list.data.meta.pages < page) { setPage(list.data.meta.pages); return; }
      setError('');
      setLeads(list.data.data);
      setMeta(list.data.meta);
      if (st.ok) setStats(st.data.data);
    })();
    return () => { cancelled = true; };
  }, [page, filters, version]);

  async function exportCsv() {
    const r = await listLeads({ page: 1, limit: 1000, ...filters() });
    if (r.ok) downloadLeadsCsv(r.data.data);
  }

  async function signOut() {
    await logout();
    clearToken();
    navigate('/login', { replace: true });
  }

  const closeModal = useCallback(() => setModal(null), []);
  const changed = () => { setModal(null); setVersion((v) => v + 1); };

  return (
    <>
      <Header variant="admin" />
      <main className="wrap">
        <div className="bar">
          <h2>Leads dashboard</h2>
          <button className="btn ghost sm" type="button" onClick={exportCsv}>Export CSV</button>
          <button className="btn alt sm" type="button" onClick={signOut}>Log out</button>
        </div>

        <StatsCards stats={stats} />

        <div className="tools">
          <input type="search" placeholder="Search name, email, phone or company" aria-label="Search leads"
            value={search} onChange={(e) => setSearch(e.target.value)} />
          <select aria-label="Filter by status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
            <option value="">All statuses</option>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
          <select aria-label="Filter by service" value={service} onChange={(e) => { setService(e.target.value); setPage(1); }}>
            <option value="">All services</option>
            {SERVICES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        <LeadsTable leads={leads} meta={meta} error={error}
          onAction={(mode, lead) => setModal({ mode, lead })}
          onPage={(d) => setPage((p) => p + d)} />
      </main>

      {modal && <LeadModal mode={modal.mode} lead={modal.lead} onClose={closeModal} onChanged={changed} />}
    </>
  );
}
