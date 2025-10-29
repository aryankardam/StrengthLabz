// services/PaymentService.js
import axios from '../utils/AxiosClient';

// Create axios instance
const api = axios.create({
  // baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  baseURL: 'http://localhost:3000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear tokens and redirect to login
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

class PaymentService {
  /**
   * Load Razorpay script dynamically
   */
  static loadRazorpayScript() {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  /**
   * Create Razorpay order on backend
   */
  static async createOrder(orderData) {
    try {
      const response = await api.post('/api/payment/create-order', orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      
      if (error.response?.status === 401) {
        throw new Error('Please login to continue');
      } else if (error.response?.status === 400) {
        throw new Error(error.response.data.message || 'Invalid order data');
      }
      
      throw new Error('Failed to create order. Please try again.');
    }
  }

  /**
   * Verify payment on backend
   */
  static async verifyPayment(paymentData) {
    try {
      const response = await api.post('/api/payment/verify', paymentData);
      return response.data;
    } catch (error) {
      console.error('Error verifying payment:', error);
      
      if (error.response?.status === 400) {
        throw new Error('Payment verification failed');
      }
      
      throw new Error('Payment verification failed. Please contact support.');
    }
  }

  /**
   * Validate Razorpay options
   */
  static validateRazorpayOptions(options) {
    const required = ['key', 'amount', 'currency', 'order_id'];
    const missing = required.filter(field => !options[field]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }

    // Validate amount is a positive integer
    if (!Number.isInteger(options.amount) || options.amount <= 0) {
      throw new Error('Amount must be a positive integer in paisa');
    }

    // Validate key format (should be a string starting with rzp_)
    if (typeof options.key !== 'string' || !options.key.startsWith('rzp_')) {
      throw new Error('Invalid Razorpay key format');
    }

    return true;
  }

  /**
   * Process complete payment flow
   */
  static async processPayment(orderDetails) {
    try {
      // Validate input
      if (!orderDetails.cart || orderDetails.cart.length === 0) {
        throw new Error('Cart is empty');
      }

      if (!orderDetails.total || orderDetails.total <= 0) {
        throw new Error('Invalid total amount');
      }

      // Load Razorpay script
      const scriptLoaded = await this.loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Payment system unavailable. Please try again later.');
      }

      // Prepare order data
      const orderData = {
        amount: Math.round(orderDetails.total * 100), // Convert to paisa
        currency: 'INR',
        receipt: `order_${Date.now()}`,
        cart: orderDetails.cart.map(item => ({
          _id: item._id,
          title: item.title || item.name,
          price: item.price,
          quantity: item.quantity,
          images: item.images,
          description: item.description
        })),
        customerInfo: orderDetails.customerInfo,
        shipping: orderDetails.shipping,
        tax: orderDetails.tax,
        discount: orderDetails.discount,
        promoCode: orderDetails.promoCode
      };

      // Create order on backend
      const orderResponse = await this.createOrder(orderData);

      // Validate required fields from backend response
      if (!orderResponse.razorpayKeyId || !orderResponse.razorpayOrderId) {
        throw new Error('Invalid response from payment server');
      }

      // Configure Razorpay options with proper validation
      const razorpayOptions = {
        key: orderResponse.razorpayKeyId,
        amount: orderResponse.amount,
        currency: orderResponse.currency || 'INR',
        name: 'Your Store Name',
        description: `Order for ${orderDetails.cart.length} items`,
        order_id: orderResponse.razorpayOrderId,
        prefill: {
          name: orderDetails.customerInfo?.name || '',
          email: orderDetails.customerInfo?.email || '',
          contact: orderDetails.customerInfo?.phone || ''
        },
        theme: {
          color: '#4F46E5'
        },
        modal: {
          backdropclose: false,
          escape: false,
          handleback: false
        }
      };

      // Validate options before creating Razorpay instance
      this.validateRazorpayOptions(razorpayOptions);

      // Open Razorpay and handle payment
      return new Promise((resolve, reject) => {
        try {
          const razorpay = new window.Razorpay({
            ...razorpayOptions,
            handler: async (response) => {
              try {
                // Verify payment on backend
                const verificationData = {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderDetails
                };

                const verificationResponse = await this.verifyPayment(verificationData);

                resolve({
                  success: true,
                  paymentResponse: response,
                  verificationResponse,
                  orderDetails
                });
              } catch (verificationError) {
                console.error('Payment verification failed:', verificationError);
                reject({
                  error: 'Payment verification failed',
                  details: verificationError.message
                });
              }
            },
            modal: {
              ondismiss: () => {
                reject({
                  error: 'Payment cancelled by user',
                  details: 'User closed the payment dialog'
                });
              }
            }
          });

          // Additional safety check before opening
          if (!razorpay) {
            throw new Error('Failed to initialize payment gateway');
          }

          razorpay.open();
        } catch (razorpayError) {
          console.error('Razorpay initialization failed:', razorpayError);
          reject({
            error: 'Payment gateway initialization failed',
            details: razorpayError.message
          });
        }
      });

    } catch (error) {
      console.error('Payment processing failed:', error);
      throw {
        error: error.message || 'Payment processing failed',
        details: 'An unexpected error occurred during payment processing'
      };
    }
  }

  /**
   * Get payment history
   */
  static async getPaymentHistory() {
    try {
      const response = await api.get('/api/payment/history');
      return response.data;
    } catch (error) {
      console.error('Error fetching payment history:', error);
      throw error;
    }
  }

  /**
   * Get order details by ID
   */
  static async getOrderDetails(orderId) {
    try {
      const response = await api.get(`/api/payment/order/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw error;
    }
  }

  /**
   * Retry failed payment
   */
  static async retryPayment(orderId) {
    try {
      const response = await api.post(`/api/payment/retry/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error retrying payment:', error);
      throw error;
    }
  }
}

export default PaymentService;