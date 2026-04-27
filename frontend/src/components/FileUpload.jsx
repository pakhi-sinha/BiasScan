import { useState, useRef } from "react";

export default function FileUpload({ onUpload }) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.name.toLowerCase().endsWith(".csv")) {
        setSelectedFile(file);
      }
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleAnalyze = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="w-full">
      {/* Dropzone */}
      <div
        id="file-dropzone"
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !selectedFile && inputRef.current?.click()}
        className={`relative group cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300 ${
          isDragging
            ? "border-accent-purple bg-accent-purple/10 scale-[1.01]"
            : selectedFile
            ? "border-accent-indigo/30 bg-accent-indigo/5"
            : "border-white/10 hover:border-white/20 hover:bg-white/[0.02]"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
          id="csv-file-input"
        />

        {!selectedFile ? (
          <>
            {/* Upload icon */}
            <div className={`mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 ${
              isDragging
                ? "bg-accent-purple/20 scale-110"
                : "bg-white/5 group-hover:bg-accent-purple/10"
            }`}>
              <svg
                className={`h-8 w-8 transition-colors duration-300 ${
                  isDragging ? "text-accent-purple" : "text-white/30 group-hover:text-accent-purple/70"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>

            <p className="text-lg font-semibold text-white/70 mb-1">
              {isDragging ? "Drop your CSV file here" : "Drag & drop your CSV file here"}
            </p>
            <p className="text-sm text-white/30">
              or{" "}
              <span className="text-accent-purple hover:underline">
                browse files
              </span>{" "}
              to upload
            </p>
            <p className="mt-4 text-xs text-white/20">
              Supports .csv files up to 10 MB
            </p>
          </>
        ) : (
          <div className="animate-scale-in">
            {/* File selected */}
            <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-accent-indigo/10">
              <svg className="h-7 w-7 text-accent-indigo" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>

            <p className="text-lg font-semibold text-white mb-1">
              {selectedFile.name}
            </p>
            <p className="text-sm text-white/40 mb-6">
              {formatFileSize(selectedFile.size)}
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                id="analyze-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAnalyze();
                }}
                className="btn-primary"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Scan for Bias
              </button>
              <button
                id="change-file-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                  inputRef.current.value = "";
                }}
                className="btn-secondary"
              >
                Change File
              </button>
            </div>
          </div>
        )}

        {/* Decorative gradient blobs */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full bg-accent-purple/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-accent-indigo/5 blur-3xl" />
      </div>
    </div>
  );
}
