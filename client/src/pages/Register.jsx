import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BsCheckCircleFill } from 'react-icons/bs';
import axios from '../utils/AxiosClient';
import { GlobalState } from '../GlobalState';

const Register = () => {
  const navigate = useNavigate();
  const state = useContext(GlobalState);
  const [token, setToken] = state.token;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogout = () => {
    localStorage.removeItem('firstLogin');
    localStorage.removeItem('refreshToken');
    setToken(false);
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      const res = await axios.post('/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      localStorage.setItem('firstRegister', true);
      setToken(res.data?.access_token || true); // fallback to true
      navigate('/'); // Redirect to homepage after successful registration
    } catch (err) {
      setApiError(err?.response?.data?.msg || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (token) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col justify-center items-center px-4 text-white">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold">Welcome to <span className="text-blue-500">StrengthLabz</span> 🎉</h2>
          <p className="mt-2 text-gray-400">You are already registered and logged in.</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-blue-600 hover:bg-blue-700 transition rounded py-3 px-6 font-semibold"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col justify-center px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-md w-full mx-auto bg-[#121212] rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-center">Register with Strength<span className="text-blue-500">Labz</span></h2>

        {apiError && (
          <p className="bg-red-600 p-2 rounded mb-4 text-center">{apiError}</p>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-2 rounded bg-[#222] border ${errors.name ? 'border-red-500' : 'border-gray-600'}`}
              autoComplete="name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-2 rounded bg-[#222] border ${errors.email ? 'border-red-500' : 'border-gray-600'}`}
              autoComplete="email"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full p-2 rounded bg-[#222] border ${errors.password ? 'border-red-500' : 'border-gray-600'}`}
              autoComplete="new-password"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block mb-1 font-medium">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full p-2 rounded bg-[#222] border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-600'}`}
              autoComplete="new-password"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition rounded py-3 font-semibold disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">Login here</Link>
        </p>
      </div>

      <div className="max-w-md w-full mx-auto mt-8 text-gray-300 bg-[#121212] p-4 rounded-lg shadow-lg">
        <p className="mb-4 text-center">
          Facing issues with Registration? Email us at{' '}
          <a href="mailto:strengthlabzsre@gmail.com" className="text-blue-500 underline">support@strengthlabz</a>
        </p>
        <div className="flex justify-around text-sm">
          {[
            'Check your past orders',
            'Track your orders',
            'Access saved products',
          ].map((text) => (
            <div key={text} className="flex items-center gap-2 max-w-[130px]">
              <BsCheckCircleFill className="text-blue-500" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      <footer className="mt-12 text-gray-400 text-sm max-w-md w-full mx-auto flex justify-between border-t border-gray-700 pt-4">
        <div className="flex gap-6">
          <a href="/help" className="hover:text-white">Help Center</a>
          <a href="/terms" className="hover:text-white">Terms of Use</a>
          <a href="/privacy" className="hover:text-white">Privacy Policy</a>
        </div>
        <div>© 2025 StrengthLabz. All Rights Reserved.</div>
      </footer>
    </div>
  );
};

export default Register;
