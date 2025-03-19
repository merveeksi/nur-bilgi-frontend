"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";

// Fix for DOMNodeInserted deprecation warning
// This component applies a patch for the React-Quill editor before it loads
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

// Dinamik olarak yükle çünkü zengin metin editörü window nesnesine bağlı
const NoteEditor = dynamic(() => import("../[id]/page"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
    </div>
  ),
});

export default function NewNotePage() {
  // Add the fix component before rendering the editor
  return (
    <>
      <QuillDeprecationFix />
      <NoteEditor forceIsNew={true} />
    </>
  );
} 