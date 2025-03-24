// Notes Service for managing user notes

import { api } from './apiClient';

export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
  color?: string;
  createdOn?: string;
  modifiedOn?: string;
}

export interface CreateNoteRequest {
  title: string;
  content: string;
  category?: string;
  tags?: string[];
}

export interface UpdateNoteRequest {
  id: string;
  title: string;
  content: string;
  category?: string;
  tags?: string[];
  isPinned?: boolean;
  color?: string;
}

// Local storage key
const NOTES_STORAGE_KEY = 'nur_bilgi_notes';

// Default categories
export const DEFAULT_CATEGORIES = [
  'Genel',
  'İbadet',
  'Dua',
  'Hadis',
  'Tefsir',
  'Fıkıh',
  'Kişisel'
];

// Available note colors
export const NOTE_COLORS = [
  { name: 'Varsayılan', value: 'bg-white dark:bg-gray-800' },
  { name: 'Yeşil', value: 'bg-emerald-50 dark:bg-emerald-900/20' },
  { name: 'Mavi', value: 'bg-blue-50 dark:bg-blue-900/20' },
  { name: 'Mor', value: 'bg-purple-50 dark:bg-purple-900/20' },
  { name: 'Turuncu', value: 'bg-orange-50 dark:bg-orange-900/20' },
  { name: 'Kırmızı', value: 'bg-red-50 dark:bg-red-900/20' },
  { name: 'Sarı', value: 'bg-yellow-50 dark:bg-yellow-900/20' },
];

/**
 * API İLE İLETİŞİM FONKSİYONLARI
 */

// Tüm notları API'den getir
export const getNotes = async (): Promise<Note[]> => {
  try {
    return await api.get<Note[]>('/notes');
  } catch (error) {
    console.error('Notlar getirilirken hata oluştu:', error);
    // API başarısız olursa localStorage'a dön
    return getAllNotesFromStorage();
  }
};

// ID'ye göre not getir
export const getNoteById = async (id: string): Promise<Note | undefined> => {
  try {
    return await api.get<Note>(`/notes/${id}`);
  } catch (error) {
    console.log('API erişilemedi, localStorage kullanılıyor', error);
    // API başarısız olursa localStorage'dan al
    const notes = getAllNotesFromStorage();
    return notes.find(note => note.id === id);
  }
};

// Not oluştur
export const createNote = async (note: CreateNoteRequest): Promise<Note> => {
  try {
    return await api.post<Note>('/notes', note);
  } catch (error) {
    console.log('API erişilemedi, localStorage kullanılıyor', error);
    // API başarısız olursa localStorage'a ekle
    return addNoteToStorage(note);
  }
};

// Not güncelle
export const updateNote = async (id: string, updates: Partial<UpdateNoteRequest>): Promise<Note | null> => {
  try {
    return await api.put<Note>(`/notes/${id}`, {
      id,
      ...updates
    });
  } catch (error) {
    console.log('API erişilemedi, localStorage kullanılıyor', error);
    // API başarısız olursa localStorage'da güncelle
    return updateNoteInStorage(id, updates);
  }
};

// Not sil
export const deleteNote = async (id: string): Promise<boolean> => {
  try {
    await api.delete(`/notes/${id}`);
    return true;
  } catch (error) {
    console.log('API erişilemedi, localStorage kullanılıyor', error);
    // API başarısız olursa localStorage'dan sil
    return deleteNoteFromStorage(id);
  }
};

// Pin durumunu değiştir
export const togglePinNote = async (id: string): Promise<Note | null> => {
  const note = await getNoteById(id);
  if (!note) return null;
  
  return await updateNote(id, { isPinned: !note.isPinned });
};

/**
 * LOCAL STORAGE YARDIMCI FONKSİYONLARI
 */

// localStorage'dan tüm notları al
const getAllNotesFromStorage = (): Note[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const notesJson = localStorage.getItem(NOTES_STORAGE_KEY);
    return notesJson ? JSON.parse(notesJson) : [];
  } catch (error) {
    console.error('Error loading notes from localStorage:', error);
    return [];
  }
};

