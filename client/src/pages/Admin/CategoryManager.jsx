// --- pages/Admin/CategoryManager.jsx ---
import { useContext, useState } from "react";
import { GlobalState } from "../../GlobalState";
import CategoryForm from "../../components/CategoryForm";

const CategoryManager = () => {
  const state = useContext(GlobalState);
  const [categories] = state.categoryAPI.categories;
  const { createCategory, updateCategory, deleteCategory } = state.categoryAPI;

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Category Manager</h2>
      <button
        onClick={() => {
          setSelectedCategory(null);
          setShowForm(true);
        }}
        className="bg-green-600 px-4 py-2 rounded text-white mb-4"
      >
        + New Category
      </button>

      {showForm && (
        <CategoryForm
          category={selectedCategory}
          onClose={() => setShowForm(false)}
          onSubmit={selectedCategory ? updateCategory : createCategory}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="bg-gray-800 p-4 rounded shadow border border-gray-700"
          >
            <h3 className="text-lg font-semibold">{cat.name}</h3>
            {cat.image && (
              <img
                src={cat.image}
                alt={cat.name}
                className="mt-2 w-full h-32 object-cover rounded"
              />
            )}
            <div className="mt-2 flex justify-between">
              <button
                className="text-blue-400 hover:underline"
                onClick={() => {
                  setSelectedCategory(cat);
                  setShowForm(true);
                }}
              >
                Edit
              </button>
              <button
                className="text-red-400 hover:underline"
                onClick={() => deleteCategory(cat._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryManager;