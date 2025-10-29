// import React, { useContext, useState, useEffect, useCallback, useMemo } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { GlobalState } from '../../GlobalState';
// import { 
//   AiOutlineShoppingCart, 
//   AiOutlinePlus, 
//   AiOutlineMinus, 
//   AiOutlineDelete,
//   AiOutlineArrowLeft,
//   AiOutlineLoading3Quarters,
//   AiOutlineHeart,
//   AiOutlineGift,
//   AiOutlineCheckCircle,
//   AiOutlineCreditCard
// } from 'react-icons/ai';
// import { MdLocalShipping, MdSecurity, MdRefresh } from 'react-icons/md';
// import PaymentService from '../../services/PaymentService';

// // Constants
// const FREE_SHIPPING_THRESHOLD = 999;
// const SHIPPING_COST = 99;
// const TAX_RATE = 0.18;

// const PROMO_CODES = {
//   'WELCOME10': 0.10,
//   'STRENGTH20': 0.20,
//   'SUMMER15': 0.15,
//   'NEWUSER': 0.25
// };

// const Cart = () => {
//   const state = useContext(GlobalState);
//   const navigate = useNavigate();
  
//   // Extract user API methods with better error handling
//   const userAPI = state?.UserAPI || {};
//   const [cart, setCart] = userAPI.cart || [[], () => {}];
//   const [isLogged] = userAPI.isLogged || [false, () => {}];
//   const [user] = userAPI.user || [{}, () => {}];
//   const removeFromCart = userAPI.removeFromCart || (() => {});
//   const updateCartQuantity = userAPI.updateCartQuantity || (() => {});
//   const clearCart = userAPI.clearCart || (() => {});
  
//   // State management
//   const [loading, setLoading] = useState(false);
//   const [promoCode, setPromoCode] = useState('');
//   const [promoApplied, setPromoApplied] = useState(false);
//   const [promoDiscount, setPromoDiscount] = useState(0);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [paymentProcessing, setPaymentProcessing] = useState(false);
//   const [errors, setErrors] = useState({});

//   // Load Razorpay script
//   useEffect(() => {
//     const loadRazorpayScript = async () => {
//       if (window.Razorpay) return true;
      
//       try {
//         const script = document.createElement('script');
//         script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//         script.async = true;
        
//         return new Promise((resolve, reject) => {
//           script.onload = () => resolve(true);
//           script.onerror = () => reject(new Error('Failed to load Razorpay script'));
//           document.body.appendChild(script);
//         });
//       } catch (error) {
//         console.error('Error loading Razorpay script:', error);
//         return false;
//       }
//     };

//     loadRazorpayScript();
//   }, []);

//   // Memoized calculations for better performance
//   const cartCalculations = useMemo(() => {
//     const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
//     const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
//     const discount = promoApplied ? (subtotal * promoDiscount) : 0;
//     const taxableAmount = subtotal - discount;
//     const tax = taxableAmount * TAX_RATE;
//     const total = taxableAmount + tax + shipping;

//     return { subtotal, shipping, discount, taxableAmount, tax, total };
//   }, [cart, promoApplied, promoDiscount]);

//   // Optimized update quantity with debouncing
//   const updateQuantity = useCallback(async (productId, newQuantity) => {
//     if (newQuantity < 1) return;
    
//     setLoading(true);
//     setErrors(prev => ({ ...prev, [productId]: null }));
    
//     try {
//       await new Promise(resolve => setTimeout(resolve, 200));
//       updateCartQuantity(productId, newQuantity);
//     } catch (error) {
//       console.error('Error updating quantity:', error);
//       setErrors(prev => ({ ...prev, [productId]: 'Failed to update quantity' }));
//     } finally {
//       setLoading(false);
//     }
//   }, [updateCartQuantity]);

//   // Remove item with error handling
//   const removeFromCartHandler = useCallback(async (productId) => {
//     setLoading(true);
//     setErrors(prev => ({ ...prev, [productId]: null }));
    
//     try {
//       await new Promise(resolve => setTimeout(resolve, 200));
//       removeFromCart(productId);
//     } catch (error) {
//       console.error('Error removing item:', error);
//       setErrors(prev => ({ ...prev, [productId]: 'Failed to remove item' }));
//     } finally {
//       setLoading(false);
//     }
//   }, [removeFromCart]);

//   // Clear cart with confirmation
//   const clearCartHandler = useCallback(() => {
//     if (window.confirm('Are you sure you want to clear your cart?')) {
//       try {
//         clearCart();
//         setPromoApplied(false);
//         setPromoDiscount(0);
//         setPromoCode('');
//       } catch (error) {
//         console.error('Error clearing cart:', error);
//         alert('Failed to clear cart. Please try again.');
//       }
//     }
//   }, [clearCart]);

