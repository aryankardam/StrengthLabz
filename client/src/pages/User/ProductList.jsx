import React, { useContext, useEffect, useState } from "react";
import { GlobalState } from "../../GlobalState";
import { Link, useLocation } from "react-router-dom";
import {
  AiOutlineLoading3Quarters,
  AiOutlineHeart,
  AiFillStar,
  AiOutlineStar,
} from "react-icons/ai";

const ProductList = () => {
  const state = useContext(GlobalState);
  const location = useLocation();
  
  // Local state for products and loading
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fix: Access addCart directly from UserAPI
  const userAPI = state?.UserAPI || {};
  const addCart = userAPI.addCart || (() => {
    console.error("Add to cart function is not available.");
    alert("Add to cart function is not available.");
  });
  
  // Access user state
  const [isLogged] = userAPI.isLogged || [false, () => {}];
  const [cart] = userAPI.cart || [[], () => {}];

  // Get token for API calls
  const [token] = userAPI.token || [''];

  // Function to fetch products based on query parameters
  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Parse URL query parameters
      const queryParams = new URLSearchParams(location.search);
      const category = queryParams.get('category');
      const sort = queryParams.get('sort');
      const search = queryParams.get('search');
      const minPrice = queryParams.get('minPrice');
      const maxPrice = queryParams.get('maxPrice');
      
      // Build API URL with query parameters
      let apiUrl = '/api/products/products';
      const params = new URLSearchParams();
      
      if (category) params.append('category', category);
      if (sort) params.append('sort', sort);
      if (search) params.append('search', search);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      
      if (params.toString()) {
        apiUrl += `?${params.toString()}`;
      }

      console.log('Fetching products from:', apiUrl);

      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Handle different response structures
      if (data.products) {
        setProducts(data.products);
      } else if (Array.isArray(data)) {
        setProducts(data);
      } else {
        setProducts([]);
      }

      console.log('Loaded products:', data.products?.length || data.length || 0);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      // Optionally show error message to user
      alert('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch products when component mounts or when URL changes
  useEffect(() => {
    fetchProducts();
  }, [location.search, token]); // Re-fetch when query parameters or token change

  // Add this function to handle cart addition with proper error handling
  const handleAddToCart = async (product) => {
    try {
      console.log("Adding product to cart:", product);
      await addCart(product);
      console.log("Product added to cart successfully");
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("Failed to add product to cart. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <AiOutlineLoading3Quarters className="animate-spin text-5xl text-indigo-400" />
      </div>
    );
  }

  if (!Array.isArray(products) || products.length === 0) {
    return <p className="text-center py-12 text-gray-400 text-lg">No products found.</p>;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f3f4f6] px-6 py-10">
      {/* Promo Banner */}
      <div className="relative rounded-lg overflow-hidden mb-12">
        <img
          src="/banners/promo.jpg"
          alt="Promo Banner"
          className="w-full h-56 object-cover opacity-80"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-4">
          <h2 className="text-3xl font-extrabold mb-2">Summer StrengthLabz Sale</h2>
          <p className="text-lg">Up to 30% off on selected products!</p>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => {
          const imgArray = Array.isArray(product.images) ? product.images : [];
          const firstImageObj = imgArray[0] || {};
          const imageUrl =
            firstImageObj.secure_url ||
            firstImageObj.url ||
            product.image ||
            "/placeholder.png";

          const rating = product.rating || 4;
          const stars = Array.from({ length: 5 }, (_, i) =>
            i < rating ? (
              <AiFillStar key={i} className="inline text-yellow-400" />
            ) : (
              <AiOutlineStar key={i} className="inline text-gray-600" />
            )
          );

          return (
            <div
              key={product._id}
              className="relative bg-[#1a1a1a] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
            >
              {/* Wishlist Icon */}
              <button
                onClick={() => addToWishlist?.(product)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 z-10"
              >
                <AiOutlineHeart size={24} />
              </button>

              <Link to={`/products/${product._id}`}>
                <div className="w-full h-56 bg-[#111] flex items-center justify-center">
                  <img
                    src={imageUrl}
                    alt={product.title || product.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-1 line-clamp-2 text-[#f3f4f6] hover:text-indigo-400">
                    {product.title || product.name}
                  </h3>
                  <div className="mb-2">{stars}</div>
                  <p className="text-xl font-bold text-indigo-400 mb-4">₹{product.price}</p>
                </div>
              </Link>

              {/* Add to Cart Button with improved error handling */}
              <button
                onClick={() => handleAddToCart(product)}
                className="w-full bg-indigo-600 text-white text-center py-2 hover:bg-indigo-700 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          );
        })}
      </div>

      {/* Featured Section */}
      <div className="bg-[#111] p-6 rounded-lg flex flex-col md:flex-row items-center mt-12">
        <img
          src="/banners/featured.png"
          alt="Featured"
          className="w-full md:w-1/3 h-48 object-cover rounded mb-4 md:mb-0"
        />
        <div className="md:ml-6">
          <h3 className="text-2xl font-bold mb-2 text-[#f3f4f6]">
            Featured StrengthLabz Hero
          </h3>
          <p className="text-gray-400 mb-4">
            Experience the ultimate strength boost with our new Hero supplement, packed with whey protein and essential BCAAs.
          </p>
          <Link
            to="/products/68785ef22edc3c69984f1d30"
            className="inline-block bg-indigo-600 text-white px-5 py-2 rounded hover:bg-indigo-700 transition"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductList;