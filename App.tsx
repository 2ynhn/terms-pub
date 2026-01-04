
import React, { useState } from 'react';
import Header from './components/Header';
import FileUploader from './components/FileUploader';
import ConversionResult from './components/ConversionResult';
import { AppStatus } from './types';
import { convertDocToHtml } from './services/geminiService';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [resultHtml, setResultHtml] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    setStatus(AppStatus.CONVERTING);
    setError(null);
    
    try {
      const html = await convertDocToHtml(file);
      setResultHtml(html);
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      console.error('Conversion error:', err);
      setError(err.message || '파일 변환 중 오류가 발생했습니다. 다시 시도해 주세요.');
      setStatus(AppStatus.ERROR);
    }
  };

  const handleReset = () => {
    setStatus(AppStatus.IDLE);
    setResultHtml('');
    setError(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl mb-4">
            약관 문서를 HTML로 즉시 변환하세요
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            DOCX 파일을 업로드하면 <code className="bg-slate-100 px-1.5 py-0.5 rounded text-blue-600 font-mono">.termsInner</code> 구조의 
            깨끗한 HTML로 변환해 드립니다. 원문 수정 없이 태그만 정확하게 입힙니다.
          </p>
        </div>

        {status === AppStatus.IDLE && (
          <FileUploader onFileSelect={handleFileSelect} disabled={false} />
        )}

        {status === AppStatus.CONVERTING && (
          <div className="bg-white rounded-2xl p-20 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="relative w-20 h-20 mb-6">
              <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">약관을 분석하고 있습니다</h3>
            <p className="text-slate-500 max-w-xs">
              Gemini AI가 문서의 구조를 파악하여 HTML 태그를 구성하고 있습니다. 잠시만 기다려 주세요.
            </p>
          </div>
        )}

        {status === AppStatus.SUCCESS && (
          <ConversionResult html={resultHtml} onReset={handleReset} />
        )}

        {status === AppStatus.ERROR && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-red-900 mb-2">변환 실패</h3>
            <p className="text-red-700 mb-6">{error}</p>
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              다시 시도하기
            </button>
          </div>
        )}
      </main>

      <footer className="py-8 border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-400">
            &copy; 2024 Terms2HTML Converter. All rights reserved. <br/>
            사용된 태그: h1~h6, p, ul, ol, table | 원문 100% 보존 모드 활성화됨
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
