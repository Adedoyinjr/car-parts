import { useState, useMemo } from 'react';
import { products as initialProducts, inventoryTransactions as initialTransactions } from '@/data/mockData';
import type { Product, InventoryTransaction } from '@/types';
import {
  Search, ArrowUpDown, Plus, AlertTriangle,
  ChevronLeft, ChevronRight, History, Package
} from 'lucide-react';

export default function AdminInventory() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>(initialTransactions);
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'stock' | 'transactions'>('stock');
  const [sortField, setSortField] = useState('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [adjustModal, setAdjustModal] = useState<Product | null>(null);
  const [adjustQty, setAdjustQty] = useState(0);
  const [adjustType, setAdjustType] = useState<'received' | 'sold' | 'returned' | 'damaged' | 'adjusted'>('adjusted');
  const perPage = 8;

  const lowStock = products.filter(p => p.quantity <= p.lowStockThreshold);

  const filtered = useMemo(() => {
    let result = [...products];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
    }
    result.sort((a, b) => {
      const aVal = a[sortField as keyof Product];
      const bVal = b[sortField as keyof Product];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
    return result;
  }, [products, search, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const toggleSort = (field: string) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const handleAdjust = () => {
    if (!adjustModal || adjustQty === 0) return;
    const newQty = Math.max(0, adjustModal.quantity + (adjustType === 'sold' || adjustType === 'damaged' ? -adjustQty : adjustQty));
    
    setProducts(prev => prev.map(p => p.id === adjustModal.id ? { ...p, quantity: newQty } : p));
    
    const newTx: InventoryTransaction = {
      id: `tx-${Date.now()}`,
      productId: adjustModal.id,
      productName: adjustModal.name,
      type: adjustType,
      quantity: adjustQty,
      previousStock: adjustModal.quantity,
      newStock: newQty,
      notes: `Manual ${adjustType}`,
      createdBy: 'Admin',
      createdAt: new Date().toISOString(),
    };
    setTransactions(prev => [newTx, ...prev]);
    setAdjustModal(null);
    setAdjustQty(0);
  };

  const getStockColor = (qty: number, threshold: number) => {
    if (qty <= 0) return 'text-red-400';
    if (qty <= threshold) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getStockBar = (qty: number, threshold: number) => {
    const max = threshold * 4;
    const pct = Math.min(100, (qty / max) * 100);
    let color = 'bg-green-500';
    if (qty <= 0) color = 'bg-red-500';
    else if (qty <= threshold) color = 'bg-yellow-500';
    return { pct, color };
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-[-0.02em]">Inventory</h1>
        <p className="text-sm text-[#A1A09B]">Track stock levels and manage inventory</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Products', value: products.length },
          { label: 'In Stock', value: products.filter(p => p.quantity > 0).length, color: 'text-green-400' },
          { label: 'Low Stock', value: lowStock.length, color: 'text-yellow-400' },
          { label: 'Out of Stock', value: products.filter(p => p.quantity === 0).length, color: 'text-red-400' },
        ].map(stat => (
          <div key={stat.label} className="bg-[#0a0a0a] border border-[#1a1a1a] p-4">
            <p className={`text-2xl font-bold ${stat.color || ''}`}>{stat.value}</p>
            <p className="text-[10px] text-[#A1A09B] uppercase tracking-[0.1em] mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Low Stock Alert */}
      {lowStock.length > 0 && (
        <div className="bg-yellow-500/5 border border-yellow-500/20 p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-yellow-400">Low Stock Alert</p>
            <p className="text-xs text-[#A1A09B]">
              {lowStock.length} product{lowStock.length > 1 ? 's are' : ' is'} below the minimum threshold:
              {lowStock.map(p => ` ${p.name} (${p.quantity})`).join(', ')}
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 border-b border-[#1a1a1a]">
        <button
          onClick={() => setView('stock')}
          className={`pb-3 text-xs font-bold uppercase tracking-[0.1em] border-b-2 transition-colors ${
            view === 'stock' ? 'text-[#FF5A00] border-[#FF5A00]' : 'text-[#A1A09B] border-transparent hover:text-[#F5F5F0]'
          }`}
        >
          <div className="flex items-center gap-1.5"><Package className="w-3.5 h-3.5" /> Stock Levels</div>
        </button>
        <button
          onClick={() => setView('transactions')}
          className={`pb-3 text-xs font-bold uppercase tracking-[0.1em] border-b-2 transition-colors ${
            view === 'transactions' ? 'text-[#FF5A00] border-[#FF5A00]' : 'text-[#A1A09B] border-transparent hover:text-[#F5F5F0]'
          }`}
        >
          <div className="flex items-center gap-1.5"><History className="w-3.5 h-3.5" /> Transactions</div>
        </button>
      </div>

      {view === 'stock' ? (
        <>
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A09B]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-[#0a0a0a] border border-[#1a1a1a] pl-9 pr-4 py-2.5 text-sm text-[#F5F5F0] placeholder-[#A1A09B] focus:outline-none focus:border-[#FF5A00]/50"
              />
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-[#1a1a1a] overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1a1a1a]">
                  {[
                    { key: 'name', label: 'Product' },
                    { key: 'sku', label: 'SKU' },
                    { key: 'quantity', label: 'Stock' },
                    { key: 'lowStockThreshold', label: 'Threshold' },
                    { key: 'status', label: 'Status' },
                    { key: 'actions', label: '' },
                  ].map(col => (
                    <th key={col.key} className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-[#A1A09B] cursor-pointer hover:text-[#F5F5F0]"
                      onClick={() => col.key !== 'actions' && toggleSort(col.key)}>
                      <div className="flex items-center gap-1">{col.label}{col.key !== 'actions' && <ArrowUpDown className="w-3 h-3" />}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((product) => {
                  const bar = getStockBar(product.quantity, product.lowStockThreshold);
                  return (
                    <tr key={product.id} className="border-b border-[#1a1a1a]/50 hover:bg-[#111] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={product.image} alt={product.name} className="w-8 h-8 object-cover bg-[#111]" />
                          <span className="text-sm font-semibold">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#A1A09B]">{product.sku}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold ${getStockColor(product.quantity, product.lowStockThreshold)}`}>
                            {product.quantity}
                          </span>
                          <div className="w-16 h-1.5 bg-[#1a1a1a]">
                            <div className={`h-full ${bar.color} transition-all`} style={{ width: `${bar.pct}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#A1A09B]">{product.lowStockThreshold}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] px-2 py-1 ${
                          product.quantity <= 0 ? 'bg-red-500/10 text-red-400' :
                          product.quantity <= product.lowStockThreshold ? 'bg-yellow-500/10 text-yellow-400' :
                          'bg-green-500/10 text-green-400'
                        }`}>
                          {product.quantity <= 0 ? 'Out of Stock' : product.quantity <= product.lowStockThreshold ? 'Low' : 'OK'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => setAdjustModal(product)}
                          className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.1em] bg-[#FF5A00]/10 text-[#FF5A00] hover:bg-[#FF5A00]/20 transition-colors">
                          <Plus className="w-3 h-3" /> Adjust
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

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
        </>
      ) : (
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1a1a1a]">
                <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-[#A1A09B]">Product</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-[#A1A09B]">Type</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-[#A1A09B]">Qty</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-[#A1A09B]">Before</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-[#A1A09B]">After</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-[#A1A09B]">By</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-[#A1A09B]">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-[#1a1a1a]/50 hover:bg-[#111] transition-colors">
                  <td className="px-4 py-3 text-sm font-semibold">{tx.productName}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-1 ${
                      tx.type === 'received' ? 'bg-green-500/10 text-green-400' :
                      tx.type === 'sold' ? 'bg-blue-500/10 text-blue-400' :
                      tx.type === 'returned' ? 'bg-purple-500/10 text-purple-400' :
                      'bg-yellow-500/10 text-yellow-400'
                    }`}>{tx.type}</span>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold">{tx.quantity}</td>
                  <td className="px-4 py-3 text-sm text-[#A1A09B]">{tx.previousStock}</td>
                  <td className="px-4 py-3 text-sm font-semibold">{tx.newStock}</td>
                  <td className="px-4 py-3 text-sm text-[#A1A09B]">{tx.createdBy}</td>
                  <td className="px-4 py-3 text-sm text-[#A1A09B]">{new Date(tx.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Adjust Modal */}
      {adjustModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setAdjustModal(null)} />
          <div className="relative bg-[#0a0a0a] border border-[#1a1a1a] p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold mb-1">Adjust Stock</h3>
            <p className="text-sm text-[#A1A09B] mb-4">{adjustModal.name}</p>
            <p className="text-sm mb-4">Current: <span className="font-bold">{adjustModal.quantity}</span></p>
            <div className="space-y-3 mb-4">
              <div>
                <label className="text-xs text-[#A1A09B] uppercase tracking-[0.1em] mb-1 block">Transaction Type</label>
                <select value={adjustType} onChange={e => setAdjustType(e.target.value as typeof adjustType)}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] px-4 py-2.5 text-sm text-[#F5F5F0] focus:outline-none focus:border-[#FF5A00]/50">
                  <option value="received">Stock Received</option>
                  <option value="sold">Stock Sold</option>
                  <option value="returned">Stock Returned</option>
                  <option value="damaged">Stock Damaged</option>
                  <option value="adjusted">Stock Adjusted</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-[#A1A09B] uppercase tracking-[0.1em] mb-1 block">Quantity</label>
                <input type="number" min="1" value={adjustQty} onChange={e => setAdjustQty(Number(e.target.value))}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] px-4 py-2.5 text-sm text-[#F5F5F0] focus:outline-none focus:border-[#FF5A00]/50" />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setAdjustModal(null)}
                className="flex-1 py-2.5 border border-[#1a1a1a] text-xs font-bold uppercase tracking-[0.1em] text-[#A1A09B] hover:border-[#FF5A00] transition-colors">
                Cancel
              </button>
              <button onClick={handleAdjust}
                className="flex-1 py-2.5 bg-[#FF5A00] text-[#050505] text-xs font-bold uppercase tracking-[0.1em] hover:bg-[#ff6b1a] transition-colors">
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
