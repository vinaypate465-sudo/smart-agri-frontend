import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import api, { errMsg, money } from '../api';

const COLORS = ['#2e7d32', '#f9a825', '#0277bd', '#c62828', '#6a1b9a', '#00838f', '#6d4c41'];

function Stat({ label, value, tone }) {
  return <div className={`stat ${tone || ''}`}><span>{label}</span><strong>{value}</strong></div>;
}

export default function Dashboard() {
  const [r, setR] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => { api.get('/reports/farmer').then((x) => setR(x.data)).catch((e) => setError(errMsg(e))); }, []);

  if (error) return <div className="page"><div className="alert">{error}</div></div>;
  if (!r) return <div className="page">Loading…</div>;

  return (
    <div className="page">
      <h2>Farmer Dashboard &amp; Reports</h2>
      <div className="stats">
        <Stat label="Farms" value={r.farms} />
        <Stat label="Crops" value={r.crops} />
        <Stat label="Products listed" value={r.products} />
        <Stat label="Total yield (kg)" value={r.totalYieldKg} />
      </div>
      <div className="stats">
        <Stat label="Total expenses" value={money(r.totalExpenses)} tone="bad" />
        <Stat label="Crop revenue" value={money(r.cropRevenue)} />
        <Stat label="Marketplace sales" value={money(r.marketplaceSales)} />
        <Stat label={r.profit >= 0 ? 'Net profit' : 'Net loss'} value={money(Math.abs(r.profit))} tone={r.profit >= 0 ? 'good' : 'bad'} />
      </div>

      <div className="grid-2">
        <div className="card">
          <h3>Expenses by category</h3>
          {r.expenseByCategory.length === 0 ? <p className="muted">No expenses recorded.</p> : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={r.expenseByCategory} dataKey="value" nameKey="name" outerRadius={95} label>
                  {r.expenseByCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => money(v)} /><Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="card">
          <h3>Profit / loss by crop</h3>
          {r.cropSummary.length === 0 ? <p className="muted">No crops added.</p> : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={r.cropSummary}>
                <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="crop" /><YAxis />
                <Tooltip formatter={(v) => money(v)} /><Legend />
                <Bar dataKey="revenue" fill="#2e7d32" name="Revenue" />
                <Bar dataKey="expenses" fill="#c62828" name="Expenses" />
                <Bar dataKey="profit" fill="#0277bd" name="Profit" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
      <p className="muted">Net profit = crop revenue + marketplace sales − expenses.</p>
    </div>
  );
}
