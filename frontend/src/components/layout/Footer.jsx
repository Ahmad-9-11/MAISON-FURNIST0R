import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <div className="white-container">
      <footer className="container-custom container-white flex flex-col gap-10 py-10 md:flex-row md:justify-between md:items-start md:py-16">
        <div className="company max-w-[410px] w-full">
          <p className="footer-heading font-Fraunces text-[40px] font-light text-[#111] mb-5 leading-tight">
            Handcrafted in <br /> København
          </p>
          <p className="footer-address text-base leading-normal text-[#383733] mt-1">
            Pilestæde 45, 1st Floor,<br />1112 Copenhagen, Denmark
          </p>
          <div className="footer-images mt-8 flex gap-4">
            <img
              className="footer-image h-10 w-auto"
              src="https://sites.kaliumtheme.com/elementor/furniture/wp-content/uploads/2025/05/fsc-logo.svg"
              alt="FSC"
            />
            <img
              className="footer-image h-10 w-auto"
              src="https://sites.kaliumtheme.com/elementor/furniture/wp-content/uploads/2025/07/nordic-swan.svg"
              alt="Nordic Swan"
            />
          </div>
        </div>
        <div className="footer-container grid w-full grid-cols-2 gap-6 sm:grid-cols-4 md:gap-8">
          <div className="footer-col">
            <p className="footer-title font-Fraunces text-[22px] font-light text-[#111] mb-5">Collections</p>
            <ul className="list-none p-0 m-0">
              <li className="mb-2"><Link to="/products" className="text-base text-[#383733] hover:text-[#cf5600]">Products</Link></li>
              <li className="mb-2"><Link to="/products?new=1" className="text-base text-[#383733] hover:text-[#cf5600]">New Arrivals</Link></li>
              <li className="mb-2"><Link to="/products" className="text-base text-[#383733] hover:text-[#cf5600]">Categories</Link></li>
              <li className="mb-2"><Link to="/products" className="text-base text-[#383733] hover:text-[#cf5600]">Bestseller Collection</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <p className="footer-title font-Fraunces text-[22px] font-light text-[#111] mb-5">Customer Care</p>
            <ul className="list-none p-0 m-0">
              <li className="mb-2"><Link to="/shipping" className="text-base text-[#383733] hover:text-[#cf5600]">Shipping</Link></li>
              <li className="mb-2"><Link to="/returns" className="text-base text-[#383733] hover:text-[#cf5600]">Refunds & Returns</Link></li>
              <li className="mb-2"><Link to="/warranty" className="text-base text-[#383733] hover:text-[#cf5600]">Warranty</Link></li>
              <li className="mb-2"><Link to="/terms" className="text-base text-[#383733] hover:text-[#cf5600]">Terms of Service</Link></li>
              <li className="mb-2"><Link to="/privacy" className="text-base text-[#383733] hover:text-[#cf5600]">Privacy Policy</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <p className="footer-title font-Fraunces text-[22px] font-light text-[#111] mb-5">About Us</p>
            <ul className="list-none p-0 m-0">
              <li className="mb-2"><Link to="/about" className="text-base text-[#383733] hover:text-[#cf5600]">Our Story</Link></li>
              <li className="mb-2"><Link to="/journal" className="text-base text-[#383733] hover:text-[#cf5600]">Journal</Link></li>
              <li className="mb-2"><Link to="/contact" className="text-base text-[#383733] hover:text-[#cf5600]">Contact</Link></li>
              <li className="mb-2"><Link to="/sustainability" className="text-base text-[#383733] hover:text-[#cf5600]">Sustainability</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <p className="footer-title font-Fraunces text-[22px] font-light text-[#111] mb-5">Stay Connected</p>
            <p className="social-details text-base leading-normal text-[#383733]">
              Get exclusive updates, design tips, and previews of our newest collections.
            </p>
            <div className="social-icons mt-6 flex gap-6">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-[#111] hover:text-[#cf5600]" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.333 3.644a.25.25 0 1 1 0-.5m0 .5a.25.25 0 1 0 0-.5" />
                  <path d="M.858 3.431A2.573 2.573 0 0 1 3.431.858h6.862a2.573 2.573 0 0 1 2.573 2.573v6.862a2.573 2.573 0 0 1-2.573 2.573H3.43a2.573 2.573 0 0 1-2.573-2.573V3.43Z" />
                  <path d="M4.312 6.862a2.55 2.55 0 1 0 5.1 0a2.55 2.55 0 1 0-5.1 0" />
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-[#111] hover:text-[#cf5600]" aria-label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669c1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
      <div className="copyright flex items-center justify-between border-t border-[#eee] bg-white px-16 py-8 text-center text-base text-[#383733]">
        <p>Maison ApS — CVR/VAT DK42168912 — Copenhagen, Denmark</p>
        <p>© {new Date().getFullYear()} Maison</p>
      </div>
    </div>
  );
}
