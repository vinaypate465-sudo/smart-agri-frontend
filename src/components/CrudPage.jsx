import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';

/**
 * Generic list + add/edit/delete page.
 * fields: [{ key, label, type: text|number|date|select|textarea, options?, source?, optLabel?, required? }]
 * columns: [{ key, label, render?(row) }]
 */
export default function CrudPage({
  title, endpoint, listEndpoint, fields, columns,
  toPayload = (f) => f, toForm = (r) => r, hint,
}) {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({});
  const [editId, setEditId] = useState(null);
  const [sources, setSources] = useState({});
  const [error, setError] = useState('');

  const load = () =>
    api.get(listEndpoint || endpoint).then((r) => setRows(r.data)).catch((e) => setError(errMsg(e)));

  useEffect(() => {
    load();
    const srcs = [...new Set(fields.filter((f) => f.source).map((f) => f.source))];
    srcs.forEach((s) => api.get(s).then((r) => setSources((p) => ({ ...p, [s]: r.data }))));
    // eslint-disable-next-line
  }, []);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const reset = () => { setForm({}); setEditId(null); };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    const clean = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v === '' ? null : v]));
    try {
      if (editId) await api.put(`${endpoint}/${editId}`, toPayload(clean));
      else await api.post(endpoint, toPayload(clean));
      reset();
      load();
    } catch (err) { setError(errMsg(err)); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try { await api.delete(`${endpoint}/${id}`); load(); } catch (err) { setError(errMsg(err)); }
  };

  const edit = (row) => { setEditId(row.id); setForm(toForm(row)); window.scrollTo(0, 0); };

  return (
    <div className="page">
      <h2>{title}</h2>
      {hint && <p className="muted">{hint}</p>}
      {error && <div className="alert">{error}</div>}

      <form className="card form-grid" onSubmit={submit}>
        {fields.map((f) => (
          <label key={f.key} className={f.type === 'textarea' ? 'wide' : ''}>
            {f.label}
            {f.type === 'select' ? (
              <select required={f.required} value={form[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)}>
                <option value="">-- select --</option>
                {(f.source ? (sources[f.source] || []).map((o) => [o.id, o[f.optLabel || 'name']]) : f.options.map((o) => [o, o]))
                  .map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            ) : f.type === 'textarea' ? (
              <textarea rows={3} required={f.required} value={form[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} />
            ) : (
              <input type={f.type || 'text'} step="any" min={f.type === 'number' ? 0 : undefined} required={f.required}
                value={form[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} />
            )}
          </label>
        ))}
        <div className="wide actions">
          <button className="btn" type="submit">{editId ? 'Update' : 'Add'}</button>
          {editId && <button type="button" className="btn ghost" onClick={reset}>Cancel</button>}
        </div>
      </form>

      <div className="card table-wrap">
        <table>
          <thead>
            <tr>{columns.map((c) => <th key={c.key}>{c.label}</th>)}<th></th></tr>
          </thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={columns.length + 1} className="muted">No records yet.</td></tr>}
            {rows.map((r) => (
              <tr key={r.id}>
                {columns.map((c) => <td key={c.key}>{c.render ? c.render(r) : r[c.key] ?? '—'}</td>)}
                <td className="row-actions">
                  <button className="btn small ghost" onClick={() => edit(r)}>Edit</button>
                  <button className="btn small danger" onClick={() => remove(r.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
