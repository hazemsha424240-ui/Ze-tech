// مكوّن LeadModal: نافذة واحدة بثلاث حالات - عرض التفاصيل، تعديل العميل، تأكيد الحذف
import { useEffect, useState } from 'react';
import { updateLead, deleteLead } from '../services/api';
import { STATUSES, SERVICES, BUDGETS } from '../utils/constants';

function ViewLead({ lead, onClose }) {
  const digits = (lead.phone || '').replace(/\D/g, '');
  const rows = [
    ['Email', lead.email], ['Phone', lead.phone], ['Company', lead.company || '—'], ['Service', lead.service],
    ['Budget', lead.budget || '—'], ['Status', lead.status], ['Message', lead.message],
    ['created_at', new Date(lead.created_at).toLocaleString()], ['updated_at', new Date(lead.updated_at).toLocaleString()]
  ];
  return (
    <>
      <h3>{lead.name}</h3>
      <dl>{rows.map(([k, v]) => <div className="row" key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
      <div className="cts">
        <a className="btn sm" href={'tel:' + (lead.phone || '').replace(/[^\d+]/g, '')}>Call</a>
        <a className="btn sm" target="_blank" rel="noopener noreferrer" href={'https://wa.me/' + digits}>WhatsApp</a>
        <a className="btn sm" href={'mailto:' + lead.email}>Email</a>
        <button className="btn sm alt" type="button" onClick={onClose}>Close</button>
      </div>
    </>
  );
}

function EditLead({ lead, onClose, onChanged }) {
  const [v, setV] = useState({
    name: lead.name, email: lead.email, phone: lead.phone, company: lead.company || '',
    service: lead.service, budget: lead.budget || '', status: lead.status, message: lead.message
  });
  const [error, setError] = useState('');
  const change = (e) => setV((x) => ({ ...x, [e.target.name]: e.target.value }));

  async function save() {
    const r = await updateLead(lead.id, v);
    if (r.ok) onChanged();
    else setError(r.fields ? Object.values(r.fields).join(' ') : r.error);
  }
  const input = (name, label) => (
    <div className="f"><label htmlFor={'e-' + name}>{label}</label>
      <input id={'e-' + name} name={name} value={v[name]} onChange={change} /></div>
  );
  const select = (name, label, list, blank) => (
    <div className="f"><label htmlFor={'e-' + name}>{label}</label>
      <select id={'e-' + name} name={name} value={v[name]} onChange={change}>
        {blank && <option value="">{blank}</option>}
        {list.map((x) => <option key={x}>{x}</option>)}
      </select></div>
  );
  return (
    <>
      <h3>Edit lead</h3>
      <div className="grid two">
        {input('name', 'Full Name')}{input('email', 'Email')}{input('phone', 'Phone')}{input('company', 'Company')}
        {select('service', 'Service', SERVICES)}{select('budget', 'Budget', BUDGETS, 'None')}{select('status', 'Status', STATUSES)}
      </div>
      <div className="f gap">
        <label htmlFor="e-message">Message</label>
        <textarea id="e-message" name="message" value={v.message} onChange={change} />
      </div>
      <div className="err" role="alert">{error}</div>
      <div className="cts">
        <button className="btn sm" type="button" onClick={save}>Save changes</button>
        <button className="btn sm alt" type="button" onClick={onClose}>Cancel</button>
      </div>
    </>
  );
}

function DeleteLead({ lead, onClose, onChanged }) {
  const [error, setError] = useState('');
  async function confirm() {
    const r = await deleteLead(lead.id);
    if (r.ok) onChanged();
    else setError(r.error);
  }
  return (
    <>
      <h3>Delete lead</h3>
      <p>Are you sure you want to delete this lead?<br /><b>{lead.name}</b> · {lead.email}</p>
      <div className="err" role="alert">{error}</div>
      <div className="cts">
        <button className="btn sm bad" type="button" onClick={confirm}>Delete</button>
        <button className="btn sm alt" type="button" onClick={onClose}>Cancel</button>
      </div>
    </>
  );
}

export default function LeadModal({ mode, lead, onClose, onChanged }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="modal" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="box" role="dialog" aria-modal="true">
        {mode === 'view' && <ViewLead lead={lead} onClose={onClose} />}
        {mode === 'edit' && <EditLead lead={lead} onClose={onClose} onChanged={onChanged} />}
        {mode === 'delete' && <DeleteLead lead={lead} onClose={onClose} onChanged={onChanged} />}
      </div>
    </div>
  );
}
