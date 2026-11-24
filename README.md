# Bharathi.O — Portfolio

A cinematic dark editorial single-page portfolio showcasing data analytics, visualization, and interactive web projects.

- **Live site**: https://YOUR-SITE-URL/

Built during the placement training program at [TAP Academy](https://thetapacademy.com/) (full-stack development, AI and augmented reality training).

---

## Tech Stack

- **Framework**: React 19 (Plain JSX)
- **Bundler & Tooling**: Vite
- **Styling**: Tailwind CSS 4
- **Animations**: GSAP & ScrollTrigger
- **Contact Handling**: EmailJS (`@emailjs/browser`)

---

## Run Locally

Clone the repository and install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run code linter:

```bash
npm run lint
```

---

## Environment Variables

To configure direct contact form submissions via EmailJS, create a `.env.local` file in the project root with the following variables:

```env
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
```

*(Note: If left unconfigured, the contact form will automatically fall back to opening your visitor's default email client via `mailto:`).*
