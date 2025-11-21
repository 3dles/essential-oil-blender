
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { saveApiKey, getApiKey, removeApiKey } from '../utils/storage';
import { SaveIcon, CheckCircleIcon, XCircleIcon, TrashIcon } from './icons';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TestStatus = 'idle' | 'loading' | 'success' | 'error';

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [status, setStatus] = useState<TestStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      const storedKey = getApiKey();
      if (storedKey) {
        setApiKey(storedKey);
      }
      setStatus('idle');
      setErrorMsg('');
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!apiKey.trim()) {
        setErrorMsg('API Key를 입력해주세요.');
        return;
    }
    saveApiKey(apiKey.trim());
    onClose();
  };

  const handleDelete = () => {
      if(window.confirm('저장된 API Key를 삭제하시겠습니까?')) {
          removeApiKey();
          setApiKey('');
          setStatus('idle');
      }
  }

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      setErrorMsg('테스트할 API Key를 입력해주세요.');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      // Use the input key to create a temporary client
      const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
      // Simple hello to test auth
      await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'Hello',
      });
      
      setStatus('success');
    } catch (error: any) {
      console.error("Connection test failed", error);
      setStatus('error');
      setErrorMsg('연결 실패: API Key를 확인해주세요.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">API Key 설정</h2>
          <p className="text-sm text-gray-500 mt-1">
            Gemini API 사용을 위한 키를 관리합니다. 키는 브라우저 내부에 암호화되어 저장됩니다.
          </p>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
              Gemini API Key
            </label>
            <input
              type="password"
              id="apiKey"
              value={apiKey}
              onChange={(e) => {
                  setApiKey(e.target.value);
                  setStatus('idle');
              }}
              placeholder="AI Studio API Key 입력"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
            />
          </div>

          {status === 'loading' && (
             <div className="flex items-center text-sm text-gray-600">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                연결 테스트 중...
             </div>
          )}

          {status === 'success' && (
            <div className="flex items-center text-sm text-emerald-600 bg-emerald-50 p-2 rounded-lg">
              <CheckCircleIcon className="w-5 h-5 mr-2" />
              연결 성공! 유효한 API Key입니다.
            </div>
          )}

          {(status === 'error' || errorMsg) && (
             <div className="flex items-center text-sm text-red-600 bg-red-50 p-2 rounded-lg">
               <XCircleIcon className="w-5 h-5 mr-2" />
               {errorMsg || '오류가 발생했습니다.'}
             </div>
          )}

          <div className="flex space-x-3 pt-2">
            <button
              onClick={handleTestConnection}
              className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition"
            >
              연결 테스트
            </button>
             {apiKey && (
                 <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl transition"
                    title="키 삭제"
                 >
                     <TrashIcon className="w-5 h-5" />
                 </button>
             )}
          </div>
        </div>

        <div className="p-4 bg-gray-50 flex justify-end space-x-3 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 font-medium hover:text-gray-800 transition"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="flex items-center px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition transform active:scale-95"
          >
            <SaveIcon className="w-5 h-5 mr-2" />
            저장 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
