import { motion } from "framer-motion";

const logos = [
  { name: "Solana", svg: (
    <svg viewBox="0 0 397.7 311.7" className="w-full h-full">
      <linearGradient id="sol1" x1="360.88" y1="351.46" x2="141.21" y2="-69.29" gradientTransform="matrix(1 0 0 -1 0 314)" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#00FFA3"/><stop offset="1" stopColor="#DC1FFF"/>
      </linearGradient>
      <path fill="url(#sol1)" d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z"/>
      <path fill="url(#sol1)" d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z"/>
      <path fill="url(#sol1)" d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z"/>
    </svg>
  )},
  { name: "Base", svg: (
    <svg viewBox="0 0 111 111" className="w-full h-full">
      <path d="M54.921 110.034C85.359 110.034 110.034 85.402 110.034 55.017C110.034 24.6319 85.359 0 54.921 0C26.0432 0 2.35281 22.1714 0 50.3923H72.8467V59.6416H0C2.35281 87.8625 26.0432 110.034 54.921 110.034Z" fill="#0052FF"/>
    </svg>
  )},
];

export default function LogoCloud() {
  return (
    <section className="mt-8 px-6 md:px-0 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <p className="text-[11px] font-semibold text-neutral-600 uppercase tracking-[0.2em] mb-8">
          Built on
        </p>

        <div className="flex items-center justify-center gap-8 md:gap-12 flex-wrap">
          {logos.map((logo, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="flex items-center gap-2 text-neutral-600 hover:text-neutral-400 transition-colors duration-300 cursor-default"
            >
              <div className="w-5 h-5 opacity-50 hover:opacity-80 transition-opacity">
                {logo.svg}
              </div>
              <span className="text-sm font-medium">{logo.name}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
