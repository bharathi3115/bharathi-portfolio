import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  personalInfo,
  socialLinks,
  contactContent,
  emailjsConfig,
} from '../data/portfolioData';

// Register ScrollTrigger once
gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const [status, setStatus] = useState('idle'); // 'idle' | 'sending' | 'success' | 'error'

  const sectionRef = useRef(null);
  const formRef = useRef(null);
  const headingRef = useRef(null);
  const infoRef = useRef(null);
  const socialRef = useRef(null);
  const fieldsRef = useRef(null);
  const submitBtnRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          once: true,
        },
      });

      // 1. Heading slides up and fades in
      if (headingRef.current) {
        tl.fromTo(
          headingRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
        );
      }

      // 2. Contact info items reveal
      if (infoRef.current) {
        const infoItems = infoRef.current.children;
        tl.fromTo(
          infoItems,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.15 },
          '-=0.6'
        );
      }

      // 3. Social icons scale and fade in
      if (socialRef.current) {
        const socialIcons = socialRef.current.children;
        if (socialIcons.length > 0) {
          tl.fromTo(
            socialIcons,
            { opacity: 0, scale: 0.8 },
            { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.5)', stagger: 0.1 },
            '-=0.4'
          );
        }
      }

      // 4. Form fields slide up with a stagger
      if (fieldsRef.current) {
        const formFields = fieldsRef.current.querySelectorAll('[data-form-field]');
        tl.fromTo(
          formFields,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08 },
          '-=0.6'
        );
      }

      // 5. Submit button fades in
      if (submitBtnRef.current) {
        tl.fromTo(
          submitBtnRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
          '-=0.4'
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'sending') return;

    const form = formRef.current;
    if (!form) return;

    const { serviceId, templateId, publicKey } = emailjsConfig || {};
    const isConfigured =
      serviceId &&
      serviceId !== 'YOUR_EMAILJS_SERVICE_ID' &&
      templateId &&
      templateId !== 'YOUR_EMAILJS_TEMPLATE_ID' &&
      publicKey &&
      publicKey !== 'YOUR_EMAILJS_PUBLIC_KEY';

    if (!isConfigured) {
      // Fallback: mailto link with encoded form values
      const formData = new FormData(form);
      const name = formData.get('user_name') || '';
      const email = formData.get('user_email') || '';
      const phone = formData.get('user_phone') || '';
      const subject = formData.get('subject') || 'General Inquiry';
      const emailSubject = `Portfolio message: ${subject}`;
      const message = formData.get('message') || '';

      const phonePart = phone ? `, ${phone}` : '';
      const bodyText = `From: ${name} (${email}${phonePart})\n\n${message}`;
      const mailtoUrl = `mailto:${personalInfo.email}?subject=${encodeURIComponent(
        emailSubject
      )}&body=${encodeURIComponent(bodyText)}`;

      window.open(mailtoUrl, '_blank');
      setStatus('success');
      form.reset();
      setTimeout(() => setStatus('idle'), 4000);
      return;
    }

    try {
      setStatus('sending');
      const emailjs = await import('@emailjs/browser');
      await emailjs.default.sendForm(serviceId, templateId, form, publicKey);
      setStatus('success');
      form.reset();
      setTimeout(() => setStatus('idle'), 4000);
    } catch (err) {
      console.error('EmailJS submission error:', err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  const socialLinksList = [
    {
      name: 'Instagram',
      url: socialLinks?.instagram,
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
    },
    {
      name: 'YouTube',
      url: socialLinks?.youtube,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      url: socialLinks?.linkedin,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.77v8.37H6.46v-8.37M7.85 6.2a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
        </svg>
      ),
    },
    {
      name: 'GitHub',
      url: socialLinks?.github,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
          />
        </svg>
      ),
    },
  ].filter((item) => Boolean(item.url));

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative min-h-screen w-full bg-[#050505] text-white px-6 md:px-16 py-24 md:py-32 overflow-hidden flex items-center"
    >
      {/* Subtle diffused neon-green horizon glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-[400px] pointer-events-none select-none z-0"
        style={{
          background:
            'radial-gradient(ellipse at bottom, rgba(120, 200, 40, 0.18) 0%, transparent 65%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-[1300px] mx-auto grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-12 lg:gap-20 items-start">
        {/* Left Column: Heading, Direct Info, and Social Links */}
        <div className="flex flex-col">
          {/* Main Editorial Heading */}
          <h2
            ref={headingRef}
            className="text-[clamp(3rem,9vw,6.5rem)] font-black uppercase tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#ffffff] via-[#d4d4d8] to-[#52525b] filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] mb-12 select-none"
          >
            {contactContent.heading || 'Get in touch'}
          </h2>

          {/* Contact Details */}
          <div ref={infoRef} className="space-y-6 mb-12">
            {/* Email */}
            {personalInfo.email && (
              <div>
                <span className="text-xs uppercase tracking-widest text-zinc-500 font-medium mb-1 block">
                  Email:
                </span>
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="text-lg md:text-xl font-light tracking-wide text-white transition-colors duration-300 hover:text-[#CCFF00]"
                >
                  {personalInfo.email}
                </a>
              </div>
            )}

            {/* Phone */}
            {personalInfo.phone && (
              <div>
                <span className="text-xs uppercase tracking-widest text-zinc-500 font-medium mb-1 block">
                  Phone:
                </span>
                <a
                  href={`tel:${personalInfo.phone}`}
                  className="text-lg md:text-xl font-light tracking-wide text-white transition-colors duration-300 hover:text-[#CCFF00]"
                >
                  {personalInfo.phone}
                </a>
              </div>
            )}
          </div>

          {/* Social Links */}
          {socialLinksList.length > 0 && (
            <div>
              <span className="text-xs uppercase tracking-widest text-zinc-500 font-medium mb-4 block">
                {contactContent.followLabel || 'Follow us'}
              </span>
              <div ref={socialRef} className="flex items-center gap-3">
                {socialLinksList.map((item) => (
                  <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.name}
                    className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all duration-300 hover:border-white/30 hover:bg-white/10 hover:shadow-[0_0_15px_rgba(204,255,0,0.3)] hover:scale-105"
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Contact Form */}
        <div className="w-full">
          <form ref={formRef} onSubmit={handleSubmit} className="w-full">
            <div ref={fieldsRef} className="space-y-4 mb-6">
              {/* Row 1: Name and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div data-form-field>
                  <label htmlFor="user_name" className="text-xs font-medium uppercase tracking-wider text-zinc-400 mb-2 block">
                    Your Name
                  </label>
                  <input
                    id="user_name"
                    name="user_name"
                    type="text"
                    required
                    placeholder="Your full name"
                    className="w-full bg-[#111111] rounded-[10px] border border-white/5 px-4 py-3.5 text-white placeholder-zinc-600 focus:border-white/25 focus:ring-1 focus:ring-[#CCFF00]/30 outline-none transition-all duration-200"
                  />
                </div>

                <div data-form-field>
                  <label htmlFor="user_email" className="text-xs font-medium uppercase tracking-wider text-zinc-400 mb-2 block">
                    Email address
                  </label>
                  <input
                    id="user_email"
                    name="user_email"
                    type="email"
                    required
                    placeholder="Your email address"
                    className="w-full bg-[#111111] rounded-[10px] border border-white/5 px-4 py-3.5 text-white placeholder-zinc-600 focus:border-white/25 focus:ring-1 focus:ring-[#CCFF00]/30 outline-none transition-all duration-200"
                  />
                </div>
              </div>

              {/* Row 2: Phone and Subject */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div data-form-field>
                  <label htmlFor="user_phone" className="text-xs font-medium uppercase tracking-wider text-zinc-400 mb-2 block">
                    Phone
                  </label>
                  <input
                    id="user_phone"
                    name="user_phone"
                    type="tel"
                    placeholder="Your phone number"
                    className="w-full bg-[#111111] rounded-[10px] border border-white/5 px-4 py-3.5 text-white placeholder-zinc-600 focus:border-white/25 focus:ring-1 focus:ring-[#CCFF00]/30 outline-none transition-all duration-200"
                  />
                </div>

                <div data-form-field>
                  <label htmlFor="subject" className="text-xs font-medium uppercase tracking-wider text-zinc-400 mb-2 block">
                    Subject
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="Subject"
                    className="w-full bg-[#111111] rounded-[10px] border border-white/5 px-4 py-3.5 text-white placeholder-zinc-600 focus:border-white/25 focus:ring-1 focus:ring-[#CCFF00]/30 outline-none transition-all duration-200"
                  />
                </div>
              </div>

              {/* Full Width: Message */}
              <div data-form-field>
                <label htmlFor="message" className="text-xs font-medium uppercase tracking-wider text-zinc-400 mb-2 block">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Write something...."
                  className="w-full bg-[#111111] rounded-[10px] border border-white/5 px-4 py-3.5 text-white placeholder-zinc-600 focus:border-white/25 focus:ring-1 focus:ring-[#CCFF00]/30 outline-none resize-none transition-all duration-200"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div ref={submitBtnRef}>
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full bg-white text-black font-semibold rounded-[9px] py-4 text-sm uppercase tracking-wider hover:bg-zinc-200 active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
              >
                {status === 'sending' ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4 text-black"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Sending...</span>
                  </span>
                ) : (
                  <span>Send Message</span>
                )}
              </button>

              {/* Status Announcements */}
              <div className="min-h-[28px] mt-3">
                {status === 'success' && (
                  <p role="status" aria-live="polite" className="text-[#CCFF00] text-sm text-center font-medium">
                    Message sent successfully!
                  </p>
                )}
                {status === 'error' && (
                  <p role="status" aria-live="polite" className="text-red-400 text-sm text-center font-medium">
                    Failed to send message. Please try again.
                  </p>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
