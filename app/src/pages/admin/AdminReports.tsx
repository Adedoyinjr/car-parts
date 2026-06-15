import { useState, useRef } from 'react';
import { salesData, productPerformance, categoryPerformance, orders } from '@/data/mockData';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Download, TrendingUp, DollarSign, ShoppingCart, Users } from 'lucide-react';

const COLORS = ['#FF5A00', '#A1A09B', '#1a1a1a', '#F5F5F0', '#2a2a2a', '#3a3a3a'];

export default function AdminReports() {
  const [dateRange, setDateRange] = useState('30');
  const [activeReport, setActiveReport] = useState<'sales' | 'products' | 'customers'>('sales');
  const reportRef = useRef<HTMLDivElement>(null);

  const totalRevenue = salesData.reduce((s, d) => s + d.revenue, 0);
  const totalOrders = salesData.reduce((s, d) => s + d.orders, 0);
  const avgOrderValue = totalRevenue / totalOrders;

  const exportCSV = () => {
    let csv = '';
    if (activeReport === 'sales') {
      csv = 'Date,Revenue,Orders\n' + salesData.map(d => `${d.date},${d.revenue},${d.orders}`).join('\n');
    } else if (activeReport === 'products') {
      csv = 'Product,Sales,Revenue\n' + productPerformance.map(p => `${p.name},${p.sales},${p.revenue}`).join('\n');
    } else {
      csv = 'Category,Percentage\n' + categoryPerformance.map(c => `${c.name},${c.value}`).join('\n');
    }
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeReport}-report.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-[-0.02em]">Reports & Analytics</h1>
          <p className="text-sm text-[#A1A09B]">Business performance insights</p>
        </div>
        <div className="flex gap-3">
          <select value={dateRange} onChange={e => setDateRange(e.target.value)}
            className="bg-[#0a0a0a] border border-[#1a1a1a] px-4 py-2.5 text-sm text-[#F5F5F0] focus:outline-none focus:border-[#FF5A00]/50">
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="365">Last Year</option>
          </select>
          <button onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0a0a0a] border border-[#1a1a1a] text-xs font-bold uppercase tracking-[0.1em] hover:border-[#FF5A00] transition-colors">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `$${(totalRevenue / 1000).toFixed(0)}k`, change: '+23.5%', icon: DollarSign, color: 'text-[#FF5A00]' },
          { label: 'Total Orders', value: totalOrders.toString(), change: '+15.2%', icon: ShoppingCart, color: 'text-blue-400' },
          { label: 'Avg Order Value', value: `$${avgOrderValue.toFixed(0)}`, change: '+7.1%', icon: TrendingUp, color: 'text-green-400' },
          { label: 'Total Customers', value: '89', change: '+8.7%', icon: Users, color: 'text-purple-400' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-[#0a0a0a] border border-[#1a1a1a] p-5">
            <div className="flex items-center justify-between mb-3">
              <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              <span className="text-[10px] text-green-400 font-bold">{kpi.change}</span>
            </div>
            <p className="text-2xl font-bold">{kpi.value}</p>
            <p className="text-[10px] text-[#A1A09B] uppercase tracking-[0.1em] mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Report Tabs */}
      <div className="flex gap-4 border-b border-[#1a1a1a]">
        {[
          { key: 'sales' as const, label: 'Sales Report' },
          { key: 'products' as const, label: 'Product Performance' },
          { key: 'customers' as const, label: 'Category Analysis' },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveReport(tab.key)}
            className={`pb-3 text-xs font-bold uppercase tracking-[0.1em] border-b-2 transition-colors ${
              activeReport === tab.key ? 'text-[#FF5A00] border-[#FF5A00]' : 'text-[#A1A09B] border-transparent hover:text-[#F5F5F0]'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      <div ref={reportRef}>
        {activeReport === 'sales' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-[#0a0a0a] border border-[#1a1a1a] p-6">
              <h3 className="text-sm font-bold uppercase tracking-[0.1em] mb-4">Revenue Trend</h3>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="revGrad2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF5A00" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#FF5A00" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                  <XAxis dataKey="date" stroke="#A1A09B" fontSize={10} />
                  <YAxis stroke="#A1A09B" fontSize={10} tickFormatter={(v) => `$${v/1000}k`} />
                  <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 0 }}
                    itemStyle={{ color: '#F5F5F0', fontSize: 12 }} formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']} />
                  <Area type="monotone" dataKey="revenue" stroke="#FF5A00" strokeWidth={2} fill="url(#revGrad2)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6">
              <h3 className="text-sm font-bold uppercase tracking-[0.1em] mb-4">Orders Trend</h3>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="ordGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#A1A09B" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#A1A09B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                  <XAxis dataKey="date" stroke="#A1A09B" fontSize={10} />
                  <YAxis stroke="#A1A09B" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 0 }}
                    itemStyle={{ color: '#F5F5F0', fontSize: 12 }} />
                  <Area type="monotone" dataKey="orders" stroke="#A1A09B" strokeWidth={2} fill="url(#ordGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeReport === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6">
              <h3 className="text-sm font-bold uppercase tracking-[0.1em] mb-4">Revenue by Product</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={productPerformance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                  <XAxis type="number" stroke="#A1A09B" fontSize={10} tickFormatter={(v) => `$${v/1000}k`} />
                  <YAxis dataKey="name" type="category" stroke="#A1A09B" fontSize={10} width={100} />
                  <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 0 }}
                    itemStyle={{ color: '#F5F5F0', fontSize: 12 }} formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="#FF5A00" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6">
              <h3 className="text-sm font-bold uppercase tracking-[0.1em] mb-4">Units Sold</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={productPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                  <XAxis dataKey="name" stroke="#A1A09B" fontSize={10} />
                  <YAxis stroke="#A1A09B" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 0 }}
                    itemStyle={{ color: '#F5F5F0', fontSize: 12 }} />
                  <Bar dataKey="sales" fill="#A1A09B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeReport === 'customers' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6">
              <h3 className="text-sm font-bold uppercase tracking-[0.1em] mb-4">Sales by Category</h3>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie data={categoryPerformance} cx="50%" cy="50%" innerRadius={60} outerRadius={120} dataKey="value" stroke="none">
                    {categoryPerformance.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 0 }}
                    itemStyle={{ color: '#F5F5F0', fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12, color: '#A1A09B' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6">
              <h3 className="text-sm font-bold uppercase tracking-[0.1em] mb-4">Category Breakdown</h3>
              <div className="space-y-4">
                {categoryPerformance.map((cat, i) => (
                  <div key={cat.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold">{cat.name}</span>
                      <span className="text-xs text-[#A1A09B]">{cat.value}%</span>
                    </div>
                    <div className="w-full h-2 bg-[#1a1a1a]">
                      <div className="h-full transition-all" style={{ width: `${cat.value * 2}%`, backgroundColor: COLORS[i % COLORS.length] }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-[#1a1a1a]">
                <h4 className="text-xs font-bold uppercase tracking-[0.1em] mb-3">Recent Order Summary</h4>
                <div className="space-y-2">
                  {orders.slice(0, 5).map(order => (
                    <div key={order.id} className="flex items-center justify-between py-1.5 border-b border-[#1a1a1a]/50">
                      <span className="text-xs">{order.orderNumber}</span>
                      <span className="text-xs font-semibold">${order.total.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
