import React, { useContext, useEffect } from 'react';
import { GlobalState } from '../GlobalState';
import ProductList from '../pages/User/ProductList';

const Product = () => {
  const state = useContext(GlobalState);

  const products = state.productsAPI.products

  console.log(state)

  return (
    <div className='products'>
      {
        products.map(product => {
          return <ProductList key={product._id} product={product} />
        })
      }  
    </div>
  );
};

export default Product;
