import React, { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { dummyProducts } from '../assets/data'
import toast from 'react-hot-toast'


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

    const fetchProducts = () => {
        setproducts(dummyProducts)
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
        toast.success("Item added to cart")
    }

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
        fetchProducts()

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
    }

    return (
        <ShopContext.Provider value={value}>
            {children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider