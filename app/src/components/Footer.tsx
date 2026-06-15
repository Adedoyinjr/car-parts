import { Link } from 'react-router-dom';
import { Shield, Facebook, Instagram, Youtube, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-[#1a1a1a]">
      {/* CTA Section */}
      <div className="px-4 lg:px-8 py-20 lg:py-32">
        <div className="max-w-[1440px] mx-auto">
          <h2 className="text-5xl lg:text-8xl font-bold tracking-[-0.04em] leading-[0.9] text-[#F5F5F0]">
            NEVER STOP<br />
            <span className="text-[#FF5A00]">MOVING.</span>
          </h2>
          <p className="mt-6 text-[#A1A09B] max-w-md text-sm leading-relaxed">
            Precision-engineered performance parts for those who demand the extraordinary. 
            Every component is tested, proven, and built to dominate.
          </p>
          <Link
            to="/shop"
            className="inline-block mt-8 px-8 py-3 bg-[#FF5A00] text-[#050505] text-xs font-bold uppercase tracking-[0.1em] hover:bg-[#ff6b1a] transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </div>

      {/* Links Grid */}
      <div className="border-t border-[#1a1a1a] px-4 lg:px-8 py-12">
        <div className="max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-[#FF5A00]" />
              <span className="font-bold tracking-tight">TURBINE</span>
            </Link>
            <p className="text-xs text-[#A1A09B] leading-relaxed max-w-xs">
              Your one-stop shop for high-quality auto parts and accessories. 
              Engineered for performance, built to last.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="text-[#A1A09B] hover:text-[#FF5A00] transition-colors"><Facebook className="w-4 h-4" /></a>
              <a href="#" className="text-[#A1A09B] hover:text-[#FF5A00] transition-colors"><Instagram className="w-4 h-4" /></a>
              <a href="#" className="text-[#A1A09B] hover:text-[#FF5A00] transition-colors"><Youtube className="w-4 h-4" /></a>
              <a href="#" className="text-[#A1A09B] hover:text-[#FF5A00] transition-colors"><Twitter className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.1em] mb-4">Shop</h4>
            <ul className="space-y-2">
              <li><Link to="/shop" className="text-xs text-[#A1A09B] hover:text-[#F5F5F0] transition-colors">All Products</Link></li>
              <li><Link to="/shop?category=engine-parts" className="text-xs text-[#A1A09B] hover:text-[#F5F5F0] transition-colors">Categories</Link></li>
              <li><Link to="/shop?featured=true" className="text-xs text-[#A1A09B] hover:text-[#F5F5F0] transition-colors">Featured</Link></li>
              <li><Link to="/shop" className="text-xs text-[#A1A09B] hover:text-[#F5F5F0] transition-colors">Special Deals</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.1em] mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><span className="text-xs text-[#A1A09B] hover:text-[#F5F5F0] transition-colors cursor-pointer">Shipping & Delivery</span></li>
              <li><span className="text-xs text-[#A1A09B] hover:text-[#F5F5F0] transition-colors cursor-pointer">Returns & Refunds</span></li>
              <li><span className="text-xs text-[#A1A09B] hover:text-[#F5F5F0] transition-colors cursor-pointer">FAQs</span></li>
              <li><span className="text-xs text-[#A1A09B] hover:text-[#F5F5F0] transition-colors cursor-pointer">Contact Us</span></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.1em] mb-4">Company</h4>
            <ul className="space-y-2">
              <li><span className="text-xs text-[#A1A09B] hover:text-[#F5F5F0] transition-colors cursor-pointer">About Us</span></li>
              <li><span className="text-xs text-[#A1A09B] hover:text-[#F5F5F0] transition-colors cursor-pointer">Careers</span></li>
              <li><span className="text-xs text-[#A1A09B] hover:text-[#F5F5F0] transition-colors cursor-pointer">Privacy Policy</span></li>
              <li><span className="text-xs text-[#A1A09B] hover:text-[#F5F5F0] transition-colors cursor-pointer">Terms & Conditions</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-[#1a1a1a] px-4 lg:px-8 py-4">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[10px] text-[#A1A09B]">
            &copy; 2024 Turbine Auto Parts. All Rights Reserved.
          </p>
          <div className="flex gap-4">
            <span className="text-[10px] text-[#A1A09B]">VISA</span>
            <span className="text-[10px] text-[#A1A09B]">Mastercard</span>
            <span className="text-[10px] text-[#A1A09B]">PayPal</span>
            <span className="text-[10px] text-[#A1A09B]">AMEX</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
