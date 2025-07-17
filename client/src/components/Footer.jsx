import React from 'react';
import {
  FaInstagram,
  FaPhoneAlt,
  FaEnvelope,
  FaDumbbell,
  FaTag,
  FaBoxOpen,
  FaArrowCircleRight
} from 'react-icons/fa';

const Footer = () => {
  return (
    <div className="bg-[#111] text-gray-300 px-6 md:px-16 py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Info */}
        <div>
          <h4 className="text-xl font-bold text-white mb-2">
            Strength<span className="text-blue-500">Labz</span>
          </h4>
          <p className="text-sm leading-relaxed">
            Your trusted destination for authentic supplements, fitness, and wellness essentials across India.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <FaInstagram className="text-pink-500" />
            <a
              href="https://www.instagram.com/strengthlabzsupplement?igsh=MWQ5ZTY3N2l5NHEzZQ=="
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white text-sm"
            >
              @strengthlabz
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h5 className="text-lg font-semibold text-white mb-2">Quick Links</h5>
          <ul className="space-y-1 text-sm">
            <li className="flex items-center gap-2">
              <FaArrowCircleRight />
              <a href="/shop" className="hover:text-white">Shop</a>
            </li>
            <li className="flex items-center gap-2">
              <FaArrowCircleRight />
              <a href="/about" className="hover:text-white">About Us</a>
            </li>
            <li className="flex items-center gap-2">
              <FaArrowCircleRight />
              <a href="/contact" className="hover:text-white">Contact</a>
            </li>
            <li className="flex items-center gap-2">
              <FaArrowCircleRight />
              <a href="/faqs" className="hover:text-white">FAQs</a>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h5 className="text-lg font-semibold text-white mb-2">Categories</h5>
          <ul className="space-y-1 text-sm">
            <li className="flex items-center gap-2">
              <FaDumbbell />
              <a href="/category/proteins" className="hover:text-white">Proteins</a>
            </li>
            <li className="flex items-center gap-2">
              <FaTag />
              <a href="/category/creatine" className="hover:text-white">Creatine</a>
            </li>
            <li className="flex items-center gap-2">
              <FaBoxOpen />
              <a href="/category/vitamins" className="hover:text-white">Vitamins</a>
            </li>
            <li className="flex items-center gap-2">
              <FaDumbbell />
              <a href="/category/gear" className="hover:text-white">Workout Gear</a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h5 className="text-lg font-semibold text-white mb-2">Contact</h5>
          <p className="text-sm flex items-center gap-2">
            <FaEnvelope />
            <a href="mailto:strengthlabzsre@gmail.com">support@strengthlabz</a>
          </p>
          <p className="text-sm flex items-center gap-2 mt-1">
            <FaPhoneAlt />
            <a href="tel:+919045116510">+91 90451 16510</a>
          </p>
          <p className="text-sm mt-2">Mon - Sat,<br />9:00am - 10:00pm</p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700 mt-10 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} StrengthLabz. All rights reserved.
      </div>
    </div>
  );
};

export default Footer;
