import { useState, useEffect } from "react";

interface NavbarProps {
  launch: () => void;
}

export default function Navbar({ launch }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav 
      className="w-full sticky top-0 z-50 flex items-center justify-between py-4 px-6 md:px-12 lg:px-20"
      style={{
        backdropFilter: isScrolled ? 'blur(16px)' : 'blur(0px)',
        backgroundColor: isScrolled ? 'rgba(11, 14, 26, 0.7)' : 'rgba(11, 14, 26, 0)',
        borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0)',
        transition: 'backdrop-filter 0.6s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.6s cubic-bezier(0.4, 0, 0.2, 1), border-bottom 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      <div className="flex items-center gap-2">
        <img src="/blockai.svg" alt="BlockAI" className="w-10 h-10" />
        <div className="text-white font-bold text-xl">BLOCKAI</div>
      </div>

      <div className="hidden md:flex gap-8 text-sm text-gray-300">
        <a className="hover:text-white cursor-pointer">Home</a>
        <a className="hover:text-white cursor-pointer">Features</a>
        <a className="hover:text-white cursor-pointer">About</a>
        <a className="hover:text-white cursor-pointer">Community</a>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={launch}
          className="px-6 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-[#14F195] to-[#9B59B6] shadow-md"
        >
          Launch App
        </button>
      </div>
    </nav>
  );
}
