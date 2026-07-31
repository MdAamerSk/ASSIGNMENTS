import React, { useState } from 'react'
import { ShoppingCart, Check } from 'lucide-react'

const ProductCards = ({ product, isAdded, onToggleCart }) => {

  // Retrieve rating details or fallback to mock data if not provided by API
  const rate = product.rating?.rate || 4.5
  const count = product.rating?.count || Math.floor(Math.random() * 150) + 20

  return (
    <div className="flex flex-col bg-[#131313] border border-neutral-800/80 rounded-[28px] p-3 transition-all duration-300 hover:border-neutral-700/80 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 justify-between">
      
      {/* Top Image Section (White capsule block) */}
      <div className="bg-white rounded-[22px] p-5 aspect-square relative flex items-center justify-center overflow-hidden group">
        
        {/* Category Badge on Top-Left */}
        <span className="absolute top-3 left-3 bg-[#6b7280] text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
          {product.category || 'Category'}
        </span>
        
        {/* Product Image */}
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-contain max-h-[140px] transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Bottom Info Section (Dark text content) */}
      <div className="px-1.5 pt-3 pb-1.5 flex flex-col flex-grow">
        
        {/* Small Category Label */}
        <span className="text-neutral-500 text-[10px] font-semibold uppercase tracking-wider mb-1 block">
          {product.category || 'Electronics'}
        </span>

        {/* Product Title */}
        <h3 className="text-white text-sm font-bold line-clamp-1 mb-1.5 hover:text-[#ccff00] cursor-pointer transition-colors" title={product.title}>
          {product.title}
        </h3>

        {/* Ratings Star Row */}
        <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-3">
          <div className="flex text-amber-400 gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg 
                key={star} 
                className={`w-3.5 h-3.5 ${star <= Math.round(rate) ? 'fill-current text-amber-500' : 'text-neutral-700 fill-current'}`} 
                viewBox="0 0 24 24"
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            ))}
          </div>
          <span className="text-[11px] text-neutral-400">({count})</span>
        </div>

        {/* Thin Divider Line */}
        <div className="w-full border-t border-neutral-800/80 mb-3" />

        {/* Footer: Price and Add Button */}
        <div className="flex items-center justify-between mt-auto gap-2">
          
          {/* Price Tag */}
          <span className="text-lg font-extrabold text-[#ccff00] tracking-tight">
            ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
          </span>

          {/* Action Button */}
          {isAdded ? (
            <button
              type="button"
              onClick={() => onToggleCart(product)}
              className="flex items-center gap-1.5 bg-[#0a2e1c]/80 border border-emerald-900/60 hover:bg-[#0d3f27] active:scale-95 text-[#34d399] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200"
            >
              <Check className="w-3.5 h-3.5 stroke-[3px]" />
              Added
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onToggleCart(product)}
              className="flex items-center gap-1.5 bg-[#ccff00] hover:bg-[#b5e600] active:scale-95 text-black px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200"
            >
              <ShoppingCart className="w-3.5 h-3.5 stroke-[2.5px]" />
              Add
            </button>
          )}

        </div>

      </div>

    </div>
  )
}

export default ProductCards

