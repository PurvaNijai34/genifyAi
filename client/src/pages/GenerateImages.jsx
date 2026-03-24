import { Image as ImageIcon, Sparkles, Wand2, Layout } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/react";
import toast from "react-hot-toast";
import DownloadButton from "../components/DownloadButton";
import Loader from "../components/Loader";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

const GenerateImages = () => {
  const imageStyle = [
    "Realistic", "Ghibli style", "Anime style", "Cartoon style",
    "Fantasy style", "3D style", "Portrait style", "Cyberpunk"
  ];

  const [selectedStyle, setSelectedStyle] = useState("Realistic");
  const [input, setInput] = useState("");
  const [publish, setPublish] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const prompt = `Generate an image of ${input} in the style ${selectedStyle}`;

      const { data } = await axios.post(
        "/api/ai/generate-image",
        { prompt, publish },
        { headers: { Authorization: `Bearer ${await getToken()}` } },
      );

      if (data.success) {
        setContent(data.content);
        toast.success("Image generated successfully!");
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
          <div className="p-2 bg-emerald-500/10 rounded-lg">
            <Sparkles className="w-6 h-6 text-emerald-400" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Image Studio</h1>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-sm font-semibold text-slate-400 ml-1">Prompt Description</label>
            <textarea
              onChange={(e) => setInput(e.target.value)}
              value={input}
              rows={4}
              className="w-full bg-white/[0.03] border border-white/10 p-4 mt-2 outline-none text-white text-sm rounded-xl focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all placeholder:text-slate-600 resize-none"
              placeholder="A futuristic city with floating cars and neon lights..."
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-400 ml-1">Art Style</label>
            <div className="mt-3 flex gap-2 flex-wrap">
              {imageStyle.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setSelectedStyle(item)}
                  className={`text-[11px] font-bold uppercase tracking-wider px-4 py-2 border rounded-full transition-all ${
                    selectedStyle === item
                      ? "bg-emerald-600 border-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                      : "text-slate-500 border-white/5 bg-white/[0.02] hover:border-white/20"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Toggle Switch */}
          <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
            <span className="text-sm text-slate-300 font-medium">Make this image Public</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                onChange={(e) => setPublish(e.target.checked)}
                checked={publish}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          <button
            disabled={loading}
            className="w-full flex justify-center items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-4 py-4 mt-2 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            {loading ? (
              <span className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin"></span>
            ) : (
              <ImageIcon size={20} />
            )}
            {loading ? "Generating Art..." : "Generate Magic"}
          </button>
        </div>
      </form>

      {/* --- RIGHT SIDE: PREVIEW AREA --- */}
      <div className="flex-1 p-8 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-md flex flex-col min-h-[500px] lg:max-h-[calc(100vh-180px)] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <ImageIcon className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl font-bold text-white">Generated Canvas</h1>
          </div>
          
          {content && (
            <DownloadButton type="image" content={content} fileName="genify-ai-image" />
          )}
        </div>

        {!content && !loading ? (
          <div className="flex-1 flex flex-col justify-center items-center text-slate-600 gap-4 text-center">
            <div className="w-20 h-20 bg-white/[0.02] rounded-full flex items-center justify-center border border-white/5">
              <Layout className="w-8 h-8 opacity-20" />
            </div>
            <p className="text-sm italic max-w-[200px]">Your masterpiece will appear here</p>
          </div>
        ) : loading ? (
            <div className="flex-1 flex justify-center items-center">
            <Loader text="AI is Generting the image..." size="lg" />
          </div>
        ) : (
          <div className="flex-1 relative group overflow-hidden rounded-2xl border border-white/10 bg-black/20">
            <img
              src={content}
              alt="generated art"
              className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.02]"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateImages;