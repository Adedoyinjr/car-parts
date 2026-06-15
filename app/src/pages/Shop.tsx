import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { products, categories } from '@/data/mockData';
import { ShoppingCart, Star, SlidersHorizontal, X, Grid3X3, LayoutList } from 'lucide-react';

export default function Shop() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToCart } = useCart();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 30000]);
  const [sortBy, setSortBy] = useState('featured');

  const filteredProducts = useMemo(() => {
    let result = [...products];
    
    const categorySlug = searchParams.get('category');
    const featuredOnly = searchParams.get('featured');
    
    if (selectedCategory) {
      const cat = categories.find(c => c.slug === selectedCategory);
      if (cat) result = result.filter(p => p.categoryId === cat.id);
    } else if (categorySlug) {
      const cat = categories.find(c => c.slug === categorySlug);
      if (cat) result = result.filter(p => p.categoryId === cat.id);
    }
    
    if (featuredOnly) result = result.filter(p => p.featured);
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.supplier.toLowerCase().includes(q)
      );
    }
    
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    
    switch (sortBy) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      default: result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)); break;
    }
    
    return result;
  }, [searchQuery, selectedCategory, priceRange, sortBy, searchParams]);

  return (
    <div className="pt-20 min-h-[100dvh]">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-5xl font-bold tracking-[-0.02em] mb-2">SHOP</h1>
          <p className="text-sm text-[#A1A09B]">
            {filteredProducts.length} products available
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-[#1a1a1a]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-2 px-4 py-2.5 border border-[#1a1a1a] text-xs font-semibold uppercase tracking-[0.1em] hover:border-[#FF5A00] transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
            <div className="hidden sm:flex items-center border border-[#1a1a1a]">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 ${viewMode === 'grid' ? 'bg-[#1a1a1a] text-[#FF5A00]' : 'text-[#A1A09B]'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 ${viewMode === 'list' ? 'bg-[#1a1a1a] text-[#FF5A00]' : 'text-[#A1A09B]'}`}
              >
                <LayoutList className="w-4 h-4" />
              </button>
            </div>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded px-4 py-2.5 text-sm text-[#F5F5F0] focus:outline-none focus:border-[#FF5A00]/50"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

        {/* Filters Panel */}
        {filtersOpen && (
          <div className="mb-6 p-6 bg-[#0a0a0a] border border-[#1a1a1a]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-[0.1em]">Filters</h3>
              <button onClick={() => setFiltersOpen(false)} className="text-[#A1A09B] hover:text-[#F5F5F0]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="text-xs font-semibold text-[#A1A09B] uppercase tracking-[0.1em] mb-2 block">Search</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded px-4 py-2.5 text-sm text-[#F5F5F0] placeholder-[#A1A09B] focus:outline-none focus:border-[#FF5A00]/50"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#A1A09B] uppercase tracking-[0.1em] mb-2 block">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded px-4 py-2.5 text-sm text-[#F5F5F0] focus:outline-none focus:border-[#FF5A00]/50"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#A1A09B] uppercase tracking-[0.1em] mb-2 block">
                  Max Price: ${priceRange[1].toLocaleString()}
                </label>
                <input
                  type="range"
                  min="0"
                  max="30000"
                  step="100"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full accent-[#FF5A00]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className={viewMode === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
          : 'space-y-4'
        }>
          {filteredProducts.map((product) => (
            viewMode === 'grid' ? (
              <div
                key={product.id}
                className="bg-[#0a0a0a] border border-[#1a1a1a] group hover:border-[#FF5A00]/30 transition-all duration-300"
              >
                <div
                  className="relative aspect-square overflow-hidden bg-[#111] cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.comparePrice && (
                    <span className="absolute top-3 left-3 bg-[#FF5A00] text-[#050505] text-[10px] font-bold px-2 py-1">
                      SALE
                    </span>
                  )}
                  {product.quantity <= product.lowStockThreshold && (
                    <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1">
                      LOW STOCK
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-[10px] text-[#A1A09B] uppercase tracking-[0.1em] mb-1">{product.category}</p>
                  <h3
                    className="text-sm font-semibold mb-2 cursor-pointer hover:text-[#FF5A00] transition-colors line-clamp-2"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-[#FF5A00] fill-[#FF5A00]' : 'text-[#2a2a2a]'}`}
                      />
                    ))}
                    <span className="text-[10px] text-[#A1A09B] ml-1">({product.reviewCount})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold">${product.price.toLocaleString()}</span>
                      {product.comparePrice && (
                        <span className="text-xs text-[#A1A09B] line-through ml-2">
                          ${product.comparePrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className="p-2.5 bg-[#FF5A00] text-[#050505] hover:bg-[#ff6b1a] transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                key={product.id}
                className="flex gap-4 bg-[#0a0a0a] border border-[#1a1a1a] group hover:border-[#FF5A00]/30 transition-all duration-300 p-4"
              >
                <div
                  className="w-32 h-32 flex-shrink-0 overflow-hidden bg-[#111] cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-[#A1A09B] uppercase tracking-[0.1em] mb-1">{product.category}</p>
                  <h3
                    className="text-base font-semibold mb-1 cursor-pointer hover:text-[#FF5A00] transition-colors"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    {product.name}
                  </h3>
                  <p className="text-xs text-[#A1A09B] mb-2 line-clamp-2">{product.description}</p>
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-[#FF5A00] fill-[#FF5A00]' : 'text-[#2a2a2a]'}`}
                      />
                    ))}
                    <span className="text-[10px] text-[#A1A09B] ml-1">({product.reviewCount})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold">${product.price.toLocaleString()}</span>
                      {product.comparePrice && (
                        <span className="text-xs text-[#A1A09B] line-through ml-2">
                          ${product.comparePrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className="px-4 py-2 bg-[#FF5A00] text-[#050505] text-xs font-bold uppercase tracking-[0.1em] hover:bg-[#ff6b1a] transition-colors flex items-center gap-2"
                    >
                      <ShoppingCart className="w-3 h-3" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#A1A09B] text-lg mb-2">No products found</p>
            <p className="text-[#A1A09B] text-sm">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </div>
  );
}
