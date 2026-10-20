import React, { useContext } from 'react'
import { Route, Routes,useLocation } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Collection from './pages/Collection'
import CategoryCollection from './pages/CategoryCollection'
import ProductDetails from './pages/ProductDetails'
import Footer from './components/Footer'
import Testimonials from './pages/Testimonials'
import Contact from './pages/Contact'
import Cart from './pages/Cart'
import MyOrders from './pages/MyOrders'
import PlaceOrder from './pages/PlaceOrder'
import { ShopContext } from './context/ShopContext'
import Login from './components/Login'
import AddProduct from './pages/admin/AddProduct'
import ProductList from './pages/admin/ProductList'
import AdminLogin from './components/admin/AdminLogin'
import Sidebar from './components/admin/Sidebar'



import Orders from './pages/admin/Orders';

const App = () => {
  const { showUserLogin ,isAdmin} = useContext(ShopContext)
const location = useLocation()
const isAdminPage = location.pathname.includes("admin")

  return (
    <main className='overflow-hidden text-tertiary'>
      {showUserLogin && <Login />}
      {!isAdminPage && <Header />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/collection' element={<Collection />} />
        <Route path='/collection/:category' element={<CategoryCollection />} />
        <Route path='/collection/:category/:id' element={<ProductDetails />} />
        <Route path='/testimonial' element={<Testimonials />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/my-orders' element={<MyOrders />} />
        <Route path='/place-order' element={<PlaceOrder />} />
        <Route path='/admin' element={isAdmin ? <Sidebar /> : <AdminLogin />}>
          <Route index element={isAdmin ? <AddProduct /> : null} />
          <Route path='list' element={<ProductList />} />
          <Route path='orders' element={<Orders />} />
        </Route>
      </Routes>
      {!isAdminPage && <Footer />}
    </main>
  )
}

export default App