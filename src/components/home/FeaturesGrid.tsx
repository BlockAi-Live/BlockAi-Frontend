import { StaggerContainer, StaggerItem } from "../ScrollReveal";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { Hand } from "lucide-react";

interface Feature {
  icon: React.ReactNode;
  text: string;
  label: string;
}

interface FeaturesGridProps {
  features: Feature[];
}

export default function FeaturesGrid({ features }: FeaturesGridProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 2000); // Auto-scroll every 2 seconds for better readability

    return () => clearInterval(interval);
  }, [api]);

  if (isMobile) {
    return (
      <div className="mt-16 px-6 md:px-0">
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {features.map((f, i) => (
              <CarouselItem key={i} className="pl-4 md:basis-1/2">
                <div className="flex flex-col items-center group h-full">
                    {/* Glass Card */}
                    <div 
                      className="rounded-[32px] p-8 w-full relative h-full bg-[#13151C] border border-white/5 flex flex-col items-center justify-center min-h-[250px] transition-all duration-300 group-hover:border-[#14F195]/30 group-hover:shadow-[0_0_30px_rgba(20,241,149,0.1)]"
                    >
                      <div className="flex justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300 text-[#14F195]">{f.icon}</div>
                      <p className="text-gray-400 text-sm text-center leading-relaxed font-medium">{f.text}</p>
                    </div>
                  <div className="mt-4 font-bold text-lg md:text-xl tracking-wide text-center group-hover:text-[#14F195] transition-colors">{f.label}</div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-8">
             <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#13151C] border border-white/10 backdrop-blur-sm animate-pulse">
                <Hand className="w-4 h-4 text-[#14F195]" />
                <span className="text-xs font-medium text-gray-400">Swipe to explore</span>
             </div>
          </div>
        </Carousel>
      </div>
    );
  }

  return (
    <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 px-6 md:px-0">
      {features.map((f, i) => (
        <StaggerItem key={i} className="flex flex-col items-center group">
            {/* Glass Card */}
            <div 
              className="rounded-[32px] p-8 w-full relative h-full bg-[#13151C] border border-white/5 transition-all duration-300 group-hover:border-[#14F195]/30 group-hover:shadow-[0_0_30px_rgba(20,241,149,0.1)] group-hover:-translate-y-2 will-change-transform flex flex-col items-center justify-center min-h-[240px]"
            >
              <div className="flex justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300 text-[#14F195]">{f.icon}</div>
              <p className="text-gray-400 text-sm text-center leading-relaxed font-medium">{f.text}</p>
            </div>
          <div className="mt-4 font-bold text-lg md:text-xl tracking-wide text-center group-hover:text-[#14F195] transition-colors duration-300">{f.label}</div>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
