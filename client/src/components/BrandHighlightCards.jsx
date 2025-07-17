import React from 'react';
import { BsArrowRightCircleFill } from 'react-icons/bs';

const cardData = [
  {
    title: 'StrengthLabz',
    description: 'Visit the brand store',
    icon: '/icons/SL.jpg',
  },
  {
    title: 'DC Creatine',
    description: 'Naturally Flavoured supplements',
    icon: '/icons/creatine.jpg',
  },
  {
    title: '100% Authentication Product',
    description: 'Learn More',
    icon: '/icons/auth.jpg',
  },
];

const BrandHighlightCards = () => {
  return (
    <div className="w-full bg-[#0a0a0a] text-white px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cardData.map((item, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center h-28 p-4 bg-[#1a1a1a] rounded-lg shadow hover:bg-[#2a2a2a] transition duration-300"
          >
            {/* Left: Title and Description with Icon */}
            <div className="flex flex-col justify-center">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <div className="flex items-center text-sm text-gray-300 mt-1 gap-2">
                {item.description}
                <BsArrowRightCircleFill className="text-blue-500" />
              </div>
            </div>

            {/* Right: Image filling full height */}
            <div className="h-full flex items-center">
              <img
                src={item.icon}
                alt={item.title}
                className="h-full w-auto object-contain ml-4"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandHighlightCards;