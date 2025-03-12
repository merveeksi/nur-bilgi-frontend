'use client';

import { useState, useEffect } from 'react';
import { Clock, Calendar, MapPin, ChevronDown } from 'lucide-react';

interface PrayerTime {
  name: string;
  time: string;
  arabicName: string;
}

interface CityPrayerTimes {
  [city: string]: PrayerTime[];
}

export default function PrayerTimes() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextPrayer, setNextPrayer] = useState<PrayerTime | null>(null);
  const [location, setLocation] = useState('İstanbul');
  const [date, setDate] = useState(new Date().toLocaleDateString('tr-TR', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  }));
  const [hijriDate, setHijriDate] = useState('');
  const [showCitySelector, setShowCitySelector] = useState(false);

  // Türkiye'deki büyük şehirler
  const cities = [
    'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 
    'Adana', 'Konya', 'Gaziantep', 'Şanlıurfa', 'Kayseri',
    'Diyarbakır', 'Mersin', 'Samsun', 'Trabzon', 'Erzurum'
  ];

  // Mock data for different cities - in a real app, this would come from an API
  const mockCityPrayerTimes: CityPrayerTimes = {
    'İstanbul': [
      { name: 'İmsak', time: '05:23', arabicName: 'الإمساك' },
      { name: 'Güneş', time: '06:52', arabicName: 'الشروق' },
      { name: 'Öğle', time: '13:07', arabicName: 'الظهر' },
      { name: 'İkindi', time: '16:37', arabicName: 'العصر' },
      { name: 'Akşam', time: '19:12', arabicName: 'المغرب' },
      { name: 'Yatsı', time: '20:32', arabicName: 'العشاء' },
    ],
    'Ankara': [
      { name: 'İmsak', time: '05:19', arabicName: 'الإمساك' },
      { name: 'Güneş', time: '06:45', arabicName: 'الشروق' },
      { name: 'Öğle', time: '13:00', arabicName: 'الظهر' },
      { name: 'İkindi', time: '16:30', arabicName: 'العصر' },
      { name: 'Akşam', time: '19:05', arabicName: 'المغرب' },
      { name: 'Yatsı', time: '20:25', arabicName: 'العشاء' },
    ],
    'İzmir': [
      { name: 'İmsak', time: '05:30', arabicName: 'الإمساك' },
      { name: 'Güneş', time: '06:57', arabicName: 'الشروق' },
      { name: 'Öğle', time: '13:12', arabicName: 'الظهر' },
      { name: 'İkindi', time: '16:42', arabicName: 'العصر' },
      { name: 'Akşam', time: '19:17', arabicName: 'المغرب' },
      { name: 'Yatsı', time: '20:37', arabicName: 'العشاء' },
    ],
    'Bursa': [
      { name: 'İmsak', time: '05:25', arabicName: 'الإمساك' },
      { name: 'Güneş', time: '06:53', arabicName: 'الشروق' },
      { name: 'Öğle', time: '13:08', arabicName: 'الظهر' },
      { name: 'İkindi', time: '16:38', arabicName: 'العصر' },
      { name: 'Akşam', time: '19:13', arabicName: 'المغرب' },
      { name: 'Yatsı', time: '20:33', arabicName: 'العشاء' },
    ],
    'Antalya': [
      { name: 'İmsak', time: '05:15', arabicName: 'الإمساك' },
      { name: 'Güneş', time: '06:40', arabicName: 'الشروق' },
      { name: 'Öğle', time: '12:55', arabicName: 'الظهر' },
      { name: 'İkindi', time: '16:25', arabicName: 'العصر' },
      { name: 'Akşam', time: '19:00', arabicName: 'المغرب' },
      { name: 'Yatsı', time: '20:20', arabicName: 'العشاء' },
    ],
  };

  // Default values for other cities
  for (const city of cities) {
    if (!mockCityPrayerTimes[city]) {
      // Generate slightly different times for other cities
      const baseTime = mockCityPrayerTimes['İstanbul'];
      mockCityPrayerTimes[city] = baseTime.map(prayer => {
        const [hour, minute] = prayer.time.split(':').map(Number);
        const newHour = (hour + Math.floor(Math.random() * 2) - 1 + 24) % 24;
        const newMinute = (minute + Math.floor(Math.random() * 10) - 5 + 60) % 60;
        return {
          ...prayer,
          time: `${String(newHour).padStart(2, '0')}:${String(newMinute).padStart(2, '0')}`
        };
      });
    }
  }

  // Update prayer times when location changes
  useEffect(() => {
    try {
      setLoading(true);
      
      // Get prayer times for selected city
      const cityPrayerTimes = mockCityPrayerTimes[location] || mockCityPrayerTimes['İstanbul'];
      setPrayerTimes(cityPrayerTimes);
      
      // Find next prayer time
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTimeInMinutes = currentHour * 60 + currentMinute;
      
      let nextPrayerIndex = -1;
      
      for (let i = 0; i < cityPrayerTimes.length; i++) {
        const prayerTimeParts = cityPrayerTimes[i].time.split(':');
        const prayerHour = parseInt(prayerTimeParts[0]);
        const prayerMinute = parseInt(prayerTimeParts[1]);
        const prayerTimeInMinutes = prayerHour * 60 + prayerMinute;
        
        if (prayerTimeInMinutes > currentTimeInMinutes) {
          nextPrayerIndex = i;
          break;
        }
      }
      
      if (nextPrayerIndex === -1) {
        // If all prayers for today have passed, the next prayer is tomorrow's first prayer
        setNextPrayer(cityPrayerTimes[0]);
      } else {
        setNextPrayer(cityPrayerTimes[nextPrayerIndex]);
      }

      // Mock Hijri date - in a real app, you would calculate or fetch this
      setHijriDate('15 Ramazan 1445');
      
      setLoading(false);
    } catch (err) {
      setError('Namaz vakitleri yüklenirken bir hata oluştu.');
      setLoading(false);
    }
  }, [location]);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  // Handle city selection
  const handleCitySelect = (city: string) => {
    setLocation(city);
    setShowCitySelector(false);
  };

  if (loading) {
    return (
      <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md animate-pulse">
        <div className="h-6 bg-gray-100 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 bg-gray-100 dark:bg-slate-700 rounded w-1/4"></div>
              <div className="h-4 bg-gray-100 dark:bg-slate-700 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/30 rounded-lg shadow-md text-red-700 dark:text-red-300">
        <p>{error}</p>
        <button 
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          onClick={() => window.location.reload()}
        >
          Yeniden Dene
        </button>
      </div>
    );
  }

  // Calculate time remaining until next prayer
  const getTimeRemaining = () => {
    if (!nextPrayer) return '';
    
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    
    const prayerTimeParts = nextPrayer.time.split(':');
    const prayerHour = parseInt(prayerTimeParts[0]);
    const prayerMinute = parseInt(prayerTimeParts[1]);
    const prayerTimeInMinutes = prayerHour * 60 + prayerMinute;
    
    let remainingMinutes = prayerTimeInMinutes - currentTimeInMinutes;
    
    // If negative, it means the next prayer is tomorrow's first prayer
    if (remainingMinutes < 0) {
      remainingMinutes = (24 * 60) + remainingMinutes;
    }
    
    const hours = Math.floor(remainingMinutes / 60);
    const minutes = remainingMinutes % 60;
    
    return `${hours > 0 ? `${hours} saat ` : ''}${minutes} dakika`;
  };

  return (
    <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md">
      {/* Location and Date Information */}
      <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-md">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="relative">
            <button 
              onClick={() => setShowCitySelector(!showCitySelector)}
              className="flex items-center text-sm text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mr-1" />
              <span>{location}</span>
              <ChevronDown className="w-4 h-4 ml-1" />
            </button>
            
            {showCitySelector && (
              <div className="absolute top-full left-0 mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                <ul className="py-1">
                  {cities.map((city) => (
                    <li key={city}>
                      <button
                        onClick={() => handleCitySelect(city)}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          city === location 
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' 
                            : 'hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {city}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="flex items-center">
            <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mr-1" />
            <span className="text-sm text-gray-700 dark:text-gray-300">{date}</span>
          </div>
          <div className="text-sm text-emerald-700 dark:text-emerald-400 font-arabic">
            {hijriDate}
          </div>
        </div>
      </div>
      
      {/* Current Time */}
      <div className="mb-4 text-center">
        <div className="text-3xl font-mono text-emerald-700 dark:text-emerald-400">
          {currentTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      
      {/* Next Prayer Information */}
      {nextPrayer && (
        <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-md border-l-4 border-emerald-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-700 dark:text-gray-300 text-sm">Sıradaki namaz:</p>
              <p className="font-bold text-emerald-700 dark:text-emerald-400">
                {nextPrayer.name} - {nextPrayer.time}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-700 dark:text-gray-300 text-sm">Kalan süre:</p>
              <p className="font-mono text-emerald-700 dark:text-emerald-400">
                {getTimeRemaining()}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Prayer Times List */}
      <div className="space-y-3">
        {prayerTimes.map((prayer, index) => (
          <div 
            key={index} 
            className={`flex justify-between items-center p-2 rounded-md ${
              nextPrayer && prayer.name === nextPrayer.name 
                ? 'bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-emerald-500' 
                : 'border-b border-gray-100 dark:border-slate-700'
            }`}
          >
            <div className="flex items-center">
              <span className="text-gray-700 dark:text-gray-300">{prayer.name}</span>
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 font-arabic">{prayer.arabicName}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mr-1" />
              <span className="font-mono text-emerald-700 dark:text-emerald-400">{prayer.time}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
        Son güncelleme: {currentTime.toLocaleTimeString()}
      </div>
    </div>
  );
} 