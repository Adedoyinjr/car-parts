import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function Cart() {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const tax = totalPrice * 0.085;
  const shipping = totalPrice > 99 ? 0 : 49.99;
  const total = totalPrice + tax + shipping;

  if (items.length === 0) {
    return (
      <div className="pt-32 min-h-[100dvh] flex flex-col items-center justify-center px-4">
        <ShoppingBag className="w-16 h-16 text-[#1a1a1a] mb-4" />
        <h2 className="text-2xl font-bold mb-2">Your Cart is Empty</h2>
        <p className="text-sm text-[#A1A09B] mb-6">Looks like you haven't added anything yet.</p>
        <button
          onClick={() => navigate('/shop')}
          className="px-8 py-3 bg-[#FF5A00] text-[#050505] text-xs font-bold uppercase tracking-[0.1em] hover:bg-[#ff6b1a] transition-colors"
        >
          CONTINUE SHOPPING
        </button>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-[100dvh] px-4 lg:px-8 pb-16">
      <div className="max-w-[1440px] mx-auto">
        <h1 className="text-3xl lg:text-5xl font-bold tracking-[-0.02em] mb-8">SHOPPING CART</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-[#1a1a1a]">
              <span className="text-xs text-[#A1A09B] uppercase tracking-[0.1em]">{items.length} items</span>
              <button
                onClick={clearCart}
                className="text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                Clear Cart
              </button>
            </div>

            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-4 bg-[#0a0a0a] border border-[#1a1a1a] p-4"
              >
                <div
                  className="w-24 h-24 flex-shrink-0 overflow-hidden bg-[#111] cursor-pointer"
                  onClick={() => navigate(`/product/${item.product.id}`)}
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[10px] text-[#A1A09B] uppercase tracking-[0.1em]">{item.product.category}</p>
                      <h3
                        className="text-sm font-semibold cursor-pointer hover:text-[#FF5A00] transition-colors"
                        onClick={() => navigate(`/product/${item.product.id}`)}
                      >
                        {item.product.name}
                      </h3>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1.5 text-[#A1A09B] hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-[#1a1a1a]">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="px-3 py-1.5 text-sm hover:bg-[#1a1a1a] transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 py-1.5 text-sm font-semibold min-w-[40px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="px-3 py-1.5 text-sm hover:bg-[#1a1a1a] transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-lg font-bold">
                      ${(item.product.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 sticky top-24">
              <h2 className="text-sm font-bold uppercase tracking-[0.1em] mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-[#A1A09B]">Subtotal</span>
                  <span className="font-semibold">${totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#A1A09B]">Tax (8.5%)</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#A1A09B]">Shipping</span>
                  <span className="font-semibold">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                {shipping === 0 && (
                  <p className="text-[10px] text-green-400">You qualify for free shipping!</p>
                )}
              </div>

              <div className="border-t border-[#1a1a1a] pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-bold text-[#FF5A00]">
                    ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-3.5 bg-[#FF5A00] text-[#050505] text-xs font-bold uppercase tracking-[0.1em] hover:bg-[#ff6b1a] transition-colors flex items-center justify-center gap-2"
              >
                PROCEED TO CHECKOUT
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('/shop')}
                className="w-full mt-3 py-3 border border-[#1a1a1a] text-xs font-bold uppercase tracking-[0.1em] text-[#A1A09B] hover:border-[#FF5A00] hover:text-[#FF5A00] transition-colors"
              >
                CONTINUE SHOPPING
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
