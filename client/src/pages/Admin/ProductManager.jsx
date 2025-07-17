import { useContext, useState } from "react";
import { GlobalState } from "../../GlobalState";
import ProductForm from "../../components/ProductForm";

const ProductManager = () => {
  const state = useContext(GlobalState);
  const [products] = state.productsAPI.products;
  const { createProduct, updateProduct, deleteProduct } = state.productsAPI;

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  // Filter products based on search query (case insensitive)
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id) => {
    try {
      setError("");
      await deleteProduct(id);
    } catch (error) {
      setError("Failed to delete product. Please check your authentication.");
      console.error("Delete error:", error);
    }
  };

  const handleSubmit = async (productData) => {
    try {
      setError("");
      if (selectedProduct) {
        await updateProduct(selectedProduct._id, productData);
      } else {
        await createProduct(productData);
      }
      setShowForm(false);
    } catch (error) {
      setError("Failed to save product. Please check your authentication.");
      console.error("Submit error:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-3xl font-bold">🛍️ Product Manager</h2>
        <div className="flex gap-4 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-64 px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => {
              setSelectedProduct(null);
              setShowForm(true);
              setError("");
            }}
            className="bg-green-600 hover:bg-green-700 transition px-4 py-2 rounded text-white font-medium whitespace-nowrap"
          >
            + Add New Product
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-600 text-white p-4 rounded mb-6">
          {error}
        </div>
      )}

      {showForm && (
        <ProductForm
          product={selectedProduct}
          onClose={() => setShowForm(false)}
          onSubmit={handleSubmit}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-gray-800 border border-gray-700 rounded-xl p-4 shadow hover:shadow-lg transition-all"
            >
              <div className="h-40 overflow-hidden rounded mb-3 bg-black/20">
                {product.images?.[0]?.url ? (
                  <img
                    src={product.images[0].url}
                    alt={product.title}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              <h3 className="text-xl font-semibold mb-1">{product.title}</h3>
              <p className="text-gray-400 text-sm line-clamp-2 mb-3">{product.description}</p>
              <p className="text-green-400 font-medium mb-2">₹{product.price}</p>
              <div className="flex justify-between mt-2">
                <button
                  onClick={() => {
                    setSelectedProduct(product);
                    setShowForm(true);
                    setError("");
                  }}
                  className="text-blue-400 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="text-red-400 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-400 mt-12">No products found.</p>
        )}
      </div>
    </div>
  );
};

export default ProductManager;