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

// Constants
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5204/api';
const NOTES_ENDPOINT = '/Notes'; // Note the capital 'N' to match your backend route

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
 * Not: API 404 döndüğü için doğrudan localStorage kullanacağız
 */

// Tüm notları getir
export const getNotes = async (): Promise<Note[]> => {
  try {
    // API devre dışı olduğu için doğrudan localStorage kullanıyoruz
    console.log("Getting notes from localStorage");
    const notes = getAllNotesFromStorage();
    console.log(`Found ${notes.length} notes in localStorage`);
    return notes;
  } catch (error) {
    console.error('Notlar getirilirken hata oluştu:', error);
    return [];
  }
};

// ID'ye göre not getir
export const getNoteById = async (id: string): Promise<Note | undefined> => {
  try {
    // API devre dışı olduğu için doğrudan localStorage kullanıyoruz
    const notes = getAllNotesFromStorage();
    return notes.find(note => note.id === id);
  } catch (error) {
    console.error('Not getirilirken hata oluştu:', error);
    return undefined;
  }
};

// Not oluştur
export const createNote = async (note: CreateNoteRequest): Promise<Note> => {
  try {
    // API devre dışı olduğu için doğrudan localStorage kullanıyoruz
    return addNoteToStorage(note);
  } catch (error) {
    console.error('Not oluşturulurken hata oluştu:', error);
    throw error;
  }
};

// Not güncelle
export const updateNote = async (id: string, updates: Partial<UpdateNoteRequest>): Promise<Note | null> => {
  try {
    // API devre dışı olduğu için doğrudan localStorage kullanıyoruz
    return updateNoteInStorage(id, updates);
  } catch (error) {
    console.error('Not güncellenirken hata oluştu:', error);
    return null;
  }
};

// Not sil
export const deleteNote = async (id: string): Promise<boolean> => {
  try {
    // API devre dışı olduğu için doğrudan localStorage kullanıyoruz
    return deleteNoteFromStorage(id);
  } catch (error) {
    console.error('Not silinirken hata oluştu:', error);
    return false;
  }
};

// Pin durumunu değiştir
export const togglePinNote = async (id: string): Promise<Note | null> => {
  try {
    const note = await getNoteById(id);
    if (!note) return null;
    
    return await updateNote(id, { isPinned: !note.isPinned });
  } catch (error) {
    console.error('Not sabitlenirken hata oluştu:', error);
    return null;
  }
};

/**
 * LOCAL STORAGE YARDIMCI FONKSİYONLARI
 */

// localStorage'dan tüm notları al
const getAllNotesFromStorage = (): Note[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const notesJson = localStorage.getItem(NOTES_STORAGE_KEY);
    
    // Check if we have notes data
    if (!notesJson) {
      // Initialize with sample data if empty
      initializeSampleData();
      const initialData = localStorage.getItem(NOTES_STORAGE_KEY);
      return initialData ? JSON.parse(initialData) : [];
    }
    
    const notes = JSON.parse(notesJson);
    
    // Ensure all notes have the proper structure (for backward compatibility)
    return notes.map(ensureNoteStructure);
  } catch (error) {
    console.error('Error loading notes from localStorage:', error);
    return [];
  }
};

// Ensure note has all required properties
const ensureNoteStructure = (note: any): Note => {
  const now = new Date().toISOString();
  
  return {
    id: note.id || crypto.randomUUID(),
    title: note.title || 'Başlıksız Not',
    content: note.content || '',
    category: note.category || DEFAULT_CATEGORIES[0],
    tags: Array.isArray(note.tags) ? note.tags : [],
    createdAt: note.createdAt || now,
    updatedAt: note.updatedAt || now,
    isPinned: Boolean(note.isPinned),
    color: note.color || ''
  };
};

// Initialize with sample data (only if localStorage is empty)
const initializeSampleData = (): void => {
  if (typeof window === 'undefined') return;
  
  // Only initialize if no data exists
  if (localStorage.getItem(NOTES_STORAGE_KEY)) return;
  
  const now = new Date().toISOString();
  
  const sampleNotes: Note[] = [
    {
      id: crypto.randomUUID(),
      title: 'Hoş Geldiniz',
      content: '<p>Not alma özelliği ile dini bilgileri ve kişisel notlarınızı düzenli bir şekilde saklayabilirsiniz.</p><p>Bu not örnek olarak oluşturulmuştur, istediğiniz zaman silebilirsiniz.</p>',
      category: 'Genel',
      tags: ['merhaba', 'başlangıç'],
      createdAt: now,
      updatedAt: now,
      isPinned: true
    }
  ];
  
  localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(sampleNotes));
};

// localStorage'a not ekle
const addNoteToStorage = (note: CreateNoteRequest): Note => {
  console.log("Adding new note to localStorage:", note.title);
  const notes = getAllNotesFromStorage();
  const now = new Date().toISOString();
  
  const newNote: Note = {
    id: crypto.randomUUID(),
    title: note.title,
    content: note.content,
    category: note.category || DEFAULT_CATEGORIES[0],
    tags: note.tags || [],
    createdAt: now,
    updatedAt: now,
    isPinned: false,
  };
  
  const updatedNotes = [newNote, ...notes];
  saveNotesToStorage(updatedNotes);
  console.log("New note added successfully with ID:", newNote.id);
  
  return newNote;
};

