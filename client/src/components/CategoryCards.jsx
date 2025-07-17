// import React, { useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { GlobalState } from '../GlobalState';

// const CategoryCards = () => {
//   const state = useContext(GlobalState);
//   const navigate = useNavigate();

//   const categoryAPI = state?.categoryAPI || {};
//   const [categories] = categoryAPI.categories || [[]];

//   if (!Array.isArray(categories) || categories.length === 0) {
//     return (
//       <p className="text-center py-12 text-gray-400 text-lg">
//         No categories found.
//       </p>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-6">
//       <div className="flex overflow-x-auto no-scrollbar gap-4 pb-2">
//         {categories.map((category, index) => {
//           const imageUrl =
//             category.image ||
//             'https://cdn2.nutrabay.com/uploads/variant/images/variant-1948-featured_image-Nutrabay_Gold_100_Whey_Protein_Concentrate__1_Kg_22_Lb_Rich_Chocolate_Creme_202507111454.png';

//           const categoryName = category.name || category.title;

//           return (
//             <button
//               key={index}
//               onClick={() =>
//                 navigate(`/products?category=${encodeURIComponent(categoryName)}`)
//               }
//               className="min-w-[110px] bg-[#1f1f1f] rounded-lg shadow-md hover:scale-105 transition-transform duration-200 text-white text-left focus:outline-none"
//             >
//               <div className="w-full h-[90px] rounded-t-lg overflow-hidden">
//                 <img
//                   src={imageUrl}
//                   alt={categoryName}
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//               <div className="text-center text-sm py-2 px-2">
//                 {categoryName}
//               </div>
//             </button>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default CategoryCards;

import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalState } from '../GlobalState';

const CategoryCards = () => {
  const state = useContext(GlobalState);
  const navigate = useNavigate();

  const categoryAPI = state?.categoryAPI || {};
  const [categories] = categoryAPI.categories || [[]];

  if (!Array.isArray(categories) || categories.length === 0) {
    return (
      <p className="text-center py-12 text-gray-400 text-lg">
        No categories found.
      </p>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div
        className="
          grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4
          lg:flex lg:overflow-x-auto lg:gap-4 lg:pb-2 custom-scroll-hide
        "
      >
        {categories.map((category, index) => {
          const imageUrl =
            category.image ||
            'https://cdn2.nutrabay.com/uploads/variant/images/variant-1948-featured_image-Nutrabay_Gold_100_Whey_Protein_Concentrate__1_Kg_22_Lb_Rich_Chocolate_Creme_202507111454.png';

          const categoryName = category.name || category.title;

          return (
            <button
              key={index}
              onClick={() =>
                navigate(`/products?category=${encodeURIComponent(categoryName)}`)
              }
              className="min-w-[110px] bg-[#1f1f1f] rounded-lg shadow-md hover:scale-105 transition-transform duration-200 text-white text-left focus:outline-none"
            >
              <div className="w-full h-[90px] rounded-t-lg overflow-hidden">
                <img
                  src={imageUrl}
                  alt={categoryName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center text-sm py-2 px-2">
                {categoryName}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryCards;
