import React, { useContext } from 'react';
import { GlobalState } from '../GlobalState';
import CategoryCard from '../pages/User/CategoryCard'; // similar to ProductList

const Category = () => {
  const state = useContext(GlobalState);
  const categories = state.categoryAPI.categories;

  console.log(state);

  return (
    <div className='categories'>
      {
        categories.map(category => (
          <CategoryCard key={category._id} category={category} />
        ))
      }
    </div>
  );
};

export default Category;
