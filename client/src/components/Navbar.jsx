import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LuSquareMenu } from 'react-icons/lu';
import { CgProfile } from 'react-icons/cg';
import { MdOutlineAddShoppingCart } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { GlobalState } from '../GlobalState';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { cart = [] } = useCart() || {};

  const state = useContext(GlobalState);
  const navigate = useNavigate();
  const location = useLocation();
  
  const userAPI = state?.UserAPI || {};
  const [token, setToken] = state?.token || [false, () => {}];
  
  const [isLogged, setIsLogged] = userAPI.isLogged || [false, () => {}];
  const [userCart] = userAPI.cart || [[], () => {}];

  const toggleMenu = () => setMenuOpen(prev => !prev);
  const toggleDropdown = () => setDropdownOpen(prev => !prev);

  const handleLogout = () => {
    setToken(false);
    setIsLogged(false);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('firstLogin');
    navigate('/');
  };

  const handleAuth = () => {
    if (isLogged) {
      handleLogout();
    } else {
      navigate('/login');
    }
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      const currentParams = new URLSearchParams(location.search);
      currentParams.set('search', searchTerm.trim());
      navigate(`/products?${currentParams.toString()}`);
      setMenuOpen(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit(e);
    }
  };

  const cartCount = userCart.length > 0 ? userCart.length : cart.length;

  return (
    <header className="fixed top-0 left-0 right-0 bg-[#0a0a0a] text-[#f3f4f6] border-b border-gray-700 shadow-md z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 h-[70px]">
        {/* Single row container - no flex-wrap */}
        <div className="flex items-center justify-between h-full gap-2 sm:gap-4">
          
          {/* Left Section: Menu Toggle + Logo */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMenu}
              className="text-2xl sm:hidden focus:outline-none hover:text-blue-400 transition"
              aria-label="Toggle mobile menu"
              aria-expanded={menuOpen}
            >
              <LuSquareMenu />
            </button>
            
            {/* Desktop Dropdown Toggle */}
            <button
              onClick={toggleDropdown}
              className="text-2xl hidden sm:inline text-blue-500 focus:outline-none hover:text-blue-400 transition"
              aria-label="Toggle dropdown menu"
              aria-expanded={dropdownOpen}
            >
              <LuSquareMenu />
            </button>
            
            {/* Logo */}
            <Link to="/" className="text-xl sm:text-2xl font-bold tracking-wide select-none whitespace-nowrap">
              Strength<span className="text-blue-500">Labz</span>
            </Link>
          </div>

          {/* Middle Section: Search Bar (Desktop Only) */}
          <div className="hidden sm:flex flex-1 mx-4 lg:mx-6">
            <form onSubmit={handleSearchSubmit} className="w-full">
              <input
                type="search"
                placeholder="Search Products, Categories, Brands and More..."
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyPress={handleSearchKeyPress}
                className="w-full bg-[#1a1a1a] border border-white text-white placeholder-gray-400 px-4 py-2 rounded-full outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
              />
            </form>
          </div>

          {/* Right Section: Auth + Cart */}
          <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
            {/* Auth Button */}
            <button
              onClick={handleAuth}
              className="flex items-center gap-1 hover:text-blue-400 transition select-none"
            >
              <CgProfile className="text-xl sm:text-2xl text-blue-500" />
              <span className="hidden md:inline text-sm lg:text-base">{isLogged ? 'Logout' : 'Login'}</span>
            </button>

            {/* Cart Button */}
            <div className="relative">
              <Link to="/cart" className="flex items-center gap-1 hover:text-blue-400 transition select-none">
                <MdOutlineAddShoppingCart className="text-xl sm:text-2xl text-blue-500" />
                <span className="hidden md:inline text-sm lg:text-base">Cart</span>
              </Link>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 sm:-right-3 bg-red-600 text-white text-[10px] sm:text-xs rounded-full w-5 h-5 sm:w-auto sm:h-auto sm:px-2 sm:py-0.5 flex items-center justify-center select-none font-semibold">
                  {cartCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Collapsible Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="sm:hidden px-4 pb-4 space-y-2 bg-[#111111] text-[#f3f4f6] z-40"
          >
            {/* Mobile Search Bar */}
            <form onSubmit={handleSearchSubmit} className="mb-4 pt-2">
              <input
                type="search"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyPress={handleSearchKeyPress}
                className="w-full bg-[#1a1a1a] border border-white text-white placeholder-gray-400 px-4 py-2 rounded-full outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
              />
            </form>
            
            <Link to="/" onClick={() => setMenuOpen(false)} className="block py-2 hover:text-blue-400 transition">Home</Link>
            <Link to="/cart" onClick={() => setMenuOpen(false)} className="block py-2 hover:text-blue-400 transition">Cart</Link>
            <button onClick={handleAuth} className="w-full text-left py-2 hover:text-blue-400 transition">
              {isLogged ? 'Logout' : 'Login'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Dropdown Menu */}
      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="hidden sm:grid grid-cols-3 gap-6 bg-[#1a1a1a] text-[#f3f4f6] p-6 shadow-lg z-40"
          >
            <div>
              <h3 className="font-semibold mb-3 select-none">Account</h3>
              <button onClick={handleAuth} className="block py-1 hover:text-blue-400 transition">
                {isLogged ? 'Logout' : 'Login'}
              </button>
              {!isLogged && <Link to="/register" className="block py-1 hover:text-blue-400 transition">Register</Link>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {['My Account', 'My Orders', 'Authenticity', 'Products', 'Offers', 'Support'].map(item => (
                <div key={item} tabIndex={0} className="bg-[#2a2a2a] rounded-md text-center py-2 px-3 hover:bg-blue-600 transition cursor-pointer select-none">
                  {item}
                </div>
              ))}
            </div>

            <div>
              <h3 className="font-semibold mb-3 select-none">Explore</h3>
              {['Categories','Brands','Health Food and Drinks','Sports Nutrition','Vitamins and Supplements','Workout Equipment','Tshirt'].map(item => (
                <div key={item} tabIndex={0} className="py-1 hover:text-blue-400 cursor-pointer transition select-none">
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;