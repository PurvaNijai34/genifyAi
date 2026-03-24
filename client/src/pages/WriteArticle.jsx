

import React, { useState } from "react";
import { Edit, Sparkles, Wand2, FileText, Layout } from "lucide-react";
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

const WriteArticle = () => {
  const articleLength = [
    { length: 800, text: "Short (500-800 words)" },
    { length: 1200, text: "Medium (800-1200 words)" },
    { length: 1600, text: "Long (1200+ words)" },
  ];

  const [selectedLength, setSelectedLength] = useState(articleLength[0]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();


  const { fetchUserData } = useAppContext();

  
  const { isDisabled, isPremium } = useCredits();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

   
    if (isDisabled) {
      toast.error("No credits left 🚀 Upgrade to premium");
      return;
    }

    try {
      setLoading(true);

      const prompt = `Write a professional, well-structured article about ${input} in ${selectedLength.text}. Use markdown formatting.`;

      const { data } = await axios.post(
        "/api/ai/generate-article",
        { prompt, length: selectedLength.length },
        { headers: { Authorization: `Bearer ${await getToken()}` } },
      );

      if (data.success) {
        setContent(data.content);
        toast.success("Article generated!");

  
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
      {/* --- LEFT SIDE --- */}
      <form
        onSubmit={onSubmitHandler}
        className="flex-1 max-w-xl p-8 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-md shadow-2xl h-fit"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-white">Article Config</h1>
        </div>

        <div className="space-y-6">
          {/* INPUT */}
          <div>
            <label className="text-sm text-slate-400">Article Topic</label>
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type="text"
              className="w-full bg-white/[0.03] border border-white/10 p-4 mt-2 text-white rounded-xl"
              placeholder="e.g. Web3 future"
              required
            />
          </div>

          {/* LENGTH */}
          <div>
            <label className="text-sm text-slate-400">Desired Length</label>
            <div className="mt-3 flex gap-2 flex-wrap">
              {articleLength.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedLength(item)}
                  className={`text-xs px-4 py-2 rounded-full ${
                    selectedLength.text === item.text
                      ? "bg-primary text-white"
                      : "text-slate-400 border border-white/10"
                  }`}
                >
                  {item.text}
                </button>
              ))}
            </div>
          </div>

        
          <button
            disabled={loading || isDisabled}
            className={`w-full flex justify-center items-center gap-3 px-4 py-4 mt-4 rounded-xl font-bold transition-all
            ${
              isDisabled
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-primary hover:bg-primary-dark text-white"
            }`}
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-t-transparent animate-spin rounded-full"></span>
            ) : (
              <Wand2 className="w-5 h-5" />
            )}
            {loading ? "AI is writing..." : "Generate Masterpiece"}
          </button>

          
          {isDisabled && (
            <p className="text-red-400 text-sm mt-2">
              ⚠️ No credits left. Upgrade to continue 
            </p>
          )}
        </div>
      </form>

      {/* --- RIGHT SIDE --- */}

      <div className="flex-1 p-8 bg-white/[0.02] border border-white/5 rounded-3xl flex flex-col min-h-[500px] lg:max-h-[calc(100vh-180px)]  overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-bold text-white">Preview</h1>
          </div>

          {content && (
            <DownloadButton
              type="text"
              content={content}
              fileName="genify-article"
            />
          )}
        </div>


        {!content && !loading ? (
          <div className="flex-1 flex justify-center items-center text-slate-600">
            <p>Enter topic to generate article</p>
          </div>
        ) : loading ? (
          <div className="flex-1 flex justify-center items-center">
            <Loader text="AI is writing your article..." size="lg" />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-3">
            <div
              className="prose prose-invert max-w-none text-slate-300 
                    prose-headings:text-white 
                    prose-p:leading-relaxed 
                    prose-p:mb-4 
                    prose-li:mb-1 
                    prose-strong:text-white"
            >
              <Markdown>{content}</Markdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WriteArticle;
