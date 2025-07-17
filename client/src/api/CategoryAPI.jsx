import axios from '../utils/AxiosClient'
import React, { useEffect, useState } from 'react'

const CategoryAPI = () => {

    const [categories, setCategories] = useState([])

    const getCategories = async() => {
        const res = await axios.get('/api/categories/category');
        console.log('Categories:', res.data);
        setCategories(res.data);
    }

    const createCategory = async(categoryData) => {
        const res = await axios.post('/api/categories/category', categoryData);
        console.log('Category created:', res.data);
        setCategories(prev => [...prev, res.data]);
        return res.data;
    }

    const updateCategory = async(id, categoryData) => {
        const res = await axios.put(`/api/categories/category/${id}`, categoryData);
        console.log('Category updated:', res.data);
        setCategories(prev => 
            prev.map(category => 
                category._id === id ? res.data : category
            )
        );
        return res.data;
    }

    const deleteCategory = async(id) => {
        await axios.delete(`/api/categories/category/${id}`);
        console.log('Category deleted:', id);
        setCategories(prev => prev.filter(category => category._id !== id));
    }

    useEffect(() => {
        getCategories()
    }, [])

  return {
    categories: [categories, setCategories],
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
  }
}

export default CategoryAPI