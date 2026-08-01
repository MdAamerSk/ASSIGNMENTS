import React, { useState } from 'react'
import Navbar from './components/Navbar'
import { Route,Routes } from 'react-router'
import Home from './pages/Home'
import About from './pages/About'
import Shop from './pages/Shop'
import CartDrawer from './components/CartDrawer'

const App = () => {
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)

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

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#ccff00] selection:text-black">
      <Navbar cartCount={totalQuantity} onCartClick={() => setIsCartOpen(true)} />
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/shop' element={<Shop cart={cart} toggleCartItem={toggleCartItem} />} />
        <Route path='/about' element={<About/>} />
      </Routes>
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


