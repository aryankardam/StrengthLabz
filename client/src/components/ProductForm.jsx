import { useState, useEffect, useContext } from "react";
import { GlobalState } from "../GlobalState";

const ProductForm = ({ product, onClose, onSubmit }) => {

  const state = useContext(GlobalState);
  const [categories] = state.categoryAPI.categories;

  const [formData, setFormData] = useState({
    product_id: "",
    title: "",
    price: "",
    description: "",
    content: "",
    category: "",
    imageFile: null,
    images: [],
  });
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Populate form when editing existing product
  useEffect(() => {
    if (product) {
      console.log("Editing product:", product);
      setFormData({
        product_id: product.product_id || "",
        title: product.title || "",
        price: product.price || "",
        description: product.description || "",
        content: product.content || "",
        category: product.category || "",
        images: product.images || [],
        imageFile: null, // Always start with no new file
      });

      // Set image preview if product has images
      if (
        product.images &&
        product.images.length > 0 &&
        product.images[0].url
      ) {
        setImagePreview(product.images[0].url);
      }
    } else {
      // Reset form for new product
      console.log("Creating new product");
      setFormData({
        product_id: "",
        title: "",
        price: "",
        description: "",
        content: "",
        category: "",
        imageFile: null,
        images: [],
      });
      setImagePreview("");
    }
    setError("");
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Image selected:", file.name, file.type, file.size);

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }

      setError("");
      setFormData((prev) => ({ ...prev, imageFile: file }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        throw new Error("Title is required");
      }
      if (!formData.price || formData.price <= 0) {
        throw new Error("Valid price is required");
      }
      if (!formData.description.trim()) {
        throw new Error("Description is required");
      }

      console.log("Submitting form data:", {
        ...formData,
        imageFile: formData.imageFile ? formData.imageFile.name : "none",
      });

      // Pass the complete form data to parent handler
      await onSubmit(formData);

      // Success - form will be closed by parent
      console.log("Form submitted successfully");
    } catch (error) {
      console.error("Form submission error:", error);
      setError(error.message || "Failed to save product. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white">
            {product ? "✏️ Edit Product" : "➕ Add New Product"}
          </h3>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-white text-2xl disabled:opacity-50"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="bg-red-600 text-white p-3 rounded mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* {Product ID} */}
          <div>
            <label className="block text-white mb-2">
              Product ID <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="product_id"
              value={formData.product_id}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              placeholder="Enter product ID"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-white mb-2">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              placeholder="Enter product title"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-white mb-2">
              Price (₹) <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              disabled={isSubmitting}
              className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              placeholder="0.00"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-white mb-2">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="3"
              disabled={isSubmitting}
              className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              placeholder="Brief description of the product"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-white mb-2">Content (Detailed)</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="4"
              disabled={isSubmitting}
              className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              placeholder="Detailed product information (optional)"
            />
          </div>

          {/* Category (Dynamic Dropdown) */}
          <div>
            <label className="block text-white mb-2">
              Category <span className="text-red-400">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 
              focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="">Select Category</option>
              {categories?.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-white mb-2">Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={isSubmitting}
              className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />
            <p className="text-gray-400 text-sm mt-1">
              {product && !formData.imageFile
                ? "Leave empty to keep current image"
                : "Max size: 5MB"}
            </p>

            {imagePreview && (
              <div className="mt-3">
                <p className="text-gray-300 text-sm mb-2">Preview:</p>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-40 h-40 object-cover rounded border-2 border-gray-600"
                />
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 rounded font-medium transition"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </span>
              ) : product ? (
                "Update Product"
              ) : (
                "Create Product"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 rounded font-medium transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
