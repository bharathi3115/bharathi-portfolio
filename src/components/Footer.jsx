import { personalInfo, socialLinks, footerContent, academy } from '../data/portfolioData';

// Dynamically load footer background image
const footerImages = import.meta.glob('../assets/footer/footer-bg.*', {
  eager: true,
  import: 'default',
});
const footerBg = Object.values(footerImages)[0] || '';
const currentYear = new Date().getFullYear();

export default function Footer() {

  const socialList = [
    { label: 'Instagram', url: socialLinks?.instagram },
    { label: 'YouTube', url: socialLinks?.youtube },
    { label: 'LinkedIn', url: socialLinks?.linkedin },
    { label: 'GitHub', url: socialLinks?.github },
  ].filter((item) => Boolean(item.url));

  const navLinks = footerContent.navLinks || [];

  return (
    <footer
      className="relative min-h-screen w-full bg-black text-white px-6 md:px-16 pt-24 pb-12 overflow-hidden flex flex-col justify-between"
      style={{
        backgroundImage: footerBg
          ? `url("${footerBg}")`
          : 'radial-gradient(circle at center bottom, rgba(120, 220, 40, 0.35) 0%, transparent 70%)',
        backgroundPosition: 'center bottom',
        backgroundSize: '160%',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Black gradient overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-transparent pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* Main Content Container (z-10) */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto flex flex-col justify-between flex-1">
        {/* Top Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start pt-6 mb-16 md:mb-24">
          {/* Left Column */}
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-widest text-zinc-500 font-medium mb-3 block">
              {footerContent.connectLabel || 'Connect with me'}
            </span>
            <a
              href={`mailto:${personalInfo.email}`}
              className="text-[clamp(1.4rem,4vw,3rem)] font-semibold text-white transition-colors duration-300 hover:text-[#CCFF00] block mb-8 leading-tight break-all sm:break-normal"
            >
              {personalInfo.email}
            </a>

            {/* Nav links */}
            {navLinks.length > 0 && (
              <nav aria-label="Footer Navigation" className="flex flex-wrap items-center gap-2 text-sm md:text-base text-zinc-400 font-medium">
                {navLinks.map((link, idx) => (
                  <span key={link.label || idx} className="inline-flex items-center gap-2">
                    <a
                      href={link.href}
                      className="transition-colors duration-200 hover:text-white"
                    >
                      {link.label}
                    </a>
                    {idx < navLinks.length - 1 && (
                      <span className="text-zinc-600 select-none" aria-hidden="true">
                        ·
                      </span>
                    )}
                  </span>
                ))}
              </nav>
            )}
          </div>

          {/* Right Column */}
          <div className="flex flex-col md:items-end text-left md:text-right">
            <h3 className="text-2xl md:text-4xl font-bold text-white mb-3">
              {footerContent.ctaHeading || "Let's build something"}
            </h3>
            <p className="text-sm md:text-base text-zinc-400 font-light max-w-md mb-8">
              {footerContent.ctaText || 'Open for freelance opportunities and collaborations.'}
            </p>
            <a
              href="#contact"
              className="inline-flex items-center justify-center bg-white text-black font-semibold rounded-full px-8 py-3.5 text-xs md:text-sm uppercase tracking-wider transition-all duration-300 hover:bg-zinc-200 hover:scale-105 active:scale-95"
            >
              {footerContent.ctaLabel || 'Get in touch'}
            </a>
          </div>
        </div>

        {/* Social Links Row */}
        {socialList.length > 0 && (
          <div className="border-t border-white/10 pt-8 pb-10">
            <div className="flex flex-wrap items-center justify-between gap-6">
              {socialList.map((item) => (
                <a
                  key={item.label}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm md:text-base font-semibold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors duration-300"
                >
                  {item.label} ↗
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Huge Brand Typography Signature */}
        <div className="my-8 md:my-16 text-center select-none overflow-hidden">
          <h2 className="text-[12vw] sm:text-[13vw] font-bold tracking-tighter uppercase leading-none text-white whitespace-nowrap">
            {(personalInfo.brandName || personalInfo.name || 'PORTFOLIO').toUpperCase()}
          </h2>
        </div>

        {/* Bottom Minimal Row */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-light">
          {/* Left copyright and TAP Academy credit */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-2 gap-y-1 text-center md:text-left">
            <span>
              © {currentYear} {personalInfo.name}. All Rights Reserved.
            </span>
            {academy && (
              <span>
                Trained at{' '}
                <a
                  href={academy.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-zinc-300 transition-colors"
                >
                  {academy.name}
                </a>
              </span>
            )}
          </div>

          {/* Right legal links */}
          <div className="flex items-center gap-6">
            <a href="#home" className="hover:text-zinc-300 transition-colors">
              Privacy policy
            </a>
            <a href="#home" className="hover:text-zinc-300 transition-colors">
              Terms and conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
