<<<<<<< HEAD
import React from "react";
import { MessageCircle, Mic, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// BlockAIChat.tsx — React + TypeScript + Tailwind recreation of the chat UI
export default function BlockAIChat() {
  const handleLogout = () => {
    window.location.href = "/home";
  };

  return (
    <div className="flex h-screen bg-[#0d0f18] text-white font-inter">
      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative">
        {/* Top Bar */}
        <div className="p-4 flex items-center justify-between border-b border-white/5">
          <input
            placeholder="Search..."
            className="w-full max-w-xl bg-transparent border border-[#4c4b5f] rounded-lg px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-[#7647ff]"
          />

          {/* Share button + Profile dropdown */}
          <div className="flex items-center gap-4 ml-4">
            <button className="text-white/60 hover:text-white text-sm flex items-center gap-1">
              Share ↗
            </button>

            {/* Profile dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-12 w-12 rounded-full p-0"
                >
                  <Avatar className="h-12 w-12 border-2 border-border">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                    <div className="absolute bottom-0 left-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full z-0"></div>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 p-2" align="end">
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer p-3 text-base flex items-center"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-10 space-y-10">
          {/* AI Message */}
          <div className="max-w-md">
            <div className="text-xs text-white/40 mb-1">BlockAI</div>
            <div className="bg-[#2a2d35] text-white p-4 rounded-2xl text-sm leading-relaxed">
              Hello! I’ve analyzed the market.<br />
              Would you like to see the latest trending tokens?
            </div>
          </div>

          {/* User Message */}
          <div className="flex justify-end">
            <div className="max-w-md text-right">
              <div className="text-xs text-white/40 mb-1">You</div>
              <div className="bg-[#47d56f] text-black p-4 rounded-2xl text-sm leading-relaxed">
                Yes, show me high-volume tokens.
              </div>
            </div>
          </div>
        </div>

        {/* Input Bar */}
        <div className="border-t border-white/5 p-4 flex items-center gap-3">
          <button className="text-white/70 hover:text-white bg-white/10 p-2 rounded-full">
            <MessageCircle size={20} />
          </button>

          <div className="flex-1">
            <input
              placeholder="Ask about a token, wallet, or market trend..."
              className="w-full bg-transparent border border-white/10 rounded-full px-6 py-2 text-sm outline-none"
            />
          </div>

          <button className="text-white/70 hover:text-white">
            <Mic size={20} />
          </button>
        </div>
      </main>
    </div>
  );
}
=======
import React from "react";
import { MessageCircle, Mic, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// BlockAIChat.tsx — React + TypeScript + Tailwind recreation of the chat UI
export default function BlockAIChat() {
  const handleLogout = () => {
    window.location.href = "/home";
  };

  return (
    <div className="flex h-screen bg-[#0d0f18] text-white font-inter">
      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative">
        {/* Top Bar */}
        <div className="p-4 flex items-center justify-between border-b border-white/5">
          <input
            placeholder="Search..."
            className="w-full max-w-xl bg-transparent border border-[#4c4b5f] rounded-lg px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-[#7647ff]"
          />

          {/* Share button + Profile dropdown */}
          <div className="flex items-center gap-4 ml-4">
            <button className="text-white/60 hover:text-white text-sm flex items-center gap-1">
              Share ↗
            </button>

            {/* Profile dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-12 w-12 rounded-full p-0"
                >
                  <Avatar className="h-12 w-12 border-2 border-border">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                    <div className="absolute bottom-0 left-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full z-0"></div>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 p-2" align="end">
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer p-3 text-base flex items-center"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-10 space-y-10">
          {/* AI Message */}
          <div className="max-w-md">
            <div className="text-xs text-white/40 mb-1">BlockAI</div>
            <div className="bg-[#2a2d35] text-white p-4 rounded-2xl text-sm leading-relaxed">
              Hello! I’ve analyzed the market.<br />
              Would you like to see the latest trending tokens?
            </div>
          </div>

          {/* User Message */}
          <div className="flex justify-end">
            <div className="max-w-md text-right">
              <div className="text-xs text-white/40 mb-1">You</div>
              <div className="bg-[#47d56f] text-black p-4 rounded-2xl text-sm leading-relaxed">
                Yes, show me high-volume tokens.
              </div>
            </div>
          </div>
        </div>

        {/* Input Bar */}
        <div className="border-t border-white/5 p-4 flex items-center gap-3">
          <button className="text-white/70 hover:text-white bg-white/10 p-2 rounded-full">
            <MessageCircle size={20} />
          </button>

          <div className="flex-1">
            <input
              placeholder="Ask about a token, wallet, or market trend..."
              className="w-full bg-transparent border border-white/10 rounded-full px-6 py-2 text-sm outline-none"
            />
          </div>

          <button className="text-white/70 hover:text-white">
            <Mic size={20} />
          </button>
        </div>
      </main>
    </div>
  );
}
>>>>>>> 563e2be438a3ec5992c96ceeb453250da23265ab
