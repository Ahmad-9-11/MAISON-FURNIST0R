import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function UpperNav() {
  const [search, setSearch] = useState('');

  return (
    <div
      className="mx-auto flex h-[42px] max-w-[1600px] w-full items-center justify-between border-b border-[#ccc9c1] bg-[#e9e6e3] px-4 py-2.5 text-[14.22px] text-[#383733] sm:px-6 md:px-8 lg:px-12 xl:px-16"
      style={{ fontSize: '14.22px' }}
    >
      <p className="hidden text-[#383733] sm:block">Free shipping on orders above 150€</p>
      <div className="flex w-full max-w-[614px] items-center justify-end gap-1 pr-0 sm:pr-3">
        <ul className="flex w-full list-none items-center justify-end gap-[14px]">
          <li><Link to="/warranty" className="text-[#111] hover:text-[#cf5600]">Warranty</Link></li>
          <li><Link to="/shipping" className="text-[#111] hover:text-[#cf5600]">Shipping</Link></li>
          <li><Link to="/wishlist" className="border-r-4 border-[#e2deda] pr-2 text-[#111] hover:text-[#cf5600]">Wishlist</Link></li>
          {/* <li><Link to="/signup" className="border-r-4 border-[#e2deda] pr-2 text-[#111] hover:text-[#cf5600]">Sign up</Link></li>
          <li><Link to="/login" className="text-[#111] hover:text-[#cf5600]">Login</Link></li> */}
        </ul>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search site..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-28 border-none bg-[#e9e6e3] py-1.5 pl-2 pr-3 text-base placeholder:text-[#383733] focus:outline-none"
          />
          <svg className="h-3 w-3 cursor-pointer text-[#111] hover:text-[#cf5600]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="23" y1="23" x2="16.65" y2="16.65" />
          </svg>
        </div>
      </div>
    </div>
  );
}
