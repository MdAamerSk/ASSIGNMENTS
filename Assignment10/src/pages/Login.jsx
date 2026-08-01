import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Zap, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Perform simple validation
    if (!email || !password) return

    // Simple email extraction for name
    const username = email.split('@')[0] || 'demo'
    
    // Call parent handler
    onLogin({ name: username, email })
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col md:flex-row">
      
      {/* Left Pane - Showcase */}
      <div 
        className="flex-1 flex flex-col justify-between p-8 md:p-16 border-b md:border-b-0 md:border-r border-neutral-900"
        style={{
          backgroundImage: 'radial-gradient(circle at center, rgba(204, 255, 0, 0.02) 0%, transparent 60%)'
        }}
      >
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#ccff00] rounded-xl flex items-center justify-center shadow-lg shadow-[#ccff00]/10">
            <Zap className="w-5 h-5 text-black fill-black" />
          </div>
          <span className="text-xl font-bold tracking-wide">
            Sky<span className="text-[#ccff00]">Mart</span>
          </span>
        </div>

        {/* Hero Headline */}
        <div className="my-12 md:my-auto max-w-lg space-y-5">
          <span className="text-[#ccff00] text-xs font-extrabold tracking-widest uppercase block">
            Welcome back
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-white">
            Shop the future. <br />
            <span className="text-[#ccff00]">Today.</span>
          </h1>
          <p className="text-neutral-400 text-sm md:text-base leading-relaxed max-w-md">
            Thousands of products, lightning-fast delivery, and prices that make your wallet happy.
          </p>
        </div>

        {/* Stats Badges */}
        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-neutral-900/60 max-w-md">
          <div className="border border-neutral-900 bg-[#0d0d0d]/40 rounded-2xl p-4 text-center">
            <span className="text-lg md:text-xl font-black text-[#ccff00] block">20K+</span>
            <span className="text-neutral-500 text-[10px] font-semibold mt-1 block">Products</span>
          </div>
          <div className="border border-neutral-900 bg-[#0d0d0d]/40 rounded-2xl p-4 text-center">
            <span className="text-lg md:text-xl font-black text-[#ccff00] block">50K+</span>
            <span className="text-neutral-500 text-[10px] font-semibold mt-1 block">Users</span>
          </div>
          <div className="border border-neutral-900 bg-[#0d0d0d]/40 rounded-2xl p-4 text-center">
            <span className="text-lg md:text-xl font-black text-[#ccff00] block">4.9★</span>
            <span className="text-neutral-500 text-[10px] font-semibold mt-1 block">Rating</span>
          </div>
        </div>

      </div>

      {/* Right Pane - Form */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16 bg-[#0a0a0a]">
        
        <div className="bg-[#0d0d0d] border border-neutral-900 rounded-[28px] p-8 max-w-sm w-full space-y-6 shadow-2xl">
          
          {/* Card Header */}
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Sign in</h2>
            <p className="text-neutral-500 text-xs font-semibold">
              Enter your credentials to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-4 h-4 text-neutral-500" />
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full bg-[#131313] border border-neutral-900 rounded-xl py-3.5 pl-11 pr-4 text-xs font-semibold text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-800 transition-all"
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-4 h-4 text-neutral-500" />
              <input 
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-[#131313] border border-neutral-900 rounded-xl py-3.5 pl-11 pr-11 text-xs font-semibold text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-800 transition-all"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-neutral-500 hover:text-neutral-300 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              className="w-full bg-[#ccff00] hover:bg-[#b5e600] active:scale-[0.98] text-black font-extrabold py-3.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer mt-2 text-xs"
            >
              Sign in <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>

          </form>

          {/* Footer Navigation */}
          <span className="text-neutral-500 text-xs text-center font-semibold mt-4 block">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#ccff00] font-bold hover:underline">
              Create one
            </Link>
          </span>

        </div>

      </div>

    </div>
  )
}

export default Login
