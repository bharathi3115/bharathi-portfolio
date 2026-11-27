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
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    user_phone: '',
    subject: '',
    message: '',
    bot_check: '', // Honeypot spam trap
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // 'idle' | 'sending' | 'success' | 'error'
  const [statusMessage, setStatusMessage] = useState('');
  const lastSubmitTimeRef = useRef(0);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field-specific error as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    // 1. Name validation
    if (!formData.user_name.trim()) {
      newErrors.user_name = 'Please enter your name.';
    } else if (formData.user_name.trim().length < 2) {
      newErrors.user_name = 'Name must be at least 2 characters.';
    }

    // 2. Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!formData.user_email.trim()) {
      newErrors.user_email = 'Please enter your email address.';
    } else if (!emailRegex.test(formData.user_email.trim())) {
      newErrors.user_email = 'Please enter a valid email address.';
    }

    // 3. Phone validation (optional, but if filled, must be 7-15 digits format)
    const phoneTrimmed = formData.user_phone.trim();
    if (phoneTrimmed) {
      const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/;
      if (!phoneRegex.test(phoneTrimmed)) {
        newErrors.user_phone = 'Please enter a valid phone number.';
      }
    }

    // 4. Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Please write a message.';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long.';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'sending') return;

    // Spam honeypot detection: reject silently if hidden bot field is filled
    if (formData.bot_check) {
      setStatus('success');
      setStatusMessage('Thank you! Your message has been sent successfully.');
      return;
    }

    // Front-end field validation
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Rate limiting: prevent submission within 25 seconds of last attempt
    const now = Date.now();
    if (now - lastSubmitTimeRef.current < 25000) {
      const waitSec = Math.ceil((25000 - (now - lastSubmitTimeRef.current)) / 1000);
      setStatus('error');
      setStatusMessage(`Please wait ${waitSec}s before sending another message.`);
      return;
    }

    const { serviceId, templateId, publicKey, autoReplyTemplateId } = emailjsConfig || {};
    const isConfigured =
      Boolean(serviceId) &&
      Boolean(templateId) &&
      Boolean(publicKey) &&
      serviceId !== 'YOUR_EMAILJS_SERVICE_ID' &&
      templateId !== 'YOUR_EMAILJS_TEMPLATE_ID' &&
      publicKey !== 'YOUR_EMAILJS_PUBLIC_KEY';

    const targetRecipient = personalInfo.email || 'bharathi3102a@gmail.com';
    const emailSubject =
      formData.subject.trim() ||
      `New Portfolio Contact Message – ${formData.user_name.trim()}`;

    // Email dispatch: uses EmailJS if keys are set, otherwise uses direct FormSubmit background service
    try {
      setStatus('sending');
      setStatusMessage('');

      if (isConfigured) {
        // 1. EmailJS path (when environment keys are provided)
        const emailjs = await import('@emailjs/browser');

        const notificationParams = {
          to_name: 'Bharathi',
          to_email: targetRecipient,
          from_name: formData.user_name.trim(),
          from_email: formData.user_email.trim(),
          from_phone: formData.user_phone.trim() || 'Not provided',
          subject: emailSubject,
          message: formData.message.trim(),
          reply_to: formData.user_email.trim(),
        };

        await emailjs.default.send(serviceId, templateId, notificationParams, publicKey);

        // Optional auto-reply template for EmailJS
        if (
          autoReplyTemplateId &&
          autoReplyTemplateId !== 'YOUR_EMAILJS_AUTOREPLY_TEMPLATE_ID'
        ) {
          try {
            const autoReplyParams = {
              to_name: formData.user_name.trim(),
              to_email: formData.user_email.trim(),
              subject: `Thank you for contacting Bharathi.O`,
              message: formData.message.trim(),
              reply_to: targetRecipient,
            };
            await emailjs.default.send(
              serviceId,
              autoReplyTemplateId,
              autoReplyParams,
              publicKey
            );
          } catch (autoErr) {
            console.warn('Auto-reply confirmation warning:', autoErr);
          }
        }
      } else {
        // 2. Direct Background Email Delivery to bharathi3102a@gmail.com
        const response = await fetch(`https://formsubmit.co/ajax/${targetRecipient}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            name: formData.user_name.trim(),
            email: formData.user_email.trim(),
            phone: formData.user_phone.trim() || 'Not provided',
            subject: emailSubject,
            message: formData.message.trim(),
            _replyto: formData.user_email.trim(),
            _subject: emailSubject,
            _autoresponse: `Hi ${formData.user_name.trim()},\n\nThank you for reaching out through my portfolio website!\n\nI have received your message regarding "${formData.subject.trim() || 'your inquiry'}" and will get back to you as soon as possible.\n\nSummary of your message:\n"${formData.message.trim()}"\n\nBest regards,\nBharathi.O\nData Analyst | Bangalore, India\nEmail: ${targetRecipient} | Phone: 9986294856`,
            _template: 'table',
            _captcha: 'false',
          }),
        });

        const result = await response.json();

        // Handle one-time FormSubmit activation notice
        if (result.message && result.message.includes('needs Activation')) {
          lastSubmitTimeRef.current = Date.now();
          setStatus('success');
          setStatusMessage(
            `Almost ready! FormSubmit sent an activation email to ${targetRecipient}. Please check your Gmail and click 'Activate Form' once. After that, every message lands directly in your Gmail!`
          );
          setFormData({
            user_name: '',
            user_email: '',
            user_phone: '',
            subject: '',
            message: '',
            bot_check: '',
          });
          setErrors({});
          return;
        }

        if (!response.ok || result.success === 'false') {
          throw new Error(result.message || 'Delivery service returned an error.');
        }
      }

      lastSubmitTimeRef.current = Date.now();
      setStatus('success');
      setStatusMessage(
        `Thank you, ${formData.user_name.trim()}! Your message has been sent directly to Bharathi. A confirmation email has been dispatched to your inbox.`
      );
      setFormData({
        user_name: '',
        user_email: '',
        user_phone: '',
        subject: '',
        message: '',
        bot_check: '',
      });
      setErrors({});
      setTimeout(() => setStatus('idle'), 8000);
    } catch (err) {
      console.error('Email submission error:', err);
      setStatus('error');
      setStatusMessage(
        `Failed to deliver message (${err.message || 'Network error'}). Please try again or email directly at ${targetRecipient}.`
      );
      setTimeout(() => setStatus('idle'), 7000);
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
          <form ref={formRef} onSubmit={handleSubmit} noValidate className="w-full">
            {/* Honeypot Spam Protection (Invisible to humans, caught by bots) */}
            <input
              type="text"
              name="bot_check"
              value={formData.bot_check}
              onChange={handleChange}
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />

            <div ref={fieldsRef} className="space-y-4 mb-6">
              {/* Row 1: Name and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div data-form-field>
                  <label
                    htmlFor="user_name"
                    className="text-xs font-medium uppercase tracking-wider text-zinc-400 mb-2 block"
                  >
                    Your Name <span className="text-[#CCFF00]">*</span>
                  </label>
                  <input
                    id="user_name"
                    name="user_name"
                    type="text"
                    required
                    value={formData.user_name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    disabled={status === 'sending'}
                    className={`w-full bg-[#111111] rounded-[10px] border px-4 py-3.5 text-white placeholder-zinc-600 outline-none transition-all duration-200 ${
                      errors.user_name
                        ? 'border-red-500/80 focus:border-red-400 focus:ring-1 focus:ring-red-400/30'
                        : 'border-white/5 focus:border-white/25 focus:ring-1 focus:ring-[#CCFF00]/30'
                    }`}
                  />
                  {errors.user_name && (
                    <span className="text-red-400 text-xs mt-1.5 block">
                      {errors.user_name}
                    </span>
                  )}
                </div>

                <div data-form-field>
                  <label
                    htmlFor="user_email"
                    className="text-xs font-medium uppercase tracking-wider text-zinc-400 mb-2 block"
                  >
                    Email address <span className="text-[#CCFF00]">*</span>
                  </label>
                  <input
                    id="user_email"
                    name="user_email"
                    type="email"
                    required
                    value={formData.user_email}
                    onChange={handleChange}
                    placeholder="Your email address"
                    disabled={status === 'sending'}
                    className={`w-full bg-[#111111] rounded-[10px] border px-4 py-3.5 text-white placeholder-zinc-600 outline-none transition-all duration-200 ${
                      errors.user_email
                        ? 'border-red-500/80 focus:border-red-400 focus:ring-1 focus:ring-red-400/30'
                        : 'border-white/5 focus:border-white/25 focus:ring-1 focus:ring-[#CCFF00]/30'
                    }`}
                  />
                  {errors.user_email && (
                    <span className="text-red-400 text-xs mt-1.5 block">
                      {errors.user_email}
                    </span>
                  )}
                </div>
              </div>

              {/* Row 2: Phone and Subject */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div data-form-field>
                  <label
                    htmlFor="user_phone"
                    className="text-xs font-medium uppercase tracking-wider text-zinc-400 mb-2 block"
                  >
                    Phone
                  </label>
                  <input
                    id="user_phone"
                    name="user_phone"
                    type="tel"
                    value={formData.user_phone}
                    onChange={handleChange}
                    placeholder="Your phone number"
                    disabled={status === 'sending'}
                    className={`w-full bg-[#111111] rounded-[10px] border px-4 py-3.5 text-white placeholder-zinc-600 outline-none transition-all duration-200 ${
                      errors.user_phone
                        ? 'border-red-500/80 focus:border-red-400 focus:ring-1 focus:ring-red-400/30'
                        : 'border-white/5 focus:border-white/25 focus:ring-1 focus:ring-[#CCFF00]/30'
                    }`}
                  />
                  {errors.user_phone && (
                    <span className="text-red-400 text-xs mt-1.5 block">
                      {errors.user_phone}
                    </span>
                  )}
                </div>

                <div data-form-field>
                  <label
                    htmlFor="subject"
                    className="text-xs font-medium uppercase tracking-wider text-zinc-400 mb-2 block"
                  >
                    Subject
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Subject"
                    disabled={status === 'sending'}
                    className="w-full bg-[#111111] rounded-[10px] border border-white/5 px-4 py-3.5 text-white placeholder-zinc-600 focus:border-white/25 focus:ring-1 focus:ring-[#CCFF00]/30 outline-none transition-all duration-200"
                  />
                </div>
              </div>

              {/* Full Width: Message */}
              <div data-form-field>
                <label
                  htmlFor="message"
                  className="text-xs font-medium uppercase tracking-wider text-zinc-400 mb-2 block"
                >
                  Message <span className="text-[#CCFF00]">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write something...."
                  disabled={status === 'sending'}
                  className={`w-full bg-[#111111] rounded-[10px] border px-4 py-3.5 text-white placeholder-zinc-600 outline-none resize-none transition-all duration-200 ${
                    errors.message
                      ? 'border-red-500/80 focus:border-red-400 focus:ring-1 focus:ring-red-400/30'
                      : 'border-white/5 focus:border-white/25 focus:ring-1 focus:ring-[#CCFF00]/30'
                  }`}
                />
                {errors.message && (
                  <span className="text-red-400 text-xs mt-1.5 block">
                    {errors.message}
                  </span>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div ref={submitBtnRef}>
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full bg-white text-black font-semibold rounded-[9px] py-4 text-sm uppercase tracking-wider hover:bg-[#CCFF00] hover:text-black active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer shadow-lg"
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
                    <span>Sending Message...</span>
                  </span>
                ) : (
                  <span>Send Message</span>
                )}
              </button>

              {/* Status Announcements */}
              <div className="min-h-[32px] mt-3">
                {status === 'success' && (
                  <div
                    role="status"
                    aria-live="polite"
                    className="p-3 rounded-lg bg-[#CCFF00]/10 border border-[#CCFF00]/30 text-[#CCFF00] text-xs sm:text-sm text-center font-medium leading-relaxed"
                  >
                    {statusMessage || 'Message sent successfully!'}
                  </div>
                )}
                {status === 'error' && (
                  <div
                    role="alert"
                    aria-live="assertive"
                    className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs sm:text-sm text-center font-medium leading-relaxed"
                  >
                    {statusMessage || 'Failed to send message. Please try again.'}
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

