// components/OrderSuccess/OrderSuccess.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  AiOutlineCheckCircle, 
  AiOutlineDownload,
  AiOutlineHome,
  AiOutlineShoppingCart,
  AiOutlinePrinter,
  AiOutlineCalendar,
  AiOutlineCreditCard
} from 'react-icons/ai';
import { MdLocalShipping, MdEmail } from 'react-icons/md';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    // Get order data from navigation state
    if (location.state) {
      setOrderData(location.state);
    } else {
      // If no state, redirect to home
      navigate('/');
    }
  }, [location.state, navigate]);

  // Generate order number from payment ID
  const getOrderNumber = (paymentId) => {
    if (!paymentId) return 'N/A';
    return `ORD-${paymentId.slice(-8).toUpperCase()}`;
  };

  // Format date
  const formatDate = (date = new Date()) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Print order details
  const printOrder = () => {
    window.print();
  };

  // Download invoice (placeholder)
  const downloadInvoice = () => {
    alert('Invoice download will be available soon!');
  };

  if (!orderData) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-[#f3f4f6] flex items-center justify-center">
        <div className="text-center">
          <AiOutlineShoppingCart className="text-8xl text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
          <p className="text-gray-400 mb-6">Unable to load order details</p>
          <Link 
            to="/"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f3f4f6] pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-full mb-4">
            <AiOutlineCheckCircle className="text-4xl text-white" />
          </div>
          <h1 className="text-3xl font-bold text-green-400 mb-2">Payment Successful!</h1>
          <p className="text-gray-400">Your order has been placed and is being processed</p>
        </div>

        {/* Order Details Card */}
        <div className="bg-[#1a1a1a] rounded-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Order Details</h2>
              <p className="text-gray-400">Order placed on {formatDate()}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={printOrder}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
                title="Print Order"
              >
                <AiOutlinePrinter />
              </button>
              <button
                onClick={downloadInvoice}
                className="p-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
                title="Download Invoice"
              >
                <AiOutlineDownload />
              </button>
            </div>
          </div>

          {/* Order Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <AiOutlineShoppingCart className="text-indigo-400" />
                <div>
                  <p className="text-sm text-gray-400">Order Number</p>
                  <p className="font-semibold">{getOrderNumber(orderData.paymentId)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <AiOutlineCreditCard className="text-green-400" />
                <div>
                  <p className="text-sm text-gray-400">Payment ID</p>
                  <p className="font-mono text-sm">{orderData.paymentId}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <AiOutlineCalendar className="text-blue-400" />
                <div>
                  <p className="text-sm text-gray-400">Estimated Delivery</p>
                  <p className="font-semibold">
                    {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MdEmail className="text-purple-400" />
                <div>
                  <p className="text-sm text-gray-400">Confirmation sent to</p>
                  <p className="font-semibold">{orderData.orderDetails?.customerInfo?.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-lg font-semibold mb-4">Payment Summary</h3>
            <div className="bg-[#111] rounded-lg p-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{orderData.orderDetails?.subtotal?.toLocaleString()}</span>
                </div>
                
                {orderData.orderDetails?.discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount</span>
                    <span>-₹{orderData.orderDetails?.discount?.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className={orderData.orderDetails?.shipping === 0 ? 'text-green-400' : ''}>
                    {orderData.orderDetails?.shipping === 0 ? 'FREE' : `₹${orderData.orderDetails?.shipping}`}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>Tax (GST 18%)</span>
                  <span>₹{Math.round(orderData.orderDetails?.tax || 0).toLocaleString()}</span>
                </div>
                
                <div className="border-t border-gray-600 pt-2">
                  <div className="flex justify-between text-lg font-bold text-green-400">
                    <span>Total Paid</span>
                    <span>₹{Math.round(orderData.amount || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-[#1a1a1a] rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Order Items</h3>
          <div className="space-y-4">
            {orderData.orderDetails?.cart?.map((item) => (
              <div key={item._id} className="flex items-center gap-4 p-4 bg-[#111] rounded-lg">
                <div className="w-16 h-16 bg-[#222] rounded-lg flex items-center justify-center">
                  <img
                    src={item.images?.[0]?.secure_url || item.images?.[0]?.url || "/placeholder.png"}
                    alt={item.title || item.name}
                    className="max-h-full max-w-full object-contain rounded"
                  />
                </div>
                
                <div className="flex-1">
                  <h4 className="font-semibold">{item.title || item.name}</h4>
                  <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</p>
                  <p className="text-sm text-gray-400">₹{item.price} each</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-[#1a1a1a] rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">What's Next?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-[#111] rounded-lg">
              <MdEmail className="text-blue-400 text-2xl" />
              <div>
                <h4 className="font-semibold">Confirmation Email</h4>
                <p className="text-sm text-gray-400">Check your inbox for order details</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-[#111] rounded-lg">
              <MdLocalShipping className="text-yellow-400 text-2xl" />
              <div>
                <h4 className="font-semibold">Processing</h4>
                <p className="text-sm text-gray-400">We'll prepare your order for shipping</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-[#111] rounded-lg">
              <AiOutlineCheckCircle className="text-green-400 text-2xl" />
              <div>
                <h4 className="font-semibold">Delivery</h4>
                <p className="text-sm text-gray-400">Expected within 5-7 business days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2"
          >
            <AiOutlineHome />
            Continue Shopping
          </Link>
          
          <Link
            to="/orders"
            className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition flex items-center justify-center gap-2"
          >
            <AiOutlineShoppingCart />
            View All Orders
          </Link>
        </div>

        {/* Support Information */}
        <div className="mt-8 text-center text-gray-400">
          <p className="mb-2">Need help with your order?</p>
          <div className="flex justify-center gap-4 text-sm">
            <Link to="/contact" className="hover:text-indigo-400 transition">Contact Support</Link>
            <span>•</span>
            <Link to="/faq" className="hover:text-indigo-400 transition">FAQ</Link>
            <span>•</span>
            <Link to="/track-order" className="hover:text-indigo-400 transition">Track Order</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;