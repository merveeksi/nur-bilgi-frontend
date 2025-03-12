import { Linkedin, Github, Instagram, Facebook, Twitter } from "lucide-react";

export default function SocialSidebar() {
  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
      <a
        href="https://linkedin.com"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#0A66C2] hover:bg-[#0A66C2]/90 text-white p-2 rounded-full transition-transform hover:scale-110"
        aria-label="LinkedIn"
      >
        <Linkedin size={20} />
      </a>
      
      <a
        href="https://github.com"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#333] hover:bg-[#333]/90 text-[#f0f6fc] p-2 rounded-full transition-transform hover:scale-110"
        aria-label="GitHub"
      >
        <Github size={20} />
      </a>
      
      <a
        href="https://instagram.com"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-gradient-to-br from-[#fa7e1e] via-[#d62976] to-[#962fbf] text-white p-2 rounded-full transition-transform hover:scale-110"
        aria-label="Instagram"
      >
        <Instagram size={20} />
      </a>
      
      <a
        href="https://facebook.com"
        target="_blank"
        rel="noopener noreferrer" 
        className="bg-[#1877F2] hover:bg-[#1877F2]/90 text-white p-2 rounded-full transition-transform hover:scale-110"
        aria-label="Facebook"
      >
        <Facebook size={20} />
      </a>
      
      <a
        href="https://twitter.com"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#1DA1F2] hover:bg-[#1DA1F2]/90 text-white p-2 rounded-full transition-transform hover:scale-110"
        aria-label="Twitter"
      >
        <Twitter size={20} />
      </a>
    </div>
  );
} 