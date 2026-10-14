import CrudPage from '../components/CrudPage.jsx';
import { money } from '../api';

export default function Crops() {
  return (
    <CrudPage
      title="Crop Management & Production" endpoint="/crops"
      hint="Record crop type, planting date, harvest, yield and revenue."
      toPayload={({ farmId, ...rest }) => ({ ...rest, farm: { id: Number(farmId) } })}
      toForm={(r) => ({ ...r, farmId: r.farm?.id })}
      fields={[
        { key: 'farmId', label: 'Farm', type: 'select', source: '/farms', required: true },
        { key: 'name', label: 'Crop', required: true },
        { key: 'season', label: 'Season', type: 'select', options: ['Kharif', 'Rabi', 'Zaid'] },
        { key: 'plantingDate', label: 'Planting date', type: 'date' },
        { key: 'harvestDate', label: 'Harvest date', type: 'date' },
        { key: 'areaAcres', label: 'Area (acres)', type: 'number' },
        { key: 'yieldKg', label: 'Yield (kg)', type: 'number' },
        { key: 'revenue', label: 'Revenue (₹)', type: 'number' },
      ]}
      columns={[
        { key: 'name', label: 'Crop' }, { key: 'farm', label: 'Farm', render: (r) => r.farm?.name },
        { key: 'season', label: 'Season' }, { key: 'plantingDate', label: 'Planted' },
        { key: 'harvestDate', label: 'Harvest' }, { key: 'yieldKg', label: 'Yield (kg)' },
        { key: 'revenue', label: 'Revenue', render: (r) => (r.revenue != null ? money(r.revenue) : '—') },
      ]}
    />
  );
}
