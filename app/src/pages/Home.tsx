import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { products, categories } from '@/data/mockData';
import {
  ArrowRight, ChevronLeft, ChevronRight, ShoppingCart,
  Truck, RotateCcw, Shield, Headphones, Star,
  Cog, CircleDot, ArrowDownUp, Wind, AirVent, Gauge, Cpu, Disc, Car, Armchair
} from 'lucide-react';
import gsap from 'gsap';

const iconMap: Record<string, React.ElementType> = {
  Cog, CircleDot, ArrowDownUp, Wind, AirVent, Gauge, Cpu, Disc, Car, Armchair
};

export default function Home() {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);

  const featuredProducts = products.filter(p => p.featured).slice(0, 6);

  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current.querySelectorAll('.hero-anim'),
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out', delay: 0.3 }
      );
    }
  }, []);

  const scrollFeatured = (dir: 'left' | 'right') => {
    if (featuredRef.current) {
      featuredRef.current.scrollBy({ left: dir === 'left' ? -340 : 340, behavior: 'smooth' });
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[100dvh] flex items-end overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/hero-car.jpg"
            alt="Performance Vehicle"
            className="w-full h-full object-cover object-center opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/80 via-transparent to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full px-4 lg:px-8 pb-16 lg:pb-24 pt-32">
          <div className="max-w-[1440px] mx-auto">
            <div className="max-w-2xl">
              <p className="hero-anim text-[#FF5A00] text-xs font-bold uppercase tracking-[0.2em] mb-4">
                Precision Parts for Performance Vehicles
              </p>
              <h1 className="hero-anim text-5xl sm:text-6xl lg:text-[120px] font-bold tracking-[-0.04em] leading-[0.9]">
                UNLEASH<br />
                <span className="text-[#FF5A00]">VELOCITY.</span>
              </h1>
              <p className="hero-anim mt-6 text-[#A1A09B] text-sm max-w-md leading-relaxed">
                Premium performance parts engineered for the world's most demanding driving machines. 
                From track day to daily drive, we've got you covered.
              </p>
              <div className="hero-anim flex flex-wrap gap-4 mt-8">
                <Link
                  to="/shop"
                  className="px-8 py-3.5 bg-[#FF5A00] text-[#050505] text-xs font-bold uppercase tracking-[0.1em] hover:bg-[#ff6b1a] transition-all duration-300"
                >
                  ENTER THE GARAGE
                </Link>
                <Link
                  to="/shop"
                  className="px-8 py-3.5 border border-[#F5F5F0]/20 text-[#F5F5F0] text-xs font-bold uppercase tracking-[0.1em] hover:border-[#FF5A00] hover:text-[#FF5A00] transition-all duration-300"
                >
                  VIEW CATALOGUE
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-[#0a0a0a] border-y border-[#1a1a1a]">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
            {[
              { icon: Truck, title: 'FREE SHIPPING', desc: 'On orders over $99' },
              { icon: RotateCcw, title: 'EASY RETURNS', desc: '30-day return policy' },
              { icon: Shield, title: 'SECURE PAYMENT', desc: '100% secure checkout' },
              { icon: Headphones, title: '24/7 SUPPORT', desc: "We're here to help" },
            ].map((badge) => (
              <div key={badge.title} className="flex items-center gap-3">
                <badge.icon className="w-5 h-5 text-[#FF5A00] flex-shrink-0" />
                <div>
                  <p className="text-[10px] font-bold tracking-[0.1em]">{badge.title}</p>
                  <p className="text-[10px] text-[#A1A09B]">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vehicle Search */}
      <section className="px-4 lg:px-8 py-16 lg:py-24">
        <div className="max-w-[1440px] mx-auto">
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 lg:p-10">
            <h3 className="text-sm font-bold uppercase tracking-[0.1em] mb-6">
              FIND THE RIGHT PART FOR YOUR VEHICLE
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <select className="bg-[#1a1a1a] border border-[#2a2a2a] rounded px-4 py-3 text-sm text-[#F5F5F0] focus:outline-none focus:border-[#FF5A00]/50">
                <option>Select Year</option>
                <option>2024</option>
                <option>2023</option>
                <option>2022</option>
                <option>2021</option>
                <option>2020</option>
              </select>
              <select className="bg-[#1a1a1a] border border-[#2a2a2a] rounded px-4 py-3 text-sm text-[#F5F5F0] focus:outline-none focus:border-[#FF5A00]/50">
                <option>Select Make</option>
                <option>BMW</option>
                <option>Audi</option>
                <option>Mercedes</option>
                <option>Porsche</option>
                <option>Toyota</option>
              </select>
              <select className="bg-[#1a1a1a] border border-[#2a2a2a] rounded px-4 py-3 text-sm text-[#F5F5F0] focus:outline-none focus:border-[#FF5A00]/50">
                <option>Select Model</option>
                <option>M4 (G82)</option>
                <option>M3 (G80)</option>
                <option>M440i</option>
                <option>RS3</option>
                <option>Supra</option>
              </select>
              <select className="bg-[#1a1a1a] border border-[#2a2a2a] rounded px-4 py-3 text-sm text-[#F5F5F0] focus:outline-none focus:border-[#FF5A00]/50">
                <option>Select Part</option>
                <option>Exhaust Systems</option>
                <option>Brake Kits</option>
                <option>Suspension</option>
                <option>Intake Systems</option>
                <option>Turbochargers</option>
              </select>
              <button className="bg-[#FF5A00] text-[#050505] text-xs font-bold uppercase tracking-[0.1em] py-3 px-6 hover:bg-[#ff6b1a] transition-colors">
                SEARCH
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="px-4 lg:px-8 pb-16 lg:pb-24">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl lg:text-4xl font-medium tracking-[-0.02em]">
              BROWSE BY CATEGORY
            </h2>
            <Link
              to="/shop"
              className="text-xs text-[#FF5A00] font-semibold uppercase tracking-[0.1em] hover:underline flex items-center gap-1"
            >
              View All Categories <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.slice(0, 10).map((cat) => {
              const Icon = iconMap[cat.icon] || Cog;
              return (
                <button
                  key={cat.id}
                  onClick={() => navigate(`/shop?category=${cat.slug}`)}
                  className="group bg-[#0a0a0a] border border-[#1a1a1a] p-6 flex flex-col items-center gap-3 hover:border-[#FF5A00]/50 transition-all duration-300"
                >
                  <Icon className="w-8 h-8 text-[#A1A09B] group-hover:text-[#FF5A00] transition-colors" />
                  <span className="text-xs font-semibold text-center group-hover:text-[#F5F5F0] transition-colors">
                    {cat.name}
                  </span>
                  <span className="text-[10px] text-[#A1A09B]">{cat.productCount} products</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-4 lg:px-8 pb-16 lg:pb-24">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl lg:text-4xl font-medium tracking-[-0.02em]">
              FEATURED PRODUCTS
            </h2>
            <div className="flex items-center gap-2">
              <Link
                to="/shop"
                className="text-xs text-[#FF5A00] font-semibold uppercase tracking-[0.1em] hover:underline flex items-center gap-1 mr-4"
              >
                View All Products <ArrowRight className="w-3 h-3" />
              </Link>
              <button
                onClick={() => scrollFeatured('left')}
                className="p-2 border border-[#1a1a1a] hover:border-[#FF5A00] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollFeatured('right')}
                className="p-2 border border-[#1a1a1a] hover:border-[#FF5A00] transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div
            ref={featuredRef}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none' }}
          >
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="min-w-[280px] lg:min-w-[320px] snap-start bg-[#0a0a0a] border border-[#1a1a1a] group hover:border-[#FF5A00]/30 transition-all duration-300"
              >
                <div className="relative aspect-square overflow-hidden bg-[#111]">
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
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="px-4 lg:px-8 pb-16 lg:pb-24">
        <div className="max-w-[1440px] mx-auto">
          <div className="relative overflow-hidden bg-[#0a0a0a] border border-[#1a1a1a] p-8 lg:p-16">
            <div className="absolute inset-0 opacity-10">
              <img src="/hero-car.jpg" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div>
                <h3 className="text-2xl lg:text-4xl font-bold tracking-[-0.02em] mb-2">
                  GET <span className="text-[#FF5A00]">10% OFF</span>
                </h3>
                <p className="text-sm text-[#A1A09B]">On your first order. Join our newsletter for the latest deals & new products.</p>
              </div>
              <div className="flex w-full lg:w-auto">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 lg:w-80 bg-[#1a1a1a] border border-[#2a2a2a] px-4 py-3 text-sm text-[#F5F5F0] placeholder-[#A1A09B] focus:outline-none focus:border-[#FF5A00]/50"
                />
                <button className="bg-[#FF5A00] text-[#050505] text-xs font-bold uppercase tracking-[0.1em] px-6 py-3 hover:bg-[#ff6b1a] transition-colors">
                  SUBSCRIBE
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 lg:px-8 pb-16 lg:pb-24">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'EXPERT QUALITY', desc: 'Trusted by professionals and car enthusiasts worldwide.' },
              { icon: Cog, title: 'PERFECT FIT', desc: 'Parts that fit perfectly. Guaranteed compatibility.' },
              { icon: Star, title: 'PREMIUM BRANDS', desc: 'Top brands. Proven performance. No compromises.' },
              { icon: Truck, title: 'FAST DELIVERY', desc: 'Quick shipping right to your door. Track every order.' },
            ].map((feat) => (
              <div key={feat.title} className="bg-[#0a0a0a] border border-[#1a1a1a] p-6">
                <feat.icon className="w-8 h-8 text-[#FF5A00] mb-4" />
                <h4 className="text-xs font-bold tracking-[0.1em] mb-2">{feat.title}</h4>
                <p className="text-xs text-[#A1A09B] leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
