import React, { useEffect } from 'react'
import { ShoppingBag, X, Minus, Plus, Trash2, ArrowRight } from 'lucide-react'

const CartDrawer = ({ 
  cart = [], 
  isOpen = false, 
  onClose, 
  updateQuantity, 
  removeFromCart, 
  clearCart 
}) => {
  // Prevent background scrolling when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Calculate totals
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <>
      {/* Backdrop Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 z-50 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div 
        className={`fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#0b0b0b] border-l border-neutral-900 shadow-2xl flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-900">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#ccff00] rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-4.5 h-4.5 text-black" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-wide">Cart</h2>
            {totalItems > 0 && (
              <span className="bg-[#ccff00]/10 text-[#ccff00] text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-[#ccff00]/20">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg border border-neutral-800 hover:bg-neutral-900 transition-colors group cursor-pointer"
          >
            <X className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
          </button>
        </div>

        {/* Scrollable Cart Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-14 h-14 bg-neutral-900/50 rounded-2xl flex items-center justify-center border border-neutral-800">
                <ShoppingBag className="w-6 h-6 text-neutral-600" />
              </div>
              <div>
                <p className="text-neutral-300 font-semibold">Your cart is empty</p>
                <p className="text-neutral-500 text-xs mt-1">Add items from the store to see them here.</p>
              </div>
            </div>
          ) : (
            cart.map((item) => (
              <div 
                key={item.id}
                className="bg-[#121212] border border-neutral-900 rounded-[20px] p-3.5 flex gap-4 items-center"
              >
                {/* Product Image Block */}
                <div className="w-16 h-16 bg-white rounded-xl p-2 flex items-center justify-center shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Info and Quantity Controls */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="mb-1">
                    <h4 
                      className="text-white text-xs font-bold truncate pr-2 hover:text-[#ccff00] transition-colors cursor-pointer"
                      title={item.title}
                    >
                      {item.title}
                    </h4>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-[#ccff00] text-sm font-extrabold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      <span className="text-neutral-500 text-[10px]">
                        ${item.price.toFixed(2)} each
                      </span>
                    </div>
                  </div>

                  {/* Quantity and Delete Controls */}
                  <div className="flex items-center justify-between mt-2.5">
                    <div className="flex items-center border border-neutral-800 bg-[#161616] rounded-lg p-0.5">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        disabled={item.quantity <= 1}
                        className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-900 disabled:opacity-30 disabled:hover:text-neutral-400 disabled:hover:bg-transparent cursor-pointer transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs text-white font-bold px-2.5 min-w-5 text-center select-none">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-900 cursor-pointer transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 rounded-lg text-neutral-500 hover:text-red-500 hover:bg-red-500/10 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-neutral-900 bg-[#0b0b0b]/95 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-neutral-400 text-sm font-medium">Total</span>
              <span className="text-white text-2xl font-extrabold tracking-tight">
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            <button 
              className="w-full bg-[#ccff00] hover:bg-[#b5e600] active:scale-[0.98] text-black font-extrabold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#ccff00]/10 cursor-pointer"
            >
              Checkout <ArrowRight className="w-4.5 h-4.5 stroke-[2.5]" />
            </button>

            <button 
              onClick={clearCart}
              className="w-full text-center text-xs font-semibold text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer block pt-0.5"
            >
              Clear cart
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default CartDrawer
