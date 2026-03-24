

import { useUser } from "@clerk/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { AiToolsData } from "../assets/assets";
import { ArrowUpRight } from "lucide-react"; 

const AiTools = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <div className="relative z-10 px-4 py-24 sm:px-20 xl:px-32 bg-[#0a0a0c]">
      
      {/* --- Section Header --- */}
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Powerful <span className="text-primary">AI Tools</span>
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-slate-400 text-lg">
          Everything you need to create, enhance, and optimize your content with
          cutting-edge neural technology.
        </p>
      </div>

      {/* --- Tools Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        {AiToolsData.map((tool, index) => (
          <div
            key={index}
            className="group relative p-8 w-full max-w-sm rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-md transition-all duration-500 hover:bg-white/[0.07] hover:border-white/20 hover:-translate-y-2 cursor-pointer overflow-hidden"
            onClick={() => user && navigate(tool.path)}
          >
            {/* Hover Glow Effect */}
            <div className="absolute -inset-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Icon Box */}
            <div className="relative z-10 flex justify-between items-start">
              <tool.Icon
                className="w-14 h-14 p-3.5 text-white rounded-2xl shadow-lg transition-transform duration-500 group-hover:scale-110"
                style={{
                  background: `linear-gradient(135deg, ${tool.bg.from}, ${tool.bg.to})`,
                  boxShadow: `0 10px 20px -5px ${tool.bg.from}66`
                }}
              />
              <ArrowUpRight className="text-slate-600 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" size={20} />
            </div>

            {/* Content */}
            <div className="relative z-10 mt-8">
              <h3 className="text-xl font-bold text-white transition-colors group-hover:text-primary">
                {tool.title}
              </h3>
              <p className="mt-3 text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">
                {tool.description}
              </p>
            </div>

            {/* Bottom Accent Line */}
            <div 
               className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary transition-all duration-500 group-hover:w-full" 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AiTools;