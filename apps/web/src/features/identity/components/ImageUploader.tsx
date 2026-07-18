import React, { useRef, useState } from 'react';


interface ImageUploaderProps {
  label: string;
  onUpload: (file: File) => Promise<void>;
  isLoading?: boolean;
}

export default function ImageUploader({ label, onUpload, isLoading }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      onUpload(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div 
      className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 transition-colors ${
        dragActive ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
      <div className="text-center cursor-pointer">
        <span className="text-2xl mb-2 block">📸</span>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-slate-500 mt-1">Click or drag & drop</p>
      </div>
      {isLoading && (
        <div className="mt-2 text-xs text-primary-500 font-medium animate-pulse">
          Uploading...
        </div>
      )}
    </div>
  );
}
