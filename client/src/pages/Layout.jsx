import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { Menu, X } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { SignIn, useUser, UserButton } from "@clerk/react";
import Navbar from "../components/Navbar";

const Layout = () => {
  const navigate = useNavigate();
  const [sidebar, setSidebar] = useState(false);
  const { user } = useUser();

  return user ? (
    <div className="flex flex-col h-screen bg-[#0a0a0c] text-slate-200 overflow-hidden">
      {/* --- Dashboard Navbar --- */}

      {
        <nav className="w-full px-6 md:px-8 h-16 flex items-center justify-between border-b border-white/5 bg-[#0a0a0c]/80 backdrop-blur-md z-50">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <img
              src={assets.favicon}
              className="w-8 transition-transform duration-300 group-hover:rotate-12"
              alt="Logo"
            />
            <span className="text-xl font-bold tracking-tight text-white">
              Genify<span className="text-primary italic">Ai.</span>
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    userButtonAvatarBox:
                      "border border-white/20 hover:border-primary transition-all",
                  },
                }}
              />
            </div>

            <div className="sm:hidden ml-2">
              {sidebar ? (
                <X
                  onClick={() => setSidebar(false)}
                  className="w-6 h-6 text-slate-400 cursor-pointer hover:text-white transition-colors"
                />
              ) : (
                <Menu
                  onClick={() => setSidebar(true)}
                  className="w-6 h-6 text-slate-400 cursor-pointer hover:text-white transition-colors"
                />
              )}
            </div>
          </div>
        </nav>
      }
      {/* --- Main Dashboard Area --- */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar Wrapper */}
        <div
          className={`absolute sm:relative z-40 transition-all duration-300 ${sidebar ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}`}
        >
          <Sidebar sidebar={sidebar} setSidebar={setSidebar} />
        </div>

        {/* Content Area */}
        <main className="flex-1 bg-[#0a0a0c] overflow-y-auto relative custom-scrollbar">
          {/* Subtle background glow for the dashboard area */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/5 blur-[120px] pointer-events-none" />

          <div className="p-4 md:p-8">
            <Outlet />
          </div>
        </main>

        {/* Mobile Overlay */}
        {sidebar && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 sm:hidden"
            onClick={() => setSidebar(false)}
          />
        )}
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0a0c]">
      <div className="p-4 glass-card rounded-2xl border border-white/5">
        <SignIn />
      </div>
    </div>
  );
};

export default Layout;
