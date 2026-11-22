import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { servicesContent } from '../data/portfolioData';

// Register ScrollTrigger once
gsap.registerPlugin(ScrollTrigger);

export default function Services() {
  const [openIndex, setOpenIndex] = useState(-1);
  const [isMobile, setIsMobile] = useState(false);

  const sectionRef = useRef(null);
  const headerRef = useRef(null);

  // Detect mobile and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Header ScrollTrigger animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { y: -100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 85%',
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const toggleRow = (index) => {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  };

  const headingLines = servicesContent.headingLines || ['WHAT I', 'CAN DO'];
  const items = servicesContent.items || [];

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative w-full bg-[#050505] text-white px-6 md:px-12 py-24 md:py-32 overflow-hidden"
    >
      <div className="max-w-[1280px] mx-auto">
        {/* Giant top-right editorial heading */}
        <div ref={headerRef} className="text-right ml-auto mb-16 md:mb-24 select-none">
          <h2 className="text-[2.5rem] sm:text-[4rem] md:text-[7rem] lg:text-[8rem] font-black uppercase leading-[0.85] tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#ffffff] via-[#d4d4d8] to-[#52525b] filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
            {headingLines[0]}
            <br />
            {headingLines[1]}
          </h2>
        </div>

        {/* Full-width accordion list */}
        <div className="border-t border-white/20">
          {items.map((service, index) => {
            const isOpen = openIndex === index;
            const numberFormatted = String(index + 1).padStart(2, '0');

            return (
              <div
                key={service.title || index}
                className={`border-b border-white/20 transition-colors duration-300 -mx-6 md:-mx-12 px-6 md:px-12 ${
                  isOpen
                    ? 'bg-[#CCFF00] text-black'
                    : 'bg-transparent text-white md:hover:bg-[#CCFF00] md:hover:text-black group'
                }`}
              >
                {/* Clickable Row Header Button */}
                <button
                  type="button"
                  id={`service-header-${index}`}
                  aria-expanded={isOpen}
                  aria-controls={`service-content-${index}`}
                  onClick={() => toggleRow(index)}
                  className="w-full flex items-center justify-between py-6 md:py-10 text-left focus:outline-none cursor-pointer"
                >
                  <div className="flex items-center gap-4 md:gap-8 flex-1 min-w-0 pr-4">
                    {/* Service Number */}
                    <span
                      className={`font-mono text-sm md:text-xl shrink-0 w-8 md:w-16 transition-colors duration-300 ${
                        isOpen ? 'text-black font-semibold' : 'text-zinc-500 group-hover:text-black'
                      }`}
                    >
                      {numberFormatted}
                    </span>

                    {/* Service Title */}
                    <span
                      className={`font-light uppercase tracking-tight transition-colors duration-300 ${
                        isMobile
                          ? 'text-[1.1rem] truncate'
                          : 'text-2xl md:text-[3rem] leading-tight'
                      } ${isOpen ? 'text-black font-medium' : 'text-white group-hover:text-black'}`}
                    >
                      {service.title}
                    </span>
                  </div>

                  {/* Outlined Arrow */}
                  <div className="shrink-0 ml-4">
                    <svg
                      viewBox="0 0 46 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`w-6 h-6 md:w-10 md:h-10 transition-transform duration-300 ease-out ${
                        isOpen
                          ? '-rotate-45 text-black'
                          : 'rotate-45 text-[#CCFF00] group-hover:text-black'
                      }`}
                      aria-hidden="true"
                    >
                      <path d="M2 12h42M34 3l10 9-10 9" />
                    </svg>
                  </div>
                </button>

                {/* Expanded Content with Grid Rows Animation */}
                <div
                  id={`service-content-${index}`}
                  role="region"
                  aria-labelledby={`service-header-${index}`}
                  className={`grid transition-[grid-template-rows,opacity] duration-500 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="pt-4 pb-10 md:py-12 border-t border-black/10">
                      <div className="flex flex-col md:grid md:grid-cols-2 md:gap-12 lg:gap-16">
                        {/* Capabilities List */}
                        <div className="mb-6 md:mb-0">
                          <h4 className="text-xs uppercase font-bold tracking-widest text-black/60 mb-4">
                            Capabilities
                          </h4>
                          <ul className="space-y-3">
                            {service.capabilities.map((cap, capIndex) => (
                              <li
                                key={capIndex}
                                className="flex items-center gap-3 text-sm md:text-base font-light text-black"
                              >
                                <span className="w-2 h-2 shrink-0 bg-black" aria-hidden="true" />
                                <span>{cap}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Description & Optional CTA */}
                        <div className="flex flex-col justify-between">
                          <div>
                            <h4 className="text-xs uppercase font-bold tracking-widest text-black/60 mb-4">
                              Overview
                            </h4>
                            <p className="max-w-xl font-light text-black/90 text-sm md:text-base leading-relaxed">
                              {service.description}
                            </p>
                          </div>

                          {service.cta && (
                            <div className="mt-8 pt-4">
                              <a
                                href={service.cta.href}
                                className="relative inline-block bg-black text-[#CCFF00] font-bold text-xs uppercase tracking-widest px-10 py-3 transition-transform duration-300 hover:scale-105 active:scale-95"
                              >
                                {service.cta.label}
                                {/* Technical Corner Marks */}
                                <span className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-black" />
                                <span className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-black" />
                                <span className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-black" />
                                <span className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-black" />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
