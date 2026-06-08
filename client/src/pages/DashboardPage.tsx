import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDashboardData } from '../api/dashboard';

const DashboardPage: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboardData,
    refetchInterval: 30000,
  });

  const dashboard = data?.data;

  if (isLoading) return (
    <div className="p-6 text-center text-gray-400">Loading dashboard...</div>
  );

  return (
    <div className="p-6 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Today's Revenue", value: dashboard?.revenue.today || 0 },
          { label: 'This Week', value: dashboard?.revenue.this_week || 0 },
          { label: 'This Month', value: dashboard?.revenue.this_month || 0 },
          { label: 'Low Stock Alerts', value: dashboard?.low_stock_products.length || 0, isCount: true },
        ].map((card) => (
          <div key={card.label} className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">{card.label}</p>
            <p className={`text-2xl font-bold ${card.isCount && Number(card.value) > 0 ? 'text-yellow-500' : 'text-gray-900'}`}>
              {card.isCount ? card.value : `₦${Number(card.value).toLocaleString()}`}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Low stock alerts */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200">
            <h2 className="font-semibold text-gray-800">⚠️ Low stock alerts</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {dashboard?.low_stock_products.length === 0 ? (
              <p className="px-4 py-6 text-sm text-center text-gray-400">All products well stocked</p>
            ) : dashboard?.low_stock_products.map((p) => (
              <div key={p.id} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.sku}</p>
                </div>
                <span className={`text-sm font-bold ${p.stock_qty === 0 ? 'text-red-500' : 'text-yellow-500'}`}>
                  {p.stock_qty === 0 ? 'Out' : `${p.stock_qty} left`}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top sellers */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200">
            <h2 className="font-semibold text-gray-800">Top sellers</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Product</th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Units sold</th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {dashboard?.top_sellers.length === 0 ? (
                <tr><td colSpan={3} className="px-4 py-6 text-center text-sm text-gray-400">No sales data yet</td></tr>
              ) : dashboard?.top_sellers.map((s) => (
                <tr key={s.product_id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{s.product_name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{s.total_sold}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">₦{Number(s.total_revenue).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;