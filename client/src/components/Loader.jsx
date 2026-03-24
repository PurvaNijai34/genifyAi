import React from "react";

const Loader = ({ text = "Loading...", size = "md" }) => {
  const sizeClasses = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-3",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Spinner */}
      <div
        className={`${sizeClasses[size]} rounded-full border-primary border-t-transparent animate-spin shadow-[0_0_15px_rgba(99,102,241,0.4)]`}
      ></div>

      {/* Text */}
      {text && (
        <p className="text-sm text-slate-400 animate-pulse tracking-wide">
          {text}
        </p>
      )}
    </div>
  );
};

export default Loader;