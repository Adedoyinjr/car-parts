import { useNavigate } from 'react-router-dom';
import { dashboardStats, salesData, categoryPerformance, productPerformance, orders, notifications } from '@/data/mockData';
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingCart,
  Users, Package, AlertTriangle, ArrowRight, Bell
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';

const COLORS = ['#FF5A00', '#A1A09B', '#1a1a1a', '#F5F5F0', '#2a2a2a', '#3a3a3a'];

export default function Dashboard() {
  const navigate = useNavigate();
  const recentOrders = orders.slice(0, 5);
  const unreadNotifications = notifications.filter(n => !n.read);

  const statCards = [
    {
      label: 'Total Revenue',
      value: `$${dashboardStats.totalRevenue.toLocaleString()}`,
      change: dashboardStats.revenueChange,
      icon: DollarSign,
    },
    {
      label: 'Total Orders',
      value: dashboardStats.totalOrders.toString(),
      change: dashboardStats.ordersChange,
      icon: ShoppingCart,
    },
    {
      label: 'Total Customers',
      value: dashboardStats.totalCustomers.toString(),
      change: dashboardStats.customersChange,
      icon: Users,
    },
    {
      label: 'Products',
      value: dashboardStats.totalProducts.toString(),
      change: 0,
      icon: Package,
    },
    {
      label: 'Inventory Value',
      value: `$${dashboardStats.inventoryValue.toLocaleString()}`,
      change: 0,
      icon: DollarSign,
    },
    {
      label: 'Low Stock Items',
      value: dashboardStats.lowStockCount.toString(),
      change: 0,
      icon: AlertTriangle,
      alert: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-[-0.02em]">Dashboard</h1>
          <p className="text-sm text-[#A1A09B]">Welcome back, here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-2.5 bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#FF5A00]/50 transition-colors">
            <Bell className="w-5 h-5 text-[#A1A09B]" />
            {unreadNotifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF5A00] text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadNotifications.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className={`bg-[#0a0a0a] border p-4 ${stat.alert ? 'border-red-500/30' : 'border-[#1a1a1a]'}`}
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon className={`w-5 h-5 ${stat.alert ? 'text-red-400' : 'text-[#A1A09B]'}`} />
              {stat.change !== 0 && (
                <div className={`flex items-center gap-0.5 text-[10px] font-bold ${stat.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {stat.change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(stat.change)}%
                </div>
              )}
            </div>
            <p className="text-xl font-bold">{stat.value}</p>
            <p className="text-[10px] text-[#A1A09B] uppercase tracking-[0.1em] mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-[#0a0a0a] border border-[#1a1a1a] p-6">
          <h3 className="text-sm font-bold uppercase tracking-[0.1em] mb-4">Revenue Overview</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF5A00" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FF5A00" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
              <XAxis dataKey="date" stroke="#A1A09B" fontSize={10} />
              <YAxis stroke="#A1A09B" fontSize={10} tickFormatter={(v) => `$${v/1000}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 0 }}
                itemStyle={{ color: '#F5F5F0', fontSize: 12 }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#FF5A00" strokeWidth={2} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6">
          <h3 className="text-sm font-bold uppercase tracking-[0.1em] mb-4">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={categoryPerformance}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                dataKey="value"
                stroke="none"
              >
                {categoryPerformance.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 0 }}
                itemStyle={{ color: '#F5F5F0', fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1 mt-2">
            {categoryPerformance.slice(0, 4).map((cat, i) => (
              <div key={cat.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-[#A1A09B]">{cat.name}</span>
                </div>
                <span className="font-semibold">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Products */}
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6">
          <h3 className="text-sm font-bold uppercase tracking-[0.1em] mb-4">Top Products</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={productPerformance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
              <XAxis type="number" stroke="#A1A09B" fontSize={10} tickFormatter={(v) => `$${v/1000}k`} />
              <YAxis dataKey="name" type="category" stroke="#A1A09B" fontSize={10} width={100} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 0 }}
                itemStyle={{ color: '#F5F5F0', fontSize: 12 }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
              />
              <Bar dataKey="revenue" fill="#FF5A00" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Orders */}
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-[0.1em]">Recent Orders</h3>
            <button
              onClick={() => navigate('/admin/orders')}
              className="text-[10px] text-[#FF5A00] font-semibold uppercase tracking-[0.1em] flex items-center gap-1 hover:underline"
            >
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b border-[#1a1a1a] last:border-0">
                <div>
                  <p className="text-xs font-semibold">{order.orderNumber}</p>
                  <p className="text-[10px] text-[#A1A09B]">{order.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">${order.total.toLocaleString()}</p>
                  <span className={`text-[10px] px-2 py-0.5 ${
                    order.status === 'delivered' ? 'bg-green-500/10 text-green-400' :
                    order.status === 'shipped' ? 'bg-blue-500/10 text-blue-400' :
                    order.status === 'cancelled' ? 'bg-red-500/10 text-red-400' :
                    'bg-yellow-500/10 text-yellow-400'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
