import React, { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { dummyProducts } from '../assets/data'
import toast from 'react-hot-toast'
import axios from 'axios'

axios.defaults.withCredentials = true
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL

export const ShopContext = createContext()

const ShopContextProvider = ({ children }) => {

    const navigate = useNavigate()
    const currency = import.meta.env.VITE_CURRENCY
    const delivery_charges = 10
    const [user, setUser] = useState(null)
    const [products, setproducts] = useState([])
    const [searchQuery, setsearchQuery] = useState("")
    const [showUserLogin, setShowUserLogin] = useState(false)
    const [cartItems, setCartItems] = useState({})
    const [isAdmin, setIsAdmin] = useState(false)


    const fetchProducts = async () => {
        try {
            const { data } = await axios.get('/api/product/list')
            if (data.success) {
                setproducts(data.products)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Fetch User
    const fetchUser = async () => {
        try {
            const { data } = await axios.get('/api/user/is-auth')
            if (data.success) {
                setUser(data.user)
                setCartItems(data.user.cartData)
            } else {
                setUser(null)
                setCartItems({})
            }
        } catch (error) {
            setUser(null)
            setCartItems({})
        }
    }

    // handle user login success
    const handleLoginSuccess = async () => {
        await fetchUser()
        navigate('/')
    }

    // user logout 
    const userLogut = async () => {
        try {
            const { data } = await axios.post('/api/user/logout')
            if (data.success) {
                toast.success(data.message)
                setUser(null)
                setCartItems({})
                navigate('/')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // fetch  admin
    const fetchAdmin = async () => {
        try {
            const { data } = await axios.post("/api/admin/is-auth")
            setIsAdmin(data.success)
        } catch (error) {
            setIsAdmin(false)
        }
    }

    // Add Product to the Cart
    const addToCart = async (itemId, size) => {
        if (!size) return toast.error("Please select a size first");
        let cartData = structuredClone(cartItems)
        // Output initially: {}
        // cartItems = {}
        // cartData = {}

        // STEP 3: Create an empty object for this product
        // if it doesn't already exist.
        cartData[itemId] = cartData[itemId] || {}
        // Output: { shirt123: {} }
        // Assuming itemId = "shirt123"

        // STEP 4: Increase the quantity of the selected size by 1.
        cartData[itemId][size] = (cartData[itemId][size] || 0) + 1
        // Assuming size = "M"
        // Output: { shirt123: { M: 1 } }
        // If M already had quantity 1, it becomes 2
        setCartItems(cartData);

        if (user) {
            try {
                const { data } = await axios.post("/api/cart/add", {userId: user._id, itemId, size });
                if (data.success) {
                    toast.success(data.message);
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error(error.message);
            }
        }
    };

    

    // Get Cart Count
    const getCartCount = () => {
        let count = 0
        for (const itemId in cartItems) {
            for (const size in cartItems[itemId]) {
                count += cartItems[itemId][size]
            }
        }
        return count
    }

    // Update Cart Quantity
    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems)
        cartData[itemId][size] = quantity
        setCartItems(cartData)
        if (user) {
            try {
                const { data } = await axios.post("/api/cart/update", {
                    itemId,
                    size,
                    quantity,
                });
                if (data.success) {
                    toast.success(data.message);
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error(error.message);
            }

        };
    }

    // Get Cart Amount
    const getCartAmount = () => {
        let total = 0
        for (const itemId in cartItems) {
            const product = products.find((p) => p._id === itemId)
            if (!product) continue;
            for (const size in cartItems[itemId]) {
                total += product.offerPrice * cartItems[itemId][size]
            }
        }
        return total
    }

    useEffect(() => {
        fetchProducts(),
            fetchAdmin(),
            fetchUser()
    }, [])

    const value = {
        fetchProducts,
        navigate,
        user,
        setUser,
        products,
        searchQuery,
        setsearchQuery,
        currency,
        showUserLogin,
        setShowUserLogin,
        cartItems,
        setCartItems,
        addToCart,
        getCartAmount,
        getCartCount,
        updateQuantity,
        delivery_charges,
        isAdmin,
        setIsAdmin,
        axios,
        handleLoginSuccess,
        userLogut,
        fetchUser
    }

    return (
        <ShopContext.Provider value={value}>
            {children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider