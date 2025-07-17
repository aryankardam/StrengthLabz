import axios from '../utils/AxiosClient';
import React, { useEffect, useState } from 'react';

const ProductAPI = () => {
  const [products, setProducts] = useState([]);

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token'); // or get from context/state
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const getProducts = async () => {
    try {
      const res = await axios.get('/api/products/products', {
        headers: getAuthHeaders()
      });
      console.log('Products:', res.data.products);
      setProducts(res.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const createProduct = async (productData) => {
    try {
      const res = await axios.post('/api/products/products', productData, {
        headers: getAuthHeaders()
      });
      console.log('Product created:', res.data);
      setProducts((prev) => [...prev, res.data]);
      return res.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error; // Re-throw to handle in component
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const res = await axios.put(`/api/products/products/${id}`, productData, {
        headers: getAuthHeaders()
      });
      console.log('Product updated:', res.data);
      setProducts((prev) =>
        prev.map((product) => (product._id === id ? res.data : product))
      );
      return res.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error; // Re-throw to handle in component
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`/api/products/products/${id}`, {
        headers: getAuthHeaders()
      });
      console.log('Product deleted:', id);
      setProducts((prev) => prev.filter((product) => product._id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error; // Re-throw to handle in component
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return {
    products: [products, setProducts],
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
  };
};

export default ProductAPI;