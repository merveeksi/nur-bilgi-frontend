// Notes Service for managing user notes

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
}

// Storage keys
const NOTES_STORAGE_KEY = 'nur-bilgi-notes';

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

// Get all notes from localStorage
export const getAllNotes = (): Note[] => {
  if (typeof window === 'undefined') return [];
  
  const notesJson = localStorage.getItem(NOTES_STORAGE_KEY);
  return notesJson ? JSON.parse(notesJson) : [];
};

// Get note by ID
export const getNoteById = (id: string): Note | undefined => {
  const notes = getAllNotes();
  return notes.find(note => note.id === id);
};

// Add new note
export const addNote = (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Note => {
  const notes = getAllNotes();
  
  const now = new Date().toISOString();
  const newNote: Note = {
    id: `note-${Date.now()}`,
    createdAt: now,
    updatedAt: now,
    ...note
  };
  
  notes.push(newNote);
  saveNotes(notes);
  
  return newNote;
};

// Update existing note
export const updateNote = (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>): Note | null => {
  const notes = getAllNotes();
  const noteIndex = notes.findIndex(note => note.id === id);
  
  if (noteIndex === -1) return null;
  
  const updatedNote = {
    ...notes[noteIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  notes[noteIndex] = updatedNote;
  saveNotes(notes);
  
  return updatedNote;
};

// Delete note
export const deleteNote = (id: string): boolean => {
  const notes = getAllNotes();
  const filteredNotes = notes.filter(note => note.id !== id);
  
  if (filteredNotes.length === notes.length) {
    return false; // Note not found
  }
  
  saveNotes(filteredNotes);
  return true;
};

// Pin/unpin note
export const togglePinNote = (id: string): Note | null => {
  const note = getNoteById(id);
  if (!note) return null;
  
  return updateNote(id, { isPinned: !note.isPinned });
};

// Get all unique categories from notes
export const getAllCategories = (): string[] => {
  const notes = getAllNotes();
  const categories = new Set<string>();
  
  DEFAULT_CATEGORIES.forEach(category => categories.add(category));
  notes.forEach(note => categories.add(note.category));
  
  return Array.from(categories);
};

// Get all unique tags from notes
export const getAllTags = (): string[] => {
  const notes = getAllNotes();
  const tags = new Set<string>();
  
  notes.forEach(note => {
    note.tags.forEach(tag => tags.add(tag));
  });
  
  return Array.from(tags);
};

// Filter notes by search term, category, and tags
export const filterNotes = (
  searchTerm: string = '',
  category: string | null = null,
  selectedTags: string[] = []
): Note[] => {
  let notes = getAllNotes();
  
  // Filter by category
  if (category) {
    notes = notes.filter(note => note.category === category);
  }
  
  // Filter by tags
  if (selectedTags.length > 0) {
    notes = notes.filter(note => 
      selectedTags.every(tag => note.tags.includes(tag))
    );
  }
  
  // Filter by search term
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

// Sort notes (pinned notes always come first)
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
  
  // Sort pinned notes using the same criteria, but keep them separate
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

// Private helper to save notes to localStorage
const saveNotes = (notes: Note[]): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
}; 