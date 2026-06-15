import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PublicLayout() {
  return (
    <div className="min-h-[100dvh] bg-[#050505] text-[#F5F5F0]">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
