
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Terms2HTML</h1>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
          <span className="text-blue-600">Converter</span>
          <span className="hover:text-slate-800 cursor-default">Preservation mode: On</span>
          <span className="hover:text-slate-800 cursor-default">Output: .termsInner</span>
        </nav>
      </div>
    </header>
  );
};

export default Header;