//   // Apply promo code with validation
//   const applyPromoCode = useCallback(() => {
//     const code = promoCode.trim().toUpperCase();
    
//     if (!code) {
//       alert('Please enter a promo code');
//       return;
//     }

//     if (PROMO_CODES[code]) {
//       setPromoApplied(true);
//       setPromoDiscount(PROMO_CODES[code]);
//       alert(`Promo code applied! You saved ${(PROMO_CODES[code] * 100).toFixed(0)}%`);
//     } else {
//       alert('Invalid promo code. Please try again.');
//     }
//   }, [promoCode]);

//   // Remove promo code
//   const removePromoCode = useCallback(() => {
//     setPromoApplied(false);
//     setPromoDiscount(0);
//     setPromoCode('');
//   }, []);

//   // Enhanced checkout handler
//   const handleCheckout = useCallback(async () => {
//     if (!isLogged) {
//       alert('Please login to continue checkout');
//       navigate('/login');
//       return;
//     }

//     if (cart.length === 0) {
//       alert('Your cart is empty');
//       return;
//     }

//     setIsProcessing(true);
    
//     try {
//       await new Promise(resolve => setTimeout(resolve, 1500));
      
//       navigate('/checkout', { 
//         state: { 
//           cart, 
//           ...cartCalculations,
//           promoCode: promoApplied ? promoCode : null
//         }
//       });
//     } catch (error) {
//       console.error('Checkout error:', error);
//       alert('Failed to proceed to checkout. Please try again.');
//     } finally {
//       setIsProcessing(false);
//     }
//   }, [isLogged, cart, cartCalculations, promoApplied, promoCode, navigate]);

//   // Enhanced payment handler
//   const handleDirectPayment = useCallback(async () => {
//     if (!isLogged) {
//       alert('Please login to continue payment');
//       navigate('/login');
//       return;
//     }

//     if (cart.length === 0) {
//       alert('Your cart is empty');
//       return;
//     }

//     setPaymentProcessing(true);

//     try {
//       const orderDetails = {
//         cart,
//         ...cartCalculations,
//         promoCode: promoApplied ? promoCode : null,
//         customerInfo: {
//           name: user.name || '',
//           email: user.email || '',
//           phone: user.phone || ''
//         }
//       };

//       const paymentResult = await PaymentService.processPayment(orderDetails);

//       if (paymentResult.success) {
//         alert('Payment successful! Order placed successfully.');
//         clearCart();
//         setPromoApplied(false);
//         setPromoDiscount(0);
//         setPromoCode('');
        
//         navigate('/order-success', {
//           state: {
//             paymentId: paymentResult.paymentResponse.razorpay_payment_id,
//             orderId: paymentResult.paymentResponse.razorpay_order_id,
//             amount: cartCalculations.total,
//             orderDetails
//           }
//         });
//       }
//     } catch (error) {
//       console.error('Payment failed:', error);
      
//       const errorMessages = {
//         'Payment cancelled by user': 'Payment was cancelled',
//         'Payment verification failed': 'Payment verification failed. Please contact support.',
//         default: 'Payment failed. Please try again.'
//       };

//       alert(errorMessages[error.error] || errorMessages.default);
//     } finally {
//       setPaymentProcessing(false);
//     }
//   }, [isLogged, cart, cartCalculations, promoApplied, promoCode, user, navigate, clearCart]);

//   // Move to wishlist
//   const moveToWishlist = useCallback((item) => {
//     alert(`${item.title || item.name} moved to wishlist!`);
//     removeFromCartHandler(item._id);
//   }, [removeFromCartHandler]);

//   // Helper function to get image URL
//   const getImageUrl = useCallback((item) => {
//     if (Array.isArray(item.images) && item.images.length > 0) {
//       const firstImage = item.images[0];
//       return firstImage.secure_url || firstImage.url || item.image || "/placeholder.png";
//     }
//     return item.image || "/placeholder.png";
//   }, []);

//   // Early returns for different states
//   if (!isLogged) {
//     return (
//       <div className="min-h-screen bg-[#0a0a0a] text-[#f3f4f6] flex items-center justify-center">
//         <div className="text-center">
//           <AiOutlineShoppingCart className="text-8xl text-gray-600 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold mb-2">Please Login</h2>
//           <p className="text-gray-400 mb-6">You need to be logged in to view your cart</p>
//           <Link 
//             to="/login"
//             className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
//           >
//             Login Now
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   if (cart.length === 0) {
//     return (
//       <div className="min-h-screen bg-[#0a0a0a] text-[#f3f4f6] flex items-center justify-center">
//         <div className="text-center">
//           <AiOutlineShoppingCart className="text-8xl text-gray-600 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold mb-2">Your Cart is Empty</h2>
//           <p className="text-gray-400 mb-6">Looks like you haven't added any items to your cart yet</p>
//           <Link 
//             to="/"
//             className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
//           >
//             Start Shopping
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#0a0a0a] text-[#f3f4f6] pt-20">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div className="flex items-center gap-4">
//             <button 
//               onClick={() => navigate(-1)}
//               className="text-2xl hover:text-indigo-400 transition"
//               aria-label="Go back"
//             >
//               <AiOutlineArrowLeft />
//             </button>
//             <h1 className="text-3xl font-bold">Shopping Cart</h1>
//             <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm">
//               {cart.length} {cart.length === 1 ? 'item' : 'items'}
//             </span>
//           </div>
          
//           {cart.length > 0 && (
//             <button
//               onClick={clearCartHandler}
//               className="text-red-500 hover:text-red-400 transition flex items-center gap-2"
//               aria-label="Clear cart"
//             >
//               <AiOutlineDelete /> Clear Cart
//             </button>
//           )}
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Cart Items */}
//           <div className="lg:col-span-2">
//             <div className="bg-[#1a1a1a] rounded-lg p-6">
//               <h2 className="text-xl font-semibold mb-6">Cart Items</h2>
              
//               {cart.map((item) => (
//                 <div key={item._id} className="border-b border-gray-700 pb-6 mb-6 last:border-b-0">
//                   {errors[item._id] && (
//                     <div className="mb-4 p-3 bg-red-900/20 border border-red-500 rounded-lg text-red-400 text-sm">
//                       {errors[item._id]}
//                     </div>
//                   )}
                  
//                   <div className="flex flex-col sm:flex-row gap-4">
//                     {/* Product Image */}
//                     <div className="w-full sm:w-32 h-32 bg-[#111] rounded-lg flex items-center justify-center">
//                       <img
//                         src={getImageUrl(item)}
//                         alt={item.title || item.name}
//                         className="max-h-full max-w-full object-contain rounded-lg"
//                         loading="lazy"
//                       />
//                     </div>

//                     {/* Product Details */}
//                     <div className="flex-1">
//                       <div className="flex justify-between items-start mb-2">
//                         <h3 className="text-lg font-semibold text-[#f3f4f6]">
//                           {item.title || item.name}
//                         </h3>
//                         <button
//                           onClick={() => removeFromCartHandler(item._id)}
//                           className="text-red-500 hover:text-red-400 transition"
//                           disabled={loading}
//                           aria-label="Remove item"
//                         >
//                           <AiOutlineDelete size={20} />
//                         </button>
//                       </div>

//                       <p className="text-gray-400 text-sm mb-4">
//                         {item.description?.substring(0, 100)}...
//                       </p>

//                       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                         {/* Quantity Controls */}
//                         <div className="flex items-center gap-3">
//                           <span className="text-sm text-gray-400">Quantity:</span>
//                           <div className="flex items-center bg-[#111] rounded-lg">
//                             <button
//                               onClick={() => updateQuantity(item._id, item.quantity - 1)}
//                               disabled={item.quantity <= 1 || loading}
//                               className="p-2 hover:bg-gray-700 rounded-l-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
//                               aria-label="Decrease quantity"
//                             >
//                               <AiOutlineMinus />
//                             </button>
//                             <span className="px-4 py-2 border-x border-gray-700 min-w-[50px] text-center">
//                               {loading ? <AiOutlineLoading3Quarters className="animate-spin mx-auto" /> : item.quantity}
//                             </span>
//                             <button
//                               onClick={() => updateQuantity(item._id, item.quantity + 1)}
//                               disabled={loading}
//                               className="p-2 hover:bg-gray-700 rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
//                               aria-label="Increase quantity"
//                             >
//                               <AiOutlinePlus />
//                             </button>
//                           </div>
//                         </div>

//                         {/* Price and Actions */}
//                         <div className="flex items-center gap-4">
//                           <button
//                             onClick={() => moveToWishlist(item)}
//                             className="flex items-center gap-2 text-gray-400 hover:text-indigo-400 transition"
//                           >
//                             <AiOutlineHeart /> Save for Later
//                           </button>
//                           <div className="text-right">
//                             <p className="text-lg font-bold text-indigo-400">
//                               ₹{(item.price * item.quantity).toLocaleString()}
//                             </p>
//                             <p className="text-sm text-gray-400">
//                               ₹{item.price.toLocaleString()} each
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Order Summary */}
//           <div className="lg:col-span-1">
//             <div className="sticky top-24">
//               {/* Promo Code */}
//               <div className="bg-[#1a1a1a] rounded-lg p-6 mb-6">
//                 <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//                   <AiOutlineGift className="text-indigo-400" />
//                   Promo Code
//                 </h3>
                
