import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useClerk, UserButton, useUser } from "@clerk/react";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { openSignIn } = useClerk();

  return (
    <nav className="fixed top-0 left-0 z-50 w-full h-16 border-b border-white/5 bg-[#0a0a0c]/50 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 lg:px-12">
        
        {/* Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <img 
            src={assets.favicon} 
            className="w-9 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" 
            alt="Logo" 
          />
          <span className="text-2xl font-bold tracking-tighter text-white">
            Genify<span className="text-primary italic">Ai.</span>
          </span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-6">
          {user ? (
            <UserButton 
              afterSignOutUrl="/" 
              appearance={{
                elements: {
                  userButtonAvatarBox: "border border-white/20"
                }
              }}
            />
          ) : (
            <button
              onClick={openSignIn}
              className="group flex items-center gap-2 rounded-full bg-white px-7 py-2 text-sm font-bold text-black hover:bg-indigo-50 active:scale-95"
            >
              Get started
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;