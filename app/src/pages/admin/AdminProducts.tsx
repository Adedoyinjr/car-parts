import { useState, useMemo } from 'react';
import { products as initialProducts, categories, suppliers } from '@/data/mockData';
import type { Product } from '@/types';
import {
  Plus, Search, Pencil, Trash2, X, ChevronLeft, ChevronRight,
  ArrowUpDown, Package
} from 'lucide-react';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortField, setSortField] = useState<string>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const perPage = 8;

  const emptyProduct: Partial<Product> = {
    name: '', sku: '', description: '', price: 0, category: '', categoryId: '',
    supplier: '', supplierId: '', quantity: 0, lowStockThreshold: 5,
    compatibility: [], specs: {}, rating: 0, reviewCount: 0, featured: false,
    status: 'active', image: '/products/engine.jpg', images: [],
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
  };

  const [form, setForm] = useState<Partial<Product>>(emptyProduct);

  const filtered = useMemo(() => {
    let result = [...products];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
    }
    if (statusFilter) result = result.filter(p => p.status === statusFilter);
    if (categoryFilter) result = result.filter(p => p.categoryId === categoryFilter);
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
  }, [products, search, statusFilter, categoryFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const toggleSort = (field: string) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const openCreate = () => {
    setEditingProduct(null);
    setForm(emptyProduct);
    setModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({ ...product });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.sku) return;
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...form, updatedAt: new Date().toISOString().split('T')[0] } as Product : p));
    } else {
      const newProduct: Product = {
        ...form as Product,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      setProducts(prev => [...prev, newProduct]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setDeleteConfirm(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-400';
      case 'draft': return 'bg-yellow-500/10 text-yellow-400';
      case 'archived': return 'bg-red-500/10 text-red-400';
      default: return 'bg-[#1a1a1a] text-[#A1A09B]';
    }
  };

  const getStockColor = (qty: number, threshold: number) => {
    if (qty <= 0) return 'text-red-400';
    if (qty <= threshold) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-[-0.02em]">Products</h1>
          <p className="text-sm text-[#A1A09B]">Manage your product catalog</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#FF5A00] text-[#050505] text-xs font-bold uppercase tracking-[0.1em] hover:bg-[#ff6b1a] transition-colors w-fit"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Filters */}
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
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#0a0a0a] border border-[#1a1a1a] px-4 py-2.5 text-sm text-[#F5F5F0] focus:outline-none focus:border-[#FF5A00]/50"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-[#0a0a0a] border border-[#1a1a1a] px-4 py-2.5 text-sm text-[#F5F5F0] focus:outline-none focus:border-[#FF5A00]/50"
        >
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1a1a1a]">
              {[
                { key: 'name', label: 'Product' },
                { key: 'sku', label: 'SKU' },
                { key: 'price', label: 'Price' },
                { key: 'quantity', label: 'Stock' },
                { key: 'status', label: 'Status' },
                { key: 'actions', label: '' },
              ].map(col => (
                <th
                  key={col.key}
                  className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-[#A1A09B] cursor-pointer hover:text-[#F5F5F0]"
                  onClick={() => col.key !== 'actions' && toggleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.key !== 'actions' && <ArrowUpDown className="w-3 h-3" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((product) => (
              <tr key={product.id} className="border-b border-[#1a1a1a]/50 hover:bg-[#111] transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={product.image} alt={product.name} className="w-10 h-10 object-cover bg-[#111]" />
                    <div>
                      <p className="text-sm font-semibold">{product.name}</p>
                      <p className="text-[10px] text-[#A1A09B]">{product.category}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-[#A1A09B]">{product.sku}</td>
                <td className="px-4 py-3 text-sm font-semibold">${product.price.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`text-sm font-semibold ${getStockColor(product.quantity, product.lowStockThreshold)}`}>
                    {product.quantity}
                  </span>
                  {product.quantity <= product.lowStockThreshold && (
                    <span className="text-[10px] text-yellow-400 ml-1">(Low)</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] px-2 py-1 ${getStatusColor(product.status)}`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEdit(product)}
                      className="p-1.5 text-[#A1A09B] hover:text-[#FF5A00] transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(product.id)}
                      className="p-1.5 text-[#A1A09B] hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {paginated.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <Package className="w-10 h-10 text-[#1a1a1a] mb-2" />
            <p className="text-sm text-[#A1A09B]">No products found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-[#A1A09B]">
            Showing {(page - 1) * perPage + 1} to {Math.min(page * perPage, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 border border-[#1a1a1a] hover:border-[#FF5A00] disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 text-xs font-semibold transition-colors ${
                  page === p ? 'bg-[#FF5A00] text-[#050505]' : 'border border-[#1a1a1a] hover:border-[#FF5A00]'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 border border-[#1a1a1a] hover:border-[#FF5A00] disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setModalOpen(false)} />
          <div className="relative bg-[#0a0a0a] border border-[#1a1a1a] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-[#1a1a1a]">
              <h2 className="text-lg font-bold">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-[#A1A09B] hover:text-[#F5F5F0]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[#A1A09B] uppercase tracking-[0.1em] mb-1 block">Name</label>
                  <input value={form.name || ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] px-4 py-2.5 text-sm text-[#F5F5F0] focus:outline-none focus:border-[#FF5A00]/50" />
                </div>
                <div>
                  <label className="text-xs text-[#A1A09B] uppercase tracking-[0.1em] mb-1 block">SKU</label>
                  <input value={form.sku || ''} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))}
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] px-4 py-2.5 text-sm text-[#F5F5F0] focus:outline-none focus:border-[#FF5A00]/50" />
                </div>
                <div>
                  <label className="text-xs text-[#A1A09B] uppercase tracking-[0.1em] mb-1 block">Price</label>
                  <input type="number" value={form.price || ''} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] px-4 py-2.5 text-sm text-[#F5F5F0] focus:outline-none focus:border-[#FF5A00]/50" />
                </div>
                <div>
                  <label className="text-xs text-[#A1A09B] uppercase tracking-[0.1em] mb-1 block">Quantity</label>
                  <input type="number" value={form.quantity || ''} onChange={e => setForm(f => ({ ...f, quantity: Number(e.target.value) }))}
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] px-4 py-2.5 text-sm text-[#F5F5F0] focus:outline-none focus:border-[#FF5A00]/50" />
                </div>
                <div>
                  <label className="text-xs text-[#A1A09B] uppercase tracking-[0.1em] mb-1 block">Category</label>
                  <select value={form.categoryId || ''} onChange={e => {
                    const cat = categories.find(c => c.id === e.target.value);
                    setForm(f => ({ ...f, categoryId: e.target.value, category: cat?.name || '' }));
                  }}
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] px-4 py-2.5 text-sm text-[#F5F5F0] focus:outline-none focus:border-[#FF5A00]/50">
                    <option value="">Select</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[#A1A09B] uppercase tracking-[0.1em] mb-1 block">Supplier</label>
                  <select value={form.supplierId || ''} onChange={e => {
                    const sup = suppliers.find(s => s.id === e.target.value);
                    setForm(f => ({ ...f, supplierId: e.target.value, supplier: sup?.name || '' }));
                  }}
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] px-4 py-2.5 text-sm text-[#F5F5F0] focus:outline-none focus:border-[#FF5A00]/50">
                    <option value="">Select</option>
                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[#A1A09B] uppercase tracking-[0.1em] mb-1 block">Status</label>
                  <select value={form.status || 'active'} onChange={e => setForm(f => ({ ...f, status: e.target.value as Product['status'] }))}
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] px-4 py-2.5 text-sm text-[#F5F5F0] focus:outline-none focus:border-[#FF5A00]/50">
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input type="checkbox" checked={form.featured || false} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                    className="accent-[#FF5A00]" />
                  <label className="text-xs text-[#A1A09B]">Featured Product</label>
                </div>
              </div>
              <div>
                <label className="text-xs text-[#A1A09B] uppercase tracking-[0.1em] mb-1 block">Description</label>
                <textarea value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] px-4 py-2.5 text-sm text-[#F5F5F0] focus:outline-none focus:border-[#FF5A00]/50 resize-none" />
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-[#1a1a1a]">
              <button onClick={() => setModalOpen(false)}
                className="flex-1 py-2.5 border border-[#1a1a1a] text-xs font-bold uppercase tracking-[0.1em] text-[#A1A09B] hover:border-[#FF5A00] transition-colors">
                Cancel
              </button>
              <button onClick={handleSave}
                className="flex-1 py-2.5 bg-[#FF5A00] text-[#050505] text-xs font-bold uppercase tracking-[0.1em] hover:bg-[#ff6b1a] transition-colors">
                {editingProduct ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-[#0a0a0a] border border-[#1a1a1a] p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-2">Delete Product</h3>
            <p className="text-sm text-[#A1A09B] mb-6">Are you sure? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 border border-[#1a1a1a] text-xs font-bold uppercase tracking-[0.1em] text-[#A1A09B] hover:border-[#FF5A00] transition-colors">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2.5 bg-red-500 text-white text-xs font-bold uppercase tracking-[0.1em] hover:bg-red-600 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
