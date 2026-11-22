import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { personalInfo, heroContent } from '../data/portfolioData';

// Load hero portrait dynamically; fallback gracefully if missing
const heroImages = import.meta.glob('../assets/hero/hero-portrait.*', {
  eager: true,
  import: 'default',
});
const heroSrc = Object.values(heroImages)[0] || '';

export default function Hero() {
  const initialBrand = (personalInfo.brandName || personalInfo.name || 'PORTFOLIO').toUpperCase();
  const finalWord = (heroContent.finalWord || 'PORTFOLIO').toUpperCase();

  const [displayText, setDisplayText] = useState(initialBrand);

  const typoRef = useRef(null);
  const imageRef = useRef(null);
  const subtitleRef = useRef(null);
  const controlsRef = useRef(null);

  // Split role: first word bold, rest light italic
  const roleParts = (personalInfo.role || '').trim().split(' ');
  const firstWord = roleParts[0] || '';
  const restWords = roleParts.slice(1).join(' ');

  useEffect(() => {
    const typoEl = typoRef.current;
    const imageEl = imageRef.current;
    const subtitleEl = subtitleRef.current;
    const controlsEl = controlsRef.current;

    // Lock page scroll initially
    document.body.style.overflow = 'hidden';

    // Initial GSAP positions
    if (imageEl) gsap.set(imageEl, { y: '100vh' });
    if (subtitleEl && controlsEl) {
      gsap.set([subtitleEl, controlsEl], { opacity: 0, y: 50 });
    }
    if (typoEl) {
      gsap.set(typoEl, { top: '50%' });
    }

    let intervalId = null;
    let timeoutId = null;
    let tl = null;
    let isCancelled = false;

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    const startAnimations = () => {
      if (isCancelled) return;

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        setDisplayText(finalWord);
        const isMobile = window.innerWidth < 768;
        if (typoEl) gsap.set(typoEl, { top: isMobile ? '20%' : '45%' });
        if (imageEl) gsap.set(imageEl, { y: 0 });
        if (subtitleEl && controlsEl) gsap.set([subtitleEl, controlsEl], { opacity: 1, y: 0 });
        document.body.style.overflow = 'auto';
        return;
      }

      // Step 3: Progressive letter-by-letter scramble replacement
      const targetLen = finalWord.length;
      let ticks = 0;
      let lockedCount = 0;

      intervalId = setInterval(() => {
        ticks += 1;
        // Lock one additional letter every 2 ticks (~100ms)
        if (ticks % 2 === 0 && lockedCount < targetLen) {
          lockedCount += 1;
        }

        let scrambled = '';
        for (let i = 0; i < targetLen; i += 1) {
          if (i < lockedCount) {
            scrambled += finalWord[i];
          } else {
            scrambled += chars[Math.floor(Math.random() * chars.length)];
          }
        }
        setDisplayText(scrambled);

        if (lockedCount >= targetLen) {
          clearInterval(intervalId);
          intervalId = null;
          setDisplayText(finalWord);

          // Step 4: Pause briefly (0.4s) before starting GSAP timeline
          timeoutId = setTimeout(() => {
            if (isCancelled) return;
            const isMobile = window.innerWidth < 768;
            const targetTop = isMobile ? '20%' : '45%';

            tl = gsap.timeline({
              onComplete: () => {
                document.body.style.overflow = 'auto';
              },
            });

            // (a) Typography top movement
            if (typoEl) {
              tl.to(typoEl, {
                top: targetTop,
                duration: 1.5,
                ease: 'power3.inOut',
              }, 0);
            }

            // (b) Person image emergence
            if (imageEl) {
              tl.to(imageEl, {
                y: 0,
                duration: 1.5,
                ease: 'power3.out',
              }, 0);
            }

            // (c) Reveal subtitle and controls
            if (subtitleEl && controlsEl) {
              tl.to([subtitleEl, controlsEl], {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: 'power3.out',
                stagger: 0.2,
              }, 0.3);
            }
          }, 400);
        }
      }, 50);
    };

    // Preload image then start sequence after ~1s
    let preloadTimer = null;
    if (heroSrc) {
      const img = new Image();
      img.onload = () => {
        preloadTimer = setTimeout(startAnimations, 1000);
      };
      img.onerror = () => {
        preloadTimer = setTimeout(startAnimations, 1000);
      };
      img.src = heroSrc;
    } else {
      preloadTimer = setTimeout(startAnimations, 1000);
    }

    return () => {
      isCancelled = true;
      if (preloadTimer) clearTimeout(preloadTimer);
      if (intervalId) clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);
      if (tl) tl.kill();
      if (typoEl) gsap.killTweensOf(typoEl);
      if (imageEl) gsap.killTweensOf(imageEl);
      if (subtitleEl) gsap.killTweensOf(subtitleEl);
      if (controlsEl) gsap.killTweensOf(controlsEl);
      document.body.style.overflow = 'auto';
    };
  }, [finalWord]);

  return (
    <header
      id="home"
      className="relative min-h-screen w-full overflow-hidden select-none"
      style={{
        background: 'radial-gradient(circle at center, #1c1c1f 0%, #050505 100%)',
      }}
    >
      {/* Subtle backdrop overlay */}
      <div
        className="absolute inset-0 bg-black/10 backdrop-blur-[2px] pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* Main typography (z-10, behind person) */}
      <div
        ref={typoRef}
        className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center z-10 pointer-events-none px-4"
        style={{ top: '50%' }}
      >
        <h1
          aria-label={`${personalInfo.brandName || personalInfo.name} ${finalWord}`}
          className="text-[16vw] md:text-[10rem] 2xl:text-[14rem] font-black uppercase leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#ffffff] via-[#d4d4d8] to-[#52525b] filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
        >
          <span aria-hidden="true">{displayText}</span>
        </h1>
      </div>

      {/* Person cut-out portrait (z-20) */}
      <div
        ref={imageRef}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex items-end justify-center"
      >
        {heroSrc ? (
          <img
            src={heroSrc}
            alt={personalInfo.name}
            className="h-auto w-auto max-h-[88vh] max-w-[72vw] md:max-w-[500px] xl:max-w-[650px] object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.7)]"
          />
        ) : (
          <div className="text-white/40 text-sm pb-12 font-sans">[Hero Portrait]</div>
        )}
      </div>

      {/* Subtitle and contact controls (z-30, front layer) */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-5 px-6 pb-10 md:flex-row md:items-end md:justify-between md:px-[8%] md:pb-[8%] z-30">
        {/* Role subtitle */}
        <div ref={subtitleRef} className="text-center md:text-left">
          <h2 className="text-base md:text-4xl lg:text-5xl text-white/90 drop-shadow-md">
            <span className="font-bold">{firstWord}</span>{' '}
            <span className="font-light italic font-serif-accent text-white/80">{restWords}</span>
          </h2>
        </div>

        {/* Contact controls */}
        <div ref={controlsRef} className="flex items-center gap-3">
          <a
            href="#contact"
            aria-label="Contact details"
            className="group h-12 w-12 rounded-full border border-white/20 bg-black/30 backdrop-blur-md flex items-center justify-center text-white transition-all duration-300 hover:border-white/40 hover:bg-black/50"
          >
            <svg
              className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 17L17 7M9 7h8v8" />
            </svg>
          </a>

          <a
            href="#contact"
            className="rounded-full backdrop-blur-md bg-black/40 border border-white/20 px-8 py-3 text-white text-sm font-medium uppercase tracking-wider transition-all duration-300 hover:bg-black/60 hover:border-white/40 flex items-center justify-center"
          >
            {heroContent.ctaLabel}
          </a>
        </div>
      </div>
    </header>
  );
}
