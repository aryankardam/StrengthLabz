import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const UserLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-text">
      {/* Fixed responsive Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </header>

      {/* Prevent content hiding behind navbar */}
      <main className="flex-1 pt-[72px] px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      <footer className="bg-[#111] text-gray-300 px-6 md:px-16 py-10">
        <Footer />
      </footer>
    </div>
  );
};

export default UserLayout;
