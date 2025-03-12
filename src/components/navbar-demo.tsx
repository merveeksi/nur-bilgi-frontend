"use client";

import { MessageSquare, Home, HelpCircle, Clock, Shield, Book } from "lucide-react";
import { ExpandableTabs } from "@/components/ui/expandable-tabs";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function NavbarDemo() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<number | null>(null);

  // Define tabs with their routes
  const tabs = [
    { title: "Ana Sayfa", icon: Home, route: "/" },
    { title: "Chatbot", icon: MessageSquare, route: "/chatbot" },
    { type: "separator" as const },
    { title: "Namaz Vakitleri", icon: Clock, route: "/namaz-vakitleri" },
    { title: "Kur'an", icon: Book, route: "/kuran" },
    { title: "İlmihal", icon: Shield, route: "/ilmihal" },
  ];

  // Set active tab based on current pathname
  useEffect(() => {
    const index = tabs.findIndex(tab => 
      tab.type !== "separator" && pathname === tab.route
    );
    setActiveTab(index !== -1 ? index : null);
  }, [pathname]);

  // Handle tab change
  const handleTabChange = (index: number | null) => {
    if (index !== null && tabs[index].type !== "separator") {
      router.push(tabs[index].route);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <ExpandableTabs 
        tabs={tabs} 
        activeColor="text-emerald-500" 
        className="border-emerald-200 dark:border-emerald-800"
        onChange={handleTabChange}
        activeTab={activeTab}
      />
    </div>
  );
}

function CustomColorDemo() {
  const tabs = [
    { title: "Profile", icon: Home },
    { title: "Messages", icon: MessageSquare },
    { type: "separator" as const },
    { title: "Documents", icon: Book },
    { title: "Privacy", icon: Shield },
  ];

  return (
    <div className="flex flex-col gap-4">
      <ExpandableTabs 
        tabs={tabs} 
        activeColor="text-blue-500"
        className="border-blue-200 dark:border-blue-800" 
      />
    </div>
  );
} 