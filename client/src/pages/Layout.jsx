
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { SignIn, useUser } from "@clerk/react";
import Navbar from "../components/Navbar";

const Layout = () => {
  const [sidebar, setSidebar] = useState(false);
  const { user } = useUser();

  return user ? (
    <div className="flex flex-col h-screen bg-[#0a0a0c] text-slate-200 overflow-hidden">
      
      {/* Navbar */}
      <Navbar />

      {/* Main Area */}
      <div className="flex flex-1 overflow-hidden relative mt-16">
        
        {/* Sidebar */}
        <div
          className={`absolute sm:relative z-40 transition-all duration-300 ${
            sidebar ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
          }`}
        >
          <Sidebar sidebar={sidebar} setSidebar={setSidebar} />
        </div>

        {/* Content */}
        <main className="flex-1 bg-[#0a0a0c] overflow-y-auto relative custom-scrollbar">
          
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