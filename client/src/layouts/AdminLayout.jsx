import { Outlet, Link } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="p-4 bg-gray-900 border-b border-gray-700 flex justify-between">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <nav className="space-x-4">
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/products">Products</Link>
          <Link to="/admin/categories">Categories</Link>
          <Link to="/admin/orders">Orders</Link>
        </nav>
      </header>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
