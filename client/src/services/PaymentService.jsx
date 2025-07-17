import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5173/api', // Adjust based on your backend URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (adjust based on your auth implementation)
    const token = localStorage.getItem('token') || 
                  localStorage.getItem('authToken') ||
                  sessionStorage.getItem('token') ||
                  sessionStorage.getItem('authToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('authToken');
      
      // Redirect to login or dispatch logout action
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

class PaymentService {
  /**
   * Create Razorpay order
   * @param {Object} orderData - Order details
   * @returns {Promise} Order creation response
   */
  static async createOrder(orderData) {
    try {
      console.log('Creating order with data:', orderData);
      
      const response = await api.post('/payment/create-order', orderData);
      
      console.log('Order created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        throw new Error('Authentication required. Please login again.');
      } else if (error.response?.status === 400) {
        throw new Error(error.response.data.message || 'Invalid order data');
      } else if (error.response?.status === 500) {
        throw new Error('Server error. Please try again later.');
      }
      
      throw error;
    }
  }

  /**
   * Verify payment with backend
   * @param {Object} paymentData - Payment verification data
   * @returns {Promise} Verification response
   */
  static async verifyPayment(paymentData) {
    try {
      console.log('Verifying payment:', paymentData);
      
      const response = await api.post('/payment/verify', paymentData);
      
      console.log('Payment verified successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error verifying payment:', error);
      
      if (error.response?.status === 401) {
        throw new Error('Authentication required. Please login again.');
      } else if (error.response?.status === 400) {
        throw new Error('Payment verification failed');
      }
      
      throw error;
    }
  }

  /**
   * Process complete payment flow
   * @param {Object} orderDetails - Complete order details
   * @returns {Promise} Payment processing result
   */
  static async processPayment(orderDetails) {
    try {
      // Validate required fields
      if (!orderDetails.cart || orderDetails.cart.length === 0) {
        throw new Error('Cart is empty');
      }

      if (!orderDetails.total || orderDetails.total <= 0) {
        throw new Error('Invalid total amount');
      }

      // Check if user is authenticated
      const token = localStorage.getItem('token') || 
                    localStorage.getItem('authToken') ||
                    sessionStorage.getItem('token') ||
                    sessionStorage.getItem('authToken');

      if (!token) {
        throw new Error('Please login to continue with payment');
      }

      // Step 1: Create order on backend
      const orderData = {
        amount: Math.round(orderDetails.total * 100), // Convert to paisa
        currency: 'INR',
        receipt: `order_${Date.now()}`,
        cart: orderDetails.cart,
        customerInfo: orderDetails.customerInfo,
        shipping: orderDetails.shipping,
        tax: orderDetails.tax,
        discount: orderDetails.discount,
        promoCode: orderDetails.promoCode
      };

      const orderResponse = await this.createOrder(orderData);

      // Step 2: Initialize Razorpay
      if (!window.Razorpay) {
        throw new Error('Razorpay SDK not loaded');
      }

      // Step 3: Configure Razorpay options
      const options = {
        key: orderResponse.razorpayKeyId || 'your_razorpay_key_id', // Get from backend
        amount: orderResponse.amount,
        currency: orderResponse.currency,
        name: 'Your Store Name',
        description: 'Purchase from Your Store',
        order_id: orderResponse.id,
        customer: {
          name: orderDetails.customerInfo.name,
          email: orderDetails.customerInfo.email,
          contact: orderDetails.customerInfo.phone
        },
        prefill: {
          name: orderDetails.customerInfo.name,
          email: orderDetails.customerInfo.email,
          contact: orderDetails.customerInfo.phone
        },
        theme: {
          color: '#4F46E5' // Your brand color
        },
        handler: async (response) => {
          try {
            // Step 4: Verify payment on backend
            const verificationData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderDetails: orderDetails
            };

            const verificationResponse = await this.verifyPayment(verificationData);
            
            // Return success response
            return {
              success: true,
              paymentResponse: response,
              verificationResponse: verificationResponse
            };
          } catch (verificationError) {
            console.error('Payment verification failed:', verificationError);
            throw {
              error: 'Payment verification failed',
              details: verificationError.message
            };
          }
        },
        modal: {
          ondismiss: () => {
            throw {
              error: 'Payment cancelled by user',
              details: 'User closed the payment dialog'
            };
          }
        }
      };

      // Step 5: Open Razorpay payment modal
      return new Promise((resolve, reject) => {
        const rzp = new window.Razorpay({
          ...options,
          handler: async (response) => {
            try {
              const verificationData = {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderDetails: orderDetails
              };

              const verificationResponse = await this.verifyPayment(verificationData);
              
              resolve({
                success: true,
                paymentResponse: response,
                verificationResponse: verificationResponse
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

        rzp.open();
      });

    } catch (error) {
      console.error('Payment processing failed:', error);
      
      // Handle different error types
      if (error.message === 'Please login to continue with payment') {
        throw {
          error: 'Authentication required',
          details: error.message
        };
      }
      
      throw {
        error: error.message || 'Payment processing failed',
        details: error.details || 'An unexpected error occurred'
      };
    }
  }

  /**
   * Get payment history
   * @returns {Promise} Payment history
   */
  static async getPaymentHistory() {
    try {
      const response = await api.get('/payment/history');
      return response.data;
    } catch (error) {
      console.error('Error fetching payment history:', error);
      throw error;
    }
  }

  /**
   * Cancel payment
   * @param {string} paymentId - Payment ID to cancel
   * @returns {Promise} Cancellation response
   */
  static async cancelPayment(paymentId) {
    try {
      const response = await api.post('/payment/cancel', { paymentId });
      return response.data;
    } catch (error) {
      console.error('Error cancelling payment:', error);
      throw error;
    }
  }
}

export default PaymentService;