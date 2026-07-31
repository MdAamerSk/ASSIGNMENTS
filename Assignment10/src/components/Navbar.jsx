import React from 'react'
import { ShoppingCart, LogOut, Zap } from 'lucide-react'
import { NavLink } from 'react-router'

const Navbar = ({ cartCount = 0 }) => {

    return (
        <nav className="w-full bg-[#0a0a0a] text-white px-8 py-4 flex items-center justify-between border-b border-neutral-800 sticky top-0 z-50">

            {/* Brand Logo */}
            <div className="flex items-center gap-3 cursor-pointer">
                <div className="w-9 h-9 bg-[#ccff00] rounded-xl flex items-center justify-center shadow-lg shadow-[#ccff00]/10">
                    <Zap className="w-5 h-5 text-black fill-black" />
                </div>
                <span className="text-xl font-bold tracking-wide">
                    Sky<span className="text-[#ccff00]">Mart</span>
                </span>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center gap-8 text-sm font-medium">
                <NavLink 
                    to="/" 
                    className={({ isActive }) => 
                        isActive 
                            ? "text-[#ccff00] transition-colors" 
                            : "text-neutral-400 hover:text-white transition-colors"
                    }
                >
                    Home
                </NavLink>
                <NavLink 
                    to="/shop" 
                    className={({ isActive }) => 
                        isActive 
                            ? "text-[#ccff00] transition-colors" 
                            : "text-neutral-400 hover:text-white transition-colors"
                    }
                >
                    Shop
                </NavLink>
                <NavLink 
                    to="/about" 
                    className={({ isActive }) => 
                        isActive 
                            ? "text-[#ccff00] transition-colors" 
                            : "text-neutral-400 hover:text-white transition-colors"
                    }
                >
                    About
                </NavLink>
            </div>

            {/* Action Controls */}
            <div className="flex items-center gap-3">

                {/* User Pill */}
                <div className="flex items-center gap-2 border border-neutral-700 rounded-xl px-3 py-1.5 text-sm bg-neutral-900/50">
                    <div className="w-6 h-6 bg-[#ccff00] text-black font-semibold rounded-lg flex items-center justify-center text-xs">
                        D
                    </div>
                    <span className="text-neutral-300 font-medium">demo</span>
                </div>

                {/* Cart Icon Button with Badge */}
                <button className="relative p-2.5 border border-neutral-700 rounded-xl hover:bg-neutral-800 transition-colors text-white">
                    <ShoppingCart className="w-4 h-4" />
                    <span className="absolute -top-1.5 -right-1.5 bg-[#ccff00] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                        {cartCount}
                    </span>
                </button>


                {/* Logout Icon Button */}
                <button className="p-2.5 border border-neutral-700 rounded-xl hover:bg-neutral-800 transition-colors text-white">
                    <LogOut className="w-4 h-4" />
                </button>

            </div>

        </nav>




    )
}

export default Navbar