//                 {!promoApplied ? (
//                   <div className="flex gap-2">
//                     <input
//                       type="text"
//                       placeholder="Enter promo code"
//                       value={promoCode}
//                       onChange={(e) => setPromoCode(e.target.value)}
//                       className="flex-1 bg-[#111] border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
//                       onKeyPress={(e) => e.key === 'Enter' && applyPromoCode()}
//                     />
//                     <button
//                       onClick={applyPromoCode}
//                       disabled={!promoCode.trim()}
//                       className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       Apply
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="flex items-center justify-between bg-green-900/20 border border-green-500 rounded-lg p-3">
//                     <div className="flex items-center gap-2">
//                       <AiOutlineCheckCircle className="text-green-400" />
//                       <span className="text-green-400">{promoCode.toUpperCase()}</span>
//                     </div>
//                     <button
//                       onClick={removePromoCode}
//                       className="text-red-500 hover:text-red-400"
//                       aria-label="Remove promo code"
//                     >
//                       <AiOutlineDelete />
//                     </button>
//                   </div>
//                 )}
//               </div>

//               {/* Order Summary */}
//               <div className="bg-[#1a1a1a] rounded-lg p-6">
//                 <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                
//                 <div className="space-y-3 mb-6">
//                   <div className="flex justify-between">
//                     <span>Subtotal</span>
//                     <span>₹{cartCalculations.subtotal.toLocaleString()}</span>
//                   </div>
                  
//                   {promoApplied && (
//                     <div className="flex justify-between text-green-400">
//                       <span>Discount ({(promoDiscount * 100).toFixed(0)}%)</span>
//                       <span>-₹{cartCalculations.discount.toLocaleString()}</span>
//                     </div>
//                   )}
                  
//                   <div className="flex justify-between">
//                     <span>Shipping</span>
//                     <span className={cartCalculations.shipping === 0 ? 'text-green-400' : ''}>
//                       {cartCalculations.shipping === 0 ? 'FREE' : `₹${cartCalculations.shipping}`}
//                     </span>
//                   </div>
                  
//                   <div className="flex justify-between">
//                     <span>Tax (GST 18%)</span>
//                     <span>₹{cartCalculations.tax.toLocaleString()}</span>
//                   </div>
                  
//                   <div className="border-t border-gray-700 pt-3">
//                     <div className="flex justify-between text-lg font-bold">
//                       <span>Total</span>
//                       <span>₹{cartCalculations.total.toLocaleString()}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Free Shipping Progress */}
//                 {cartCalculations.shipping > 0 && (
//                   <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-500 rounded-lg">
//                     <div className="flex items-center gap-2 mb-2">
//                       <MdLocalShipping className="text-yellow-400" />
//                       <span className="text-sm text-yellow-400">
//                         Add ₹{(FREE_SHIPPING_THRESHOLD - cartCalculations.subtotal).toLocaleString()} more for FREE shipping
//                       </span>
//                     </div>
//                     <div className="w-full bg-gray-700 rounded-full h-2">
//                       <div 
//                         className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
//                         style={{ width: `${Math.min((cartCalculations.subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}
//                       />
//                     </div>
//                   </div>
//                 )}

//                 {/* Payment Buttons */}
//                 <div className="space-y-3">
//                   <button
//                     onClick={handleDirectPayment}
//                     disabled={paymentProcessing || cart.length === 0}
//                     className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                   >
//                     {paymentProcessing ? (
//                       <>
//                         <AiOutlineLoading3Quarters className="animate-spin" />
//                         Processing Payment...
//                       </>
//                     ) : (
//                       <>
//                         <AiOutlineCreditCard />
//                         Pay Now - ₹{cartCalculations.total.toLocaleString()}
//                       </>
//                     )}
//                   </button>

//                   <button
//                     onClick={handleCheckout}
//                     disabled={isProcessing || cart.length === 0}
//                     className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                   >
//                     {isProcessing ? (
//                       <>
//                         <AiOutlineLoading3Quarters className="animate-spin" />
//                         Processing...
//                       </>
//                     ) : (
//                       'Proceed to Checkout'
//                     )}
//                   </button>
//                 </div>

//                 {/* Payment Methods */}
//                 <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
//                   <p className="text-sm text-gray-400 mb-2">We accept:</p>
//                   <div className="flex items-center gap-2 text-xs text-gray-500">
//                     <span>💳 Credit/Debit Cards</span>
//                     <span>•</span>
//                     <span>🏦 Net Banking</span>
//                     <span>•</span>
//                     <span>📱 UPI</span>
//                     <span>•</span>
//                     <span>💰 Wallets</span>
//                   </div>
//                 </div>

