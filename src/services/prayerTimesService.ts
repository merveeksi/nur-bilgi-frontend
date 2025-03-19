import { useEffect, useState } from 'react';

export interface PrayerTime {
  name: string;
  time: string;
  arabicName: string;
}

export type NamazVakti = "Sabah" | "Öğle" | "İkindi" | "Akşam" | "Yatsı";

export interface CityPrayerTimes {
  [city: string]: PrayerTime[];
}

// Namaz vakitleri isim dönüşümü (API'den gelen isimler ile UI'da kullanılan isimler arasında)
const prayerNameMapping: Record<string, NamazVakti> = {
  'İmsak': 'Sabah',
  'Güneş': 'Sabah',
  'Öğle': 'Öğle',
  'İkindi': 'İkindi',
  'Akşam': 'Akşam',
  'Yatsı': 'Yatsı'
};

// Türkiye'deki büyük şehirler
export const cities = [
  'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 
  'Adana', 'Konya', 'Gaziantep', 'Şanlıurfa', 'Kayseri',
  'Diyarbakır', 'Mersin', 'Samsun', 'Trabzon', 'Erzurum'
];

// Mock data for different cities - in a real app, this would come from an API
export const mockCityPrayerTimes: CityPrayerTimes = {
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

// Utility to calculate time with offset (minutes before/after)
export function calculateTimeWithOffset(timeString: string, offsetMinutes: number): string {
  const [hours, minutes] = timeString.split(':').map(Number);
  
  // Convert to total minutes, apply offset, and convert back to hours:minutes
  let totalMinutes = hours * 60 + minutes + offsetMinutes;
  
  // Handle overflow/underflow
  while (totalMinutes < 0) totalMinutes += 24 * 60;
  totalMinutes = totalMinutes % (24 * 60);
  
  const newHours = Math.floor(totalMinutes / 60);
  const newMinutes = totalMinutes % 60;
  
  // Format back to HH:MM
  return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
}

// Get prayer times for a specific location
export function getPrayerTimesForLocation(location: string): PrayerTime[] {
  return mockCityPrayerTimes[location] || mockCityPrayerTimes['İstanbul'];
}

// Get next prayer time
export function getNextPrayerTime(location: string, currentTime?: Date): PrayerTime | null {
  const now = currentTime || new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinute;
  
  const prayerTimes = getPrayerTimesForLocation(location);
  let nextPrayerIndex = -1;
  
  for (let i = 0; i < prayerTimes.length; i++) {
    const prayerTimeParts = prayerTimes[i].time.split(':');
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
    return prayerTimes[0];
  } else {
    return prayerTimes[nextPrayerIndex];
  }
}

// Get prayer time by name
export function getPrayerTimeByName(location: string, prayerName: string): PrayerTime | null {
  const prayerTimes = getPrayerTimesForLocation(location);
  return prayerTimes.find(prayer => prayer.name === prayerName) || null;
}

// Convert standard prayer name to Namaz Vakti type
export function convertToNamazVakti(prayerName: string): NamazVakti {
  return prayerNameMapping[prayerName] || 'Sabah';
}

// Custom hook to use prayer times
export function usePrayerTimes(location: string = 'İstanbul') {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextPrayer, setNextPrayer] = useState<PrayerTime | null>(null);
  
  useEffect(() => {
    try {
      setLoading(true);
      
      // Get prayer times for selected city
      const cityPrayerTimes = getPrayerTimesForLocation(location);
      setPrayerTimes(cityPrayerTimes);
      
      // Find next prayer time
      const nextPrayer = getNextPrayerTime(location);
      setNextPrayer(nextPrayer);
      
      setLoading(false);
    } catch (err) {
      console.error('Error loading prayer times:', err);
      setLoading(false);
    }
  }, [location]);
  
  return { prayerTimes, loading, nextPrayer };
} 