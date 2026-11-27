import { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projectsContent } from '../data/portfolioData';

// Register ScrollTrigger once
gsap.registerPlugin(ScrollTrigger);

// Dynamically load all project cover images from assets
const projectImages = import.meta.glob('../assets/projects/*.{png,jpg,jpeg,webp,svg}', {
  eager: true,
  import: 'default',
});

// Helper to look up an image by its ID or filename
function getProjectImage(imageId) {
  if (!imageId) return null;
  const matchingEntry = Object.entries(projectImages).find(([filePath]) => {
    const filename = filePath.split('/').pop().split('.')[0];
    return filename === imageId;
  });
  if (matchingEntry) return matchingEntry[1];
  return `/assets/images/${imageId}.webp`;
}

// Format lines and convert *word* into light italic serif
function formatTitleLine(line) {
  const parts = line.split(/(\*[^*]+\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      const inner = part.slice(1, -1).toLowerCase();
      return (
        <span
          key={index}
          className="lowercase font-light italic font-serif-accent text-[#9CA3AF]"
        >
          {inner}
        </span>
      );
    }
    return part;
  });
}

export default function Projects({ onCtaClick = () => {} }) {
  const sectionRef = useRef(null);
  const projectRowRefs = useRef([]);

  // Active image index for each multi-image project card
  const [activeCardImages, setActiveCardImages] = useState({});

  // Fullscreen modal lightbox state
  const [modalState, setModalState] = useState({
    isOpen: false,
    project: null,
    images: [],
    imageIndex: 0,
  });

  const openModal = useCallback((project, initialIndex = 0) => {
    const projectImagesList = project.images && project.images.length > 0
      ? project.images
      : [{ id: project.id, label: 'Cover', title: (project.title || []).join(' ') }];

    setModalState({
      isOpen: true,
      project,
      images: projectImagesList,
      imageIndex: initialIndex,
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const nextModalImage = useCallback(() => {
    setModalState((prev) => ({
      ...prev,
      imageIndex: (prev.imageIndex + 1) % prev.images.length,
    }));
  }, []);

  const prevModalImage = useCallback(() => {
    setModalState((prev) => ({
      ...prev,
      imageIndex: (prev.imageIndex - 1 + prev.images.length) % prev.images.length,
    }));
  }, []);

  // Handle keyboard shortcuts and lock body scroll when modal is active
  useEffect(() => {
    if (!modalState.isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowRight') nextModalImage();
      if (e.key === 'ArrowLeft') prevModalImage();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [modalState.isOpen, closeModal, nextModalImage, prevModalImage]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      projectRowRefs.current.forEach((rowEl) => {
        if (!rowEl) return;
        const imgEl = rowEl.querySelector('[data-project-image]');
        const contentEls = rowEl.querySelectorAll('[data-project-content]');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: rowEl,
            start: 'top 80%',
            once: true,
          },
        });

        if (imgEl) {
          tl.fromTo(
            imgEl,
            { opacity: 0, y: 60 },
            { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
          );
        }

        if (contentEls.length > 0) {
          tl.fromTo(
            contentEls,
            { opacity: 0, y: 60 },
            { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.1 },
            imgEl ? '-=0.7' : 0
          );
        }
      });
    }, sectionRef);

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

  const items = projectsContent.items || [];
  const headingMain = projectsContent.headingMain || 'Selected';
  const headingAccent = projectsContent.headingAccent || 'work';
  const description = projectsContent.description || '';
  const readMore = projectsContent.readMore || { label: 'Read More ↗', href: '#projects' };

  const activeModalImage = modalState.images[modalState.imageIndex];
  const activeModalImgSrc = activeModalImage ? getProjectImage(activeModalImage.id) : null;

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative w-full bg-[#050505] text-white px-6 md:px-16 pt-20 pb-24 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between md:gap-8 mb-20 md:mb-32">
          {/* Left: Giant Heading */}
          <div className="mb-8 md:mb-0">
            <h2 className="flex flex-wrap items-baseline tracking-tighter leading-none select-none">
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#ffffff] via-[#d4d4d8] to-[#52525b] font-black uppercase text-[36px] sm:text-[48px] md:text-[60px] lg:text-[96px]">
                {headingMain}
              </span>
              <span className="font-serif-accent font-light italic text-[#d4d4d8] text-[32px] sm:text-[44px] md:text-[54px] lg:text-[88px] ml-3 md:ml-4">
                {headingAccent}
              </span>
            </h2>
          </div>

          {/* Right: Description & Read More */}
          <div className="flex flex-col items-start md:items-start max-w-[400px]">
            {description && (
              <p className="text-[#9CA3AF] font-light text-sm md:text-base leading-relaxed mb-6">
                {description}
              </p>
            )}
            <a
              href={readMore.href || '#projects'}
              className="inline-flex items-center gap-2 bg-[#CCFF00] text-black rounded-full border border-[#CCFF00] px-6 py-2.5 text-xs font-medium uppercase tracking-wider transition-colors duration-300 hover:bg-[#b8e600] active:scale-95"
            >
              <span>{readMore.label || 'Read More ↗'}</span>
            </a>
          </div>
        </div>

        {/* Project List */}
        <div className="flex flex-col gap-24 md:gap-40">
          {items.map((project, index) => {
            const isEven = index % 2 === 0;
            const hasMultipleImages = Boolean(project.images && project.images.length > 1);
            const activeImgIdx = activeCardImages[project.id] ?? 0;
            const currentImgId = hasMultipleImages ? project.images[activeImgIdx]?.id : project.id;
            const imgSrc = getProjectImage(currentImgId);
            const altText = (project.title || []).join(' ').replace(/\*/g, '');

            return (
              <div
                key={project.id || index}
                ref={(el) => {
                  if (el) projectRowRefs.current[index] = el;
                }}
                className="group grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16 lg:gap-24 md:items-center"
              >
                {/* 1. Header Block (Number + Category + Title) */}
                <div
                  data-project-content
                  className={`flex flex-col ${
                    isEven
                      ? 'md:col-start-2 md:row-start-1 md:self-end'
                      : 'md:col-start-1 md:row-start-1 md:self-end'
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="text-[#CCFF00] font-bold text-sm uppercase tracking-[0.3em]">
                      {project.number || String(index + 1).padStart(2, '0')}
                    </span>
                    {project.category && (
                      <>
                        <span className="text-zinc-600 text-xs hidden sm:inline" aria-hidden="true">
                          /
                        </span>
                        <span className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-zinc-400">
                          {project.category}
                        </span>
                      </>
                    )}
                  </div>

                  <h3 className="text-[30px] sm:text-[40px] md:text-[clamp(1.9rem,5vw,3.8rem)] font-extrabold uppercase tracking-tight leading-[1.05] text-white">
                    {(project.title || []).map((line, lineIdx) => (
                      <span key={lineIdx} className="block">
                        {formatTitleLine(line)}
                      </span>
                    ))}
                  </h3>
                </div>

                {/* 2. Image Block (With Interactive Multi-Image Tabs & Lightbox trigger) */}
                <div
                  data-project-image
                  className={`relative overflow-hidden rounded-[4px] bg-zinc-950 aspect-[16/10] w-full border border-zinc-800/80 shadow-xl ${
                    isEven
                      ? 'md:col-start-1 md:row-start-1 md:row-span-2'
                      : 'md:col-start-2 md:row-start-1 md:row-span-2'
                  }`}
                >
                  {/* Clickable Image Container */}
                  <div
                    onClick={() => {
                      if (project.hasDashboardModal || hasMultipleImages) {
                        openModal(project, activeImgIdx);
                      }
                    }}
                    className={`w-full h-full relative ${
                      project.hasDashboardModal || hasMultipleImages ? 'cursor-pointer' : ''
                    }`}
                  >
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={altText}
                        loading="lazy"
                        className="w-full h-full object-cover rounded-[3px] opacity-90 transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-100"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-950 flex flex-col items-center justify-center text-zinc-500 font-mono text-sm p-4 text-center">
                        <span className="text-zinc-600 mb-2 uppercase tracking-widest text-xs">
                          Project Cover
                        </span>
                        <span>{project.id}</span>
                      </div>
                    )}

                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
                  </div>

                  {/* Multi-page Tab Switcher for Dashboards */}
                  {hasMultipleImages && (
                    <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between gap-1.5 p-1 rounded-full bg-black/80 backdrop-blur-md border border-white/10 shadow-lg">
                      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                        {project.images.map((imgItem, imgIdx) => (
                          <button
                            key={imgItem.id || imgIdx}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveCardImages((prev) => ({
                                ...prev,
                                [project.id]: imgIdx,
                              }));
                            }}
                            className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-medium tracking-wide transition-all duration-200 cursor-pointer whitespace-nowrap ${
                              activeImgIdx === imgIdx
                                ? 'bg-[#CCFF00] text-black font-semibold shadow'
                                : 'text-zinc-300 hover:text-white hover:bg-white/10'
                            }`}
                          >
                            {imgItem.label || `Page ${imgIdx + 1}`}
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal(project, activeImgIdx);
                        }}
                        title="Open interactive viewer"
                        className="p-1.5 rounded-full text-zinc-400 hover:text-[#CCFF00] hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
                        aria-label="Expand image"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                {/* 3. Body Block (Description + Tech Tags + Buttons) */}
                <div
                  data-project-content
                  className={`flex flex-col ${
                    isEven
                      ? 'md:col-start-2 md:row-start-2 md:self-start md:pt-4'
                      : 'md:col-start-1 md:row-start-2 md:self-start md:pt-4'
                  }`}
                >
                  <p className="text-[#9CA3AF] font-light text-sm md:text-base leading-[1.7] max-w-[500px] mb-6">
                    {project.description}
                  </p>

                  {/* Technology Tags */}
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 mb-8">
                      {project.tags.map((tag, tagIdx) => (
                        <span
                          key={tagIdx}
                          className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-zinc-900/90 text-zinc-300 border border-zinc-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3">
                    {project.hasDashboardModal ? (
                      <button
                        type="button"
                        onClick={() => openModal(project, activeImgIdx)}
                        className="inline-flex items-center gap-2 bg-[#CCFF00] text-black border border-[#CCFF00] rounded-full px-6 py-2.5 text-xs md:text-sm font-semibold uppercase tracking-wider transition-all duration-300 hover:bg-[#b8e600] active:scale-95 cursor-pointer shadow-md"
                      >
                        <span>{project.primaryBtnLabel || 'VIEW DASHBOARD'}</span>
                        <span aria-hidden="true">↗</span>
                      </button>
                    ) : (
                      project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => onCtaClick('live', project)}
                          className="inline-flex items-center gap-2 bg-[#CCFF00] text-black border border-[#CCFF00] rounded-full px-6 py-2.5 text-xs md:text-sm font-semibold uppercase tracking-wider transition-all duration-300 hover:bg-[#b8e600] active:scale-95"
                        >
                          <span>Live Demo</span>
                          <span aria-hidden="true">↗</span>
                        </a>
                      )
                    )}

                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => onCtaClick('github', project)}
                        className="inline-flex items-center gap-2 bg-transparent text-white border border-white/30 rounded-full px-6 py-2.5 text-xs md:text-sm font-medium uppercase tracking-wider transition-all duration-300 hover:bg-white hover:text-black active:scale-95"
                      >
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                          />
                        </svg>
                        <span>GitHub</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Dashboard Lightbox Modal */}
      {modalState.isOpen && modalState.project && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={modalState.project.title?.join(' ') || 'Project Dashboard'}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6 md:p-10"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-[#0c0c0e] border border-white/10 rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/10 bg-zinc-950/90">
              <div className="flex items-center flex-wrap gap-2">
                <span className="text-[#CCFF00] text-xs font-mono font-bold tracking-widest uppercase">
                  {modalState.project.number}
                </span>
                <span className="text-white font-bold text-sm md:text-base tracking-tight uppercase">
                  {(modalState.project.title || []).join(' ').replace(/\*/g, '')}
                </span>
                {activeModalImage && (
                  <span className="hidden sm:inline-block text-xs text-zinc-400 font-mono">
                    — {activeModalImage.title || activeModalImage.label}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-zinc-400">
                  {modalState.imageIndex + 1} / {modalState.images.length}
                </span>
                <button
                  type="button"
                  onClick={closeModal}
                  aria-label="Close modal"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#CCFF00] hover:text-black transition-all cursor-pointer font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Main Image View */}
            <div className="relative flex-1 flex items-center justify-center bg-black/70 p-2 sm:p-4 overflow-hidden min-h-[260px] md:min-h-[460px]">
              {activeModalImgSrc && (
                <img
                  src={activeModalImgSrc}
                  alt={activeModalImage?.title || 'Dashboard page'}
                  className="max-h-[66vh] w-auto max-w-full object-contain rounded shadow-2xl transition-all duration-300"
                />
              )}

              {/* Prev / Next navigation arrows */}
              {modalState.images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevModalImage}
                    aria-label="Previous page"
                    className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/80 border border-white/20 text-white hover:bg-[#CCFF00] hover:text-black hover:border-[#CCFF00] transition-all cursor-pointer shadow-lg text-lg"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={nextModalImage}
                    aria-label="Next page"
                    className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/80 border border-white/20 text-white hover:bg-[#CCFF00] hover:text-black hover:border-[#CCFF00] transition-all cursor-pointer shadow-lg text-lg"
                  >
                    →
                  </button>
                </>
              )}
            </div>

            {/* Modal Footer (Page Tabs & Caption Description) */}
            <div className="px-5 sm:px-6 py-3.5 border-t border-white/10 bg-zinc-950/90 flex flex-col sm:flex-row items-center justify-between gap-3">
              {activeModalImage?.description ? (
                <p className="text-xs text-zinc-400 font-light leading-relaxed max-w-xl text-center sm:text-left">
                  {activeModalImage.description}
                </p>
              ) : (
                <div />
              )}

              {modalState.images.length > 1 && (
                <div className="flex items-center gap-1.5 flex-wrap justify-center">
                  {modalState.images.map((imgItem, idx) => (
                    <button
                      key={imgItem.id || idx}
                      type="button"
                      onClick={() =>
                        setModalState((prev) => ({ ...prev, imageIndex: idx }))
                      }
                      className={`px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                        modalState.imageIndex === idx
                          ? 'bg-[#CCFF00] text-black font-bold shadow'
                          : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {imgItem.label || `Page ${idx + 1}`}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}


