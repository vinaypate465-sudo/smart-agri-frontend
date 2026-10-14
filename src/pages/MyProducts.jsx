import CrudPage from '../components/CrudPage.jsx';
import { money } from '../api';

export default function MyProducts() {
  return (
    <CrudPage
      title="My Marketplace Products" endpoint="/products" listEndpoint="/products/mine"
      hint="List produce for customers to buy directly from you. Products with zero stock are hidden from the marketplace."
      fields={[
        { key: 'name', label: 'Product name', required: true },
        { key: 'category', label: 'Category', type: 'select', options: ['Vegetables', 'Fruits', 'Grains', 'Pulses', 'Spices', 'Dairy', 'Other'] },
        { key: 'price', label: 'Price per unit (₹)', type: 'number', required: true },
        { key: 'quantity', label: 'Quantity in stock', type: 'number', required: true },
        { key: 'unit', label: 'Unit', type: 'select', options: ['kg', 'quintal', 'dozen', 'litre', 'piece'], required: true },
        { key: 'description', label: 'Description', type: 'textarea' },
      ]}
      columns={[
        { key: 'name', label: 'Product' }, { key: 'category', label: 'Category' },
        { key: 'price', label: 'Price', render: (r) => `${money(r.price)} / ${r.unit}` },
        { key: 'quantity', label: 'Stock', render: (r) => `${r.quantity} ${r.unit}` },
      ]}
    />
  );
}
