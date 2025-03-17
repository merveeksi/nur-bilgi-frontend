'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface Juz {
  id: number;
  name: string;
  startPage: number;
  endPage: number;
}

interface CuzIndicatorProps {
  juzData: Juz[];
  currentPage: number;
  onJuzChange: (juzId: number) => void;
}

const CuzIndicator: React.FC<CuzIndicatorProps> = ({ juzData, currentPage, onJuzChange }) => {
  // Şu anda görüntülenen cüz
  const currentJuz = juzData.find(juz => 
    currentPage >= juz.startPage && currentPage <= juz.endPage
  );

  // Sayfanın, cüz içindeki ilerlemesi (0-1 arası)
  const getProgressInJuz = () => {
    if (!currentJuz) return 0;
    const totalPagesInJuz = currentJuz.endPage - currentJuz.startPage + 1;
    const pagesCompleted = currentPage - currentJuz.startPage;
    return Math.min(1, Math.max(0, pagesCompleted / totalPagesInJuz));
  };

  const progressPercent = getProgressInJuz() * 100;

  return (
    <div className="fixed bottom-36 left-6 z-20">
      <div className="bg-emerald-700 text-white rounded-lg shadow-lg p-3 max-w-xs">
        <div className="text-sm opacity-80">Cüz</div>
        <div className="text-xl font-bold">{currentJuz?.id || 1}. {currentJuz?.name || ''}</div>
        <div className="text-xs mb-2">{currentJuz?.startPage || 1}-{currentJuz?.endPage || 20}. sayfalar</div>
        
        {/* İlerleme çubuğu */}
        <div className="h-2 bg-emerald-800 rounded-full mt-2 overflow-hidden">
          <div 
            className="h-full bg-emerald-400"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        
        {/* Önceki/Sonraki Cüz */}
        <div className="flex justify-between mt-3">
          <button
            onClick={() => currentJuz && currentJuz.id > 1 && onJuzChange(currentJuz.id - 1)}
            disabled={!currentJuz || currentJuz.id <= 1}
            className="text-xs bg-emerald-600 hover:bg-emerald-500 px-2 py-1 rounded disabled:opacity-50"
          >
            ◀ Önceki Cüz
          </button>
          <button
            onClick={() => currentJuz && currentJuz.id < 30 && onJuzChange(currentJuz.id + 1)}
            disabled={!currentJuz || currentJuz.id >= 30}
            className="text-xs bg-emerald-600 hover:bg-emerald-500 px-2 py-1 rounded disabled:opacity-50"
          >
            Sonraki Cüz ▶
          </button>
        </div>
      </div>
    </div>
  );
};

export default CuzIndicator; 