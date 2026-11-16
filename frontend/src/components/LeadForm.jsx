// مكوّن LeadForm: فورم تواصل بيتحقق من البيانات ويبعت العميل للـ API
import { useState } from 'react';
import { createLead } from '../services/api';
import { SERVICES, BUDGETS } from '../utils/constants';

const EMPTY = { name: '', email: '', phone: '', company: '', service: '', budget: '', message: '' };

function validate(d) {
  const e = {};
  if (d.name.trim().length < 2) e.name = 'Enter your full name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email.trim())) e.email = 'Enter a valid email address.';
  if (!/^\+?[0-9\s\-()]{7,18}$/.test(d.phone.trim())) e.phone = 'Enter a valid phone number (7-15 digits).';
  if (!d.service) e.service = 'Choose a service.';
  if (d.message.trim().length < 10) e.message = 'Tell us a bit more (at least 10 characters).';
  return e;
}

export default function LeadForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);
  const [sending, setSending] = useState(false);

  const change = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  async function submit(ev) {
    ev.preventDefault();
    setResult(null);
    const found = validate(values);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      document.getElementById(first).focus();
      return;
    }
    setSending(true);
    const r = await createLead(values);
    setSending(false);
    if (r.ok) {
      setResult({ type: 'ok', text: 'Thank you! Your request has been submitted successfully.' });
      setValues(EMPTY);
      setErrors({});
    } else if (r.status === 422 && r.fields) {
      setErrors(r.fields);
      setResult({ type: 'no', text: 'Please fix the highlighted fields.' });
    } else {
      setResult({ type: 'no', text: r.error || 'We could not send your request. Please try again.' });
    }
  }

  function field(name, label, required, control) {
    return (
      <div className="f">
        <label htmlFor={name}>{label} {required && <b>*</b>}</label>
        {control}
        <div className="err">{errors[name]}</div>
      </div>
    );
  }
  const cls = (name) => (errors[name] ? 'bad-in' : '');

  return (
    <form className="lead" onSubmit={submit} noValidate>
      {field('name', 'Full Name', true,
        <input id="name" name="name" className={cls('name')} value={values.name} onChange={change} autoComplete="name" />)}
      {field('email', 'Email', true,
        <input id="email" name="email" type="email" className={cls('email')} value={values.email} onChange={change} autoComplete="email" />)}
      {field('phone', 'Phone', true,
        <input id="phone" name="phone" type="tel" className={cls('phone')} value={values.phone} onChange={change} autoComplete="tel" placeholder="+20 100 123 4567" />)}
      {field('company', 'Company', false,
        <input id="company" name="company" value={values.company} onChange={change} autoComplete="organization" />)}
      {field('service', 'Service', true,
        <select id="service" name="service" className={cls('service')} value={values.service} onChange={change}>
          <option value="">Select a service</option>
          {SERVICES.map((s) => <option key={s}>{s}</option>)}
        </select>)}
      {field('budget', 'Budget', false,
        <select id="budget" name="budget" value={values.budget} onChange={change}>
          <option value="">Select a budget</option>
          {BUDGETS.map((b) => <option key={b}>{b}</option>)}
        </select>)}
      <div className="f full">
        <label htmlFor="message">Message <b>*</b></label>
        <textarea id="message" name="message" className={cls('message')} value={values.message} onChange={change} />
        <div className="err">{errors.message}</div>
      </div>
      <div className="f full">
        <button className="btn" type="submit" disabled={sending}>{sending ? 'Sending…' : 'Send request'}</button>
      </div>
      {result && <div className={'msg ' + result.type} role="status">{result.text}</div>}
    </form>
  );
}
