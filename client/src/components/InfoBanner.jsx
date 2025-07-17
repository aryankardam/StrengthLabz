import React from 'react';
import { MdVerified, MdLocalShipping, MdSecurity } from 'react-icons/md';
import { GiFactory } from 'react-icons/gi';

const infoItems = [
  {
    title: '100% Original',
    icon: <MdVerified className="text-4xl text-blue-500" />,
  },
  {
    title: 'Certified by Brands',
    icon: <MdVerified className="text-4xl text-green-500" />,
  },
  {
    title: 'Direct Sourcing',
    icon: <GiFactory className="text-4xl text-yellow-500" />,
  },
  {
    title: 'Secure Packaging',
    icon: <MdSecurity className="text-4xl text-red-500" />,
  },
];

const InfoBanner = () => {
  return (
    <div className="bg-[#111111] text-white py-6 px-4 max-w-7xl mx-auto rounded-lg shadow-lg">
      <div className="flex flex-wrap justify-between items-center gap-8">
        {infoItems.map(({ title, icon }, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 min-w-[180px]"
          >
            <div className="bg-[#222222] p-3 rounded-full flex items-center justify-center">
              {icon}
            </div>
            <span className="text-lg font-medium">{title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoBanner;
