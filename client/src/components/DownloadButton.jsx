import React from "react";
import { Download, Loader2 } from "lucide-react";
import { jsPDF } from "jspdf";
import toast from "react-hot-toast";

const DownloadButton = ({ type, content, fileName = "genify-export" }) => {
  const [isDownloading, setIsDownloading] = React.useState(false);

  const handleDownload = async (e) => {
    e.stopPropagation(); 
    setIsDownloading(true);
    try {
      if (type === "text") {
        const doc = new jsPDF();
        const lines = doc.splitTextToSize(content, 180);
        doc.text(lines, 10, 10);
        doc.save(`${fileName}.pdf`);
        toast.success("PDF Downloaded!");
      }

      if (type === "image") {
        const response = await fetch(content);
        const blob = await response.blob();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${fileName}.png`;
        link.click();
        toast.success("Image Saved!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Download failed");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className="flex items-center gap-2 px-4 py-2 text-[11px] font-bold uppercase tracking-wider bg-white/10 hover:bg-primary hover:text-white text-slate-300 rounded-xl transition-all border border-white/5 active:scale-95 disabled:opacity-50"
    >
      {isDownloading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Download className="w-3.5 h-3.5" />
      )}
      {isDownloading ? "Saving..." : "Download"}
    </button>
  );
};

export default DownloadButton;