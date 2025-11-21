
import React, { useState, useCallback, useEffect } from 'react';
import { BlendItem, EssentialOil, CompositionResult, SavedBlend } from './types';
import { ESSENTIAL_OILS } from './data/essentialOils';
import { analyzeBlend } from './services/geminiService';
import Header from './components/Header';
import EssentialOilSelector from './components/EssentialOilSelector';
import BlendList from './components/BlendList';
import CompositionPieChart from './components/CompositionPieChart';
import BlendAnalysis from './components/BlendAnalysis';
import SavedBlendsList from './components/SavedBlendsList';
import { SaveIcon, BeakerIcon } from './components/icons';
import ApiKeyModal from './components/ApiKeyModal';
import { getApiKey } from './utils/storage';

export default function App() {
  const [blend, setBlend] = useState<BlendItem[]>([]);
  const [composition, setComposition] = useState<CompositionResult[]>([]);
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [savedBlends, setSavedBlends] = useState<SavedBlend[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Load saved blends from localStorage on initial render
  useEffect(() => {
    try {
      const storedBlends = localStorage.getItem('essentialOilBlends');
      if (storedBlends) {
        setSavedBlends(JSON.parse(storedBlends));
      }
    } catch (error) {
      console.error("Failed to load blends from local storage", error);
    }

    // Check if API key exists on load, if not, maybe prompt? 
    // For now, we just let the user click the settings button.
    if (!getApiKey()) {
        // Optionally auto-open settings if no key is found
        // setIsSettingsOpen(true); 
    }
  }, []);

  // Save blends to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('essentialOilBlends', JSON.stringify(savedBlends));
    } catch (error) {
      console.error("Failed to save blends to local storage", error);
    }
  }, [savedBlends]);

  // Calculate composition whenever the blend changes
  useEffect(() => {
    const totalDrops = blend.reduce((sum, item) => sum + item.drops, 0);
    if (totalDrops === 0) {
      setComposition([]);
      return;
    }

    const componentTotals: { [key: string]: number } = {};

    blend.forEach(({ oil, drops }) => {
      oil.composition.forEach(({ name, percentage }) => {
        if (!componentTotals[name]) {
          componentTotals[name] = 0;
        }
        componentTotals[name] += (percentage / 100) * drops;
      });
    });

    const newComposition = Object.entries(componentTotals)
      .map(([name, total]) => ({
        name,
        value: parseFloat(((total / totalDrops) * 100).toFixed(2)),
      }))
      .sort((a, b) => b.value - a.value);
      
    setComposition(newComposition);
  }, [blend]);


  const addOilToBlend = useCallback((oil: EssentialOil) => {
    setBlend((prevBlend) => {
      const existing = prevBlend.find((item) => item.oil.id === oil.id);
      if (existing) {
        return prevBlend.map((item) =>
          item.oil.id === oil.id ? { ...item, drops: item.drops + 1 } : item
        );
      }
      return [...prevBlend, { oil, drops: 1 }];
    });
    setAnalysis(''); // Clear stale analysis
  }, []);

  const updateDropCount = useCallback((oilId: string, newDrops: number) => {
    if (newDrops < 1) return;
    setBlend((prevBlend) =>
      prevBlend.map((item) =>
        item.oil.id === oilId ? { ...item, drops: newDrops } : item
      )
    );
    setAnalysis(''); // Clear stale analysis
  }, []);

  const removeOilFromBlend = useCallback((oilId: string) => {
    setBlend((prevBlend) => prevBlend.filter((item) => item.oil.id !== oilId));
    setAnalysis(''); // Clear stale analysis
  }, []);

  const handleAnalyzeBlend = async () => {
    if (composition.length === 0) {
      setError('분석할 블렌드가 없습니다. 오일을 먼저 추가해주세요.');
      return;
    }
    
    if (!getApiKey()) {
        setIsSettingsOpen(true);
        setError('API Key가 필요합니다. 설정에서 키를 입력해주세요.');
        return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysis('');

    try {
      const analysisResult = await analyzeBlend(composition);
      setAnalysis(analysisResult);
    } catch (err: any) {
      setError(err.message || '분석 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSaveBlend = () => {
    if (blend.length === 0 || !analysis) {
        alert('저장하려면 먼저 블렌드를 구성하고 분석해야 합니다.');
        return;
    }
    const blendName = prompt('저장할 블렌드 이름을 입력해주세요:');
    if (blendName && blendName.trim() !== '') {
      const newSavedBlend: SavedBlend = {
        id: Date.now().toString(),
        name: blendName,
        blend: blend,
        composition: composition,
        analysis: analysis,
      };
      setSavedBlends(prev => [...prev, newSavedBlend]);
      alert(`'${blendName}'(으)로 블렌드가 저장되었습니다.`);
    }
  };

  const handleLoadBlend = useCallback((id: string) => {
    const blendToLoad = savedBlends.find(b => b.id === id);
    if (blendToLoad) {
      setBlend(blendToLoad.blend);
      setAnalysis(blendToLoad.analysis);
      setComposition(blendToLoad.composition || []);
      setError(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [savedBlends]);

  const handleDeleteBlend = useCallback((id: string) => {
    if (window.confirm('정말로 이 블렌드를 삭제하시겠습니까?')) {
      setSavedBlends(prev => prev.filter(b => b.id !== id));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Header onOpenSettings={() => setIsSettingsOpen(true)} />
      
      <ApiKeyModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col space-y-6">
            <h2 className="text-2xl font-bold text-gray-700 border-b pb-3">1. 블렌드 구성하기</h2>
            <EssentialOilSelector oils={ESSENTIAL_OILS} onAddOil={addOilToBlend} />
            <div className="flex-grow">
              <BlendList
                blend={blend}
                onUpdateDrops={updateDropCount}
                onRemoveOil={removeOilFromBlend}
              />
            </div>
             {blend.length > 0 && (
                <div className="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <button
                      onClick={handleAnalyzeBlend}
                      disabled={isLoading}
                      className="w-full bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-emerald-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                      {isLoading ? (
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                      ) : (
                          <BeakerIcon className="w-6 h-6" />
                      )}
                      <span>{isLoading ? '분석 중...' : '블렌드 분석하기'}</span>
                  </button>
                  <button
                      onClick={handleSaveBlend}
                      disabled={!analysis || isLoading}
                      className="w-full bg-sky-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-sky-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                      <SaveIcon className="w-6 h-6" />
                      <span>현재 블렌드 저장</span>
                  </button>
                </div>
             )}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col space-y-6">
            <h2 className="text-2xl font-bold text-gray-700 border-b pb-3">2. 화학 구성 비율</h2>
            <div className="flex-grow min-h-[400px]">
              <CompositionPieChart data={composition} />
            </div>
            <BlendAnalysis analysis={analysis} isLoading={isLoading} error={error} />
          </div>

        </div>
        
        <div className="mt-8 bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-700 border-b pb-3 mb-6">3. 저장된 블렌드</h2>
            <SavedBlendsList 
                savedBlends={savedBlends}
                onLoad={handleLoadBlend}
                onDelete={handleDeleteBlend}
            />
        </div>

      </main>
    </div>
  );
}
