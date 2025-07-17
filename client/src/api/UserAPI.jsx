import axios from '../utils/AxiosClient';
import React, { useEffect, useState, useCallback } from 'react'

const UserAPI = (token) => {
    const [isLogged, setIsLogged] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false);
    const [cart, setCart] = useState([])
    const [isLoadingUser, setIsLoadingUser] = useState(true); // Start with true to show loading initially

    useEffect(() => {
        const getUser = async () => {
            try {
                setIsLoadingUser(true);
                
                if (!token) {
                    // No token, reset everything
                    setIsLogged(false);
                    setIsAdmin(false);
                    setCart([]);
                    setIsLoadingUser(false);
                    return;
                }
                
                // Ensure token has "Bearer " prefix
                const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

                console.log('Fetching user data with token:', authToken);
                
                const res = await axios.get('/api/auth/user', {
                    headers: { Authorization: authToken }
                });
                
                console.log('User API response:', res.data);
                
                setIsLogged(true);
                
                // More explicit admin check
                const isUserAdmin = res.data.role === 'admin';
                setIsAdmin(isUserAdmin);
                
                console.log('User role:', res.data.role);
                console.log('Is admin:', isUserAdmin);
                
                // If user has a cart in their profile, sync it
                if (res.data.cart && Array.isArray(res.data.cart)) {
                    setCart(res.data.cart);
                }

                console.log('User data loaded successfully:', {
                    role: res.data.role,
                    isAdmin: isUserAdmin,
                    isLogged: true
                });
            }
            catch (err) {
                console.error('Failed to fetch user info:', err);
                
                // Reset all states on error
                setIsLogged(false);
                setIsAdmin(false);
                setCart([]);
                
                // If token is invalid/expired, clear stored tokens
                if (err.response?.status === 401 || err.response?.status === 403) {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('firstLogin');
                    
                    console.log('Session expired. Please login again.');
                } else {
                    // For other errors, show the message
                    console.error('Error fetching user:', err.response?.data?.msg || "Failed to fetch user info.");
                }
            } finally {
                setIsLoadingUser(false);
            }
        };

        // Always call getUser, it will handle the no-token case
        getUser();
    }, [token])

    // Optimize addCart function with useCallback to prevent unnecessary re-renders
    const addCart = useCallback((product) => {
        if (!isLogged) {
            alert("Please Login first");
            return;
        }

        // Check if product already exists in cart
        const existingItemIndex = cart.findIndex(item => item._id === product._id);
        
        if (existingItemIndex !== -1) {
            // If item exists, increase quantity
            const updatedCart = [...cart];
            updatedCart[existingItemIndex].quantity += 1;
            setCart(updatedCart);
            console.log('Product quantity updated in cart');
        } else {
            // If item doesn't exist, add new item
            const newItem = {
                ...product,
                quantity: 1,
                // Ensure we have the product ID
                _id: product._id || product.id
            };
            setCart(prevCart => [...prevCart, newItem]);
            console.log('New product added to cart');
        }
    }, [isLogged, cart]);

    // Add remove from cart function
    const removeFromCart = useCallback((productId) => {
        setCart(prevCart => prevCart.filter(item => item._id !== productId));
    }, []);

    // Add update quantity function
    const updateCartQuantity = useCallback((productId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(productId);
            return;
        }
        
        setCart(prevCart => 
            prevCart.map(item => 
                item._id === productId 
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    }, [removeFromCart]);

    // Add clear cart function
    const clearCart = useCallback(() => {
        setCart([]);
    }, []);

    return {
        isLogged: [isLogged, setIsLogged],
        isAdmin: [isAdmin, setIsAdmin],
        cart: [cart, setCart],
        addCart: addCart,
        removeFromCart: removeFromCart,
        updateCartQuantity: updateCartQuantity,
        clearCart: clearCart,
        isLoadingUser: isLoadingUser
    };
}

export default UserAPI