// localStorage'daki notu güncelle
const updateNoteInStorage = (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>): Note | null => {
  console.log("Updating note in localStorage, ID:", id);
  const notes = getAllNotesFromStorage();
  const noteIndex = notes.findIndex(note => note.id === id);
  
  if (noteIndex === -1) {
    console.warn("Note not found for update:", id);
    return null;
  }
  
  const updatedNote = {
    ...notes[noteIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  notes[noteIndex] = updatedNote;
  saveNotesToStorage(notes);
  console.log("Note updated successfully");
  
  return updatedNote;
};

// localStorage'dan not sil
const deleteNoteFromStorage = (id: string): boolean => {
  console.log("Deleting note from localStorage, ID:", id);
  const notes = getAllNotesFromStorage();
  const filteredNotes = notes.filter(note => note.id !== id);
  
  if (filteredNotes.length === notes.length) {
    console.warn("Note not found for deletion:", id);
    return false;
  }
  
  saveNotesToStorage(filteredNotes);
  console.log("Note deleted successfully");
  return true;
};

// localStorage'a notları kaydet
const saveNotesToStorage = (notes: Note[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
    console.log(`Saved ${notes.length} notes to localStorage`);
    
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
  try {
    // Önce tüm notları al
    let notes = await getNotes();
    
    // Kategori ile filtrele
    if (category) {
      notes = notes.filter(note => note.category === category);
    }
    
    // Etiketlerle filtrele
    if (selectedTags.length > 0) {
      notes = notes.filter(note => 
        selectedTags.every(tag => note.tags && note.tags.includes(tag))
      );
    }
    
    // Arama terimiyle filtrele
    if (searchTerm.trim()) {
      const searchTermLower = searchTerm.toLowerCase();
      notes = notes.filter(note => 
        (note.title && note.title.toLowerCase().includes(searchTermLower)) || 
        (note.content && note.content.toLowerCase().includes(searchTermLower)) ||
        (note.tags && note.tags.some(tag => tag.toLowerCase().includes(searchTermLower)))
      );
    }
    
    return notes;
  } catch (error) {
    console.error('Notlar filtrelenirken hata oluştu:', error);
    return [];
  }
};

// Notları sıralama
export const sortNotes = (
  notes: Note[],
  sortBy: 'createdAt' | 'updatedAt' | 'title' = 'updatedAt',
  directionOrSortDirection: 'asc' | 'desc' = 'desc'
): Note[] => {
  if (!notes) return [];
  
  // Accept either direction or sortDirection parameter name for backward compatibility
  const direction = directionOrSortDirection;
  
  // Separate pinned and unpinned notes for proper sorting
  const pinnedNotes = notes.filter(note => note.isPinned);
  const unpinnedNotes = notes.filter(note => !note.isPinned);
  
  // Sorting function
  const sortFunction = (a: Note, b: Note) => {
    let valueA: string | Date;
    let valueB: string | Date;
    
    if (sortBy === 'title') {
      valueA = a.title || '';
      valueB = b.title || '';
      return direction === 'asc' 
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    } else {
      // For dates, handle as Date objects
      valueA = new Date(a[sortBy]);
      valueB = new Date(b[sortBy]);
      
      return direction === 'asc' 
        ? valueA.getTime() - valueB.getTime()
        : valueB.getTime() - valueA.getTime();
    }
  };
  
  // Sort both pinned and unpinned notes
  const sortedPinnedNotes = [...pinnedNotes].sort(sortFunction);
  const sortedUnpinnedNotes = [...unpinnedNotes].sort(sortFunction);
  
  // Return pinned notes first, then unpinned notes
  return [...sortedPinnedNotes, ...sortedUnpinnedNotes];
};

/**
 * METADATA FONKSİYONLARI
 */

// Tüm kategorileri getir
export const getAllCategories = async (): Promise<string[]> => {
  try {
    // Önce tüm notları al
    const notes = await getNotes();
    
    // Notlardan benzersiz kategorileri çıkar
    const uniqueCategories = Array.from(
      new Set(
        [
          ...DEFAULT_CATEGORIES,
          ...notes.map(note => note.category).filter(Boolean)
        ]
      )
    ).sort();
    
    return uniqueCategories;
  } catch (error) {
    console.error('Kategoriler alınırken hata oluştu:', error);
    // Hata durumunda varsayılan kategorileri döndür
    return DEFAULT_CATEGORIES;
  }
};

// Tüm etiketleri getir
export const getAllTags = async (): Promise<string[]> => {
  try {
    // Önce tüm notları al
    const notes = await getNotes();
    
    // Tüm notların etiketlerini düzleştir ve benzersiz hale getir
    const allTags = notes.flatMap(note => note.tags || []);
    const uniqueTags = Array.from(new Set(allTags)).sort();
    
    return uniqueTags;
  } catch (error) {
    console.error('Etiketler alınırken hata oluştu:', error);
    return [];
  }
}; 