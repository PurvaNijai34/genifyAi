




import React, { useState } from "react";
import { Scissors, Sparkles, UploadCloud, ImageIcon, Loader2, Target } from "lucide-react";
import axios from "axios";
import { useAuth } from "@clerk/react";
import toast from "react-hot-toast";
import DownloadButton from "../components/DownloadButton";
import Loader from "../components/Loader";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

const RemoveObject = () => {
  const [input, setInput] = useState("");
  const [object, setObject] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState(null);

  const { getToken } = useAuth();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInput(file);
      setPreview(URL.createObjectURL(file));
      setContent(""); 
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();


    if (!input) {
      return toast.error("Please upload an image first.");
    }
    if (!object.trim()) {
      return toast.error("Kya remove karna hai? Object ka naam toh likho! ✍️");
    }
    if (object.trim().split(/\s+/).length > 1) {
      return toast.error("Please enter only one object name (e.g., 'watch')");
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", input);
      formData.append("object", object);

      const token = await getToken();
      const { data } = await axios.post(
        "/api/ai/remove-image-object",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setContent(data.content);
        toast.success("Object removed successfully!");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-8 animate-[fadeIn_0.5s_ease-out] p-4 sm:p-0">
      
      {/* --- LEFT SIDE: CONFIGURATION --- */}
      <form
        onSubmit={onSubmitHandler}
        className="flex-1 max-w-xl p-8 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-md shadow-2xl h-fit"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Sparkles className="w-6 h-6 text-blue-400" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Object Remover</h1>
        </div>

        <div className="space-y-6">
          {/* File Upload Area */}
          <div className="relative group">
            <label className="text-sm font-semibold text-slate-400 ml-1 flex items-center gap-2">
              <Target size={14} className="text-blue-400" />
              Step 1: Upload Image
            </label>
            <div className="mt-2 relative border-2 border-dashed border-white/10 rounded-2xl p-6 hover:border-blue-500/40 transition-all bg-white/[0.01] flex flex-col items-center justify-center gap-3 min-h-[160px]">
              {preview ? (
                <div className="relative w-full h-32">
                  <img src={preview} className="w-full h-full object-contain rounded-lg" alt="Preview" />
                  <button 
                    type="button"
                    onClick={() => {setPreview(null); setInput("")}}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-all shadow-lg z-10"
                  >
                    <Scissors size={12} className="rotate-90" />
                  </button>
                </div>
              ) : (
                <>
                  <UploadCloud size={32} className="text-slate-600 group-hover:text-blue-400 transition-colors" />
                  <p className="text-[11px] text-slate-500 text-center">Click or drag image here</p>
                </>
              )}
              <input
                onChange={handleFileChange}
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Object Input */}
          <div>
            <label className="text-sm font-semibold text-slate-400 ml-1 flex items-center gap-2">
              <Target size={14} className="text-blue-400" />
              Step 2: What to remove?
            </label>
            <input
              type="text"
              onChange={(e) => setObject(e.target.value)}
              value={object}
              className="w-full bg-white/[0.03] border border-white/10 p-4 mt-2 outline-none text-white text-sm rounded-xl focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all placeholder:text-slate-600"
              placeholder="e.g. watch, spoon, wire..."
            />
            <p className="text-[10px] text-slate-500 mt-2 italic">* Use single word for best results</p>
          </div>

          {/* 🚀 FIXED: Button ab hamesha active dikhega jab tak loading na ho */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold px-4 py-4 mt-2 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 cursor-pointer"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Scissors className="w-5 h-5" />
            )}
            {loading ? "Magic in progress..." : "Erase Object"}
          </button>
        </div>
      </form>

      {/* --- RIGHT SIDE: PREVIEW AREA --- */}
      <div className="flex-1 p-8 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-md flex flex-col min-h-[500px] lg:max-h-[calc(100vh-180px)] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <ImageIcon className="w-5 h-5 text-blue-400" />
            <h1 className="text-xl font-bold text-white">Cleaned Result</h1>
          </div>
          
          {content && (
            <DownloadButton type="image" content={content} fileName="genify-object-removed" />
          )}
        </div>

        {!content && !loading ? (
          <div className="flex-1 flex flex-col justify-center items-center text-slate-600 gap-4 text-center">
            <div className="w-20 h-20 bg-white/[0.02] rounded-full flex items-center justify-center border border-white/5">
              <Scissors className="w-8 h-8 opacity-20" />
            </div>
            <p className="text-sm italic max-w-[200px]">The cleaned image will appear here</p>
          </div>
        ) : loading ? (
            <div className="flex-1 flex justify-center items-center">
            <Loader text="AI is erasing the target...." size="lg" />
          </div>
        ) : (
          <div className="flex-1 relative group overflow-hidden rounded-2xl border border-white/10 bg-black/20">
            <img
              src={content}
              alt="processed"
              className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.02]"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RemoveObject;