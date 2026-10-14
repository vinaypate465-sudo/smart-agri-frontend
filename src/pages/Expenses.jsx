import CrudPage from '../components/CrudPage.jsx';
import { money } from '../api';

export default function Expenses() {
  return (
    <CrudPage
      title="Expense Tracker" endpoint="/expenses"
      hint="Track seeds, fertilizer, labour and other costs per crop. They feed the profit/loss report."
      toPayload={({ cropId, ...rest }) => ({ ...rest, crop: { id: Number(cropId) } })}
      toForm={(r) => ({ ...r, cropId: r.crop?.id })}
      fields={[
        { key: 'cropId', label: 'Crop', type: 'select', source: '/crops', required: true },
        { key: 'category', label: 'Category', type: 'select', required: true,
          options: ['SEEDS', 'FERTILIZER', 'LABOUR', 'IRRIGATION', 'PESTICIDE', 'EQUIPMENT', 'OTHER'] },
        { key: 'amount', label: 'Amount (₹)', type: 'number', required: true },
        { key: 'date', label: 'Date', type: 'date' },
        { key: 'note', label: 'Note' },
      ]}
      columns={[
        { key: 'crop', label: 'Crop', render: (r) => r.crop?.name }, { key: 'category', label: 'Category' },
        { key: 'amount', label: 'Amount', render: (r) => money(r.amount) },
        { key: 'date', label: 'Date' }, { key: 'note', label: 'Note' },
      ]}
    />
  );
}
