// صفحة الدخول: فورم تسجيل دخول الأدمن، بيحفظ التوكن ويفتح الداشبورد
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import { hasToken, login, setToken } from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (hasToken()) return <Navigate to="/dashboard" replace />;

  async function submit(ev) {
    ev.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Enter your email and password.');
      return;
    }
    setBusy(true);
    const r = await login(email.trim(), password);
    setBusy(false);
    if (r.ok && r.data && r.data.token) {
      setToken(r.data.token);
      navigate('/dashboard', { replace: true });
    } else {
      setError(r.error || 'Could not sign in. Please try again.');
    }
  }

  return (
    <>
      <Header variant="public-min" />
      <main className="wrap">
        <form className="login" onSubmit={submit} noValidate>
          <h2>Admin sign in</h2>
          <div className="f">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
          </div>
          <div className="f">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </div>
          <div className="err" role="alert">{error}</div>
          <button className="btn" type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
          <Link className="back" to="/">Back to website</Link>
        </form>
      </main>
    </>
  );
}
