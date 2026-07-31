import React from 'react'
import Navbar from './components/Navbar'
import { Route,Routes } from 'react-router'
import Home from './pages/Home'
import About from './pages/About'
import Shop from './pages/Shop'

const App = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#ccff00] selection:text-black">
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/shop' element={<Shop/>} />
        <Route path='/about' element={<About/>} />
      </Routes>
    </div>
  )
}

export default App

