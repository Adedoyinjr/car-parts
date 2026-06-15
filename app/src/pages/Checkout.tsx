import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { Check, CreditCard, Truck, Shield } from 'lucide-react';

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');
  const [orderNumber, setOrderNumber] = useState('');
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', zip: '', country: 'USA',
    cardNumber: '', expiry: '', cvv: '', nameOnCard: '',
  });

  const tax = totalPrice * 0.085;
  const shipping = totalPrice > 99 ? 0 : 49.99;
  const total = totalPrice + tax + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = () => {
    const orderNum = `ORD-${Date.now().toString(36).toUpperCase()}`;
    setOrderNumber(orderNum);
    setStep('confirmation');
    clearCart();
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (items.length === 0 && step !== 'confirmation') {
    return <Navigate to="/cart" replace />;
  }

  if (step === 'confirmation') {
    return (
      <div className="pt-32 min-h-[100dvh] px-4 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
          <Check className="w-10 h-10 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-[#A1A09B] mb-2">Thank you for your purchase.</p>
        <p className="text-sm font-semibold mb-6">Order Number: <span className="text-[#FF5A00]">{orderNumber}</span></p>
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 max-w-md w-full mb-8">
          <p className="text-xs text-[#A1A09B] mb-4">A confirmation email has been sent to your email address.</p>
          <div className="flex items-center gap-2 text-xs text-[#A1A09B]">
            <Truck className="w-4 h-4 text-[#FF5A00]" />
            <span>Estimated delivery: 3-5 business days</span>
          </div>
        </div>
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
        <h1 className="text-3xl lg:text-5xl font-bold tracking-[-0.02em] mb-8">CHECKOUT</h1>

        {/* Steps */}
        <div className="flex items-center gap-4 mb-8">
          {['Shipping', 'Payment'].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                (step === 'shipping' && i === 0) || (step === 'payment' && i <= 1)
                  ? 'bg-[#FF5A00] text-[#050505]'
                  : 'bg-[#1a1a1a] text-[#A1A09B]'
              }`}>
                {i + 1}
              </div>
              <span className={`text-xs font-semibold uppercase tracking-[0.1em] ${
                (step === 'shipping' && i === 0) || (step === 'payment' && i <= 1) ? 'text-[#F5F5F0]' : 'text-[#A1A09B]'
              }`}>{s}</span>
              {i === 0 && <div className="w-8 h-px bg-[#1a1a1a]" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            {step === 'shipping' ? (
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6">
                <h2 className="text-sm font-bold uppercase tracking-[0.1em] mb-6">Shipping Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-[#A1A09B] uppercase tracking-[0.1em] mb-1 block">First Name</label>
                    <input name="firstName" value={formData.firstName} onChange={handleInputChange}
                      className="w-full bg-[#1a1a1a] border border-[#2a2a2a] px-4 py-2.5 text-sm text-[#F5F5F0] focus:outline-none focus:border-[#FF5A00]/50" />
                  </div>
                  <div>
                    <label className="text-xs text-[#A1A09B] uppercase tracking-[0.1em] mb-1 block">Last Name</label>
                    <input name="lastName" value={formData.lastName} onChange={handleInputChange}
                      className="w-full bg-[#1a1a1a] border border-[#2a2a2a] px-4 py-2.5 text-sm text-[#F5F5F0] focus:outline-none focus:border-[#FF5A00]/50" />
                  </div>
                  <div>
                    <label className="text-xs text-[#A1A09B] uppercase tracking-[0.1em] mb-1 block">Email</label>
                    <input name="email" type="email" value={formData.email} onChange={handleInputChange}
                      className="w-full bg-[#1a1a1a] border border-[#2a2a2a] px-4 py-2.5 text-sm text-[#F5F5F0] focus:outline-none focus:border-[#FF5A00]/50" />
                  </div>
                  <div>
                    <label className="text-xs text-[#A1A09B] uppercase tracking-[0.1em] mb-1 block">Phone</label>
                    <input name="phone" value={formData.phone} onChange={handleInputChange}
                      className="w-full bg-[#1a1a1a] border border-[#2a2a2a] px-4 py-2.5 text-sm text-[#F5F5F0] focus:outline-none focus:border-[#FF5A00]/50" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs text-[#A1A09B] uppercase tracking-[0.1em] mb-1 block">Address</label>
                    <input name="address" value={formData.address} onChange={handleInputChange}
                      className="w-full bg-[#1a1a1a] border border-[#2a2a2a] px-4 py-2.5 text-sm text-[#F5F5F0] focus:outline-none focus:border-[#FF5A00]/50" />
                  </div>
                  <div>
                    <label className="text-xs text-[#A1A09B] uppercase tracking-[0.1em] mb-1 block">City</label>
                    <input name="city" value={formData.city} onChange={handleInputChange}
                      className="w-full bg-[#1a1a1a] border border-[#2a2a2a] px-4 py-2.5 text-sm text-[#F5F5F0] focus:outline-none focus:border-[#FF5A00]/50" />
                  </div>
                  <div>
                    <label className="text-xs text-[#A1A09B] uppercase tracking-[0.1em] mb-1 block">State</label>
                    <input name="state" value={formData.state} onChange={handleInputChange}
                      className="w-full bg-[#1a1a1a] border border-[#2a2a2a] px-4 py-2.5 text-sm text-[#F5F5F0] focus:outline-none focus:border-[#FF5A00]/50" />
                  </div>
                  <div>
                    <label className="text-xs text-[#A1A09B] uppercase tracking-[0.1em] mb-1 block">ZIP Code</label>
                    <input name="zip" value={formData.zip} onChange={handleInputChange}
                      className="w-full bg-[#1a1a1a] border border-[#2a2a2a] px-4 py-2.5 text-sm text-[#F5F5F0] focus:outline-none focus:border-[#FF5A00]/50" />
                  </div>
                  <div>
                    <label className="text-xs text-[#A1A09B] uppercase tracking-[0.1em] mb-1 block">Country</label>
                    <select name="country" value={formData.country} onChange={handleInputChange}
                      className="w-full bg-[#1a1a1a] border border-[#2a2a2a] px-4 py-2.5 text-sm text-[#F5F5F0] focus:outline-none focus:border-[#FF5A00]/50">
                      <option>USA</option>
                      <option>Canada</option>
                      <option>UK</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={() => setStep('payment')}
                  className="mt-6 w-full py-3.5 bg-[#FF5A00] text-[#050505] text-xs font-bold uppercase tracking-[0.1em] hover:bg-[#ff6b1a] transition-colors"
                >
                  CONTINUE TO PAYMENT
                </button>
              </div>
            ) : (
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6">
                <h2 className="text-sm font-bold uppercase tracking-[0.1em] mb-6">Payment Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-[#A1A09B] uppercase tracking-[0.1em] mb-1 block">Name on Card</label>
                    <input name="nameOnCard" value={formData.nameOnCard} onChange={handleInputChange}
                      className="w-full bg-[#1a1a1a] border border-[#2a2a2a] px-4 py-2.5 text-sm text-[#F5F5F0] focus:outline-none focus:border-[#FF5A00]/50" />
                  </div>
                  <div>
                    <label className="text-xs text-[#A1A09B] uppercase tracking-[0.1em] mb-1 block">Card Number</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A09B]" />
                      <input name="cardNumber" value={formData.cardNumber} onChange={handleInputChange}
                        placeholder="4242 4242 4242 4242"
                        className="w-full bg-[#1a1a1a] border border-[#2a2a2a] pl-10 pr-4 py-2.5 text-sm text-[#F5F5F0] focus:outline-none focus:border-[#FF5A00]/50" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-[#A1A09B] uppercase tracking-[0.1em] mb-1 block">Expiry</label>
                      <input name="expiry" value={formData.expiry} onChange={handleInputChange} placeholder="MM/YY"
                        className="w-full bg-[#1a1a1a] border border-[#2a2a2a] px-4 py-2.5 text-sm text-[#F5F5F0] focus:outline-none focus:border-[#FF5A00]/50" />
                    </div>
                    <div>
                      <label className="text-xs text-[#A1A09B] uppercase tracking-[0.1em] mb-1 block">CVV</label>
                      <input name="cvv" value={formData.cvv} onChange={handleInputChange} placeholder="123"
                        className="w-full bg-[#1a1a1a] border border-[#2a2a2a] px-4 py-2.5 text-sm text-[#F5F5F0] focus:outline-none focus:border-[#FF5A00]/50" />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStep('shipping')}
                    className="flex-1 py-3.5 border border-[#1a1a1a] text-xs font-bold uppercase tracking-[0.1em] text-[#A1A09B] hover:border-[#FF5A00] transition-colors"
                  >
                    BACK
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    className="flex-1 py-3.5 bg-[#FF5A00] text-[#050505] text-xs font-bold uppercase tracking-[0.1em] hover:bg-[#ff6b1a] transition-colors"
                  >
                    PLACE ORDER
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 sticky top-24">
              <h2 className="text-sm font-bold uppercase tracking-[0.1em] mb-6">Order Summary</h2>
              <div className="max-h-60 overflow-y-auto space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <img src={item.product.image} alt={item.product.name} className="w-12 h-12 object-cover bg-[#111]" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">{item.product.name}</p>
                      <p className="text-[10px] text-[#A1A09B]">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-xs font-semibold">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[#A1A09B]">Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#A1A09B]">Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#A1A09B]">Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
              </div>
              <div className="border-t border-[#1a1a1a] pt-4">
                <div className="flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="text-xl font-bold text-[#FF5A00]">${total.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 text-[10px] text-[#A1A09B]">
                <Shield className="w-3 h-3" />
                <span>Secure SSL Encrypted Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
