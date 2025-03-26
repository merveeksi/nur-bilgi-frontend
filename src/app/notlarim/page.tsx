"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Plus, 
  Tag, 
  Calendar, 
  Pin, 
  PinOff, 
  Trash2, 
  Clock, 
  Filter,
  Pencil,
  Tags,
  SlidersHorizontal,
  X,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatePresence, motion } from "framer-motion";

import { 
  getNotes, 
  getAllCategories, 
  getAllTags, 
  filterNotes, 
  sortNotes, 
  deleteNote, 
  togglePinNote,
  Note
} from "@/services/notesService";

export default function NotesPage() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'createdAt' | 'updatedAt' | 'title'>('updatedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Fetch notes and metadata
  useEffect(() => {
    refreshData();
  }, []);

  // Apply filters when search, category, or tags change
  useEffect(() => {
    const applyFilters = async () => {
      try {
        const filtered = await filterNotes(searchTerm, selectedCategory, selectedTags);
        const sorted = sortNotes(filtered, sortBy, sortDirection);
        setNotes(sorted);
      } catch (err) {
        console.error("Error filtering notes:", err);
      }
    };
    
    applyFilters();
  }, [searchTerm, selectedCategory, selectedTags, sortBy, sortDirection]);

  const refreshData = async () => {
    try {
      // Fetch all data
      const allNotes = await getNotes();
      const allCategories = await getAllCategories();
      const allTags = await getAllTags();
      
      // Sort notes
      const sorted = sortNotes(allNotes, sortBy, sortDirection);
      
      setNotes(sorted);
      setCategories(allCategories);
      setTags(allTags);
    } catch (err) {
      console.error("Error fetching notes data:", err);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  const handleSortChange = (value: string) => {
    const [sortByValue, direction] = value.split('-') as [
      'createdAt' | 'updatedAt' | 'title', 
      'asc' | 'desc'
    ];
    
    setSortBy(sortByValue);
    setSortDirection(direction);
  };

  const handleTogglePin = async (id: string) => {
    await togglePinNote(id);
    refreshData();
  };

  const handleDeleteNote = async (id: string) => {
    await deleteNote(id);
    setConfirmDeleteId(null);
    refreshData();
  };

  const handleAddNote = () => {
    router.push('/notlarim/yeni');
  };

  const handleEditNote = (id: string) => {
    router.push(`/notlarim/${id}`);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory(null);
    setSelectedTags([]);
    setSortBy('updatedAt');
    setSortDirection('desc');
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('tr-TR', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Genel': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      'İbadet': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
      'Dua': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'Hadis': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      'Tefsir': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      'Fıkıh': 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300',
      'Kişisel': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
    };
    
    return colors[category as keyof typeof colors] || colors['Genel'];
  };

  // Extract a preview from HTML content
  const extractPreview = (html: string, maxLength = 150) => {
    // Remove HTML tags
    const text = html.replace(/<[^>]*>/g, '');
    // Trim to maxLength
    return text.length > maxLength
      ? text.substring(0, maxLength) + '...'
      : text;
  };

  return (
    <div className="min-h-screen text-black bg-gray-50 pt-24 pb-16 px-4 dark:bg-gray-900">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-emerald-700 dark:text-emerald-400 mb-2">
              Notlarım
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
              Dini bilgilerinizi ve düşüncelerinizi düzenli bir şekilde kaydedin
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button onClick={handleAddNote} className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-5 w-5 mr-2" />
              Yeni Not
            </Button>
          </div>
        </div>
        
        {/* Search Bar and Filters */}
        <div className="mb-6 relative">
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Notlarınızda arayın..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 dark:text-gray-200 dark:placeholder:text-gray-200"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-3"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                </button>
              )}
            </div>
            
            <div className="flex space-x-2">
              <Sheet open={showFilters} onOpenChange={setShowFilters}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="flex items-center whitespace-nowrap dark:text-gray-200 dark:hover:text-gray-200">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtreler
                    {(selectedCategory || selectedTags.length > 0) && (
                      <Badge variant="secondary" className="ml-2 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                        {(selectedCategory ? 1 : 0) + selectedTags.length}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filtreler</SheetTitle>
                  </SheetHeader>
                  
                  <div className="mt-6 space-y-6">
                    {/* Category Filter */}
                    <div>
                      <h3 className="text-sm font-medium mb-3 text-gray-800 dark:text-gray-200">Kategori</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge
                          key="all"
                          variant={selectedCategory === null ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => handleCategoryChange(null)}
                        >
                          Tümü
                        </Badge>
                        {categories.map(category => (
                          <Badge
                            key={category}
                            variant={selectedCategory === category ? "default" : "outline"}
                            className={`cursor-pointer ${selectedCategory === category ? "bg-black text-white" : ""}`}
                            onClick={() => handleCategoryChange(category)}
                          >
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {/* Tags Filter */}
                    {tags.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium mb-3 flex items-center">
                          <Tag className="h-4 w-4 mr-2" />
                          Etiketler
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {tags.map(tag => (
                            <Badge
                              key={tag}
                              variant={selectedTags.includes(tag) ? "default" : "outline"}
                              className={`cursor-pointer ${selectedTags.includes(tag) ? "bg-black text-white" : ""}`}
                              onClick={() => handleTagToggle(tag)}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Sort Options */}
                    <div>
                      <h3 className="text-sm font-medium mb-3 text-gray-800 dark:text-gray-200 dark:hover:text-gray-200">Sıralama</h3>
                      <Select 
                        value={`${sortBy}-${sortDirection}`}
                        onValueChange={handleSortChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sıralama seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="updatedAt-desc">En son güncellenen</SelectItem>
                          <SelectItem value="updatedAt-asc">En eski güncellenen</SelectItem>
                          <SelectItem value="createdAt-desc">En son oluşturulan</SelectItem>
                          <SelectItem value="createdAt-asc">En eski oluşturulan</SelectItem>
                          <SelectItem value="title-asc">Başlık (A-Z)</SelectItem>
                          <SelectItem value="title-desc">Başlık (Z-A)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* View Mode */}
                    <div>
                      <h3 className="text-sm font-medium mb-3 text-gray-800 dark:text-gray-200">Görünüm</h3>
                      <div className="flex space-x-2">
                        <Button 
                          variant={viewMode === 'grid' ? "default" : "outline"}
                          size="sm"
                          className="flex-1 text-gray-200 dark:text-gray-200 hover:text-white hover:bg-emerald-600"
                          onClick={() => setViewMode('grid')}
                        >
                          Izgara
                        </Button>
                        <Button 
                          variant={viewMode === 'list' ? "default" : "outline"}
                          size="sm"
                          className="flex-1 text-gray-800 dark:text-gray-200 hover:text-white hover:bg-emerald-600"
                          onClick={() => setViewMode('list')}
                        >
                          Liste
                        </Button>
                      </div>
                    </div>
                    
                    {/* Reset Filters */}
                    {(selectedCategory || selectedTags.length > 0 || sortBy !== 'updatedAt' || sortDirection !== 'desc') && (
                      <Button 
                        variant="ghost" 
                        className="w-full dark:text-gray-200 dark:hover:text-gray-200 text-white bg-emerald-600 hover:text-white hover:bg-emerald-700 dark:bg-emerald-800" 
                        onClick={resetFilters}
                      >
                        Filtreleri Sıfırla
                      </Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
              
              <Select value={`${sortBy}-${sortDirection}`} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[180px] md:w-[220px] dark:text-gray-200 dark:hover:text-gray-200">
                  <SelectValue placeholder="Sıralama seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="updatedAt-desc">En son güncellenen</SelectItem>
                  <SelectItem value="updatedAt-asc">En eski güncellenen</SelectItem>
                  <SelectItem value="createdAt-desc">En son oluşturulan</SelectItem>
                  <SelectItem value="createdAt-asc">En eski oluşturulan</SelectItem>
                  <SelectItem value="title-asc">Başlık (A-Z)</SelectItem>
                  <SelectItem value="title-desc">Başlık (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Active Filters */}
          {(selectedCategory || selectedTags.length > 0) && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Aktif filtreler:</span>
              
              {selectedCategory && (
                <Badge 
                  className={`${getCategoryColor(selectedCategory)} group animate-fadeIn`}
                >
                  <span className="mr-1">Kategori:</span>
                  {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="ml-1 rounded-full p-0.5 group-hover:bg-black/10 dark:group-hover:bg-white/10"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              
              {selectedTags.map(tag => (
                <Badge 
                  key={tag} 
                  className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 group animate-fadeIn"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                  <button
                    onClick={() => handleTagToggle(tag)}
                    className="ml-1 rounded-full p-0.5 group-hover:bg-black/10 dark:group-hover:bg-white/10"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs dark:text-gray-200 dark:hover:text-gray-200"
                onClick={resetFilters}
              >
                Temizle
              </Button>
            </div>
          )}
        </div>

        {/* Notes Display */}
        {notes.length === 0 ? (
          <div className="text-center py-16">
            {searchTerm || selectedCategory || selectedTags.length > 0 ? (
              <>
                <div className="h-24 w-24 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-12 w-12 text-gray-400" />
                </div>
                <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Arama sonucu bulunamadı
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Farklı anahtar kelimeler veya filtreler deneyin
                </p>
                <Button onClick={resetFilters} variant="outline" className="dark:text-gray-200 dark:hover:text-gray-200">Filtreleri Temizle</Button>
              </>
            ) : (
              <>
                <div className="h-24 w-24 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Pencil className="h-12 w-12 text-gray-400" />
                </div>
                <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Henüz not eklenmemiş
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  İlk notunuzu ekleyerek başlayın
                </p>
                <Button onClick={handleAddNote}>Yeni Not Ekle</Button>
              </>
            )}
          </div>
        ) : (
          <AnimatePresence>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {notes.map(note => (
                  <motion.div
                    key={note.id}
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    className={`rounded-lg shadow-md overflow-hidden relative group border border-gray-200 dark:border-gray-700 
                      ${note.color ? note.color : 'bg-white dark:bg-gray-800'}`}
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <h3 
                          className="font-semibold text-lg text-gray-900 dark:text-white cursor-pointer hover:text-emerald-600 dark:hover:text-emerald-400 transition"
                          onClick={() => handleEditNote(note.id)}
                        >
                          {note.title || "Başlıksız Not"}
                        </h3>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleTogglePin(note.id)}
                            className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                          >
                            {note.isPinned ? (
                              <Pin className="h-4 w-4 fill-emerald-500 text-emerald-500" />
                            ) : (
                              <PinOff className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                          </button>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="text-gray-800 hover:text-gray-700 dark:hover:text-gray-300">
                                <SlidersHorizontal className="h-4 w-4" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditNote(note.id)}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Düzenle
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleTogglePin(note.id)}>
                                {note.isPinned ? (
                                  <>
                                    <PinOff className="h-4 w-4 mr-2 dark:text-gray-200" />
                                    Sabitlemeyi Kaldır
                                  </>
                                ) : (
                                  <>
                                    <Pin className="h-4 w-4 mr-2 dark:text-gray-200" />
                                    Sabitle
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => setConfirmDeleteId(note.id)}
                                className="text-red-600 dark:text-red-400"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Sil
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      
                      <div 
                        className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 cursor-pointer"
                        onClick={() => handleEditNote(note.id)}
                      >
                        {extractPreview(note.content)}
                      </div>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <Badge className={getCategoryColor(note.category)}>
                          {note.category}
                        </Badge>
                        
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(note.updatedAt)}
                        </div>
                      </div>
                      
                      {note.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {note.tags.slice(0, 3).map(tag => (
                            <span 
                              key={tag}
                              className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                          {note.tags.length > 3 && (
                            <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">
                              +{note.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {notes.map(note => (
                  <motion.div
                    key={note.id}
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    className={`rounded-lg shadow-sm overflow-hidden relative group border border-gray-200 dark:border-gray-700
                      ${note.color ? note.color : 'bg-white dark:bg-gray-800'}`}
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div 
                          className="flex-1 cursor-pointer"
                          onClick={() => handleEditNote(note.id)}
                        >
                          <div className="flex items-center">
                            {note.isPinned && (
                              <Pin className="h-4 w-4 fill-emerald-500 text-emerald-500 mr-2" />
                            )}
                            <h3 className="font-medium text-gray-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                              {note.title || "Başlıksız Not"}
                            </h3>
                          </div>
                          
                          <div className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                            {extractPreview(note.content, 100)}
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <Badge className={getCategoryColor(note.category)}>
                              {note.category}
                            </Badge>
                            
                            {note.tags.length > 0 && (
                              <div className="flex items-center gap-1">
                                <Tags className="h-3 w-3 text-gray-400" />
                                {note.tags.slice(0, 2).map(tag => (
                                  <span 
                                    key={tag}
                                    className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {note.tags.length > 2 && (
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    +{note.tags.length - 2}
                                  </span>
                                )}
                              </div>
                            )}
                            
                            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center ml-auto">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(note.updatedAt)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-1 ml-4">
                          <button
                            onClick={() => handleEditNote(note.id)}
                            className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 p-1"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleTogglePin(note.id)}
                            className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 p-1"
                          >
                            {note.isPinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(note.id)}
                            className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        )}
        
        {/* Delete Confirmation Dialog */}
        <Dialog open={!!confirmDeleteId} onOpenChange={(open) => !open && setConfirmDeleteId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Notu Sil</DialogTitle>
              <DialogDescription>
                Bu not kalıcı olarak silinecektir. Bu işlem geri alınamaz.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>
                İptal
              </Button>
              <Button 
                variant="destructive"
                onClick={() => confirmDeleteId && handleDeleteNote(confirmDeleteId)}
              >
                Sil
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
} 