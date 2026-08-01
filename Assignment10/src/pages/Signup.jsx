import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Zap, User, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'

const Signup = ({ onSignup }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    // Simple validations
    if (!name || !email || !password || !confirmPassword) return
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    // Process signup database insertion
    try {
      const users = JSON.parse(localStorage.getItem('skymart_users') || '[]')
      
      // Check if email already exists
      const emailExists = users.some(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      )

      if (emailExists) {
        setError("Email already registered")
        return
      }

      // Add new user to database
      const newUser = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password
      }
      users.push(newUser)
      localStorage.setItem('skymart_users', JSON.stringify(users))

      onSignup({ name: newUser.name, email: newUser.email })
      navigate('/')
    } catch (err) {
      setError("An error occurred during registration")
      console.error(err)
    }
  }

  const handleNameChange = (val) => {
    setName(val)
    if (error) setError('')
  }

  const handleEmailChange = (val) => {
    setEmail(val)
    if (error) setError('')
  }

  const handlePasswordChange = (val) => {
    setPassword(val)
    if (error) setError('')
  }

  const handleConfirmChange = (val) => {
    setConfirmPassword(val)
    if (error) setError('')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col justify-center items-center p-6">
      
      {/* Brand Logo Centered */}
      <div className="flex items-center gap-3 mb-6 cursor-pointer" onClick={() => navigate('/')}>
        <div className="w-9 h-9 bg-[#ccff00] rounded-xl flex items-center justify-center shadow-lg shadow-[#ccff00]/10">
          <Zap className="w-5 h-5 text-black fill-black" />
        </div>
        <span className="text-xl font-bold tracking-wide">
          Sky<span className="text-[#ccff00]">Mart</span>
        </span>
      </div>

      {/* Form Card */}
      <div className="bg-[#0d0d0d] border border-neutral-900 rounded-[28px] p-8 max-w-sm w-full space-y-6 shadow-2xl">
        
        {/* Header */}
        <div className="space-y-1">
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Create account</h2>
          <p className="text-neutral-500 text-xs font-semibold">
            Join SkyMart and start shopping
          </p>
        </div>

        {/* Inline Error Alert Box */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold p-3.5 rounded-xl text-center select-none animate-shake">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name */}
          <div className="relative">
            <User className="absolute left-4 top-3.5 w-4 h-4 text-neutral-500" />
            <input 
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Full name"
              className="w-full bg-[#131313] border border-neutral-900 rounded-xl py-3.5 pl-11 pr-4 text-xs font-semibold text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-800 transition-all"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 w-4 h-4 text-neutral-500" />
            <input 
              type="email"
              required
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder="Email address"
              className="w-full bg-[#131313] border border-neutral-900 rounded-xl py-3.5 pl-11 pr-4 text-xs font-semibold text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-800 transition-all"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 w-4 h-4 text-neutral-500" />
            <input 
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              placeholder="Password (min 6 chars)"
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

          {/* Confirm Password */}
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 w-4 h-4 text-neutral-500" />
            <input 
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => handleConfirmChange(e.target.value)}
              placeholder="Confirm password"
              className="w-full bg-[#131313] border border-neutral-900 rounded-xl py-3.5 pl-11 pr-4 text-xs font-semibold text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-800 transition-all"
            />
          </div>

          {/* Submit */}
          <button 
            type="submit"
            className="w-full bg-[#ccff00] hover:bg-[#b5e600] active:scale-[0.98] text-black font-extrabold py-3.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer mt-2 text-xs"
          >
            Create Account <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>

        </form>

        {/* Footer */}
        <span className="text-neutral-500 text-xs text-center font-semibold mt-4 block">
          Already have an account?{' '}
          <Link to="/login" className="text-[#ccff00] font-bold hover:underline">
            Sign in
          </Link>
        </span>

      </div>

    </div>
  )
}

export default Signup
