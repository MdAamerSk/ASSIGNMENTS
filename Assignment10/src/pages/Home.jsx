import React from 'react'
import { Link, useNavigate } from 'react-router'
import { Box, TrendingUp, Star, Tag, ArrowRight } from 'lucide-react'

const Home = ({ cart = [], user }) => {
  const navigate = useNavigate()

  // Calculate dynamic stats
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartValue = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Categories list matching mockup
  const categories = [
    { name: 'Electronics', count: 17, icon: '💻' },
    { name: 'Clothing', count: 2, icon: '📦' },
    { name: 'Furniture', count: 3, icon: '📦' },
    { name: 'Home', count: 14, icon: '📦' },
    { name: 'Sports', count: 8, icon: '📦' },
    { name: 'Accessories', count: 6, icon: '📦' },
  ]

  return (
    <div className="max-w-[1600px] mx-auto px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Hero Section */}
      <div 
        className="relative overflow-hidden bg-[#0a0a0a] border border-neutral-900 rounded-3xl p-8 md:p-12 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(204, 255, 0, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(204, 255, 0, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }}
      >
        {/* Left Side: Welcome Text */}
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center gap-2 text-[#ccff00] text-xs font-extrabold tracking-widest uppercase">
            <span>Good Evening</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-white">
            Welcome back, <br className="sm:hidden" />
            <span className="text-[#ccff00]">{user?.name || 'demo'}!</span>
          </h1>
          
          <p className="text-neutral-400 text-sm md:text-base leading-relaxed max-w-lg">
            Discover today's picks — hand-curated products across electronics, fashion, and more.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link 
              to="/shop" 
              className="flex items-center gap-2 bg-[#ccff00] hover:bg-[#b5e600] active:scale-95 text-black font-extrabold px-6 py-3.5 rounded-xl transition-all shadow-md shadow-[#ccff00]/10"
            >
              Shop Now <ArrowRight className="w-4 h-4 stroke-3" />
            </Link>
            <Link 
              to="/shop" 
              className="flex items-center gap-2 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white font-semibold px-6 py-3.5 rounded-xl transition-all"
            >
              View All Products
            </Link>
          </div>
        </div>

        {/* Right Side: Quick Stats Cards */}
        <div className="flex sm:flex-row lg:flex-col gap-4 w-full sm:w-auto shrink-0">
          <div className="flex-1 sm:flex-none bg-[#101407] border border-[#ccff00]/15 rounded-2xl p-5 w-full sm:w-44 text-center flex flex-col justify-center items-center shadow-lg shadow-[#ccff00]/2">
            <span className="text-2xl font-black text-[#ccff00] tracking-tight">20+</span>
            <span className="text-neutral-400 text-xs font-semibold mt-1.5 block">Products Available</span>
          </div>
          <div className="flex-1 sm:flex-none bg-[#0c0c0c] border border-neutral-900 rounded-2xl p-5 w-full sm:w-44 text-center flex flex-col justify-center items-center">
            <span className="text-2xl font-black text-white tracking-tight">Free</span>
            <span className="text-neutral-400 text-xs font-semibold mt-1.5 block">Delivery on ₹999+</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1: Cart Items */}
        <div className="bg-[#0f0f0f] border border-neutral-900 rounded-2xl p-5 flex items-center gap-4 hover:border-neutral-800 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-[#ccff00]/10 border border-[#ccff00]/20 flex items-center justify-center shrink-0">
            <Box className="w-5 h-5 text-[#ccff00]" />
          </div>
          <div>
            <div className="text-2xl font-black text-white tracking-tight">{cartItemsCount}</div>
            <div className="text-neutral-300 text-xs font-extrabold mt-0.5">Cart Items</div>
            <div className="text-neutral-500 text-[10px] font-semibold mt-0.5">In your bag</div>
          </div>
        </div>

        {/* Metric 2: Cart Value */}
        <div className="bg-[#0f0f0f] border border-neutral-900 rounded-2xl p-5 flex items-center gap-4 hover:border-neutral-800 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-white tracking-tight">
              ${cartValue.toFixed(2)}
            </div>
            <div className="text-neutral-300 text-xs font-extrabold mt-0.5">Cart Value</div>
            <div className="text-neutral-500 text-[10px] font-semibold mt-0.5">Ready to checkout</div>
          </div>
        </div>

        {/* Metric 3: Top Products */}
        <div className="bg-[#0f0f0f] border border-neutral-900 rounded-2xl p-5 flex items-center gap-4 hover:border-neutral-800 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Star className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-white tracking-tight">5</div>
            <div className="text-neutral-300 text-xs font-extrabold mt-0.5">Top Products</div>
            <div className="text-neutral-500 text-[10px] font-semibold mt-0.5">Highly rated</div>
          </div>
        </div>

        {/* Metric 4: Categories */}
        <div className="bg-[#0f0f0f] border border-neutral-900 rounded-2xl p-5 flex items-center gap-4 hover:border-neutral-800 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
            <Tag className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-white tracking-tight">6</div>
            <div className="text-neutral-300 text-xs font-extrabold mt-0.5">Categories</div>
            <div className="text-neutral-500 text-[10px] font-semibold mt-0.5">To explore</div>
          </div>
        </div>

      </div>

      {/* Shop by Category Section */}
      <div className="space-y-6 pt-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-extrabold text-white tracking-tight">Shop by Category</h2>
          <button 
            onClick={() => navigate('/shop')}
            className="flex items-center gap-1.5 text-[#ccff00] hover:text-[#b5e600] text-xs font-extrabold hover:underline cursor-pointer transition-colors"
          >
            View All <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => navigate('/shop')}
              className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-md hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group cursor-pointer"
            >
              <span className="text-3xl mb-3 transform group-hover:scale-110 transition-transform select-none">
                {cat.icon}
              </span>
              <span className="text-neutral-900 font-extrabold text-sm tracking-wide block">
                {cat.name}
              </span>
              <span className="text-neutral-500 text-[11px] font-semibold mt-1.5 block">
                {cat.count} items
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default Home
