'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Kur'an-ı Kerim'in 30 cüzü
interface Juz {
  id: number;
  name: string;
  startPage: number;
  endPage: number;
  // Sureleri de cüzlere göre gruplandırıyoruz
  surahs: Array<{
    id: number;
    name: string;
    arabicName: string;
    startVerse?: number;
    endVerse?: number;
  }>;
}

// Cüz verileri
const juzData: Juz[] = [
  { 
    id: 1, 
    name: "Elif Lâm Mîm", 
    startPage: 1, 
    endPage: 21, 
    surahs: [
      { id: 1, name: "Fatiha", arabicName: "الفاتحة", startVerse: 1, endVerse: 7 },
      { id: 2, name: "Bakara", arabicName: "البقرة", startVerse: 1, endVerse: 141 }
    ]
  },
  { 
    id: 2, 
    name: "Sayekûl", 
    startPage: 22, 
    endPage: 41, 
    surahs: [
      { id: 2, name: "Bakara", arabicName: "البقرة", startVerse: 142, endVerse: 252 }
    ]
  },
  { 
    id: 3, 
    name: "Tilker Rusül", 
    startPage: 42, 
    endPage: 61, 
    surahs: [
      { id: 2, name: "Bakara", arabicName: "البقرة", startVerse: 253, endVerse: 286 },
      { id: 3, name: "Âl-i İmrân", arabicName: "آل عمران", startVerse: 1, endVerse: 92 }
    ] 
  },
  { 
    id: 4, 
    name: "Len Tenâlû", 
    startPage: 62, 
    endPage: 81, 
    surahs: [
      { id: 3, name: "Âl-i İmrân", arabicName: "آل عمران", startVerse: 93, endVerse: 200 },
      { id: 4, name: "Nisâ", arabicName: "النساء", startVerse: 1, endVerse: 23 }
    ] 
  },
  { 
    id: 5, 
    name: "Vel Muhsanât", 
    startPage: 82, 
    endPage: 101, 
    surahs: [
      { id: 4, name: "Nisâ", arabicName: "النساء", startVerse: 24, endVerse: 147 }
    ] 
  }
  // Diğer cüzler eklenebilir
];

interface CuzOverviewProps {
  onSurahSelect: (surahId: number, verseNumber?: number) => void;
}

const CuzOverview: React.FC<CuzOverviewProps> = ({ onSurahSelect }) => {
  // Filtre için arama
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filtrelenmiş cüzler
  const filteredJuzs = juzData.filter(juz => 
    juz.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    juz.surahs.some(surah => surah.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Cüz Görünümü</h2>
      
      <div className="mb-6">
        <div className="relative">
          <Input
            type="text"
            placeholder="Cüz veya sure ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>
      
      <div className="space-y-6">
        {filteredJuzs.map(juz => (
          <div key={juz.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="text-xl font-semibold mb-2">
              {juz.id}. Cüz: {juz.name}
              <span className="text-sm text-gray-500 ml-2">({juz.startPage}-{juz.endPage}. sayfalar)</span>
            </h3>
            
            <div className="ml-4 mt-3 space-y-2">
              {juz.surahs.map(surah => (
                <div 
                  key={`${juz.id}-${surah.id}-${surah.startVerse || 0}`} 
                  className="flex justify-between items-center"
                >
                  <div>
                    <span className="font-medium">{surah.id}. {surah.name}</span>
                    <span className="text-sm text-gray-500 ml-2">{surah.arabicName}</span>
                    {surah.startVerse && surah.endVerse && (
                      <span className="text-xs text-gray-500 ml-2">
                        (Ayet {surah.startVerse}-{surah.endVerse})
                      </span>
                    )}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onSurahSelect(surah.id, surah.startVerse)}
                  >
                    Git
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CuzOverview; 