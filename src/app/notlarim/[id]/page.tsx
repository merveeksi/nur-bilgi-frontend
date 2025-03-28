"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Trash2, Save, Tag as TagIcon, X, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import RichTextEditor from "@/components/ui/rich-text-editor";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

import {
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  getAllCategories,
  DEFAULT_CATEGORIES,
  NOTE_COLORS,
  Note
} from "@/services/notesService";

interface NotePageProps {
  forceIsNew?: boolean;
}

// Fix for DOMNodeInserted deprecation warning
const QuillDeprecationFix = () => {
  useEffect(() => {
    // Only run in the browser
    if (typeof window !== 'undefined') {
      // Check if we have already applied the patch
      if (window.__REACT_QUILL_MUTATION_PATCH__) {
        return; // Patch already applied, don't add script again
      }
      
      // Mark that we're applying the patch
      window.__REACT_QUILL_MUTATION_PATCH__ = true;
      
      // Add a script to prevent React-Quill from using DOMNodeInserted
      const script = document.createElement('script');
      script.id = "quill-deprecation-fix"; // Add an ID to check for existing script
      
      // Check if script already exists
      if (document.getElementById("quill-deprecation-fix")) {
        return; // Script already exists
      }
      
      script.innerHTML = `
        // Create a polyfill system for DOMNodeInserted events
        (function() {
          // Store the original addEventListener
          const originalAddEventListener = EventTarget.prototype.addEventListener;
          
          // Keep track of elements and their DOMNodeInserted listeners
          const nodeInsertedListeners = new WeakMap();
          
          // Replace the addEventListener method
          EventTarget.prototype.addEventListener = function(type, listener, options) {
            if (type === 'DOMNodeInserted') {
              // Instead of adding the actual event listener, we'll store it for our polyfill
              const element = this;
              
              if (!nodeInsertedListeners.has(element)) {
                nodeInsertedListeners.set(element, []);
                
                // Set up a MutationObserver for this element
                const observer = new MutationObserver((mutations) => {
                  mutations.forEach((mutation) => {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                      // Get all listeners for this element
                      const listeners = nodeInsertedListeners.get(element) || [];
                      
                      // Call each listener for each added node
                      mutation.addedNodes.forEach(node => {
                        listeners.forEach(listenerFn => {
                          // Create a synthetic event
                          const event = new Event('DOMNodeInserted', { bubbles: true });
                          Object.defineProperty(event, 'target', { value: node });
                          
                          // Call the listener with the synthetic event
                          listenerFn.call(element, event);
                        });
                      });
                    }
                  });
                });
                
                // Start observing the element
                observer.observe(element, { childList: true, subtree: true });
              }
              
              // Add this listener to our collection
              const listeners = nodeInsertedListeners.get(element);
              if (listeners && !listeners.includes(listener)) {
                listeners.push(listener);
              }
              
              // Log that we've intercepted the listener
              console.log('DOMNodeInserted listener intercepted and replaced with MutationObserver');
              return;
            } else {
              // For all other event types, use the original behavior
              return originalAddEventListener.call(this, type, listener, options);
            }
          };
        })();
      `;
      document.head.appendChild(script);
    }
  }, []);

  return null;
};

// Add TypeScript interface for window
declare global {
  interface Window {
    __REACT_QUILL_MUTATION_PATCH__?: boolean;
  }
}

