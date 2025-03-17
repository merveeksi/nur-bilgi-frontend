// AçıkKuran API Service
// API documentation: https://github.com/acik-kuran/acikkuran-api

const API_BASE_URL = 'https://api.acikkuran.com';

export interface Author {
  id: number;
  name: string;
  description?: string;
  language: string;
  url?: string | null;
}

export interface AudioInfo {
  mp3: string;
  duration: number;
  mp3_en?: string;
  duration_en?: number;
}

export interface Verse {
  id: number;
  surah_id: number;
  verse_number: number;
  verse: string;
  verse_simplified?: string;
  page: number;
  juz_number: number;
  transcription: string;
  transcription_en?: string;
  translation?: {
    id: number;
    text: string;
    author: Author;
    footnotes?: Array<{
      id: number;
      text: string;
      number: number;
    }> | null;
  };
}

export interface Surah {
  id: number;
  name: string;
  name_en?: string;
  name_original: string;
  name_translation_tr?: string;
  name_translation_en?: string;
  slug?: string;
  verse_count: number;
  page_number: number;
  audio?: AudioInfo;
  verses?: Verse[];
  zero?: Verse; // Besmele
}

// Get all authors (translators)
export async function getAuthors(): Promise<Author[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/authors`);
    if (!response.ok) {
      throw new Error(`API response error: ${response.status}`);
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching authors:', error);
    throw error;
  }
}

// Get all surahs
export async function getSurahs(): Promise<Surah[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/surahs`);
    if (!response.ok) {
      throw new Error(`API response error: ${response.status}`);
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching surahs:', error);
    throw error;
  }
}

// Get a specific surah with verses and translation
export async function getSurahDetail(surahId: number, authorId: number = 105): Promise<Surah> {
  try {
    const response = await fetch(`${API_BASE_URL}/surah/${surahId}?author=${authorId}`);
    if (!response.ok) {
      throw new Error(`API response error: ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Error fetching surah ${surahId}:`, error);
    throw error;
  }
}

// Get a specific verse with translation
export async function getVerse(surahId: number, verseNumber: number, authorId: number = 105): Promise<Verse> {
  try {
    const response = await fetch(`${API_BASE_URL}/surah/${surahId}/verse/${verseNumber}?author=${authorId}`);
    if (!response.ok) {
      throw new Error(`API response error: ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Error fetching verse ${surahId}:${verseNumber}:`, error);
    throw error;
  }
}

// Helper: Get the audio URL for a surah
export function getSurahAudioUrl(surahId: number, language: 'tr' | 'en' = 'tr'): string {
  return `https://audio.acikkuran.com/${language}/${surahId}.mp3`;
}

// Helper: Get single verse audio URL (fallback to Alafasy recitation)
export function getVerseAudioUrl(surahId: number, verseNumber: number): string {
  return `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${((surahId-1)*1000) + verseNumber}.mp3`;
}

// Get Quran page based on page number
export async function getPage(pageNumber: number, authorId: number = 105): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/page/${pageNumber}?author_id=${authorId}`);
    if (!response.ok) {
      throw new Error(`API response error: ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Error fetching page ${pageNumber}:`, error);
    throw error;
  }
}

export default {
  getAuthors,
  getSurahs,
  getSurahDetail,
  getVerse,
  getSurahAudioUrl,
  getVerseAudioUrl,
  getPage
}; 