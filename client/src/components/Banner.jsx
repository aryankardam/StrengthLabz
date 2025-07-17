import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const banners = [
  { id: 1, image: '/banners/banner1.jpg' },
  { id: 2, image: '/banners/mainBanner.jpg' },
  { id: 3, image: '/banners/Banner2.jpg' },
  { id: 4, image: '/banners/GNC_banner.jpg' },
];

const Banner = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const nextBanner = () => {
    setCurrent((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
  };

  useEffect(() => {
    const timer = setInterval(nextBanner, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full">
      <div
        onClick={() => navigate('/products')}
        className="cursor-pointer w-full overflow-hidden relative group"
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={banners[current].id}
            src={banners[current].image}
            alt={`Banner ${current + 1}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="w-full h-[300px] object-cover"
          />
        </AnimatePresence>

        {/* Left arrow */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            prevBanner();
          }}
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-60 transition"
        >
          ‹
        </button>

        {/* Right arrow */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            nextBanner();
          }}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-60 transition"
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default Banner;
