
import React, { useState } from 'react';

interface ConversionResultProps {
  html: string;
  onReset: () => void;
}

const ConversionResult: React.FC<ConversionResultProps> = ({ html, onReset }) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('code');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex gap-1 bg-slate-200 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('code')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
              activeTab === 'code' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            HTML 소스
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
              activeTab === 'preview' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            미리보기
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyToClipboard}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              copied ? 'bg-green-100 text-green-700' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {copied ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                복사됨!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                코드 복사
              </>
            )}
          </button>
          <button
            onClick={onReset}
            className="px-4 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium transition-all"
          >
            새로 변환
          </button>
        </div>
      </div>

      <div className="p-0">
        {activeTab === 'code' ? (
          <div className="bg-slate-900 p-6 overflow-auto max-h-[600px] mono text-sm leading-relaxed">
            <pre className="text-slate-300 whitespace-pre-wrap break-all">
              {html}
            </pre>
          </div>
        ) : (
          <div className="p-10 overflow-auto max-h-[600px] bg-white">
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversionResult;
