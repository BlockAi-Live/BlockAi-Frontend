interface Feature {
  icon: React.ReactNode;
  text: string;
  label: string;
}

interface FeaturesGridProps {
  features: Feature[];
}

export default function FeaturesGrid({ features }: FeaturesGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 px-6 md:px-0">
      {features.map((f, i) => (
        <div key={i} className="flex flex-col items-center group">
          <div className="relative w-full rounded-2xl">
            {/* Card Content */}
            <div 
              className="rounded-2xl p-8 w-full backdrop-blur-xl relative h-full border border-white/10"
              style={{
                background: 'rgba(255, 255, 255, 0.03)'
              }}
            >
              <div className="flex justify-center mb-6">{f.icon}</div>
              <p className="text-gray-300 text-sm text-center leading-relaxed">{f.text}</p>
            </div>

            {/* Animated Gradient Border */}
            <div 
              className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white to-transparent bg-[length:200%_100%] animate-shimmer pointer-events-none"
              style={{
                padding: '1px',
                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                maskComposite: 'exclude',
                WebkitMaskComposite: 'xor'
              }}
            />
          </div>
          <div className="mt-4 font-bold text-lg md:text-xl tracking-wide text-center">{f.label}</div>
        </div>
      ))}
    </div>
  );
}
