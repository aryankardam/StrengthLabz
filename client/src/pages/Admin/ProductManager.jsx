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
  const [success, setSuccess] = useState("");

  // Filter products based on search query (case insensitive)
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id) => {
    // Confirm before deleting
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      setError("");
      setSuccess("");
      console.log('Deleting product:', id);
      
      await deleteProduct(id);
      
      setSuccess("Product deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Failed to delete product";
      setError(errorMsg);
      console.error("Delete error:", error);
      setTimeout(() => setError(""), 5000);
    }
  };

  const handleSubmit = async (productData) => {
    try {
      setError("");
      setSuccess("");
      
      console.log('ProductManager handleSubmit called with:', {
        ...productData,
        imageFile: productData.imageFile ? productData.imageFile.name : 'none'
      });
      
      if (selectedProduct) {
        // UPDATE existing product
        console.log('Updating product:', selectedProduct._id);
        await updateProduct(selectedProduct._id, productData);
        setSuccess("Product updated successfully!");
      } else {
        // CREATE new product
        console.log('Creating new product');
        await createProduct(productData);
        setSuccess("Product created successfully!");
      }
      
      // Close form and reset
      setShowForm(false);
      setSelectedProduct(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
      
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Failed to save product";
      setError(errorMsg);
      console.error("Submit error:", error);
      
      // Don't close form on error so user can retry
      // Clear error after 5 seconds
      setTimeout(() => setError(""), 5000);
      
      // Re-throw so ProductForm knows it failed
      throw error;
    }
  };

  const handleEdit = (product) => {
    console.log('Editing product:', product);
    setSelectedProduct(product);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const handleAddNew = () => {
    console.log('Adding new product');
    setSelectedProduct(null);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedProduct(null);
    setError("");
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
            onClick={handleAddNew}
            className="bg-green-600 hover:bg-green-700 transition px-4 py-2 rounded text-white font-medium whitespace-nowrap"
          >
            + Add New Product
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-600 text-white p-4 rounded mb-6 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError("")} className="text-white hover:text-gray-200">✕</button>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-600 text-white p-4 rounded mb-6 flex items-center justify-between">
          <span>{success}</span>
          <button onClick={() => setSuccess("")} className="text-white hover:text-gray-200">✕</button>
        </div>
      )}

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={selectedProduct}
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
        />
      )}

      {/* Products Grid */}
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
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23374151" width="100" height="100"/%3E%3Ctext fill="%239CA3AF" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              <h3 className="text-xl font-semibold mb-1 truncate" title={product.title}>
                {product.title}
              </h3>
              <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                {product.description}
              </p>
              <p className="text-green-400 font-medium mb-2">₹{product.price}</p>
              {product.category && (
                <p className="text-gray-500 text-xs mb-3">
                  Category: {product.category}
                </p>
              )}
              <div className="flex justify-between mt-2 pt-2 border-t border-gray-700">
                <button
                  onClick={() => handleEdit(product)}
                  className="text-blue-400 hover:text-blue-300 transition font-medium"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="text-red-400 hover:text-red-300 transition font-medium"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 text-lg mb-2">
              {searchQuery ? '🔍 No products found matching your search' : '📦 No products available'}
            </div>
            {!searchQuery && (
              <button
                onClick={handleAddNew}
                className="mt-4 bg-blue-600 hover:bg-blue-700 transition px-6 py-2 rounded text-white font-medium"
              >
                Create Your First Product
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManager;