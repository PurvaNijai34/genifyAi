import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="relative z-10 px-6 md:px-16 lg:px-24 xl:px-32 pt-20 w-full bg-[#0a0a0c] text-slate-400 border-t border-white/5">
      <div className="flex flex-col md:flex-row justify-between w-full gap-16 pb-12">
        
        {/* --- Brand Section --- */}
        <div className="md:max-w-sm">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <img src={assets.favicon} className="w-10 transition-transform group-hover:rotate-12" alt="Logo" />
            <span className="text-2xl font-bold text-white tracking-tight">
              Genify<span className="text-primary italic">Ai.</span>
            </span>
          </div>
          <p className="mt-6 text-sm leading-relaxed text-slate-500">
            Experience the future of productivity. Transform your
            content creation with our suite of premium AI tools. 
            Generate, edit, and scale your ideas effortlessly.
          </p>
        </div>

        {/* --- Links & Newsletter --- */}
        <div className="flex-1 flex flex-col sm:flex-row items-start md:justify-end gap-12 lg:gap-24">
          
          {/* Company Links */}
          <div className="min-w-[120px]">
            <h2 className="font-semibold mb-6 text-white text-base">Company</h2>
            <ul className="text-sm space-y-3">
              {['Home', 'About us', 'Contact us', 'Privacy policy'].map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-primary transition-colors duration-300">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="max-w-sm">
            <h2 className="font-semibold text-white mb-6 text-base">Subscribe to our newsletter</h2>
            <div className="text-sm space-y-4">
              <p className="text-slate-500">The latest news, articles, and resources, sent to your inbox weekly.</p>
              <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                <input 
                  className="bg-white/5 border border-white/10 placeholder-slate-600 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none w-full h-11 rounded-xl px-4 transition-all" 
                  type="email" 
                  placeholder="Enter your email"
                />
                <button className="bg-primary hover:bg-primary-dark w-full sm:w-auto px-6 h-11 text-white font-medium rounded-xl cursor-pointer transition-all active:scale-95 shadow-lg shadow-primary/20">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Bottom Copyright --- */}
      <div className="border-t border-white/5 py-8 text-center">
        <p className="text-xs md:text-sm text-slate-600">
          Copyright 2026 © <span className="text-slate-400 font-medium">Genify Ai</span>. All Rights Reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer