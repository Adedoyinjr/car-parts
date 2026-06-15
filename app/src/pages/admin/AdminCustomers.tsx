import { useState, useMemo } from 'react';
import { customers as initialCustomers, orders } from '@/data/mockData';
import type { Customer } from '@/types';
import {
  Search, Eye, X, ChevronLeft, ChevronRight,
  Users, ShoppingCart, DollarSign, Mail, Phone
} from 'lucide-react';

export default function AdminCustomers() {
  const [customers] = useState<Customer[]>(initialCustomers);
  const [search, setSearch] = useState('');
  const [detailCustomer, setDetailCustomer] = useState<Customer | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 8;

  const filtered = useMemo(() => {
    let result = [...customers];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q)
      );
    }
    return result;
  }, [customers, search]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const customerOrders = (customerId: string) => orders.filter(o => o.customerId === customerId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-[-0.02em]">Customers</h1>
        <p className="text-sm text-[#A1A09B]">View and manage your customers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Customers', value: customers.length, icon: Users },
          { label: 'Active', value: customers.filter(c => c.status === 'active').length, icon: Users, color: 'text-green-400' },
          { label: 'Total Orders', value: orders.length, icon: ShoppingCart, color: 'text-blue-400' },
          { label: 'Total Revenue', value: `$${orders.reduce((s, o) => s + o.total, 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`, icon: DollarSign, color: 'text-[#FF5A00]' },
        ].map(stat => (
          <div key={stat.label} className="bg-[#0a0a0a] border border-[#1a1a1a] p-4">
            <stat.icon className={`w-5 h-5 ${stat.color || 'text-[#A1A09B]'} mb-2`} />
            <p className={`text-2xl font-bold ${stat.color || ''}`}>{stat.value}</p>
            <p className="text-[10px] text-[#A1A09B] uppercase tracking-[0.1em] mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A09B]" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers..."
          className="w-full bg-[#0a0a0a] border border-[#1a1a1a] pl-9 pr-4 py-2.5 text-sm text-[#F5F5F0] placeholder-[#A1A09B] focus:outline-none focus:border-[#FF5A00]/50" />
      </div>

      <div className="bg-[#0a0a0a] border border-[#1a1a1a] overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1a1a1a]">
              {[
                { key: 'name', label: 'Customer' },
                { key: 'totalOrders', label: 'Orders' },
                { key: 'totalSpent', label: 'Total Spent' },
                { key: 'status', label: 'Status' },
                { key: 'actions', label: '' },
              ].map(col => (
                <th key={col.key} className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-[#A1A09B]">
                  <div className="flex items-center gap-1">{col.label}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map(customer => (
              <tr key={customer.id} className="border-b border-[#1a1a1a]/50 hover:bg-[#111] transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#FF5A00]/10 flex items-center justify-center">
                      <span className="text-xs font-bold text-[#FF5A00]">{customer.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{customer.name}</p>
                      <p className="text-[10px] text-[#A1A09B]">{customer.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm font-semibold">{customer.totalOrders}</td>
                <td className="px-4 py-3 text-sm font-semibold">${customer.totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] px-2 py-1 ${customer.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                    {customer.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => setDetailCustomer(customer)} className="p-1.5 text-[#A1A09B] hover:text-[#FF5A00] transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-1">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="p-2 border border-[#1a1a1a] hover:border-[#FF5A00] disabled:opacity-30 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              className={`w-8 h-8 text-xs font-semibold transition-colors ${page === p ? 'bg-[#FF5A00] text-[#050505]' : 'border border-[#1a1a1a] hover:border-[#FF5A00]'}`}>{p}</button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="p-2 border border-[#1a1a1a] hover:border-[#FF5A00] disabled:opacity-30 transition-colors"><ChevronRight className="w-4 h-4" /></button>
        </div>
      )}

      {/* Customer Detail */}
      {detailCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDetailCustomer(null)} />
          <div className="relative bg-[#0a0a0a] border border-[#1a1a1a] w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-[#1a1a1a]">
              <h2 className="text-lg font-bold">Customer Details</h2>
              <button onClick={() => setDetailCustomer(null)} className="text-[#A1A09B] hover:text-[#F5F5F0]"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#FF5A00]/10 flex items-center justify-center">
                  <span className="text-xl font-bold text-[#FF5A00]">{detailCustomer.name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold">{detailCustomer.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-[#A1A09B]"><Mail className="w-3 h-3" /> {detailCustomer.email}</span>
                    <span className="flex items-center gap-1 text-xs text-[#A1A09B]"><Phone className="w-3 h-3" /> {detailCustomer.phone}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[#111] border border-[#1a1a1a] p-3 text-center">
                  <p className="text-xl font-bold">{detailCustomer.totalOrders}</p>
                  <p className="text-[10px] text-[#A1A09B] uppercase tracking-[0.1em]">Orders</p>
                </div>
                <div className="bg-[#111] border border-[#1a1a1a] p-3 text-center">
                  <p className="text-xl font-bold text-[#FF5A00]">${(detailCustomer.totalSpent / detailCustomer.totalOrders).toFixed(0)}</p>
                  <p className="text-[10px] text-[#A1A09B] uppercase tracking-[0.1em]">Avg Order</p>
                </div>
                <div className="bg-[#111] border border-[#1a1a1a] p-3 text-center">
                  <p className="text-xl font-bold text-green-400">${detailCustomer.totalSpent.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                  <p className="text-[10px] text-[#A1A09B] uppercase tracking-[0.1em]">Lifetime</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-[#A1A09B] uppercase tracking-[0.1em] mb-3">Recent Orders</p>
                <div className="space-y-2">
                  {customerOrders(detailCustomer.id).map(order => (
                    <div key={order.id} className="flex items-center justify-between py-2 border-b border-[#1a1a1a]">
                      <div>
                        <p className="text-xs font-semibold">{order.orderNumber}</p>
                        <p className="text-[10px] text-[#A1A09B]">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">${order.total.toFixed(2)}</p>
                        <span className={`text-[10px] px-1.5 py-0.5 ${statusColors[order.status] || ''}`}>{order.status}</span>
                      </div>
                    </div>
                  ))}
                  {customerOrders(detailCustomer.id).length === 0 && (
                    <p className="text-xs text-[#A1A09B]">No orders found</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-400',
  confirmed: 'bg-blue-500/10 text-blue-400',
  processing: 'bg-purple-500/10 text-purple-400',
  shipped: 'bg-indigo-500/10 text-indigo-400',
  delivered: 'bg-green-500/10 text-green-400',
  cancelled: 'bg-red-500/10 text-red-400',
  refunded: 'bg-gray-500/10 text-gray-400',
};
