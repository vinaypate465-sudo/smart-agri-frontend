import CrudPage from '../components/CrudPage.jsx';

export default function Farms() {
  return (
    <CrudPage
      title="My Farms" endpoint="/farms"
      hint="Add your farm details: land area, location and soil type."
      fields={[
        { key: 'name', label: 'Farm name', required: true },
        { key: 'location', label: 'Location' },
        { key: 'soilType', label: 'Soil type', type: 'select', options: ['Black', 'Red', 'Alluvial', 'Sandy', 'Loamy', 'Clay'] },
        { key: 'areaAcres', label: 'Area (acres)', type: 'number' },
      ]}
      columns={[
        { key: 'name', label: 'Name' }, { key: 'location', label: 'Location' },
        { key: 'soilType', label: 'Soil' }, { key: 'areaAcres', label: 'Acres' },
      ]}
    />
  );
}
