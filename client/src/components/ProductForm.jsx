import { useContext, useEffect, useState } from "react";
import { GlobalState } from "../GlobalState";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";

const initialState = {
  product_id: "",
  title: "",
  price: 0,
  description: "",
  content: "",
  category: "",
  images: [],
};

const ProductForm = ({ product, onClose, onSubmit }) => {
  const state = useContext(GlobalState);
  const [productData, setProductData] = useState(initialState);
  const [images, setImages] = useState([]);
  const [categories] = state.categoryAPI.categories;

  useEffect(() => {
    if (product) {
      setProductData(product);
      setImages(product.images || []);
    } else {
      setProductData(initialState);
      setImages([]);
    }
  }, [product]);

  const handleChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const uploaded = [];

    for (let file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "your_unsigned_preset"); // Replace this
      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/dongif3xp/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await res.json();
        uploaded.push({ url: data.secure_url, public_id: data.public_id });
      } catch (err) {
        console.error("Image upload error:", err);
      }
    }

    setImages((prev) => [...prev, ...uploaded]);
  };

  const handleImageDelete = (public_id) => {
    setImages(images.filter((img) => img.public_id !== public_id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalData = { ...productData, images };
    await onSubmit(product ? product._id : null, finalData);
    onClose();
  };

  return (
    <Dialog open={true} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Panel className="w-full max-w-2xl bg-white text-black p-6 rounded-xl shadow-xl relative">
          <button className="absolute top-4 right-4" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
          <Dialog.Title className="text-xl font-bold mb-4">
            {product ? "Edit Product" : "Create Product"}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="product_id"
              placeholder="Product ID"
              className="w-full border p-2 rounded"
              value={productData.product_id}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="title"
              placeholder="Title"
              className="w-full border p-2 rounded"
              value={productData.title}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              className="w-full border p-2 rounded"
              value={productData.price}
              onChange={handleChange}
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              className="w-full border p-2 rounded"
              value={productData.description}
              onChange={handleChange}
              required
            />
            <textarea
              name="content"
              placeholder="Content"
              className="w-full border p-2 rounded"
              value={productData.content}
              onChange={handleChange}
              required
            />

            <select
              name="category"
              className="w-full border p-2 rounded"
              value={productData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full border p-2 rounded"
            />

            <div className="grid grid-cols-3 gap-2">
              {images.map((img) => (
                <div key={img.public_id} className="relative">
                  <img
                    src={img.url}
                    alt="product"
                    className="w-full h-24 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleImageDelete(img.public_id)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full px-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              {product ? "Update" : "Create"}
            </button>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ProductForm;
