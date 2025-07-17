import React, { useState } from 'react';

const AboutStrengthLabz = () => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => setExpanded(!expanded);

  return (
    <div className="w-full bg-[#101010] text-gray-300 px-6 md:px-16 py-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-6">About StrengthLabz</h2>

        <div className={`transition-all duration-500 ease-in-out ${expanded ? 'max-h-full' : 'max-h-[220px] overflow-hidden'}`}>
          <p className="mb-5 text-lg leading-relaxed">
            StrengthLabz is India’s trusted and fastest-growing online supplement store offering authentic products for health, fitness, wellness, and bodybuilding. We are committed to delivering top-quality products all over India.
          </p>

          <h3 className="text-xl font-semibold text-white mb-2">Our Speciality</h3>
          <p className="mb-5 text-base leading-relaxed">
            All products are delivered directly from us — no middlemen or third-party sellers involved. We are certified by all listed brands or their official importers, guaranteeing 100% authentic supplements. StrengthLabz prioritizes customer satisfaction through seamless user experience, fast delivery, and affordable pricing. Since launching our own supplement range in 2022, we've received immense customer love. Our mission is to help India become a fitter and stronger nation with high-quality, accessible fitness solutions.
          </p>

          <h3 className="text-xl font-semibold text-white mb-2">Products We Offer</h3>
          <p className="mb-5 text-base leading-relaxed">
            From Whey Protein, Mass Gainers, BCAAs, Creatine, and Vitamins to Shakers, Gym Gear, and more — we have everything to fuel your fitness journey. We stock top international and Indian brands like Optimum Nutrition, GNC, MuscleBlaze, and of course, our in-house StrengthLabz products.
          </p>

          <h3 className="text-xl font-semibold text-white mb-2">Authenticity Guarantee</h3>
          <p className="mb-2 text-base leading-relaxed">
            We are among the few stores in India that can truly promise 100% authenticity. Every order placed through StrengthLabz ensures peace of mind, trust, and safe supplementation.
          </p>
        </div>

        <button
          onClick={toggleExpand}
          className="mt-6 text-blue-500 hover:text-blue-400 transition font-medium"
        >
          {expanded ? 'View Less' : 'View More'}
        </button>
      </div>
    </div>
  );
};

export default AboutStrengthLabz;
