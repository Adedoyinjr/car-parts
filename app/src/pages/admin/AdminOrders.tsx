import { useState, useMemo } from 'react';
import { orders as initialOrders } from '@/data/mockData';
import type { Order, OrderStatus } from '@/types';
import {
  Search, Eye, ChevronLeft, ChevronRight, ArrowUpDown,
  Package, X
} from 'lucide-react';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-400',
  confirmed: 'bg-blue-500/10 text-blue-400',
  processing: 'bg-purple-500/10 text-purple-400',
  shipped: 'bg-indigo-500/10 text-indigo-400',
  delivered: 'bg-green-500/10 text-green-400',
  cancelled: 'bg-red-500/10 text-red-400',
  refunded: 'bg-gray-500/10 text-gray-400',
};

const paymentColors: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-400',
  paid: 'bg-green-500/10 text-green-400',
  failed: 'bg-red-500/10 text-red-400',
  refunded: 'bg-gray-500/10 text-gray-400',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const perPage = 8;

  const filtered = useMemo(() => {
    let result = [...orders];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(o =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q)
      );
    }
    if (statusFilter) result = result.filter(o => o.status === statusFilter);
    result.sort((a, b) => {
      const aVal = a[sortField as keyof Order];
      const bVal = b[sortField as keyof Order];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
    return result;
  }, [orders, search, statusFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const toggleSort = (field: string) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const updateStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o));
    if (detailOrder?.id === orderId) {
      setDetailOrder(prev => prev ? { ...prev, status } : null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-[-0.02em]">Orders</h1>
        <p className="text-sm text-[#A1A09B]">Manage and track customer orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A09B]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders..."
            className="w-full bg-[#0a0a0a] border border-[#1a1a1a] pl-9 pr-4 py-2.5 text-sm text-[#F5F5F0] placeholder-[#A1A09B] focus:outline-none focus:border-[#FF5A00]/50"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#0a0a0a] border border-[#1a1a1a] px-4 py-2.5 text-sm text-[#F5F5F0] focus:outline-none focus:border-[#FF5A00]/50"
        >
          <option value="">All Statuses</option>
          {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'].map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', value: orders.length, color: '' },
          { label: 'Pending', value: orders.filter(o => o.status === 'pending').length, color: 'text-yellow-400' },
          { label: 'Processing', value: orders.filter(o => ['confirmed', 'processing'].includes(o.status)).length, color: 'text-blue-400' },
          { label: 'Completed', value: orders.filter(o => o.status === 'delivered').length, color: 'text-green-400' },
        ].map(stat => (
          <div key={stat.label} className="bg-[#0a0a0a] border border-[#1a1a1a] p-4">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-[10px] text-[#A1A09B] uppercase tracking-[0.1em] mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1a1a1a]">
              {[
                { key: 'orderNumber', label: 'Order' },
                { key: 'customerName', label: 'Customer' },
                { key: 'total', label: 'Total' },
                { key: 'status', label: 'Status' },
                { key: 'paymentStatus', label: 'Payment' },
                { key: 'createdAt', label: 'Date' },
                { key: 'actions', label: '' },
              ].map(col => (
                <th key={col.key} className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-[#A1A09B] cursor-pointer hover:text-[#F5F5F0]"
                  onClick={() => col.key !== 'actions' && toggleSort(col.key)}>
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.key !== 'actions' && <ArrowUpDown className="w-3 h-3" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((order) => (
              <tr key={order.id} className="border-b border-[#1a1a1a]/50 hover:bg-[#111] transition-colors">
                <td className="px-4 py-3">
                  <span className="text-sm font-semibold">{order.orderNumber}</span>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm">{order.customerName}</p>
                  <p className="text-[10px] text-[#A1A09B]">{order.customerEmail}</p>
                </td>
                <td className="px-4 py-3 text-sm font-semibold">${order.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] px-2 py-1 ${statusColors[order.status] || ''}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] px-2 py-1 ${paymentColors[order.paymentStatus] || ''}`}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-[#A1A09B]">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => setDetailOrder(order)}
                    className="p-1.5 text-[#A1A09B] hover:text-[#FF5A00] transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {paginated.length === 0 && (
          <div className="flex flex-col items-center py-12">
            <Package className="w-10 h-10 text-[#1a1a1a] mb-2" />
            <p className="text-sm text-[#A1A09B]">No orders found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-1">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="p-2 border border-[#1a1a1a] hover:border-[#FF5A00] disabled:opacity-30 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              className={`w-8 h-8 text-xs font-semibold transition-colors ${page === p ? 'bg-[#FF5A00] text-[#050505]' : 'border border-[#1a1a1a] hover:border-[#FF5A00]'}`}>
              {p}
            </button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="p-2 border border-[#1a1a1a] hover:border-[#FF5A00] disabled:opacity-30 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Order Detail Modal */}
      {detailOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDetailOrder(null)} />
          <div className="relative bg-[#0a0a0a] border border-[#1a1a1a] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-[#1a1a1a]">
              <div>
                <h2 className="text-lg font-bold">{detailOrder.orderNumber}</h2>
                <p className="text-xs text-[#A1A09B]">{new Date(detailOrder.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={() => setDetailOrder(null)} className="text-[#A1A09B] hover:text-[#F5F5F0]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="flex items-center gap-3">
                <span className={`text-xs px-3 py-1 ${statusColors[detailOrder.status]}`}>{detailOrder.status}</span>
                <span className={`text-xs px-3 py-1 ${paymentColors[detailOrder.paymentStatus]}`}>{detailOrder.paymentStatus}</span>
              </div>

              {/* Customer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#111] border border-[#1a1a1a] p-4">
                  <p className="text-[10px] text-[#A1A09B] uppercase tracking-[0.1em] mb-2">Customer</p>
                  <p className="text-sm font-semibold">{detailOrder.customerName}</p>
                  <p className="text-xs text-[#A1A09B]">{detailOrder.customerEmail}</p>
                </div>
                <div className="bg-[#111] border border-[#1a1a1a] p-4">
                  <p className="text-[10px] text-[#A1A09B] uppercase tracking-[0.1em] mb-2">Shipping Address</p>
                  <p className="text-sm">{detailOrder.shippingAddress.street}</p>
                  <p className="text-xs text-[#A1A09B]">{detailOrder.shippingAddress.city}, {detailOrder.shippingAddress.state} {detailOrder.shippingAddress.zip}</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <p className="text-[10px] text-[#A1A09B] uppercase tracking-[0.1em] mb-3">Order Items</p>
                <div className="space-y-2">
                  {detailOrder.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-[#1a1a1a]">
                      <img src={item.productImage} alt={item.productName} className="w-10 h-10 object-cover bg-[#111]" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{item.productName}</p>
                        <p className="text-[10px] text-[#A1A09B]">Qty: {item.quantity} x ${item.price.toFixed(2)}</p>
                      </div>
                      <span className="text-sm font-semibold">${item.total.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="border-t border-[#1a1a1a] pt-4 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-[#A1A09B]">Subtotal</span>
                  <span>${detailOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#A1A09B]">Tax</span>
                  <span>${detailOrder.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#A1A09B]">Shipping</span>
                  <span>${detailOrder.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2">
                  <span>Total</span>
                  <span className="text-[#FF5A00]">${detailOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Actions */}
              <div>
                <p className="text-[10px] text-[#A1A09B] uppercase tracking-[0.1em] mb-3">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] as OrderStatus[]).map(status => (
                    <button
                      key={status}
                      onClick={() => updateStatus(detailOrder.id, status)}
                      className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] border transition-colors ${
                        detailOrder.status === status
                          ? 'bg-[#FF5A00] text-[#050505] border-[#FF5A00]'
                          : 'border-[#1a1a1a] text-[#A1A09B] hover:border-[#FF5A00]'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
