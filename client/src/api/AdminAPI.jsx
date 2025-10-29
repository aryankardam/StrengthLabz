import axios from '../utils/AxiosClient';

export const AdminAPI = {
  // Product APIs
  async getProducts() {
    try {
      const response = await axios.get('/api/products');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch products');
    }
  },

  async createProduct(productData) {
    try {
      const formData = new FormData();
      Object.keys(productData).forEach(key => {
        if (key === 'images') {
          productData[key].forEach(image => {
            formData.append('images', image);
          });
        } else {
          formData.append(key, productData[key]);
        }
      });

      const response = await axios.post('/api/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create product');
    }
  },

  async updateProduct(id, productData) {
    try {
      const formData = new FormData();
      Object.keys(productData).forEach(key => {
        if (key === 'images' && productData[key].length) {
          productData[key].forEach(image => {
            formData.append('images', image);
          });
        } else {
          formData.append(key, productData[key]);
        }
      });

      const response = await axios.put(`/api/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update product');
    }
  },

  async deleteProduct(id) {
    try {
      const response = await axios.delete(`/api/products/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete product');
    }
  },

  // Category APIs
  async getCategories() {
    try {
      const response = await axios.get('/api/categories');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
};
