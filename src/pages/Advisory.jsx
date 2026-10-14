import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';

const TABS = [
  ['IRRIGATION', '💧 Irrigation'], ['FERTILIZER', '🧪 Fertilizer'],
  ['DISEASE', '🐛 Crop Diseases'], ['PRACTICE', '🌾 Best Practices'],
];

export default function Advisory() {
  const [type, setType] = useState('IRRIGATION');
  const [crop, setCrop] = useState('');
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const t = setTimeout(() => {
      api.get('/advisory', { params: { type, crop } }).then((r) => setRows(r.data)).catch((e) => setError(errMsg(e)));
    }, 250);
    return () => clearTimeout(t);
  }, [type, crop]);

  return (
    <div className="page">
      <h2>Farm Advisory</h2>
      <p className="muted">Irrigation schedules, fertilizer recommendations (crop &amp; soil), and disease symptoms &amp; treatment. Always confirm doses with a soil test / local agriculture officer.</p>
      {error && <div className="alert">{error}</div>}
      <div className="tabs">
        {TABS.map(([k, l]) => <button key={k} className={`tab ${type === k ? 'active' : ''}`} onClick={() => setType(k)}>{l}</button>)}
      </div>
      <input className="search" placeholder="Filter by crop (e.g. Rice, Tomato)…" value={crop} onChange={(e) => setCrop(e.target.value)} />
      <div className="cards">
        {rows.length === 0 && <p className="muted">No entries found.</p>}
        {rows.map((a) => (
          <div className="card" key={a.id}>
            <span className="badge">{a.crop}</span>
            <h3>{a.title}</h3>
            <p>{a.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
