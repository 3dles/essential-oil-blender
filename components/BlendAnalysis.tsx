
import React from 'react';
import { marked } from 'marked';

interface BlendAnalysisProps {
  analysis: string;
  isLoading: boolean;
  error: string | null;
}

const BlendAnalysis: React.FC<BlendAnalysisProps> = ({ analysis, isLoading, error }) => {
  const getHtml = () => {
    if (analysis) {
       return { __html: marked.parse(analysis) };
    }
    return { __html: '' };
  };

  return (
    <div className="mt-4 p-4 border-t border-gray-200 min-h-[150px]">
      <h3 className="text-xl font-bold mb-3 text-gray-700">Gemini AI 분석 결과</h3>
      {isLoading && (
        <div className="flex items-center justify-center space-x-2 text-gray-500">
          <svg className="animate-spin h-5 w-5 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>AI가 블렌드를 분석하고 있습니다...</span>
        </div>
      )}
      {error && (
        <div className="p-3 bg-red-100 border border-red-300 text-red-800 rounded-lg">
          {error}
        </div>
      )}
      {!isLoading && !error && analysis && (
         <div 
          className="prose prose-sm max-w-none prose-headings:text-emerald-700 prose-strong:text-gray-800"
          dangerouslySetInnerHTML={getHtml()} 
        />
      )}
      {!isLoading && !error && !analysis && (
        <p className="text-gray-500">'블렌드 분석하기' 버튼을 누르면 AI 분석 결과를 볼 수 있습니다.</p>
      )}
    </div>
  );
};

export default BlendAnalysis;
