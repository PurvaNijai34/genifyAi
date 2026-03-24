


import {
  FileText,
  Sparkles,
  UploadCloud,
  Search,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";
import DownloadButton from "../components/DownloadButton";
import Loader from "../components/Loader";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

const ReviewResume = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [fileName, setFileName] = useState("");

  const { getToken } = useAuth();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        return toast.error("Only PDF files are supported for analysis.");
      }
      setInput(file);
      setFileName(file.name);
      setContent(""); 
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!input) {
      return toast.error("Please upload a resume (PDF) to proceed.");
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("resume", input);

      const token = await getToken();
      const { data } = await axios.post("/api/ai/resume-review", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setContent(data.content);
        toast.success("Resume analysis completed successfully!");
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
      {/* --- LEFT SIDE: UPLOAD --- */}
      <form
        onSubmit={onSubmitHandler}
        className="flex-1 max-w-xl p-8 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-md shadow-2xl h-fit"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-teal-500/10 rounded-lg">
            <Sparkles className="w-6 h-6 text-teal-400" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            ATS Resume Review
          </h1>
        </div>

        <div className="space-y-6">
          <div className="relative group">
            <label className="text-sm font-semibold text-slate-400 ml-1">
              Upload Resume (PDF)
            </label>
            <div
              className={`mt-2 relative border-2 border-dashed rounded-2xl p-8 transition-all bg-white/[0.01] flex flex-col items-center justify-center gap-3 min-h-[180px] ${
                fileName
                  ? "border-teal-500/40"
                  : "border-white/10 hover:border-teal-500/30"
              }`}
            >
              {fileName ? (
                <div className="flex flex-col items-center animate-[scaleIn_0.2s_ease-out]">
                  <div className="p-3 bg-teal-500/20 rounded-xl mb-2">
                    <FileText className="text-teal-400 w-8 h-8" />
                  </div>
                  <p className="text-sm text-white font-medium truncate max-w-[200px]">
                    {fileName}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setFileName("");
                      setInput("");
                    }}
                    className="mt-2 text-[10px] text-red-400 hover:underline uppercase font-bold tracking-tighter cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <UploadCloud
                    size={40}
                    className="text-slate-600 group-hover:text-teal-400 transition-colors"
                  />
                  <p className="text-xs text-slate-500 text-center">
                    Click to browse or drop your resume here
                  </p>
                </>
              )}
              <input
                onChange={handleFileChange}
                type="file"
                accept="application/pdf"
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          <div className="p-4 bg-teal-500/5 rounded-2xl border border-teal-500/10">
            <h3 className="text-[11px] font-bold text-teal-400 uppercase mb-2">
              How it works
            </h3>
            <ul className="text-[11px] text-slate-400 space-y-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={12} className="text-teal-500" /> Analysis of ATS keywords
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={12} className="text-teal-500" /> Grammar & structure check
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={12} className="text-teal-500" /> Improvement suggestions
              </li>
            </ul>
          </div>

          {/* 🚀 FIXED: Button ab hamesha active dikhega jab tak loading na ho */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold px-4 py-4 mt-2 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal-500/20 cursor-pointer"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
            {loading ? "Analyzing Skills..." : "Review My Resume"}
          </button>
        </div>
      </form>

      {/* --- RIGHT SIDE: RESULTS --- */}
      <div className="flex-1 p-8 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-md flex flex-col min-h-[500px] lg:max-h-[calc(100vh-180px)] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-teal-400" />
            <h1 className="text-xl font-bold text-white">Analysis Results</h1>
          </div>

          {content && (
            <DownloadButton
              type="text"
              content={content}
              fileName={`genify-review-${fileName.replace(".pdf", "")}`}
            />
          )}
        </div>

        {!content && !loading ? (
          <div className="flex-1 flex flex-col justify-center items-center text-slate-600 gap-4 text-center">
            <div className="w-20 h-20 bg-white/[0.02] rounded-full flex items-center justify-center border border-white/5">
              <FileText className="w-8 h-8 opacity-20" />
            </div>
            <p className="text-sm italic max-w-[200px]">
              Detailed AI feedback will appear here
            </p>
          </div>
        ) : loading ? (
          <div className="flex-1 flex justify-center items-center">
            <Loader text="Reading your career story..." size="lg" />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
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

export default ReviewResume;