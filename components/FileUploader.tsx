
import React, { useRef, useState } from 'react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  disabled: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (isValidFile(file)) {
        onFileSelect(file);
      } else {
        alert('지원되지 않는 파일 형식입니다. .docx 또는 .pdf 파일을 권장합니다.');
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const isValidFile = (file: File) => {
    const validExtensions = ['.doc', '.docx', '.pdf'];
    const fileName = file.name.toLowerCase();
    return validExtensions.some(ext => fileName.endsWith(ext));
  };

  const triggerFileInput = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={triggerFileInput}
      className={`
        relative overflow-hidden
        border-2 border-dashed rounded-2xl p-12
        flex flex-col items-center justify-center gap-4
        transition-all duration-200 cursor-pointer
        ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 bg-white'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept=".doc,.docx,.pdf"
        className="hidden"
        disabled={disabled}
      />
      
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </div>
      
      <div className="text-center">
        <p className="text-lg font-semibold text-slate-800">
          약관 문서를 드래그하여 업로드하세요
        </p>
        <p className="text-slate-500 text-sm mt-1">
          DOCX, PDF (권장) 또는 DOC 파일 지원
        </p>
        <p className="text-xs text-slate-400 mt-2">
          * PDF 파일은 레이아웃과 표 구조를 더 정확하게 유지합니다.
        </p>
      </div>
      
      <button
        className="mt-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        disabled={disabled}
      >
        파일 선택하기
      </button>
    </div>
  );
};

export default FileUploader;
