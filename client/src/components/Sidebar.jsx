import React from "react";
import { useUser, useClerk } from "@clerk/react";
import { NavLink } from "react-router-dom";
import {
  House,
  SquarePen,
  Hash,
  Image,
  Eraser,
  Scissors,
  FileText,
  Users,
  LogOut,
} from "lucide-react";

const navItems = [
  { to: "/ai", label: "Dashboard", Icon: House },
  { to: "/ai/write-article", label: "Write Article", Icon: SquarePen },
  { to: "/ai/blog-titles", label: "Blog Titles", Icon: Hash },
  { to: "/ai/generate-images", label: "Generate Images", Icon: Image },
  { to: "/ai/remove-background", label: "Remove Background", Icon: Eraser },
  { to: "/ai/remove-object", label: "Remove Object", Icon: Scissors },
  { to: "/ai/review-resume", label: "Review Resume", Icon: FileText },
  { to: "/ai/community", label: "Community", Icon: Users },
];

const Sidebar = ({ sidebar, setSidebar }) => {
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <div
      className={`w-64 bg-[#0a0a0c] border-r border-white/5 flex flex-col justify-between 
      fixed sm:relative z-50 transition-transform duration-300 
      h-screen sm:h-full  /* ✅ Fix 1: Mobile pe viewport height lock ki */
      ${sidebar ? "translate-x-0" : "max-sm:-translate-x-full"}`}
    >
      {/* Scrollable Area */}
      {/* ✅ Fix 2: min-h-0 zaroori hai flex-col mein scroll enable karne ke liye */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar pt-8 px-4 min-h-0">
        
        {/* Navigation Links */}
        <nav className="space-y-1.5 pb-10">
          {navItems.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/ai"}
              onClick={() => setSidebar(false)}
              className={({ isActive }) => `
                group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300
                ${isActive
                    ? "bg-primary/10 text-primary shadow-[inset_0_0_15px_rgba(99,102,241,0.1)]"
                    : "text-slate-400 hover:bg-white/[0.03] hover:text-white"
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={18}
                    className={`shrink-0 transition-transform group-hover:scale-110 ${isActive ? "text-primary" : "text-slate-500"}`}
                  />
                  <span className="flex-1 truncate">{label}</span>

                  {/* Animated Glow Dot */}
                  <div
                    className={`w-1.5 h-1.5 rounded-full bg-primary transition-all duration-500 ${
                      isActive
                        ? "opacity-100 shadow-[0_0_8px_#6366f1]"
                        : "opacity-0"
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Fixed Bottom Logout Section */}
      {/* ✅ Fix 3: shrink-0 se button kabhi compress nahi hoga */}
      <div className="p-4 border-t border-white/5 bg-[#0a0a0c] shrink-0">
        <button
          onClick={signOut}
          className="flex items-center gap-3 w-full px-4 py-3 text-slate-500 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all duration-300 cursor-pointer group"
        >
          <LogOut
            size={18}
            className="group-hover:-translate-x-1 transition-transform shrink-0"
          />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;