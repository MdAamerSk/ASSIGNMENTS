import React, { useState } from 'react'
import Navbar from './components/Navbar'
import { Route,Routes } from 'react-router'
import Home from './pages/Home'
import About from './pages/About'
import Shop from './pages/Shop'

const App = () => {
  const [cart, setCart] = useState([])

  const toggleCartItem = (product) => {
    setCart((prev) => {
      const exists = prev.some((item) => item.id === product.id)
      if (exists) {
        return prev.filter((item) => item.id !== product.id)
      } else {
        return [...prev, product]
      }
    })
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#ccff00] selection:text-black">
      <Navbar cartCount={cart.length} />
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/shop' element={<Shop cart={cart} toggleCartItem={toggleCartItem} />} />
        <Route path='/about' element={<About/>} />
      </Routes>
    </div>
  )
}

export default App