export default function NotePage({ forceIsNew }: NotePageProps) {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const isNew = forceIsNew || id === "yeni";

  const [note, setNote] = useState<Partial<Note>>({
    title: "",
    content: "",
    category: "Genel",
    tags: [],
    isPinned: false,
    color: "text-gray-800",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  
  const [categories, setCategories] = useState<string[]>([]);
  const [newTagValue, setNewTagValue] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [newCategory, setNewCategory] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);

  // Load note data if editing
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load categories
        const allCategories = await getAllCategories();
        setCategories(allCategories);

        if (!isNew) {
          const existingNote = await getNoteById(id);
          if (existingNote) {
            setNote(existingNote);
          } else {
            // Note not found, redirect to notes page
            router.push("/notlarim");
          }
        }
      } catch (error) {
        console.error("Error loading note data:", error);
      }
    };

    loadData();
  }, [id, isNew, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNote(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (value: string) => {
    setNote(prev => ({ ...prev, content: value }));
  };

  const handleCategoryChange = (value: string) => {
    if (value === "__add_new__") {
      setShowAddCategory(true);
      return;
    }
    setNote(prev => ({ ...prev, category: value }));
  };

  const handleColorChange = (value: string) => {
    setNote(prev => ({ ...prev, color: value }));
  };

  const addTag = () => {
    if (newTagValue.trim() && !note.tags?.includes(newTagValue.trim())) {
      setNote(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTagValue.trim()]
      }));
      setNewTagValue("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNote(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleNewTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      const updatedCategories = [...categories, newCategory.trim()];
      setCategories(updatedCategories);
      setNote(prev => ({ ...prev, category: newCategory.trim() }));
      setNewCategory("");
      setShowAddCategory(false);
    }
  };

  const togglePin = () => {
    setNote(prev => ({ ...prev, isPinned: !prev.isPinned }));
  };

  const saveNote = async () => {
    // Check if both title and content are empty
    if (!note.title?.trim() && !note.content?.trim()) {
      setSaveMessage({
        type: "error",
        text: "Not başlığı veya içerik alanlarından en az birini doldurmalısınız"
      });
      return;
    }

    setIsSaving(true);

    try {
      if (isNew) {
        // Create new note
        const newNote = await createNote({
          title: note.title?.trim() || "Başlıksız Not",
          content: note.content?.trim() || "",
          category: note.category || "Genel",
          tags: note.tags || [],
        });

        setNote(newNote);
        
        // Show success message
        setSaveMessage({
          type: "success",
          text: "Not başarıyla oluşturuldu",
        });
        
        // Delay redirect slightly to ensure localStorage is synchronized
        setTimeout(() => {
          // Redirect to edit page after creation
          router.push(`/notlarim/${newNote.id}`);
        }, 100);
      } else {
        // Update existing note
        const updatedNote = await updateNote(id, {
          title: note.title?.trim() || "Başlıksız Not",
          content: note.content?.trim() || "",
          category: note.category,
          tags: note.tags,
          isPinned: note.isPinned,
          color: note.color
        });

        if (updatedNote) {
          // Show success message
          setSaveMessage({
            type: "success",
            text: "Not başarıyla güncellendi",
          });
        } else {
          // Show error message
          setSaveMessage({
            type: "error",
            text: "Not güncellenirken bir hata oluştu"
          });
        }
      }
    } catch (error) {
      console.error("Not kaydedilirken hata:", error);
      setSaveMessage({
        type: "error",
        text: "Not kaydedilirken bir hata oluştu"
      });
    } finally {
      setIsSaving(false);
      
      // Clear message after a few seconds
      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);
    }
  };

  const handleDeleteNote = async () => {
    if (id && !isNew) {
      const success = await deleteNote(id);
      if (success) {
        // Redirect to notes page
        router.push("/notlarim");
      }
    }
    setConfirmDelete(false);
  };

  const goBack = () => {
    router.push("/notlarim");
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4 dark:bg-gray-900">
      <QuillDeprecationFix />
      <div className="container mx-auto max-w-4xl">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={goBack} 
              className="mr-2 text-gray-800 dark:text-gray-200"
            >
              <ArrowLeft className="h-5 w-5 mr-1 text-gray-800 dark:text-gray-200" />
              Geri
            </Button>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              {isNew ? "Yeni Not" : "Notu Düzenle"}
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            {!isNew && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setConfirmDelete(true)} 
                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Sil
              </Button>
            )}
            <Button 
              size="sm" 
              onClick={saveNote} 
              disabled={isSaving}
              className="bg-emerald-600 hover:bg-emerald-700 dark:text-gray-200 dark:hover:text-gray-200 dark:bg-emerald-800 dark:hover:bg-emerald-900"
            >
              {isSaving ? (
                <div className="flex items-center">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Kaydediliyor...
                </div>
              ) : (
                <div className="flex items-center">
                  <Save className="h-4 w-4 mr-2" />
                  Kaydet
                </div>
              )}
            </Button>
          </div>
        </div>
        
        {/* Save Message */}
        {saveMessage && (
          <div 
            className={`mb-4 p-3 rounded-md ${
              saveMessage.type === "success" 
                ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400" 
                : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
            }`}
          >
            {saveMessage.text}
          </div>
        )}
        
        {/* Main content */}
        <div className={`rounded-lg shadow-md overflow-hidden ${
          note.color ? note.color : 'bg-white dark:bg-gray-800'
        }`}>
          {/* Note Metadata */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <div className="flex-1">
                <Input
                  name="title"
                  value={note.title || ""}
                  onChange={handleInputChange}
                  placeholder="Not başlığı"
                  className="text-lg text-gray-800 dark:text-gray-200 font-medium border-0 p-0 focus-visible:ring-0 dark:bg-transparent"
                />
              </div>
              
              <div className="flex flex-wrap gap-2 items-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant={note.isPinned ? "default" : "outline"} 
                        size="sm" 
                        onClick={togglePin}
                        className={note.isPinned ? "bg-black hover:bg-gray-800 dark:text-gray-200 dark:hover:text-gray-200" : ""}
                      >
                        {note.isPinned ? "Sabitlendi" : "Sabitle"}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{note.isPinned ? "Sabitlemeyi kaldır" : "Notu sabitle"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="dark:text-gray-200 dark:hover:text-gray-200">
                      Renk
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Not Rengi</h4>
                      <RadioGroup value={note.color || ""} onValueChange={handleColorChange}>
                        <div className="grid grid-cols-2 gap-2">
                          {NOTE_COLORS.map((colorOption) => (
                            <div key={colorOption.value} className="flex items-center space-x-2">
                              <RadioGroupItem 
                                value={colorOption.value} 
                                id={colorOption.value} 
                                className="peer sr-only" 
                              />
                              <Label 
                                htmlFor={colorOption.value}
                                className={`flex-1 cursor-pointer rounded-md p-2 text-xs peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-black ${colorOption.value}`}
                              >
                                {colorOption.name}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-full sm:w-1/3">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                  Kategori
                </label>
                {showAddCategory ? (
                  <div className="flex items-center">
                    <Input
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Yeni kategori..."
                      className="mr-2"
                    />
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={addCategory}
                      disabled={!newCategory.trim()}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => setShowAddCategory(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Select value={note.category} onValueChange={handleCategoryChange}>
                    <SelectTrigger className="w-full dark: text-gray-50">
                      <SelectValue placeholder="Kategori seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                      <SelectItem value="__add_new__" className="text-emerald-600 dark:text-emerald-400">
                        + Yeni Kategori Ekle
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
              
              <div className="w-full sm:w-2/3">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                  Etiketler
                </label>
                <div className="flex items-center">
                  <div className="relative flex-1">
                    <TagIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      value={newTagValue}
                      onChange={(e) => setNewTagValue(e.target.value)}
                      onKeyDown={handleNewTagKeyDown}
                      placeholder="Etiket ekle ve Enter'a bas..."
                      className="pl-10 pr-10"
                    />
                    {newTagValue && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={addTag}
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {note.tags.map((tag) => (
                      <Badge
                        key={tag}
                        className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 group"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-1 rounded-full p-0.5 group-hover:bg-black/10 dark:group-hover:bg-white/10"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Note Content */}
          <div className="p-6">
            <RichTextEditor
              value={note.content || ""}
              onChange={handleContentChange}
              minHeight="300px"
            />
          </div>
        </div>
        
        {/* Delete Confirmation Dialog */}
        <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Notu Sil</DialogTitle>
              <DialogDescription>
                Bu not kalıcı olarak silinecektir. Bu işlem geri alınamaz.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmDelete(false)}>
                İptal
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteNote}
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