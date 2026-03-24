

import React, { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/react";
import { Heart, Sparkles, Image as ImageIcon, MessageSquare } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

const Community = () => {
  const [creations, setCreations] = useState([]);
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  const fetchCreations = async () => {
    try {
      const { data } = await axios.get("/api/user/get-published-creations", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setCreations(data.creations);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const imageLikeToggle = async (id) => {
    try {
      const { data } = await axios.post(
        "/api/user/toggle-like-creation",
        { id },
        { headers: { Authorization: `Bearer ${await getToken()}` } },
      );

      if (data.success) {
        fetchCreations(); 
      }
    } catch (error) {
      toast.error("Action failed");
    }
  };

  useEffect(() => {
    if (user) {
      fetchCreations();
    }
  }, [user]);

  // Loading state handling
  if (loading) {
    return (
    <div className="flex-1 flex justify-center items-center">
            <Loader text="Loading Community gallery..." size="lg" />
          </div>
    );
  }

  // Final Clean Return
  return (
    <div className="h-full flex flex-col gap-6 p-2 md:p-6 animate-[fadeIn_0.5s_ease-out]">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/[0.02] border border-white/5 p-6 rounded-3xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-500/10 rounded-lg">
            <Sparkles className="w-6 h-6 text-rose-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">AI Community</h1>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Explore what others are creating</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/10 rounded-full text-[11px] text-slate-400">
          <ImageIcon size={14} />
          <span>{creations.length} Published Masterpieces</span>
        </div>
      </div>

      {/* Grid Section */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {creations.map((creation, index) => (
            <div
              key={index}
              className="relative group break-inside-avoid rounded-3xl overflow-hidden border border-white/5 bg-white/[0.02] transition-all duration-500 hover:border-rose-500/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
            >
              <img
                src={creation.content}
                alt={creation.prompt}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                <p className="text-sm text-white/90 line-clamp-3 mb-4 font-medium italic leading-relaxed">
                  "{creation.prompt}"
                </p>

                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-orange-500 flex items-center justify-center text-[10px] font-bold text-white">
                      AI
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Genify Artist</span>
                  </div>

                  <button 
                    onClick={() => imageLikeToggle(creation.id)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md border border-white/10"
                  >
                    <span className="text-xs font-bold text-white">{creation.likes.length}</span>
                    <Heart
                      className={`w-4 h-4 transition-all duration-300 ${
                        creation.likes.includes(user.id)
                          ? "fill-rose-500 text-rose-500 scale-110"
                          : "text-white hover:text-rose-400"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {creations.length === 0 && (
          <div className="h-[400px] flex flex-col items-center justify-center text-slate-600">
            <MessageSquare size={48} className="opacity-10 mb-4" />
            <p className="italic">No creations found in the gallery yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;