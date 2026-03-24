
import React, { useState } from "react";
import Markdown from "react-markdown";
import { ChevronDown, ChevronUp, Clock, Sparkles, FileText, ImageIcon, Layers } from "lucide-react";
import DownloadButton from "./DownloadButton";

const CreationItem = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

  
  const getToolMeta = (type) => {
    switch (type) {
      case "image": return { icon: <ImageIcon size={16}/>, color: "text-emerald-400", bg: "bg-emerald-500/10" };
      case "resume-review": return { icon: <FileText size={16}/>, color: "text-teal-400", bg: "bg-teal-500/10" };
      default: return { icon: <Layers size={16}/>, color: "text-primary", bg: "bg-primary/10" };
    }
  };

  const meta = getToolMeta(item.type);

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className={`group border transition-all duration-300 rounded-2xl overflow-hidden cursor-pointer ${
        expanded 
        ? "bg-white/[0.05] border-white/10 shadow-2xl" 
        : "bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]"
      }`}
    >
      {/* --- TOP BAR (Always Visible) --- */}
      <div className="p-4 flex justify-between items-center gap-4">
        <div className="flex items-center gap-4 overflow-hidden">
          <div className={`p-2.5 rounded-xl ${meta.bg} ${meta.color} shrink-0`}>
            {meta.icon}
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-white truncate group-hover:text-primary transition-colors">
              {item.prompt || "Untitled Creation"}
            </h2>
            <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500 font-medium">
              <Clock size={12} />
              <span>{new Date(item.created_at).toLocaleDateString()}</span>
              <span className="w-1 h-1 rounded-full bg-slate-700" />
              <span className="uppercase tracking-widest">{item.type}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Tag Badge */}
          <span className={`hidden sm:block text-[10px] px-2 py-0.5 rounded-md border border-white/5 bg-black/20 font-bold uppercase ${meta.color}`}>
            {item.type}
          </span>
          {expanded ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-500" />}
        </div>
      </div>

      {/* --- EXPANDED CONTENT --- */}
      {expanded && (
        <div className="px-4 pb-5 pt-2 animate-[slideDown_0.3s_ease-out]">
          <div className="border-t border-white/5 pt-5 flex flex-col gap-4">
            
            {/* Action Header inside Expanded */}
            <div className="flex justify-between items-center">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[2px]">Result Preview</h3>
              <DownloadButton 
                type={item.type === "image" ? "image" : "text"} 
                content={item.content}
                fileName={`${item.type}-${item.id}`}
              />
            </div>

            {/* Display Area */}
            <div className="rounded-xl overflow-hidden bg-black/20 border border-white/5">
              {item.type === "image" ? (
                <div className="flex justify-center p-2 bg-slate-900/50">
                  <img
                    src={item.content}
                    alt="AI Generated"
                    className="max-h-[400px] w-auto rounded-lg shadow-2xl transition-transform hover:scale-[1.02]"
                  />
                </div>
              ) : (
                <div className="p-5 max-h-[300px] overflow-y-auto custom-scrollbar text-sm leading-relaxed text-slate-300">
                  <div className="prose prose-invert prose-sm max-w-none prose-p:text-slate-400 prose-headings:text-white">
                    <Markdown>{item.content}</Markdown>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreationItem;