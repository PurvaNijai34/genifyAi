import React from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, Play } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-[#0a0a0c] px-6 py-20">
      
      {/* --- Animated Background Glows --- */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-purple-600/10 blur-[100px]" />
      
      {/* Noise/Grain Overlay */}
      <div className="absolute inset-0 bg-grain pointer-events-none" />

      {/* --- Content --- */}
      <div className="relative z-10 flex flex-col items-center text-center">
        
        {/* Modern Badge */}
        <div className="mb-8 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-indigo-300 backdrop-blur-md">
          <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
          Genify AI v1.0 is live
        </div>

        <h1 className="max-w-4xl text-center text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl md:text-7xl">
  Create amazing content
  <br />
  <span className="block mt-3 bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-600 bg-clip-text text-transparent">
    with AI Tools
  </span>
</h1>

        <p className="mx-auto mt-8 max-w-2xl text-lg text-slate-400 sm:text-xl">
          Experience the next generation of AI productivity. Generate, edit, and 
          scale your ideas with our high-performance neural tools.
        </p>

        {/* --- Buttons --- */}
        <div className="mt-12 flex flex-wrap justify-center gap-6">
          <button
            onClick={() => navigate("/ai")}
            className="group relative flex items-center gap-2 rounded-full bg-white px-8 py-4 font-bold text-black transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            Start Creating Free
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </button>

        </div>

        {/* --- Features Mini-Grid (Animated) --- */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-50">
           {['Fast Tech', 'Neural Art', 'Auto Write', 'PDF Pro'].map((item, index) => (
             <div key={index} className="flex items-center gap-2 text-sm text-slate-300">
               <Sparkles size={14} className="text-indigo-400" />
               {item}
             </div>
           ))}
        </div>

      </div>

      {/* --- Bottom Fade --- */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0a0a0c] to-transparent pointer-events-none" />
    </div>
  );
};

export default Hero;