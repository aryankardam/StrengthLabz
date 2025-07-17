import React from 'react';

const testimonials = [
  {
    name: 'Khush Dhir',
    image: '/testimonials/user1.jpg',
    comment:
      'StrengthLabz is my go-to for all fitness supplements. Their delivery is super quick and the products are 100% genuine!',
  },
  {
    name: 'Nikhil Bawa',
    image: '/testimonials/user2.jpg',
    comment:
      'I love the variety and pricing here! Their packaging is also very secure and professional. Totally recommended.',
  },
  {
    name: 'Govind Kashyap',
    image: '/testimonials/user3.jpg',
    comment:
      'Was skeptical at first but their authenticity guarantee won me over. Been shopping here ever since!',
  },
];

const Testimonials = () => {
  return (
    <div className="bg-[#111111] text-white py-12 px-4">
      <h2 className="text-3xl font-bold text-center mb-10">What Customers Say</h2>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial, idx) => (
          <div
            key={idx}
            className="bg-[#1a1a1a] p-6 rounded-xl shadow-lg hover:shadow-blue-800 transition duration-300 flex flex-col items-center text-center"
          >
            <img
              src={testimonial.image}
              alt={testimonial.name}
              className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-blue-500"
            />
            <p className="text-gray-300 text-sm mb-4 italic">"{testimonial.comment}"</p>
            <h4 className="text-lg font-semibold text-blue-400">{testimonial.name}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
