// خدمة الـ API: كل النداءات لسيرفر الـ REST API + تخزين توكن تسجيل الدخول
const BASE = '/api';
const KEY = 'zt_token';

export function getToken() {
  try { return sessionStorage.getItem(KEY); } catch (e) { return null; }
}
export function setToken(token) {
  try { sessionStorage.setItem(KEY, token); } catch (e) { /* التخزين ممنوع في المتصفح */ }
}
export function clearToken() {
  try { sessionStorage.removeItem(KEY); } catch (e) { /* التخزين ممنوع في المتصفح */ }
}
export const hasToken = () => !!getToken();

async function request(method, path, body) {
  const headers = {};
  const token = getToken();
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = 'Bearer ' + token;

  let res;
  try {
    res = await fetch(BASE + path, { method, headers, body: body !== undefined ? JSON.stringify(body) : undefined });
  } catch (e) {
    return { ok: false, status: 0, error: 'Cannot reach the server. Make sure the backend is running.' };
  }
  let data = null;
  try { data = await res.json(); } catch (e) { /* الرد فاضي */ }

  if (res.status === 401 && token && path !== '/login') {
    clearToken();
    window.location.replace('/login');
  }
  return { ok: res.ok, status: res.status, data, error: data && data.error, fields: data && data.fields };
}

export const createLead = (body) => request('POST', '/leads', body);
export const listLeads = (query) => request('GET', '/leads?' + new URLSearchParams(query));
export const updateLead = (id, body) => request('PUT', '/leads/' + id, body);
export const deleteLead = (id) => request('DELETE', '/leads/' + id);
export const getStats = () => request('GET', '/dashboard/stats');
export const login = (email, password) => request('POST', '/login', { email, password });
export const logout = () => request('POST', '/logout');
