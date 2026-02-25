import { useLocation } from 'react-router-dom';
import UpperNav from './UpperNav';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from '../cart/CartDrawer';
import MusicPlayer from '../MusicPlayer';

export default function Layout({ children }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-[#e9e6e3]">
      {!isAdmin && (
        <div className="max-w-[1600px] mx-auto w-full">
          <UpperNav />
          <Navbar />
        </div>
      )}
      <main className={isAdmin ? '' : 'flex flex-col'}>{children}</main>
      {!isAdmin && <Footer />}
      <CartDrawer />
      <MusicPlayer />
    </div>
  );
}