//                 {/* Security & Benefits */}
//                 <div className="mt-6 space-y-3 text-sm text-gray-400">
//                   <div className="flex items-center gap-2">
//                     <MdSecurity className="text-green-400" />
//                     <span>Secure checkout with SSL encryption</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <MdRefresh className="text-blue-400" />
//                     <span>Easy returns within 30 days</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <MdLocalShipping className="text-yellow-400" />
//                     <span>Free shipping on orders over ₹{FREE_SHIPPING_THRESHOLD.toLocaleString()}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Cart;

// components/Cart/Cart.jsx
import React, { useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GlobalState } from '../../GlobalState';
import { 
  AiOutlineShoppingCart, 
  AiOutlinePlus, 
  AiOutlineMinus, 
  AiOutlineDelete,
  AiOutlineArrowLeft,
  AiOutlineLoading3Quarters,
  AiOutlineHeart,
  AiOutlineGift,
  AiOutlineCheckCircle,
  AiOutlineCreditCard,
  AiOutlineWarning
} from 'react-icons/ai';
import { MdLocalShipping, MdSecurity, MdRefresh } from 'react-icons/md';
import PaymentService from '../../services/PaymentService';

// Constants
const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_COST = 99;
const TAX_RATE = 0.18;

const PROMO_CODES = {
  'WELCOME10': 0.10,
  'STRENGTH20': 0.20,
  'SUMMER15': 0.15,
  'NEWUSER': 0.25
};

const Cart = () => {
  const state = useContext(GlobalState);
  const navigate = useNavigate();
  
  // Extract user API methods
  const userAPI = state?.UserAPI || {};
  const [cart, setCart] = userAPI.cart || [[], () => {}];
  const [isLogged] = userAPI.isLogged || [false, () => {}];
  const [user] = userAPI.user || [{}, () => {}];
  const removeFromCart = userAPI.removeFromCart || (() => {});
  const updateCartQuantity = userAPI.updateCartQuantity || (() => {});
  const clearCart = userAPI.clearCart || (() => {});
  
  // State management
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Load Razorpay script on mount
  useEffect(() => {
    const loadScript = async () => {
      try {
        const loaded = await PaymentService.loadRazorpayScript();
        setRazorpayLoaded(loaded);
        if (!loaded) {
          console.error('Failed to load Razorpay script');
        }
      } catch (error) {
        console.error('Error loading Razorpay:', error);
        setRazorpayLoaded(false);
      }
    };

    loadScript();
  }, []);

  // Memoized calculations
  const cartCalculations = useMemo(() => {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const discount = promoApplied ? (subtotal * promoDiscount) : 0;
    const taxableAmount = subtotal - discount;
    const tax = taxableAmount * TAX_RATE;
    const total = taxableAmount + tax + shipping;

    return { subtotal, shipping, discount, taxableAmount, tax, total };
  }, [cart, promoApplied, promoDiscount]);

  // Update quantity with error handling
  const updateQuantity = useCallback(async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setLoading(true);
    setErrors(prev => ({ ...prev, [productId]: null }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      updateCartQuantity(productId, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
      setErrors(prev => ({ ...prev, [productId]: 'Failed to update quantity' }));
    } finally {
      setLoading(false);
    }
  }, [updateCartQuantity]);

  // Remove item from cart
  const removeFromCartHandler = useCallback(async (productId) => {
    setLoading(true);
    setErrors(prev => ({ ...prev, [productId]: null }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      removeFromCart(productId);
    } catch (error) {
      console.error('Error removing item:', error);
      setErrors(prev => ({ ...prev, [productId]: 'Failed to remove item' }));
    } finally {
      setLoading(false);
    }
  }, [removeFromCart]);

  // Clear cart
  const clearCartHandler = useCallback(() => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        clearCart();
        setPromoApplied(false);
        setPromoDiscount(0);
        setPromoCode('');
      } catch (error) {
        console.error('Error clearing cart:', error);
        alert('Failed to clear cart. Please try again.');
      }
    }
  }, [clearCart]);

  // Apply promo code
  const applyPromoCode = useCallback(() => {
    const code = promoCode.trim().toUpperCase();
    
    if (!code) {
      alert('Please enter a promo code');
      return;
    }

    if (PROMO_CODES[code]) {
      setPromoApplied(true);
      setPromoDiscount(PROMO_CODES[code]);
      alert(`Promo code applied! You saved ${(PROMO_CODES[code] * 100).toFixed(0)}%`);
    } else {
      alert('Invalid promo code. Please try again.');
    }
  }, [promoCode]);

  // Remove promo code
  const removePromoCode = useCallback(() => {
    setPromoApplied(false);
    setPromoDiscount(0);
    setPromoCode('');
  }, []);

  // Handle Razorpay payment
