import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { products } from '@/data/mockData';
import { ShoppingCart, Star, ArrowLeft, Check, Shield, Truck, RotateCcw } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'compatibility'>('description');
  const [added, setAdded] = useState(false);

  const product = products.find(p => p.id === id);
  const relatedProducts = products.filter(p => p.categoryId === product?.categoryId && p.id !== id).slice(0, 4);

  if (!product) {
    return (
      <div className="pt-32 text-center">
        <p className="text-[#A1A09B]">Product not found</p>
        <button onClick={() => navigate('/shop')} className="mt-4 text-[#FF5A00] text-sm">
          Back to Shop
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="pt-20 min-h-[100dvh]">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate('/shop')}
          className="flex items-center gap-2 text-xs text-[#A1A09B] hover:text-[#FF5A00] transition-colors mb-6"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to Shop
        </button>

        {/* Product Main */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-16">
          {/* Image */}
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full aspect-square object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <p className="text-[10px] text-[#FF5A00] font-bold uppercase tracking-[0.2em] mb-2">
              {product.category}
            </p>
            <h1 className="text-2xl lg:text-4xl font-bold tracking-[-0.02em] mb-2">
              {product.name}
            </h1>
            <p className="text-xs text-[#A1A09B] mb-4">SKU: {product.sku}</p>

            <div className="flex items-center gap-2 mb-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-[#FF5A00] fill-[#FF5A00]' : 'text-[#2a2a2a]'}`}
                />
              ))}
              <span className="text-sm text-[#A1A09B]">{product.rating} ({product.reviewCount} reviews)</span>
            </div>

            <div className="mb-6">
              <span className="text-3xl font-bold">${product.price.toLocaleString()}</span>
              {product.comparePrice && (
                <span className="text-lg text-[#A1A09B] line-through ml-3">
                  ${product.comparePrice.toLocaleString()}
                </span>
              )}
            </div>

            <p className="text-sm text-[#A1A09B] leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Stock Status */}
            <div className="flex items-center gap-4 mb-6">
              <div className={`flex items-center gap-1.5 text-xs ${product.quantity > product.lowStockThreshold ? 'text-green-400' : product.quantity > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                <div className={`w-2 h-2 rounded-full ${product.quantity > product.lowStockThreshold ? 'bg-green-400' : product.quantity > 0 ? 'bg-yellow-400' : 'bg-red-400'}`} />
                {product.quantity > product.lowStockThreshold ? 'In Stock' : product.quantity > 0 ? `Only ${product.quantity} left` : 'Out of Stock'}
              </div>
              <span className="text-xs text-[#A1A09B]">Supplier: {product.supplier}</span>
            </div>

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-[#1a1a1a]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 text-sm hover:bg-[#1a1a1a] transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-3 text-sm font-semibold min-w-[50px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                  className="px-4 py-3 text-sm hover:bg-[#1a1a1a] transition-colors"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={product.quantity === 0}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-xs font-bold uppercase tracking-[0.1em] transition-all duration-300 ${
                  added
                    ? 'bg-green-500 text-white'
                    : 'bg-[#FF5A00] text-[#050505] hover:bg-[#ff6b1a] disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                {added ? (
                  <><Check className="w-4 h-4" /> ADDED</>
                ) : (
                  <><ShoppingCart className="w-4 h-4" /> ADD TO CART</>
                )}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Truck, label: 'Free Shipping', desc: 'Orders $99+' },
                { icon: Shield, label: 'Warranty', desc: '2 Years' },
                { icon: RotateCcw, label: 'Returns', desc: '30 Days' },
              ].map((badge) => (
                <div key={badge.label} className="bg-[#0a0a0a] border border-[#1a1a1a] p-3 text-center">
                  <badge.icon className="w-5 h-5 text-[#FF5A00] mx-auto mb-1" />
                  <p className="text-[10px] font-bold">{badge.label}</p>
                  <p className="text-[9px] text-[#A1A09B]">{badge.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-16">
          <div className="flex border-b border-[#1a1a1a] mb-6">
            {(['description', 'specs', 'compatibility'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-xs font-bold uppercase tracking-[0.1em] transition-colors border-b-2 ${
                  activeTab === tab
                    ? 'text-[#FF5A00] border-[#FF5A00]'
                    : 'text-[#A1A09B] border-transparent hover:text-[#F5F5F0]'
                }`}
              >
                {tab === 'description' ? 'Description' : tab === 'specs' ? 'Specifications' : 'Vehicle Compatibility'}
              </button>
            ))}
          </div>

          <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6">
            {activeTab === 'description' && (
              <p className="text-sm text-[#A1A09B] leading-relaxed">{product.description}</p>
            )}
            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-[#1a1a1a]">
                    <span className="text-xs text-[#A1A09B] uppercase">{key}</span>
                    <span className="text-sm font-semibold">{value}</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'compatibility' && (
              <div className="space-y-3">
                {product.compatibility.map((compat, i) => (
                  <div key={i} className="flex items-center gap-4 py-2 border-b border-[#1a1a1a]">
                    <span className="text-sm font-semibold w-32">{compat.make}</span>
                    <span className="text-sm text-[#A1A09B] w-32">{compat.model}</span>
                    <span className="text-sm text-[#A1A09B]">
                      {compat.yearStart}-{compat.yearEnd === 2024 ? 'Present' : compat.yearEnd}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-medium tracking-[-0.02em] mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map((rp) => (
                <div
                  key={rp.id}
                  className="bg-[#0a0a0a] border border-[#1a1a1a] group hover:border-[#FF5A00]/30 transition-all duration-300 cursor-pointer"
                  onClick={() => { navigate(`/product/${rp.id}`); window.scrollTo(0, 0); }}
                >
                  <div className="aspect-square overflow-hidden bg-[#111]">
                    <img
                      src={rp.image}
                      alt={rp.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] text-[#A1A09B] uppercase tracking-[0.1em] mb-1">{rp.category}</p>
                    <h3 className="text-sm font-semibold mb-2 line-clamp-2 group-hover:text-[#FF5A00] transition-colors">
                      {rp.name}
                    </h3>
                    <span className="text-lg font-bold">${rp.price.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
