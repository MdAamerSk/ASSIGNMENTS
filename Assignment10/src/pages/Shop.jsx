import React, { useState, useEffect } from 'react'
import { Search, ChevronDown, X } from 'lucide-react'
import ProductCard from '../components/ProductCard'

const Shop = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // Mock UI state (as requested, the user will hook up their own logic, but we provide state-driven UI shells)
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState('Electronics')
  const [sortBy, setSortBy] = useState('Price: High → Low')
  const [showCategoryChip, setShowCategoryChip] = useState(true)
  const [showSortChip, setShowSortChip] = useState(true)

  // Fetch the data inside useEffect
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://fakestoreapi.com/products")
        const data = await response.json()
        
        // Let's filter the products to electronics by default if category is set to match the screenshot "17 products found in Electronics"
        // Wait, fake store api has 20 products total, and 4 in electronics.
        // We will load all products and let the user do the filtering, but to make the UI look like the screenshot on load,
        // we can set the initial products list.
        setProducts(data)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Count products matching category (to mimic the screenshot)
  const filteredCount = products.filter(p => {
    if (showCategoryChip) {
      return p.category.toLowerCase() === 'electronics'
    }
    return true
  }).length

  const handleClearAll = () => {
    setSearchQuery('')
    setShowCategoryChip(false)
    setShowSortChip(false)
  }

  return (
    <div className="max-w-[1600px] mx-auto px-8 py-8 animate-fade-in">
      
      {/* Title & Count Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">All Products</h1>
        <p className="text-neutral-400 text-sm mt-2 font-medium">
          {loading ? (
            <span>Loading products...</span>
          ) : (
            <>
              <span className="text-neutral-400">{filteredCount || products.length} products found</span>{' '}
              {showCategoryChip && (
                <>
                  <span className="text-neutral-500">in</span>{' '}
                  <span className="text-[#ccff00] font-semibold">Electronics</span>
                </>
              )}
            </>
          )}
        </p>
      </div>

      {/* Search & Filter Shell Container */}
      <div className="bg-[#111111]/60 border border-neutral-800/80 rounded-3xl p-5 mb-8 flex flex-col gap-4">
        
        {/* Top Controls Row */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Search Box */}
          <div className="relative flex-grow max-w-full md:max-w-2xl lg:max-w-3xl">
            <Search className="absolute left-4 top-3.5 w-4.5 h-4.5 text-neutral-500" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..." 
              className="w-full bg-[#161616] border border-neutral-800/70 rounded-2xl py-3 pl-12 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 focus:ring-1 focus:ring-neutral-700 transition-all"
            />
          </div>

          {/* Category Dropdown */}
          <div className="relative min-w-[140px]">
            <select 
              value={category}
              onChange={(e) => {
                setCategory(e.target.value)
                setShowCategoryChip(true)
              }}
              className="w-full appearance-none bg-[#161616] border border-neutral-800/70 rounded-2xl py-3 pl-4 pr-10 text-sm text-white focus:outline-none focus:border-neutral-600 cursor-pointer transition-all"
            >
              <option value="Electronics">Electronics</option>
              <option value="Jewelery">Jewelery</option>
              <option value="Men's Clothing">Men's Clothing</option>
              <option value="Women's Clothing">Women's Clothing</option>
            </select>
            <ChevronDown className="absolute right-3.5 top-4 w-4 h-4 text-neutral-500 pointer-events-none" />
          </div>

          {/* Sort Dropdown (With green border) */}
          <div className="relative min-w-[180px]">
            <select 
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value)
                setShowSortChip(true)
              }}
              className="w-full appearance-none bg-[#161616] border border-[#ccff00] rounded-2xl py-3 pl-4 pr-10 text-sm text-white focus:outline-none cursor-pointer transition-all font-semibold"
            >
              <option value="Price: High → Low">Price: High &rarr; Low</option>
              <option value="Price: Low → High">Price: Low &rarr; High</option>
              <option value="Rating: High → Low">Rating: High &rarr; Low</option>
            </select>
            <ChevronDown className="absolute right-3.5 top-4 w-4 h-4 text-[#ccff00] pointer-events-none" />
          </div>

          {/* Clear Button */}
          <button 
            type="button"
            onClick={handleClearAll}
            className="flex items-center gap-1 bg-[#231515]/60 hover:bg-[#341b1b]/80 border border-red-900/30 hover:border-red-700/50 text-red-400 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer md:ml-auto"
          >
            <X className="w-3.5 h-3.5 stroke-[2.5px]" />
            Clear
          </button>

        </div>

        {/* Bottom Active Chips Row */}
        {(showCategoryChip || showSortChip || searchQuery) && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-900/50">
            
            {showCategoryChip && (
              <div 
                onClick={() => setShowCategoryChip(false)}
                className="bg-[#ccff00] hover:bg-[#b5e600] text-black px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer select-none"
              >
                <span>{category.toLowerCase()}</span>
                <X className="w-3 h-3 stroke-[3px]" />
              </div>
            )}

            {showSortChip && (
              <div 
                onClick={() => setShowSortChip(false)}
                className="bg-[#ccff00] hover:bg-[#b5e600] text-black px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer select-none"
              >
                <span>{sortBy}</span>
                <X className="w-3 h-3 stroke-[3px]" />
              </div>
            )}

            {searchQuery && (
              <div 
                onClick={() => setSearchQuery('')}
                className="bg-[#ccff00] hover:bg-[#b5e600] text-black px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer select-none"
              >
                <span>Search: "{searchQuery}"</span>
                <X className="w-3 h-3 stroke-[3px]" />
              </div>
            )}

          </div>
        )}

      </div>

      {/* Grid of Product Cards */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#ccff00]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {products.map((val) => (
            <ProductCard key={val.id} product={val} />
          ))}
        </div>
      )}

    </div>
  )
}

export default Shop