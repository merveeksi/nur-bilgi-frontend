"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

interface NavigationEventsContextType {
  isNavigating: boolean;
}

const NavigationEventsContext = createContext<NavigationEventsContextType>({
  isNavigating: false,
});

export const useNavigationEvents = () => useContext(NavigationEventsContext);

export function NavigationEventsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const url = pathname + searchParams.toString();
    
    // Show loading indicator
    setIsNavigating(true);
    
    // Hide loading indicator after a short delay
    const timeoutId = setTimeout(() => {
      setIsNavigating(false);
    }, 1200); // Increased from 500ms to 1200ms
    
    return () => clearTimeout(timeoutId);
  }, [pathname, searchParams]);

  return (
    <NavigationEventsContext.Provider value={{ isNavigating }}>
      {children}
    </NavigationEventsContext.Provider>
  );
} 