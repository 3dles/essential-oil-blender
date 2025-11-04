
import React, { useState, useMemo, useCallback } from 'react';
import { BlendItem, EssentialOil, CompositionResult } from './types';
import { ESSENTIAL_OILS } from './data/essentialOils';
import { analyzeBlend } from './services/geminiService';
import Header from './components/Header';
import EssentialOilSelector from './components/EssentialOilSelector';
import BlendList from './components/BlendList';
import CompositionPieChart from './components/CompositionPieChart';
import BlendAnalysis from './components/BlendAnalysis';
import { PlusCircleIcon } from './components/icons';

export default function App() {
  const [blend, setBlend] = useState<BlendItem[]>([]);
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
  }, []);

  const updateDropCount = useCallback((oilId: string, newDrops: number) => {
    if (newDrops < 1) return;
    setBlend((prevBlend) =>
      prevBlend.map((item) =>
        item.oil.id === oilId ? { ...item, drops: newDrops } : item
      )
    );
  }, []);

  const removeOilFromBlend = useCallback((oilId: string) => {
    setBlend((prevBlend) => prevBlend.filter((item) => item.oil.id !== oilId));
  }, []);

  const composition = useMemo<CompositionResult[]>(() => {
    const totalDrops = blend.reduce((sum, item) => sum + item.drops, 0);
    if (totalDrops === 0) return [];

    const componentTotals: { [key: string]: number } = {};

    blend.forEach(({ oil, drops }) => {
      oil.composition.forEach(({ name, percentage }) => {
        if (!componentTotals[name]) {
          componentTotals[name] = 0;
        }
        componentTotals[name] += (percentage / 100) * drops;
      });
    });

    return Object.entries(componentTotals)
      .map(([name, total]) => ({
        name,
        value: parseFloat(((total / totalDrops) * 100).toFixed(2)),
      }))
      .sort((a, b) => b.value - a.value);
  }, [blend]);

  const handleAnalyzeBlend = async () => {
    if (composition.length === 0) {
      setError('분석할 블렌드가 없습니다. 오일을 먼저 추가해주세요.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysis('');
    try {
      const result = await analyzeBlend(composition);
      setAnalysis(result);
    } catch (err) {
      setError('분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header />
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
                <button
                    onClick={handleAnalyzeBlend}
                    disabled={isLoading}
                    className="w-full mt-4 bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-emerald-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                     {isLoading ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <PlusCircleIcon className="w-6 h-6" />
                    )}
                    <span>{isLoading ? '분석 중...' : '블렌드 분석하기'}</span>
                </button>
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
      </main>
    </div>
  );
}
