import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSalesHistory, recordSale } from '../api/sales';
import { getProducts } from '../api/products';
import type { CreateSaleInput } from '../types/api';
import toast from 'react-hot-toast';

interface SaleItemRow {
  product_id: string;
  quantity: number;
  unit_price: number;
}

const SalesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [items, setItems] = useState<SaleItemRow[]>([{ product_id: '', quantity: 1, unit_price: 0 }]);
  const [notes, setNotes] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const { data: productsData } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const { data: salesData, isLoading: salesLoading } = useQuery({
    queryKey: ['sales', from, to],
    queryFn: () => getSalesHistory(from || undefined, to || undefined),
  });

  const mutation = useMutation({
    mutationFn: (data: CreateSaleInput) => recordSale(data),
    onSuccess: () => {
      toast.success('Sale recorded successfully!');
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setItems([{ product_id: '', quantity: 1, unit_price: 0 }]);
      setNotes('');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to record sale');
    },
  });

  const products = productsData?.data || [];
  const sales = salesData?.data || [];

  const handleProductChange = (index: number, product_id: string) => {
    const product = products.find((p) => p.id === product_id);
    const updated = [...items];
    updated[index] = {
      product_id,
      quantity: updated[index].quantity,
      unit_price: product ? Number(product.price) : 0,
    };
    setItems(updated);
  };

  const handleQtyChange = (index: number, quantity: number) => {
    const updated = [...items];
    updated[index] = { ...updated[index], quantity };
    setItems(updated);
  };

  const addItem = () => setItems([...items, { product_id: '', quantity: 1, unit_price: 0 }]);

  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

  const total = items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);

  const handleSubmit = () => {
    const validItems = items.filter((i) => i.product_id && i.quantity > 0);
    if (validItems.length === 0) return toast.error('Add at least one product');
    mutation.mutate({ items: validItems, notes });
  };

  return (
    <div className="p-6 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sales</h1>
        <p className="text-sm text-gray-500 mt-1">Record sales and view history</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* Sales History */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between flex-wrap gap-3">
            <h2 className="font-semibold text-gray-800">Sales history</h2>
            <div className="flex items-center gap-2 text-sm">
              <input type="date" value={from} onChange={(e) => setFrom(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none" />
              <span className="text-gray-400">to</span>
              <input type="date" value={to} onChange={(e) => setTo(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none" />
            </div>
          </div>
          {salesLoading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : sales.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No sales recorded yet</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Sale ID</th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Date</th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Total</th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Notes</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-xs font-mono text-gray-400">#{sale.id.slice(0, 8)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(sale.sold_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                      ₦{Number(sale.total_amount).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{sale.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Record Sale Form */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200">
            <h2 className="font-semibold text-gray-800">Record new sale</h2>
          </div>
          <div className="p-4 flex flex-col gap-4">

            <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
              <span className="col-span-5">Product</span>
              <span className="col-span-3">Qty</span>
              <span className="col-span-3">Price</span>
              <span className="col-span-1"></span>
            </div>

            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-center">
                <select
                  className="col-span-5 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none text-gray-800 bg-white w-full"
                  value={item.product_id}
                  onChange={(e) => handleProductChange(index, e.target.value)}
                >
                  <option value="">Select...</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <input
                  type="number" min={1}
                  className="col-span-3 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none text-gray-800 bg-white w-full"
                  value={item.quantity}
                  onChange={(e) => handleQtyChange(index, Number(e.target.value))}
                />
                <div className="col-span-3 text-sm text-gray-500 px-1">
                  ₦{item.unit_price.toLocaleString()}
                </div>
                <button onClick={() => removeItem(index)}
                  className="col-span-1 text-red-400 hover:text-red-600 text-lg leading-none">×</button>
              </div>
            ))}

            <button onClick={addItem}
              className="w-full border border-dashed border-gray-300 rounded-lg py-2 text-sm text-gray-400 hover:text-gray-600 hover:border-gray-400">
              + Add item
            </button>

            <div className="border-t border-gray-100 pt-3">
              <label className="block text-xs font-medium text-gray-500 mb-1">Notes (optional)</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none resize-none h-20 text-gray-800 bg-white placeholder-gray-400"
                placeholder="e.g. Walk-in customer, paid cash"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
              <span className="text-sm text-gray-500">Total</span>
              <span className="text-xl font-bold text-gray-900">₦{total.toLocaleString()}</span>
            </div>

            <button
              onClick={handleSubmit}
              disabled={mutation.isPending}
              className="w-full bg-gray-900 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-gray-700 disabled:opacity-50"
            >
              {mutation.isPending ? 'Processing...' : 'Confirm sale'}
            </button>

            <p className="text-xs text-center text-gray-400">Stock will be deducted automatically on confirm</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SalesPage;