import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-6">
      <div className="max-w-md text-center space-y-6">
        <h1 className="text-6xl font-bold text-red-500">404</h1>
        <p className="text-xl font-semibold">Page Not Found</p>
        <p className="text-gray-400 text-sm">
          The page you are looking for does not exist or has been moved.
        </p>
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full transition"
        >
          <FaArrowLeft />
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
