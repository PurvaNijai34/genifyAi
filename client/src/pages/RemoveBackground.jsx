
import { Eraser, Sparkles, UploadCloud, ImageIcon, Loader2 } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/react";
import toast from "react-hot-toast";
import DownloadButton from "../components/DownloadButton";
import Loader from "../components/Loader";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

const RemoveBackground = () => {
  const [input, setInput] = useState("");
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

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", input);

      const token = await getToken();
      const { data } = await axios.post(
        "/api/ai/remove-image-background",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setContent(data.content);
        toast.success("Background removed successfully!");
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-8 animate-[fadeIn_0.5s_ease-out] p-4 sm:p-0">
      
      {/* --- LEFT SIDE: UPLOAD --- */}
      <form
        onSubmit={onSubmitHandler}
        className="flex-1 max-w-xl p-8 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-md shadow-2xl h-fit"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-orange-500/10 rounded-lg">
            <Sparkles className="w-6 h-6 text-orange-400" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">BG Remover</h1>
        </div>

        <div className="space-y-6">
          <div className="relative group">
            <label className="text-sm font-semibold text-slate-400 ml-1">Upload Image</label>
            <div className="mt-2 relative border-2 border-dashed border-white/10 rounded-2xl p-8 hover:border-orange-500/40 transition-all bg-white/[0.01] flex flex-col items-center justify-center gap-3 min-h-[200px]">
              {preview ? (
                <div className="relative w-full h-48">
                  <img src={preview} className="w-full h-full object-contain rounded-lg" alt="Preview" />
                  <button 
                    type="button"
                    onClick={() => {setPreview(null); setInput("")}}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-xl z-10"
                  >
                    <Eraser size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <UploadCloud size={40} className="text-slate-600 group-hover:text-orange-400 transition-colors" />
                  <p className="text-xs text-slate-500 text-center px-4">Click to browse or drag and drop image</p>
                </>
              )}
              <input
                onChange={handleFileChange}
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            <p className="text-[10px] text-slate-600 mt-4 text-center uppercase tracking-widest font-bold">Supports JPG, PNG, WebP</p>
          </div>

          {/* 🚀 Button ab hamesha active dikhega jab tak loading na ho */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold px-4 py-4 mt-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20 cursor-pointer"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Eraser className="w-5 h-5" />
            )}
            {loading ? "Removing Background..." : "Remove Background"}
          </button>
        </div>
      </form>

      {/* --- RIGHT SIDE: RESULT --- */}
      <div className="flex-1 p-8 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-md flex flex-col min-h-[500px] lg:max-h-[calc(100vh-180px)] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <ImageIcon className="w-5 h-5 text-orange-400" />
            <h1 className="text-xl font-bold text-white">Result</h1>
          </div>
          
          {content && (
            <DownloadButton type="image" content={content} fileName="genify-no-bg" />
          )}
        </div>

        {!content && !loading ? (
          <div className="flex-1 flex flex-col justify-center items-center text-slate-600 gap-4 text-center">
            <div className="w-20 h-20 bg-white/[0.02] rounded-full flex items-center justify-center border border-white/5">
              <Eraser className="w-8 h-8 opacity-20" />
            </div>
            <p className="text-sm italic max-w-[200px]">Your background-free image will appear here</p>
          </div>
        ) : loading ? (
           <div className="flex-1 flex justify-center items-center">
            <Loader text="Magic is happening..." size="lg" />
          </div>
        ) : (
          <div className="flex-1 relative group overflow-hidden rounded-2xl border border-white/10 bg-[url('https://www.transparenttextures.com/patterns/checkerboard.png')] bg-white/10">
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

export default RemoveBackground;