"use client";

import React, { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
  readOnly?: boolean;
}

// Check if our window patch has been applied
declare global {
  interface Window {
    __REACT_QUILL_MUTATION_PATCH__?: boolean;
  }
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "İçeriğinizi buraya yazın...",
  className,
  minHeight = "200px",
  readOnly = false
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const quillRef = useRef<ReactQuill>(null);

  useEffect(() => {
    setIsMounted(true);
    
    // Apply basic configuration for Quill editor after mount
    if (typeof window !== 'undefined') {
      const timerId = setTimeout(() => {
        if (quillRef.current) {
          // Set focus if needed or apply other configurations
        }
      }, 100);
      return () => clearTimeout(timerId);
    }
  }, []);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'blockquote', 'code-block'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent',
    'link', 'blockquote', 'code-block',
    'color', 'background'
  ];

  if (!isMounted) {
    return (
      <div 
        className={cn("border rounded-md p-3 bg-white dark:bg-gray-800", className)}
        style={{ minHeight }}
      >
        <div className="animate-pulse h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="animate-pulse h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
        <div className="animate-pulse h-6 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
      </div>
    );
  }

  return (
    <div className={cn("rich-text-editor", className)}>
      <style jsx global>{`
        .rich-text-editor .ql-container {
          min-height: ${minHeight};
          font-size: 16px;
          font-family: inherit;
          border-bottom-left-radius: 0.375rem;
          border-bottom-right-radius: 0.375rem;
        }
        
        .ql-snow.ql-toolbar {
          border-top-left-radius: 0.375rem;
          border-top-right-radius: 0.375rem;
          border-color: #e2e8f0;
        }
        
        .dark .ql-snow.ql-toolbar, .dark .ql-snow.ql-container {
          border-color: #374151;
        }
        
        .dark .ql-snow .ql-picker {
          color: #e5e7eb;
        }
        
        .dark .ql-snow .ql-stroke {
          stroke: #e5e7eb;
        }
        
        .dark .ql-snow .ql-fill {
          fill: #e5e7eb;
        }
        
        .dark .ql-editor.ql-blank::before {
          color: #6b7280;
        }
        
        .dark .ql-snow.ql-toolbar button:hover, 
        .dark .ql-snow .ql-toolbar button:hover,
        .dark .ql-snow.ql-toolbar button.ql-active, 
        .dark .ql-snow .ql-toolbar button.ql-active,
        .dark .ql-snow.ql-toolbar .ql-picker-label:hover, 
        .dark .ql-snow .ql-toolbar .ql-picker-label:hover,
        .dark .ql-snow.ql-toolbar .ql-picker-label.ql-active, 
        .dark .ql-snow .ql-toolbar .ql-picker-label.ql-active {
          color: #10b981;
        }
        
        .dark .ql-snow.ql-toolbar button:hover .ql-stroke, 
        .dark .ql-snow .ql-toolbar button:hover .ql-stroke,
        .dark .ql-snow.ql-toolbar button.ql-active .ql-stroke, 
        .dark .ql-snow .ql-toolbar button.ql-active .ql-stroke,
        .dark .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke, 
        .dark .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke {
          stroke: #10b981;
        }
        
        .dark .ql-snow.ql-toolbar button:hover .ql-fill, 
        .dark .ql-snow .ql-toolbar button:hover .ql-fill,
        .dark .ql-snow.ql-toolbar button.ql-active .ql-fill, 
        .dark .ql-snow .ql-toolbar button.ql-active .ql-fill {
          fill: #10b981;
        }
        
        .dark .ql-editor {
          color: #e5e7eb;
          background: #1f2937;
        }
        
        .ql-editor {
          background: white;
        }
        
        .ql-container.ql-disabled .ql-editor {
          background: #f9fafb;
        }
        
        .dark .ql-container.ql-disabled .ql-editor {
          background: #111827;
        }
      `}</style>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        readOnly={readOnly}
      />
    </div>
  );
};

export default RichTextEditor; 