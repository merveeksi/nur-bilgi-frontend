import { useState, useEffect } from 'react';

/**
 * Custom hook for responsive design that returns whether the current viewport matches the given media query
 * @param query The media query to check against the viewport
 * @returns boolean indicating if the viewport matches the query
 */
export function useMediaQuery(query: string): boolean {
  // Initial state is based on the match, for SSR we assume false
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    // Check if window is defined (to avoid SSR issues)
    if (typeof window !== 'undefined') {
      const media = window.matchMedia(query);
      
      // Update the state based on the current match
      setMatches(media.matches);

      // Define a callback function to handle changes
      const listener = (event: MediaQueryListEvent) => {
        setMatches(event.matches);
      };

      // Add the listener for changes
      media.addEventListener('change', listener);

      // Clean up the listener on component unmount
      return () => {
        media.removeEventListener('change', listener);
      };
    }
  }, [query]);

  return matches;
}

export default useMediaQuery; 