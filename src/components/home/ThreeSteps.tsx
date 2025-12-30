import { StaggerContainer, StaggerItem } from "../ScrollReveal";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { Hand } from "lucide-react";

function StepCircle({ title, number }: { title: string; number: string }) {
  return (
    <div className="relative group mx-auto">
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-[#10e291] blur-[40px] opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-full" />
      
      {/* Circle Container */}
      <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full flex flex-col items-center justify-center p-8 transition-transform duration-300 hover:scale-105">
        {/* Gradient Border Ring */}
        <div className="absolute inset-0 rounded-full p-[2px] bg-gradient-to-b from-[#10e291] to-[#9b59b6]">
          <div className="w-full h-full rounded-full bg-[#13151C]/90 backdrop-blur-xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center space-y-4">
          <span className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white/20 to-white/5 select-none">
            {number}
          </span>
          <h4 className="text-xl md:text-2xl font-bold text-white leading-tight max-w-[200px]">
            {title}
          </h4>
        </div>
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <div className="hidden md:flex items-center justify-center w-24 opacity-50">
      <svg width="100%" height="24" viewBox="0 0 100 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 12H98M98 12L88 2M98 12L88 22" stroke="url(#arrow-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <defs>
          <linearGradient id="arrow-gradient" x1="0" y1="12" x2="100" y2="12" gradientUnits="userSpaceOnUse">
            <stop stopColor="#10e291" stopOpacity="0" />
            <stop offset="0.5" stopColor="#10e291" />
            <stop offset="1" stopColor="#10e291" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export default function ThreeSteps() {
  const [isMobile, setIsMobile] = useState(false);
  const [api, setApi] = useState<CarouselApi>();

  const steps = [
    { number: "01", title: "Connect Wallet" },
    { number: "02", title: "AI scans chains in real-time" },
    { number: "03", title: "Get Instant Alpha" },
  ];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768); // md breakpoint
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 2500);

    return () => clearInterval(interval);
  }, [api]);

  return (
    <section className="mt-32 px-6 md:px-0 text-center relative z-10">
      <h3 className="text-[#10e291] text-3xl md:text-4xl lg:text-5xl font-bold mb-24 tracking-wide">
        3 Steps to Alpha
      </h3>

      {isMobile ? (
        <div className="w-full max-w-sm mx-auto">
          <Carousel
            setApi={setApi}
            opts={{
              align: "center",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {steps.map((step, i) => (
                <CarouselItem key={i} className="basis-full flex justify-center py-4">
                  <StepCircle number={step.number} title={step.title} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-8">
               <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm animate-pulse">
                  <Hand className="w-4 h-4 text-[#10e291]" />
                  <span className="text-xs font-medium text-gray-300">Swipe to explore</span>
               </div>
            </div>
          </Carousel>
        </div>
      ) : (
        <StaggerContainer className="flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-4 max-w-7xl mx-auto">
          <StaggerItem>
            <StepCircle number="01" title="Connect Wallet" />
          </StaggerItem>
          <StaggerItem className="hidden md:block">
            <Arrow />
          </StaggerItem>
          <StaggerItem>
            <StepCircle number="02" title="AI scans chains in real-time" />
          </StaggerItem>
          <StaggerItem className="hidden md:block">
            <Arrow />
          </StaggerItem>
          <StaggerItem>
            <StepCircle number="03" title="Get Instant Alpha" />
          </StaggerItem>
        </StaggerContainer>
      )}
    </section>
  );
}