// Enhanced handleDirectPayment with comprehensive debugging

const handleDirectPayment = useCallback(async () => {
  console.log('=== PAYMENT DEBUG START ===');
  console.log('User object:', user);
  console.log('Cart:', cart);
  console.log('Cart calculations:', cartCalculations);
  console.log('Razorpay loaded:', razorpayLoaded);
  console.log('Is logged:', isLogged);
  
  // Pre-payment validations
  if (!isLogged) {
    console.log('❌ User not logged in');
    alert('Please login to continue payment');
    navigate('/login');
    return;
  }

  if (cart.length === 0) {
    console.log('❌ Cart is empty');
    alert('Your cart is empty');
    return;
  }

  // Skip user validation for debugging (you can uncomment this later)
  /*
  if (!user.name || !user.email) {
    console.log('❌ User profile incomplete:', { name: user.name, email: user.email });
    alert('Please complete your profile before making a payment');
    navigate('/profile');
    return;
  }
  */

  if (!razorpayLoaded) {
    console.log('❌ Razorpay not loaded');
    alert('Payment system is loading. Please try again in a moment.');
    return;
  }

  console.log('✅ All validations passed');
  setPaymentProcessing(true);

  try {
    // Prepare order details
    const orderDetails = {
      cart: cart.map(item => ({
        _id: item._id,
        title: item.title || item.name,
        price: item.price,
        quantity: item.quantity,
        images: item.images,
        description: item.description
      })),
      subtotal: cartCalculations.subtotal,
      shipping: cartCalculations.shipping,
      tax: cartCalculations.tax,
      discount: cartCalculations.discount,
      total: cartCalculations.total,
      promoCode: promoApplied ? promoCode : null,
      customerInfo: {
        name: user.name || 'Test User',
        email: user.email || 'test@example.com',
        phone: user.phone || user.mobile || ''
      }
    };

    console.log('📋 Order details prepared:', orderDetails);

    // Check if PaymentService exists
    if (!PaymentService) {
      console.error('❌ PaymentService not found');
      throw new Error('Payment service not available');
    }

    console.log('💳 Calling PaymentService.processPayment...');
    
    // Add timeout to catch hanging requests
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Payment request timeout')), 30000)
    );

    const paymentResult = await Promise.race([
      PaymentService.processPayment(orderDetails),
      timeoutPromise
    ]);

    console.log('💳 Payment result received:', paymentResult);

    if (paymentResult && paymentResult.success) {
      console.log('✅ Payment successful!');
      alert('🎉 Payment successful! Your order has been placed.');
      
      // Clear cart and promo codes
      clearCart();
      setPromoApplied(false);
      setPromoDiscount(0);
      setPromoCode('');
      
      // Navigate to success page
      navigate('/order-success', {
        state: {
          paymentId: paymentResult.paymentResponse?.razorpay_payment_id,
          orderId: paymentResult.paymentResponse?.razorpay_order_id,
          amount: cartCalculations.total,
          orderDetails,
          verificationResponse: paymentResult.verificationResponse
        }
      });
    } else {
      console.log('❌ Payment not successful:', paymentResult);
      throw new Error(paymentResult?.error || 'Payment processing failed');
    }
  } catch (error) {
    console.error('💥 Payment error caught:', error);
    console.error('Error details:', {
      message: error.message,
      error: error.error,
      stack: error.stack,
      name: error.name
    });
    
    // Handle different error types with more specific debugging
    let errorMessage = 'Payment failed. Please check your connection and try again.';
    
    if (error.message === 'Payment request timeout') {
      errorMessage = 'Payment request timed out. Please check your connection and try again.';
      console.error('🕐 Payment timed out after 30 seconds');
    } else if (error.message.includes('PaymentService')) {
      errorMessage = 'Payment service is unavailable. Please try again later.';
      console.error('🚫 PaymentService error');
    } else if (error.message.includes('network') || error.message.includes('fetch')) {
      errorMessage = 'Network error. Please check your internet connection.';
      console.error('🌐 Network error detected');
    } else if (error.error === 'Payment cancelled by user') {
      errorMessage = 'Payment was cancelled. Your cart is still saved.';
      console.log('👤 User cancelled payment');
    }

    alert(errorMessage);

    // Handle authentication errors
    if (error.error === 'Authentication required' || 
        error.error === 'Please login to continue' ||
        error.message === 'Please login to continue') {
      navigate('/login');
    }
  } finally {
    console.log('🏁 Payment process completed');
    setPaymentProcessing(false);
  }
}, [isLogged, cart, cartCalculations, promoApplied, promoCode, user, navigate, clearCart, razorpayLoaded]);

