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
  
  // Fix: Properly access UserAPI and token from GlobalState
  const userAPI = state?.UserAPI || {};
  const [token, setToken] = state?.token || [false, () => {}];
  
  // Fix: Properly destructure isLogged from UserAPI
  const [isLogged, setIsLogged] = userAPI.isLogged || [false, () => {}];
  const [userCart] = userAPI.cart || [[], () => {}];

  const toggleMenu = () => setMenuOpen(prev => !prev);
  const toggleDropdown = () => setDropdownOpen(prev => !prev);

  // Fix: Create logout function since it doesn't exist in GlobalState
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

  // Search functionality
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Get current query parameters
      const currentParams = new URLSearchParams(location.search);
      
      // Update search parameter
      currentParams.set('search', searchTerm.trim());
      
      // Navigate to products page with search query
      navigate(`/products?${currentParams.toString()}`);
      
      // Close mobile menu if open
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

  // Use userCart from UserAPI if available, otherwise fall back to cart from CartContext
  const cartCount = userCart.length > 0 ? userCart.length : cart.length;

  return (
    <header className="fixed top-0 left-0 right-0 bg-[#0a0a0a] text-[#f3f4f6] border-b border-gray-700 shadow-md z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between flex-wrap h-[70px]">
        {/* Left: Logo and Menu Toggles */}
        <div className="flex items-center gap-7 w-full sm:w-auto justify-between">
          <button
            onClick={toggleMenu}
            className="text-3xl sm:hidden focus:outline-none"
            aria-label="Toggle mobile menu"
            aria-expanded={menuOpen}
          >
            <LuSquareMenu />
          </button>
          <button
            onClick={toggleDropdown}
            className="text-3xl hidden sm:inline text-blue-500 focus:outline-none"
            aria-label="Toggle dropdown menu"
            aria-expanded={dropdownOpen}
          >
            <LuSquareMenu />
          </button>
          <Link to="/" className="text-2xl font-bold tracking-wide select-none">
            Strength<span className="text-blue-500">Labz</span>
          </Link>
        </div>

        {/* Middle: Search Bar */}
        <div className="hidden sm:flex flex-1 mx-0 sm:mx-6 mt-4 sm:mt-0">
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

        {/* Right: Auth and Cart */}
        <div className="flex items-center gap-10 text-lg mt-4 sm:mt-0 w-full sm:w-auto justify-end">
          <button
            onClick={handleAuth}
            className="flex items-center gap-1 hover:text-blue-400 transition select-none"
          >
            <CgProfile className="text-xl text-blue-500" />
            <span className="hidden sm:inline">{isLogged ? 'Logout' : 'Login'}</span>
          </button>

          <div className="relative">
            <Link to="/cart" className="flex items-center gap-1 hover:text-blue-400 transition select-none">
              <MdOutlineAddShoppingCart className="text-xl text-blue-500" />
              <span className="hidden sm:inline">Cart</span>
            </Link>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs rounded-full px-2 py-0.5 select-none">
                {cartCount}
              </span>
            )}
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
            <form onSubmit={handleSearchSubmit} className="mb-4">
              <input
                type="search"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyPress={handleSearchKeyPress}
                className="w-full bg-[#1a1a1a] border border-white text-white placeholder-gray-400 px-4 py-2 rounded-full outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
              />
            </form>
            
            <Link to="/" onClick={() => setMenuOpen(false)} className="block py-2 hover:text-blue-400">Home</Link>
            <Link to="/cart" onClick={() => setMenuOpen(false)} className="block py-2 hover:text-blue-400">Cart</Link>
            <button onClick={handleAuth} className="w-full text-left py-2 hover:text-blue-400">
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
              <button onClick={handleAuth} className="block py-1 hover:text-blue-400">
                {isLogged ? 'Logout' : 'Login'}
              </button>
              {!isLogged && <Link to="/register" className="block py-1 hover:text-blue-400">Register</Link>}
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
                <div key={item} tabIndex={0} className="py-1 hover:text-blue-400 cursor-pointer select-none">
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



