
import React, { useState } from "react";
import { Hash, Sparkles, Wand2, LayoutPanelLeft } from "lucide-react";
import axios from "axios";
import { useAuth } from "@clerk/react";
import Markdown from "react-markdown";
import toast from "react-hot-toast";
import DownloadButton from "../components/DownloadButton";
import useCredits from "../hooks/useCredits";
import Loader from "../components/Loader";
import { useAppContext } from "../context/AppContext";

axios.defaults.baseURL =
  import.meta.env.VITE_BASE_URL || "http://localhost:5000";

const BlogTitles = () => {
  const blogCategories = [
    "General", "Technology", "Business", "Health",
    "Lifestyle", "Education", "Travel", "Food",
  ];

  const [selectedCategory, setSelectedCategory] = useState("General");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();
  const { fetchUserData } = useAppContext();
  const { isDisabled } = useCredits();

  const onSubmitHandler = async (e) => {
    e.preventDefault();


    if (isDisabled) {
      toast.error("No credits left 🚀 Upgrade to premium");
      return;
    }

    try {
      setLoading(true);
      const prompt = `Generate 5 catchy and SEO-friendly blog titles for the keyword "${input}" in the category ${selectedCategory}. Return them in a clean markdown list.`;

      const { data } = await axios.post(
        "/api/ai/generate-blog-title",
        { prompt },
        { headers: { Authorization: `Bearer ${await getToken()}` } },
      );

      if (data.success) {
        setContent(data.content);
        toast.success("Titles generated!");
        fetchUserData(); 
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-8 animate-[fadeIn_0.5s_ease-out]">
      {/* --- LEFT SIDE: CONFIGURATION --- */}
      <form
        onSubmit={onSubmitHandler}
        className="flex-1 max-w-xl p-8 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-md shadow-2xl h-fit"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <Sparkles className="w-6 h-6 text-purple-400" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">AI Title Generator</h1>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-sm font-semibold text-slate-400 ml-1">Focus Keyword</label>
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type="text"
              className="w-full bg-white/[0.03] border border-white/10 p-4 mt-2 outline-none text-white text-sm rounded-xl focus:border-purple-500/50 transition-all placeholder:text-slate-600"
              placeholder="e.g. Passive Income 2026"
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-400 ml-1">Select Category</label>
            <div className="mt-3 flex gap-2 flex-wrap">
              {blogCategories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setSelectedCategory(item)}
                  className={`text-[11px] font-bold uppercase tracking-wider px-4 py-2 border rounded-full transition-all ${
                    selectedCategory === item
                      ? "bg-purple-600 border-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                      : "text-slate-500 border-white/5 bg-white/[0.02] hover:border-white/20"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

       
          <button
            disabled={loading || isDisabled}
            className={`w-full flex justify-center items-center gap-3 font-bold px-4 py-4 mt-4 rounded-xl transition-all active:scale-[0.98] shadow-lg cursor-pointer ${
              isDisabled 
                ? "bg-gray-600 text-slate-400 cursor-not-allowed" 
                : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-500/20"
            }`}
          >
            {loading ? (
              <span className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin"></span>
            ) : (
              <Wand2 className="w-5 h-5" />
            )}
            {loading ? "Thinking..." : "Generate Titles"}
          </button>

    
          {isDisabled && (
            <p className="text-red-400 text-sm mt-2 text-center font-medium animate-pulse">
              ⚠️ No credits left. Upgrade to continue 
            </p>
          )}
        </div>
      </form>

      {/* --- RIGHT SIDE: PREVIEW AREA --- */}
      <div className="flex-1 p-8 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-md flex flex-col min-h-[500px] lg:max-h-[calc(100vh-180px)] overflow-hidden">
        <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <Hash className="w-5 h-5 text-purple-400" />
            <h1 className="text-xl font-bold text-white">Suggested Titles</h1>
          </div>

          {content && (
            <DownloadButton
              type="text"
              content={content}
              fileName={`titles-${input}`}
            />
          )}
        </div>

        {!content && !loading ? (
          <div className="flex-1 flex flex-col justify-center items-center text-slate-600 gap-4 text-center">
            <div className="w-20 h-20 bg-white/[0.02] rounded-full flex items-center justify-center border border-white/5">
              <LayoutPanelLeft className="w-8 h-8 opacity-20" />
            </div>
            <p className="text-sm italic max-w-[200px]">
              Add your keywords and click generate to see the magic
            </p>
          </div>
        ) : loading ? (
          <div className="flex-1 flex justify-center items-center">
            <Loader text="Brainstorming catchy titles..." size="lg" />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            <div className="prose prose-invert prose-sm max-w-none text-slate-300">
              <Markdown>{content}</Markdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogTitles;