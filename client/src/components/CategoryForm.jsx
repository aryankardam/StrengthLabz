import { useContext, useEffect, useState } from "react";
import { GlobalState } from "../GlobalState";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";

const initialState = {
  name: "",
  image: "",
};

const CategoryForm = ({ category, onClose, onSubmit }) => {
  const state = useContext(GlobalState);
  const [categoryData, setCategoryData] = useState(initialState);

  useEffect(() => {
    if (category) {
      setCategoryData(category);
    } else {
      setCategoryData(initialState);
    }
  }, [category]);

  const handleChange = (e) => {
    setCategoryData({ ...categoryData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "your_unsigned_preset"); // <-- Replace with your unsigned preset

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/dongif3xp/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      setCategoryData((prev) => ({ ...prev, image: data.secure_url }));
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(category ? category._id : null, categoryData);
    onClose();
  };

  return (
    <Dialog open={true} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Panel className="w-full max-w-lg bg-white text-black p-6 rounded-xl shadow-xl relative">
          <button className="absolute top-4 right-4" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
          <Dialog.Title className="text-xl font-bold mb-4">
            {category ? "Edit Category" : "Create Category"}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Category Name"
              className="w-full border p-2 rounded"
              value={categoryData.name}
              onChange={handleChange}
              required
            />

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full border p-2 rounded"
            />

            {categoryData.image && (
              <img
                src={categoryData.image}
                alt="Category"
                className="mt-4 w-full h-40 object-cover rounded"
              />
            )}

            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              {category ? "Update" : "Create"}
            </button>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default CategoryForm;