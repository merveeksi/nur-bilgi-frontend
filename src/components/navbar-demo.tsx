"use client";

import { MessageSquare, Home, HelpCircle, Clock, Shield, Book, Users, Notebook, Heart, HandHeart, BookOpen } from "lucide-react";
import { ExpandableTabs } from "@/components/ui/expandable-tabs";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import UserProfileMenu from "@/components/UserProfileMenu";

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
    { title: "Hadis", icon: BookOpen, route: "/hadis" },
    { title: "Dua", icon: HandHeart, route: "/dua" },
    { title: "Notlarım", icon: Notebook, route: "/notlarim" },
    { title: "Favorilerim", icon: Heart, route: "/favorilerim" },
    { title: "SSS", icon: HelpCircle, route: "/sss" },
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
    <div className="flex items-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-full shadow-md border border-gray-200 dark:border-gray-800 mt-28 ">
      <div className="flex-1">
        <ExpandableTabs 
          tabs={tabs} 
          activeColor="text-emerald-500" 
          className="border-emerald-200 dark:border-emerald-800"
          onChange={handleTabChange}
          activeTab={activeTab}
        />
      </div>
      
      <div className="ml-4 mr-2">
        <UserProfileMenu />
      </div>
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