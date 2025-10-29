import axios from '../utils/AxiosClient';
import { useEffect, useState } from 'react';

const ProductAPI = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Get all products
  const getProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/products/products', {
        headers: getAuthHeaders()
      });
      console.log('Products fetched:', res.data.products);
      setProducts(res.data.products || []);
      return res.data.products;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Upload image to Cloudinary
  const uploadImage = async (file) => {
    try {
      console.log('Uploading image to Cloudinary...', file);
      
      const formData = new FormData();
      formData.append('file', file);
      
      // CRITICAL: Replace these with your actual Cloudinary credentials
      const CLOUDINARY_UPLOAD_PRESET = 'ml_default'; // e.g., 'ml_default'
      const CLOUDINARY_CLOUD_NAME = 'dongif3xp'; // e.g., 'demo'
      
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      
      // Use native fetch for Cloudinary (bypasses axios interceptors)
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Cloudinary upload failed:', errorData);
        throw new Error(errorData.error?.message || 'Image upload failed');
      }
      
      const data = await response.json();
      
      // ✅ CRITICAL FIX: Return object with BOTH url and public_id
      const imageData = {
        url: data.secure_url,
        public_id: data.public_id
      };
      
      console.log('Cloudinary upload successful:', imageData);
      return imageData;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image: ' + error.message);
    }
  };

  // Create product
  const createProduct = async (productData) => {
    try {
      setLoading(true);
      console.log('Creating product with data:', productData);
      
      // Prepare the product data
      let dataToSend = { ...productData };
      
      // Handle image upload if there's a file
      if (productData.imageFile && productData.imageFile instanceof File) {
        console.log('Uploading new image...');
        const uploadedImage = await uploadImage(productData.imageFile);
        
        // ✅ Backend expects images as an array with url and public_id
        dataToSend.images = [uploadedImage];
        
        console.log('Image data being sent to backend:', dataToSend.images);
      } else if (productData.images && Array.isArray(productData.images)) {
        // Keep existing images format
        dataToSend.images = productData.images;
      } else {
        // No images provided
        dataToSend.images = [];
      }
      
      // Remove imageFile from payload (backend doesn't need it)
      delete dataToSend.imageFile;
      
      console.log('Sending to backend:', dataToSend);
      
      const res = await axios.post('/api/products/products', dataToSend, {
        headers: getAuthHeaders()
      });
      
      console.log('Product created response:', res.data);
      
      // Get the created product from response (handle different response formats)
      const newProduct = res.data.product || res.data.newProduct || res.data;
      
      // CRITICAL: Update state immediately so UI refreshes
      setProducts((prev) => [...prev, newProduct]);
      
      return newProduct;
    } catch (error) {
      console.error('Error creating product:', error.response?.data || error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update product
  const updateProduct = async (id, productData) => {
    try {
      setLoading(true);
      console.log('Updating product:', id, productData);
      
      // Prepare the product data
      let dataToSend = { ...productData };
      
      // Handle image upload if there's a new file
      if (productData.imageFile && productData.imageFile instanceof File) {
        console.log('Uploading new image for update...');
        const uploadedImage = await uploadImage(productData.imageFile);
        
        // ✅ Backend expects images as an array with url and public_id
        dataToSend.images = [uploadedImage];
        
        console.log('Image data being sent to backend:', dataToSend.images);
      } else if (productData.images && Array.isArray(productData.images)) {
        // Keep existing images if no new file uploaded
        dataToSend.images = productData.images;
      } else {
        // Preserve existing images if none provided
        const existingProduct = products.find(p => p._id === id);
        dataToSend.images = existingProduct?.images || [];
      }
      
      // Remove imageFile from payload
      delete dataToSend.imageFile;
      
      console.log('Sending update to backend:', dataToSend);
      
      const res = await axios.put(`/api/products/products/${id}`, dataToSend, {
        headers: getAuthHeaders()
      });
      
      console.log('Product updated response:', res.data);
      
      // Get the updated product from response (handle different response formats)
      const updatedProduct = res.data.product || res.data.updatedProduct || res.data;
      
      // CRITICAL: Update state immediately so UI refreshes
      setProducts((prev) =>
        prev.map((product) => (product._id === id ? updatedProduct : product))
      );
      
      return updatedProduct;
    } catch (error) {
      console.error('Error updating product:', error.response?.data || error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    try {
      setLoading(true);
      console.log('Deleting product:', id);
      
      await axios.delete(`/api/products/products/${id}`, {
        headers: getAuthHeaders()
      });
      
      console.log('Product deleted:', id);
      
      // CRITICAL: Update state immediately so UI refreshes
      setProducts((prev) => prev.filter((product) => product._id !== id));
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting product:', error.response?.data || error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fetch products on mount
  useEffect(() => {
    getProducts();
  }, []);

  // Return API in the format GlobalState expects
  return {
    products: [products, setProducts],
    loading,
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadImage
  };
};

export default ProductAPI;