import React, { useState } from 'react'
import { Link } from 'react-router'
import { Zap, Send } from 'lucide-react'

const Footer = () => {
  const [email, setEmail] = useState('')

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email) return
    alert(`Subscribed ${email} to our newsletter!`)
    setEmail('')
  }

  return (
    <footer className="w-full bg-[#070707] text-white border-t border-neutral-900 mt-auto select-none">
      {/* Bottom Copyright Row */}
      <div className="border-t border-neutral-900">
        <div className="max-w-[1600px] mx-auto px-8 py-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-neutral-500 font-extrabold tracking-wide gap-4">
          <span>&copy; {new Date().getFullYear()} SKYMART. ALL RIGHTS RESERVED.</span>
          <div className="flex items-center gap-6">
            <Link to="/" className="hover:text-neutral-300 transition-colors">PRIVACY POLICY</Link>
            <Link to="/" className="hover:text-neutral-300 transition-colors">TERMS OF USE</Link>
            <Link to="/" className="hover:text-neutral-300 transition-colors">SITEMAP</Link>
          </div>
        </div>
      </div>

    </footer>
  )
}

export default Footer
