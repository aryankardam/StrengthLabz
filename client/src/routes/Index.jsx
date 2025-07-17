import { createBrowserRouter } from "react-router-dom";
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";
import Home from "../pages/User/Home";
import ProductList from "../pages/User/ProductList";
import ProductDetails from "../pages/User/ProductDetails";
import Cart from "../pages/User/Cart";
import Checkout from "../pages/User/Checkout";
import Dashboard from "../pages/Admin/Dashboard";
import ProductManager from "../pages/Admin/ProductManager";
import CategoryManager from "../pages/Admin/CategoryManager";
import OrderManager from "../pages/Admin/OrderManager";
import ErrorPage from "../pages/ErrorPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProtectedRoute from "../components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: <UserLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "", element: <Home /> },
      { path: "products", element: <ProductList /> },
      { path: "products/:id", element: <ProductDetails /> },
      { 
        path: "cart", 
        element: (
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "checkout", 
        element: (
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        ) 
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute requireAdmin={true}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      { path: "", element: <Dashboard /> },
      { path: "products", element: <ProductManager /> },
      { path: "categories", element: <CategoryManager /> },
      { path: "orders", element: <OrderManager /> },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  }
]);

export default router;