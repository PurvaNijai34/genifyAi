


import React, { useEffect, useState } from "react";
import { Gem, Sparkles, Clock, LayoutGrid } from "lucide-react";
import { useAuth, useUser } from "@clerk/react";
import CreationItem from "../components/CreationItem";
import axios from "axios";
import { toast } from "react-hot-toast"; 

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

const Dashboard = () => {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState(0);

  const { getToken } = useAuth();
  const { user } = useUser();

  const getDashboardData = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/user/get-user-creations", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setCreations(data.creations);
        setCredits(data.remainingCredits); 
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message); 
    }
    setLoading(false);
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <div className="h-full custom-scrollbar">
      {/* --- Welcome Header --- */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-white">
          Welcome back, <span className="text-primary">{user?.firstName || 'Creator'}!</span>
        </h1>
        <p className="text-slate-500 text-sm mt-1">Here's what's happening with your AI projects.</p>
      </div>

      {/* --- Stats Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        
        {/* Total Creations Card */}
        <div className="relative group overflow-hidden p-6 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-md transition-all hover:border-primary/30">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm font-medium">Total Creations</p>
              <h2 className="text-3xl font-bold text-white mt-2">{creations.length}</h2>
            </div>
            <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <Sparkles size={24} />
            </div>
          </div>
          
        </div>

        {/* Active Plan Card */}
        <div className="relative group overflow-hidden p-6 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-md transition-all hover:border-purple-500/30">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm font-medium">Active Plan</p>
              <h2 className="text-3xl font-bold text-white mt-2">
                {user?.publicMetadata?.plan === "premium" ? "Premium" : "Free"}
              </h2>
            </div>
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              <Gem size={24} />
            </div>
          </div>
          <p className="text-[10px] text-slate-500 mt-4 uppercase tracking-widest font-bold">
            {/* {user?.publicMetadata?.plan === "premium" ? "Unlimited Access" : "8 Credits Remaining"} */}
            {user?.publicMetadata?.plan === "premium"
  ? "Unlimited Access"
  : `${credits} Credits Remaining`}
          </p>
        </div>
      </div>

      {/* --- Recent Activity Section --- */}
      <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-8">
        <div className="flex items-center gap-2 mb-8">
           <Clock className="text-primary" size={20} />
           <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent shadow-[0_0_15px_#6366f1]"></div>
            <p className="text-slate-500 text-sm animate-pulse">Fetching your masterpieces...</p>
          </div>
        ) : creations.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {creations.map((item) => (
              <CreationItem key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-2xl">
            <LayoutGrid className="mx-auto text-slate-700 mb-4" size={48} />
            <p className="text-slate-400 font-medium">No creations yet.</p>
            <button className="mt-4 text-primary text-sm hover:underline cursor-pointer">
              Start your first project
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;