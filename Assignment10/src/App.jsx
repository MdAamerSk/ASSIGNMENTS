import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation, Navigate } from 'react-router'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Login from './pages/Login'
import Signup from './pages/Signup'
import CartDrawer from './components/CartDrawer'
import Footer from './components/Footer'

const App = () => {
  // Initialize cart from localStorage
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('skymart_cart')
      return savedCart ? JSON.parse(savedCart) : []
    } catch (e) {
      console.error('Failed to load cart from localStorage', e)
      return []
    }
  })

  // Initialize user session from localStorage
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('skymart_current_user')
      return savedUser ? JSON.parse(savedUser) : null
    } catch (e) {
      console.error('Failed to load user session from localStorage', e)
      return null
    }
  })

  const [isCartOpen, setIsCartOpen] = useState(false)
  const location = useLocation()

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('skymart_cart', JSON.stringify(cart))
  }, [cart])

  // Save user session to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('skymart_current_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('skymart_current_user')
    }
  }, [user])

  const toggleCartItem = (product) => {
    setCart((prev) => {
      const exists = prev.some((item) => item.id === product.id)
      if (exists) {
        return prev.filter((item) => item.id !== product.id)
      } else {
        // Automatically open cart drawer when adding a new item
        setIsCartOpen(true)
        return [...prev, { ...product, quantity: 1 }]
      }
    })
  }

  const updateQuantity = (productId, change) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    )
  }

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId))
  }

  const clearCart = () => {
    setCart([])
  }

  const handleLogout = () => {
    setUser(null)
    setCart([])
    localStorage.removeItem('skymart_cart')
  }

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0)
  
  const showNavbar = location.pathname !== '/login' && location.pathname !== '/signup'

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-white selection:bg-[#ccff00] selection:text-black">
      {/* Session protection: Redirect to signin if not logged in */}
      {!user && location.pathname !== '/login' && location.pathname !== '/signup' && (
        <Navigate to="/login" replace />
      )}

      {showNavbar && (
        <Navbar 
          cartCount={totalQuantity} 
          onCartClick={() => setIsCartOpen(true)} 
          user={user}
          onLogout={handleLogout}
        />
      )}
      
      <main className="flex-grow">
        <Routes>
          <Route path='/login' element={<Login onLogin={(u) => setUser(u)} />} />
          <Route path='/signup' element={<Signup onSignup={(u) => setUser(u)} />} />
          <Route path='/' element={<Home cart={cart} user={user} />} />
          <Route path='/shop' element={<Shop cart={cart} toggleCartItem={toggleCartItem} />} />
        </Routes>
      </main>

      {showNavbar && <Footer />}

      <CartDrawer 
        cart={cart}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
      />
    </div>
  )
}

export default App