// localStorage'a not ekle
const addNoteToStorage = (note: CreateNoteRequest): Note => {
  const notes = getAllNotesFromStorage();
  const now = new Date().toISOString();
  
  const newNote: Note = {
    id: crypto.randomUUID(),
    title: note.title,
    content: note.content,
    category: note.category || '',
    tags: note.tags || [],
    createdAt: now,
    updatedAt: now,
    isPinned: false,
  };
  
  const updatedNotes = [newNote, ...notes];
  saveNotesToStorage(updatedNotes);
  
  return newNote;
};

// localStorage'daki notu güncelle
const updateNoteInStorage = (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>): Note | null => {
  const notes = getAllNotesFromStorage();
  const noteIndex = notes.findIndex(note => note.id === id);
  
  if (noteIndex === -1) return null;
  
  const updatedNote = {
    ...notes[noteIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  notes[noteIndex] = updatedNote;
  saveNotesToStorage(notes);
  
  return updatedNote;
};

// localStorage'dan not sil
const deleteNoteFromStorage = (id: string): boolean => {
  const notes = getAllNotesFromStorage();
  const filteredNotes = notes.filter(note => note.id !== id);
  
  if (filteredNotes.length === notes.length) return false;
  
  saveNotesToStorage(filteredNotes);
  return true;
};

// localStorage'a notları kaydet
const saveNotesToStorage = (notes: Note[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
    
    // Notların güncellendiğini bildiren olay
    window.dispatchEvent(new CustomEvent('notes-updated'));
  } catch (error) {
    console.error('Error saving notes to localStorage:', error);
  }
};

/**
 * FİLTRELEME VE SIRALAMA FONKSİYONLARI
 */

// Notları filtreleme
export const filterNotes = async (
  searchTerm: string = '',
  category: string | null = null,
  selectedTags: string[] = []
): Promise<Note[]> => {
  // Önce tüm notları al (API veya localStorage'dan)
  let notes = await getNotes();
  
  // Kategori ile filtrele
  if (category) {
    notes = notes.filter(note => note.category === category);
  }
  
  // Etiketlerle filtrele
  if (selectedTags.length > 0) {
    notes = notes.filter(note => 
      selectedTags.every(tag => note.tags.includes(tag))
    );
  }
  
  // Arama terimiyle filtrele
  if (searchTerm.trim()) {
    const searchTermLower = searchTerm.toLowerCase();
    notes = notes.filter(note => 
      note.title.toLowerCase().includes(searchTermLower) || 
      note.content.toLowerCase().includes(searchTermLower) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchTermLower))
    );
  }
  
  return notes;
};

// Notları sırala (sabitlenmiş notlar her zaman önce gelir)
export const sortNotes = (
  notes: Note[], 
  sortBy: 'createdAt' | 'updatedAt' | 'title' = 'updatedAt',
  sortDirection: 'asc' | 'desc' = 'desc'
): Note[] => {
  const pinnedNotes = notes.filter(note => note.isPinned);
  const unpinnedNotes = notes.filter(note => !note.isPinned);
  
  const sortedUnpinnedNotes = [...unpinnedNotes].sort((a, b) => {
    if (sortBy === 'title') {
      return sortDirection === 'asc' 
        ? a.title.localeCompare(b.title) 
        : b.title.localeCompare(a.title);
    } else {
      const dateA = new Date(a[sortBy]).getTime();
      const dateB = new Date(b[sortBy]).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    }
  });
  
  // Sabitlenmiş notları aynı kriterlerle sırala, ancak ayrı tut
  const sortedPinnedNotes = [...pinnedNotes].sort((a, b) => {
    if (sortBy === 'title') {
      return sortDirection === 'asc' 
        ? a.title.localeCompare(b.title) 
        : b.title.localeCompare(a.title);
    } else {
      const dateA = new Date(a[sortBy]).getTime();
      const dateB = new Date(b[sortBy]).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    }
  });
  
  return [...sortedPinnedNotes, ...sortedUnpinnedNotes];
};

// Tüm kategorileri al
export const getAllCategories = async (): Promise<string[]> => {
  const notes = await getNotes();
  const categories = new Set(notes.map(note => note.category).filter(Boolean));
  return Array.from(categories);
};

// Tüm etiketleri al
export const getAllTags = async (): Promise<string[]> => {
  const notes = await getNotes();
  const tagsSet = new Set<string>();
  
  notes.forEach(note => {
    note.tags.forEach(tag => tagsSet.add(tag));
  });
  
  return Array.from(tagsSet);
}; 