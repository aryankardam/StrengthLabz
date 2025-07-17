import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { GlobalState } from "../../GlobalState";
import {
  AiFillStar,
  AiOutlineStar,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";
import { FaShippingFast, FaMoneyBillWave, FaCheckCircle } from "react-icons/fa";

const DetailProduct = () => {
  const params = useParams();
  const state = useContext(GlobalState);

  const { productsAPI, UserAPI } = state;
  const [products] = productsAPI.products;
  const [loading] = productsAPI.loading || [false];
  const [detailProduct, setDetailProduct] = useState(null);
  const [related, setRelated] = useState([]);

  const addCart = UserAPI.addCart || (() => {
    console.error("Add to cart function is not available.");
    alert("Add to cart function is not available.");
  });
  const [token] = UserAPI.token || [""];

  useEffect(() => {
    if (params.id && Array.isArray(products)) {
      const matchedProduct = products.find((p) => p._id === params.id);
      setDetailProduct(matchedProduct);

      if (matchedProduct) {
        const filtered = products.filter(
          (p) =>
            p._id !== matchedProduct._id &&
            (p.category === matchedProduct.category ||
              p.brand === matchedProduct.brand)
        );
        setRelated(filtered.slice(0, 4));
      }
    }
  }, [params.id, products]);

  const handleAddToCart = async (product) => {
    try {
      if (!product) throw new Error("No product selected");
      console.log("Adding product to cart:", product);
      await addCart(product);
      console.log("Product added to cart successfully");
    } catch (error) {
      console.error("Error adding to cart:", error.message);
      alert("Unable to add to cart right now.");
    }
  };

  if (loading || !detailProduct) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0a0a0a] text-white">
        <AiOutlineLoading3Quarters className="animate-spin text-4xl text-indigo-500" />
      </div>
    );
  }

  const {
    title,
    name,
    product_id,
    price,
    description,
    content,
    sold,
    images,
    rating = 4,
  } = detailProduct;

  const imageArray = Array.isArray(images) ? images : [];
  const imageUrl =
    imageArray[0]?.secure_url ||
    imageArray[0]?.url ||
    detailProduct.image ||
    "/placeholder.png";

  const stars = Array.from({ length: 5 }, (_, i) =>
    i < rating ? (
      <AiFillStar key={i} className="inline text-yellow-400" />
    ) : (
      <AiOutlineStar key={i} className="inline text-gray-600" />
    )
  );

  return (
    <div className="bg-[#0a0a0a] text-[#f3f4f6] min-h-screen px-6 py-12">
      {/* Main Product Section */}
      <div className="flex flex-col md:flex-row gap-10 max-w-6xl mx-auto">
        {/* Image Section */}
        <div className="w-full md:w-1/2 bg-[#111] p-4 rounded-xl shadow-lg">
          <img
            src={imageUrl}
            alt={title || name}
            className="w-full h-[400px] object-contain rounded-lg"
          />
        </div>

        {/* Details Section */}
        <div className="w-full md:w-1/2 space-y-4">
          <h1 className="text-3xl font-extrabold">{title || name}</h1>
          <p className="text-sm text-gray-400">Product ID: {product_id}</p>
          <div className="flex items-center gap-2 text-lg">{stars}</div>
          <p className="text-2xl font-semibold text-indigo-400">₹{price}</p>

          <p className="text-gray-300">{description}</p>
          <p className="text-sm text-gray-400">{content}</p>

          <p className="text-sm text-gray-500">Sold: {sold || 0}</p>

          {/* Shipping & Info Icons */}
          <div className="flex gap-6 mt-4 text-gray-300">
            <div className="flex items-center gap-2">
              <FaShippingFast className="text-green-400" />
              <span>Fast Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <FaMoneyBillWave className="text-yellow-300" />
              <span>COD / UPI Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-blue-400" />
              <span>Quality Checked</span>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              onClick={() => handleAddToCart(detailProduct)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow-md"
            >
              Add to Cart
            </button>
            <Link
              to="/cart"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
            >
              Buy Now
            </Link>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-20 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">You may also like</h2>
        {related.length === 0 ? (
          <p className="text-gray-500">No related products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((product) => {
              const img =
                product.images?.[0]?.secure_url ||
                product.images?.[0]?.url ||
                product.image ||
                "/placeholder.png";
              return (
                <div
                  key={product._id}
                  className="bg-[#1a1a1a] p-4 rounded-lg hover:shadow-xl transition duration-300"
                >
                  <Link to={`/products/${product._id}`}>
                    <img
                      src={img}
                      alt={product.title || product.name}
                      className="w-full h-48 object-contain rounded mb-4"
                    />
                    <h3 className="text-lg font-semibold line-clamp-2 text-white hover:text-indigo-400">
                      {product.title || product.name}
                    </h3>
                    <p className="text-indigo-400 font-bold">₹{product.price}</p>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailProduct;