// Additional debugging - Check PaymentService availability
useEffect(() => {
  console.log('=== PAYMENT SERVICE DEBUG ===');
  console.log('PaymentService available:', !!PaymentService);
  if (PaymentService) {
    console.log('PaymentService methods:', Object.keys(PaymentService));
    console.log('processPayment method:', typeof PaymentService.processPayment);
  }
  
  // Check if window.Razorpay is available
  console.log('window.Razorpay available:', !!window.Razorpay);
  
  // Check network connectivity
  console.log('Navigator online:', navigator.onLine);
}, []);

// Network status monitoring
useEffect(() => {
  const handleOnline = () => {
    console.log('🌐 Network: Online');
  };
  
  const handleOffline = () => {
    console.log('🌐 Network: Offline');
    alert('You appear to be offline. Please check your internet connection.');
  };
  
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}, []);

  // Traditional checkout handler
  const handleCheckout = useCallback(async () => {
    if (!isLogged) {
      alert('Please login to continue checkout');
      navigate('/login');
      return;
    }

    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      navigate('/checkout', { 
        state: { 
          cart, 
          ...cartCalculations,
          promoCode: promoApplied ? promoCode : null
        }
      });
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to proceed to checkout. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [isLogged, cart, cartCalculations, promoApplied, promoCode, navigate]);

  // Move to wishlist
  const moveToWishlist = useCallback((item) => {
    alert(`${item.title || item.name} moved to wishlist!`);
    removeFromCartHandler(item._id);
  }, [removeFromCartHandler]);

  // Get image URL
  const getImageUrl = useCallback((item) => {
    if (Array.isArray(item.images) && item.images.length > 0) {
      const firstImage = item.images[0];
      return firstImage.secure_url || firstImage.url || "/placeholder.png";
    }
    return item.image || "/placeholder.png";
  }, []);

  // Early returns for different states
  if (!isLogged) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-[#f3f4f6] flex items-center justify-center">
        <div className="text-center">
          <AiOutlineShoppingCart className="text-8xl text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Please Login</h2>
          <p className="text-gray-400 mb-6">You need to be logged in to view your cart</p>
          <Link 
            to="/login"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            Login Now
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-[#f3f4f6] flex items-center justify-center">
        <div className="text-center">
          <AiOutlineShoppingCart className="text-8xl text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your Cart is Empty</h2>
          <p className="text-gray-400 mb-6">Looks like you haven't added any items to your cart yet</p>
          <Link 
            to="/"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f3f4f6] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Razorpay Loading Warning */}
        {!razorpayLoaded && (
          <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-500 rounded-lg flex items-center gap-3">
            <AiOutlineWarning className="text-yellow-400" />
            <span className="text-yellow-400">Payment system is loading...</span>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="text-2xl hover:text-indigo-400 transition"
              aria-label="Go back"
            >
              <AiOutlineArrowLeft />
            </button>
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm">
              {cart.length} {cart.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          
          {cart.length > 0 && (
            <button
              onClick={clearCartHandler}
              className="text-red-500 hover:text-red-400 transition flex items-center gap-2"
              aria-label="Clear cart"
            >
              <AiOutlineDelete /> Clear Cart
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-[#1a1a1a] rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Cart Items</h2>
              
              {cart.map((item) => (
                <div key={item._id} className="border-b border-gray-700 pb-6 mb-6 last:border-b-0">
                  {errors[item._id] && (
                    <div className="mb-4 p-3 bg-red-900/20 border border-red-500 rounded-lg text-red-400 text-sm">
                      {errors[item._id]}
                    </div>
                  )}
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product Image */}
                    <div className="w-full sm:w-32 h-32 bg-[#111] rounded-lg flex items-center justify-center">
                      <img
                        src={getImageUrl(item)}
                        alt={item.title || item.name}
                        className="max-h-full max-w-full object-contain rounded-lg"
                        loading="lazy"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-[#f3f4f6]">
                          {item.title || item.name}
                        </h3>
                        <button
                          onClick={() => removeFromCartHandler(item._id)}
                          className="text-red-500 hover:text-red-400 transition"
                          disabled={loading}
                          aria-label="Remove item"
                        >
                          <AiOutlineDelete size={20} />
                        </button>
                      </div>

                      <p className="text-gray-400 text-sm mb-4">
                        {item.description?.substring(0, 100)}...
                      </p>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-400">Quantity:</span>
                          <div className="flex items-center bg-[#111] rounded-lg">
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              disabled={item.quantity <= 1 || loading}
                              className="p-2 hover:bg-gray-700 rounded-l-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                              aria-label="Decrease quantity"
                            >
                              <AiOutlineMinus />
                            </button>
                            <span className="px-4 py-2 border-x border-gray-700 min-w-[50px] text-center">
                              {loading ? <AiOutlineLoading3Quarters className="animate-spin mx-auto" /> : item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              disabled={loading}
                              className="p-2 hover:bg-gray-700 rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                              aria-label="Increase quantity"
                            >
                              <AiOutlinePlus />
                            </button>
                          </div>
                        </div>

                        {/* Price and Actions */}
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => moveToWishlist(item)}
                            className="flex items-center gap-2 text-gray-400 hover:text-indigo-400 transition"
                          >
                            <AiOutlineHeart /> Save for Later
                          </button>
                          <div className="text-right">
                            <p className="text-lg font-bold text-indigo-400">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-400">
                              ₹{item.price.toLocaleString()} each
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {/* Promo Code Section */}
              <div className="bg-[#1a1a1a] rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <AiOutlineGift className="text-indigo-400" />
                  Promo Code
                </h3>
                
                {!promoApplied ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 bg-[#111] border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                      onKeyPress={(e) => e.key === 'Enter' && applyPromoCode()}
                    />
                    <button
                      onClick={applyPromoCode}
                      disabled={!promoCode.trim()}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Apply
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-green-900/20 border border-green-500 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <AiOutlineCheckCircle className="text-green-400" />
                      <span className="text-green-400">{promoCode.toUpperCase()}</span>
                      <span className="text-sm text-gray-400">
                        ({(promoDiscount * 100).toFixed(0)}% off)
                      </span>
                    </div>
                    <button
                      onClick={removePromoCode}
                      className="text-red-500 hover:text-red-400"
                      aria-label="Remove promo code"
                    >
                      <AiOutlineDelete />
                    </button>
                  </div>
                )}

                {/* Available Promo Codes Hint */}
                {!promoApplied && (
                  <div className="mt-3 text-xs text-gray-500">
                    Try: WELCOME10, STRENGTH20, SUMMER15, NEWUSER
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="bg-[#1a1a1a] rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal ({cart.length} items)</span>
                    <span>₹{cartCalculations.subtotal.toLocaleString()}</span>
                  </div>
                  
                  {promoApplied && (
                    <div className="flex justify-between text-green-400">
                      <span>Discount ({(promoDiscount * 100).toFixed(0)}%)</span>
                      <span>-₹{cartCalculations.discount.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className={cartCalculations.shipping === 0 ? 'text-green-400' : ''}>
                      {cartCalculations.shipping === 0 ? 'FREE' : `₹${cartCalculations.shipping}`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Tax (GST 18%)</span>
                    <span>₹{Math.round(cartCalculations.tax).toLocaleString()}</span>
                  </div>
                  
                  <div className="border-t border-gray-700 pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-indigo-400">₹{Math.round(cartCalculations.total).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Free Shipping Progress */}
                {cartCalculations.shipping > 0 && (
                  <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-500 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MdLocalShipping className="text-yellow-400" />
                      <span className="text-sm text-yellow-400">
                        Add ₹{(FREE_SHIPPING_THRESHOLD - cartCalculations.subtotal).toLocaleString()} more for FREE shipping
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((cartCalculations.subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Payment Buttons */}
                <div className="space-y-3">
                  {/* Razorpay Payment Button */}
                  <button
                    onClick={handleDirectPayment}
                    disabled={paymentProcessing || cart.length === 0 || !razorpayLoaded}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {paymentProcessing ? (
                      <>
                        <AiOutlineLoading3Quarters className="animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <AiOutlineCreditCard />
                        Pay Now - ₹{Math.round(cartCalculations.total).toLocaleString()}
                      </>
                    )}
                  </button>

                  {/* Traditional Checkout */}
                  <button
                    onClick={handleCheckout}
                    disabled={isProcessing || cart.length === 0}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <AiOutlineLoading3Quarters className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Proceed to Checkout'
                    )}
                  </button>
                </div>

                {/* Payment Methods */}
                <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
                  <p className="text-sm text-gray-400 mb-2">Secure payments via Razorpay:</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                    <span>💳 Credit/Debit Cards</span>
                    <span>🏦 Net Banking</span>
                    <span>📱 UPI</span>
                    <span>💰 Wallets</span>
                  </div>
                </div>

                {/* Security & Benefits */}
                <div className="mt-6 space-y-3 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <MdSecurity className="text-green-400" />
                    <span>256-bit SSL encryption</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MdRefresh className="text-blue-400" />
                    <span>Easy returns within 30 days</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MdLocalShipping className="text-yellow-400" />
                    <span>Free shipping on orders ₹{FREE_SHIPPING_THRESHOLD.toLocaleString()}+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;