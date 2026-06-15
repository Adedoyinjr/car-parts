import { useState, useMemo } from 'react';
import { suppliers as initialSuppliers } from '@/data/mockData';
import type { Supplier } from '@/types';
import {
  Search, Plus, Pencil, Trash2, X, ChevronLeft, ChevronRight,
  Phone, Mail, MapPin, Truck
} from 'lucide-react';

export default function AdminSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 8;

  const emptySupplier: Partial<Supplier> = {
    name: '', contactPerson: '', email: '', phone: '', address: '', notes: '',
    productCount: 0, status: 'active', createdAt: new Date().toISOString().split('T')[0],
  };

  const [form, setForm] = useState<Partial<Supplier>>(emptySupplier);

  const filtered = useMemo(() => {
    let result = [...suppliers];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.contactPerson.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
      );
    }
    return result;
  }, [suppliers, search]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const openCreate = () => {
    setEditingSupplier(null);
    setForm(emptySupplier);
    setModalOpen(true);
  };

  const openEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setForm({ ...supplier });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.email) return;
    if (editingSupplier) {
      setSuppliers(prev => prev.map(s => s.id === editingSupplier.id ? { ...s, ...form } as Supplier : s));
    } else {
      const newSupplier: Supplier = { ...form as Supplier, id: Date.now().toString() };
      setSuppliers(prev => [...prev, newSupplier]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setSuppliers(prev => prev.filter(s => s.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-[-0.02em]">Suppliers</h1>
          <p className="text-sm text-[#A1A09B]">Manage your supplier directory</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#FF5A00] text-[#050505] text-xs font-bold uppercase tracking-[0.1em] hover:bg-[#ff6b1a] transition-colors w-fit">
          <Plus className="w-4 h-4" /> Add Supplier
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A09B]" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search suppliers..."
          className="w-full bg-[#0a0a0a] border border-[#1a1a1a] pl-9 pr-4 py-2.5 text-sm text-[#F5F5F0] placeholder-[#A1A09B] focus:outline-none focus:border-[#FF5A00]/50" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {paginated.map(supplier => (
          <div key={supplier.id} className="bg-[#0a0a0a] border border-[#1a1a1a] p-5 hover:border-[#FF5A00]/20 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-[#FF5A00]/10 flex items-center justify-center">
                <Truck className="w-5 h-5 text-[#FF5A00]" />
              </div>
              <span className={`text-[10px] px-2 py-0.5 ${supplier.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {supplier.status}
              </span>
            </div>
            <h3 className="text-sm font-bold mb-1">{supplier.name}</h3>
            <p className="text-xs text-[#A1A09B] mb-3">{supplier.contactPerson}</p>
            <div className="space-y-1.5 mb-4">
              <div className="flex items-center gap-2 text-xs text-[#A1A09B]">
                <Mail className="w-3 h-3 text-[#FF5A00]" /> {supplier.email}
              </div>
              <div className="flex items-center gap-2 text-xs text-[#A1A09B]">
                <Phone className="w-3 h-3 text-[#FF5A00]" /> {supplier.phone}
              </div>
              <div className="flex items-center gap-2 text-xs text-[#A1A09B]">
                <MapPin className="w-3 h-3 text-[#FF5A00]" /> {supplier.address}
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-[#1a1a1a]">
              <span className="text-[10px] text-[#A1A09B]">{supplier.productCount} products</span>
              <div className="flex gap-1">
                <button onClick={() => openEdit(supplier)} className="p-1.5 text-[#A1A09B] hover:text-[#FF5A00] transition-colors">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setDeleteConfirm(supplier.id)} className="p-1.5 text-[#A1A09B] hover:text-red-400 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
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

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setModalOpen(false)} />
          <div className="relative bg-[#0a0a0a] border border-[#1a1a1a] w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-[#1a1a1a]">
              <h2 className="text-lg font-bold">{editingSupplier ? 'Edit' : 'Add'} Supplier</h2>
              <button onClick={() => setModalOpen(false)} className="text-[#A1A09B] hover:text-[#F5F5F0]"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs text-[#A1A09B] uppercase tracking-[0.1em] mb-1 block">Company Name</label>
                <input value={form.name || ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] px-4 py-2.5 text-sm text-[#F5F5F0] focus:outline-none focus:border-[#FF5A00]/50" />
              </div>
              <div>
                <label className="text-xs text-[#A1A09B] uppercase tracking-[0.1em] mb-1 block">Contact Person</label>
                <input value={form.contactPerson || ''} onChange={e => setForm(f => ({ ...f, contactPerson: e.target.value }))}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] px-4 py-2.5 text-sm text-[#F5F5F0] focus:outline-none focus:border-[#FF5A00]/50" />
              </div>
              <div>
                <label className="text-xs text-[#A1A09B] uppercase tracking-[0.1em] mb-1 block">Email</label>
                <input value={form.email || ''} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] px-4 py-2.5 text-sm text-[#F5F5F0] focus:outline-none focus:border-[#FF5A00]/50" />
              </div>
              <div>
                <label className="text-xs text-[#A1A09B] uppercase tracking-[0.1em] mb-1 block">Phone</label>
                <input value={form.phone || ''} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] px-4 py-2.5 text-sm text-[#F5F5F0] focus:outline-none focus:border-[#FF5A00]/50" />
              </div>
              <div>
                <label className="text-xs text-[#A1A09B] uppercase tracking-[0.1em] mb-1 block">Status</label>
                <select value={form.status || 'active'} onChange={e => setForm(f => ({ ...f, status: e.target.value as Supplier['status'] }))}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] px-4 py-2.5 text-sm text-[#F5F5F0] focus:outline-none focus:border-[#FF5A00]/50">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs text-[#A1A09B] uppercase tracking-[0.1em] mb-1 block">Address</label>
                <input value={form.address || ''} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] px-4 py-2.5 text-sm text-[#F5F5F0] focus:outline-none focus:border-[#FF5A00]/50" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs text-[#A1A09B] uppercase tracking-[0.1em] mb-1 block">Notes</label>
                <textarea value={form.notes || ''} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] px-4 py-2.5 text-sm text-[#F5F5F0] focus:outline-none focus:border-[#FF5A00]/50 resize-none" />
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-[#1a1a1a]">
              <button onClick={() => setModalOpen(false)}
                className="flex-1 py-2.5 border border-[#1a1a1a] text-xs font-bold uppercase tracking-[0.1em] text-[#A1A09B] hover:border-[#FF5A00] transition-colors">Cancel</button>
              <button onClick={handleSave}
                className="flex-1 py-2.5 bg-[#FF5A00] text-[#050505] text-xs font-bold uppercase tracking-[0.1em] hover:bg-[#ff6b1a] transition-colors">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-[#0a0a0a] border border-[#1a1a1a] p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-2">Delete Supplier</h3>
            <p className="text-sm text-[#A1A09B] mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 border border-[#1a1a1a] text-xs font-bold uppercase tracking-[0.1em] text-[#A1A09B] hover:border-[#FF5A00] transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2.5 bg-red-500 text-white text-xs font-bold uppercase tracking-[0.1em] hover:bg-red-600 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
