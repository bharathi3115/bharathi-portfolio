import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { personalInfo, aboutContent, skillRows } from '../data/portfolioData';

// Register ScrollTrigger once
gsap.registerPlugin(ScrollTrigger);

// Dynamically load about portrait
const aboutImages = import.meta.glob('../assets/about/about-portrait.*', {
  eager: true,
  import: 'default',
});
const aboutSrc = Object.values(aboutImages)[0] || '';

export default function About() {
  const sectionRef = useRef(null);
  const desktopHeadingRef = useRef(null);
  const mobileHeadingRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Desktop Heading Animation
      if (desktopHeadingRef.current) {
        gsap.fromTo(
          desktopHeadingRef.current,
          { opacity: 0, y: 100 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: desktopHeadingRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Mobile Heading Animation
      if (mobileHeadingRef.current) {
        gsap.fromTo(
          mobileHeadingRef.current,
          { opacity: 0, y: 100 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: mobileHeadingRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Word-by-word scroll highlight reveal
      if (cardRef.current) {
        const words = cardRef.current.querySelectorAll('[data-word]');
        if (words.length > 0) {
          gsap.fromTo(
            words,
            { color: '#52525b', opacity: 0.2 },
            {
              color: (i, el) => (el.dataset.highlight === 'true' ? '#ffffff' : '#d4d4d8'),
              opacity: 1,
              stagger: 0.1,
              ease: 'none',
              scrollTrigger: {
                trigger: cardRef.current,
                start: 'top 85%',
                end: 'bottom 50%',
                scrub: true,
              },
            }
          );
        }
      }
    }, sectionRef);

    // Refresh ScrollTrigger when images and fonts finish loading
    const handleLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', handleLoad);
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 600);

    return () => {
      window.removeEventListener('load', handleLoad);
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);

  // Split paragraph into words and determine highlights
  const renderParagraphWords = () => {
    const rawParagraph = aboutContent.paragraph || '';
    const words = rawParagraph.split(/\s+/).filter(Boolean);
    const highlights = (aboutContent.highlights || []).map((h) => h.toLowerCase());

    return words.map((word, index) => {
      const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, '');
      const isHighlighted = highlights.some((h) => {
        const cleanH = h.replace(/[^a-z0-9]/g, '');
        return (
          cleanH === cleanWord ||
          h.split(/\s+/).some((part) => part.replace(/[^a-z0-9]/g, '') === cleanWord)
        );
      });

      return (
        <span
          key={index}
          data-word
          data-highlight={isHighlighted ? 'true' : undefined}
          className={`inline-block mr-[0.3em] transition-colors duration-150 ${
            isHighlighted ? 'font-semibold text-white' : ''
          }`}
          style={{ color: '#52525b', opacity: 0.2 }}
        >
          {word}
        </span>
      );
    });
  };

  // Repeated skills for smooth marquee tracks
  const renderSkillsList = (items) => {
    const repeated = [...items, ...items, ...items];
    return repeated.map((skill, i) => (
      <span key={i} className="flex items-center gap-6 md:gap-8 whitespace-nowrap">
        <span>{skill}</span>
        <span className="text-zinc-700 select-none">·</span>
      </span>
    ));
  };

  return (
    <section id="about" ref={sectionRef} className="relative bg-[#050505] text-white overflow-hidden">
      {/* Intro section */}
      <div className="min-h-screen max-w-[1280px] mx-auto px-6 md:px-12 py-20 md:py-32 flex flex-col justify-center">
        {/* Mobile Heading (centered above content on mobile only) */}
        <h2
          ref={mobileHeadingRef}
          className="block md:hidden text-center text-[18vw] sm:text-[8rem] font-black uppercase leading-[0.85] tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#ffffff] via-[#d4d4d8] to-[#52525b] filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] mb-10 select-none"
        >
          {aboutContent.heading}
        </h2>

        <div className="flex flex-col md:flex-row md:items-start md:gap-12 lg:gap-16 items-center">
          {/* Left Column: Portrait */}
          <div className="shrink-0 mb-10 md:mb-0 flex justify-center md:justify-start">
            {aboutSrc ? (
              <img
                src={aboutSrc}
                alt={`${personalInfo.name} — portrait`}
                className="w-[190px] sm:w-[220px] md:w-[250px] lg:w-[260px] h-auto object-contain filter drop-shadow-[0_30px_50px_rgba(0,0,0,0.7)]"
              />
            ) : (
              <div className="w-[190px] sm:w-[220px] md:w-[260px] aspect-[3/4] border border-white/10 rounded-2xl flex items-center justify-center text-white/40 text-sm">
                [About Portrait]
              </div>
            )}
          </div>

          {/* Right Column: Desktop Heading + Glass Card */}
          <div className="flex-1 w-full flex flex-col justify-center">
            {/* Desktop Heading (placed above description card) */}
            <h2
              ref={desktopHeadingRef}
              className="hidden md:block text-[8rem] lg:text-[11rem] font-black uppercase leading-[0.85] tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#ffffff] via-[#d4d4d8] to-[#52525b] filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] mb-8 select-none"
            >
              {aboutContent.heading}
            </h2>

            {/* Glass Description Card */}
            <div
              ref={cardRef}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6 md:p-10 transition-colors duration-500 hover:bg-white/[0.08]"
            >
              <h3 className="font-semibold text-white text-xl md:text-2xl mb-4 text-center md:text-left">
                {aboutContent.greeting}
              </h3>
              <p className="font-light text-base md:text-[20px] leading-relaxed text-center md:text-left">
                {renderParagraphWords()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Skills Marquee Ticker */}
      <div className="w-full bg-[#030303] border-t border-white/5 py-8 md:py-12 overflow-hidden">
        <div className="space-y-4 md:space-y-6">
          {skillRows.map((row, index) => {
            // Rows 1 and 3 move Left -> Right; Rows 2 and 4 move Right -> Left
            const isRight = index % 2 === 0;
            return (
              <div key={row.label || index} className="relative flex items-center overflow-hidden">
                {/* Pinned Label */}
                <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center px-4 md:px-8 bg-gradient-to-r from-[#030303] via-[#030303]/90 to-transparent pr-12 md:pr-16 text-white uppercase text-xs md:text-sm font-bold tracking-[0.3em] pointer-events-none select-none">
                  {row.label}
                </div>

                {/* Infinite Marquee Track */}
                <div
                  className={`flex w-max gap-6 md:gap-8 py-2 md:py-3 text-zinc-500 font-medium tracking-widest text-[14px] md:text-[18px] select-none ${
                    isRight ? 'marquee-right' : 'marquee-left'
                  }`}
                >
                  <div className="flex items-center gap-6 md:gap-8">
                    {renderSkillsList(row.items)}
                  </div>
                  <div className="flex items-center gap-6 md:gap-8" aria-hidden="true">
                    {renderSkillsList(row.items)}
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
