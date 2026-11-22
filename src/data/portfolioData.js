// ============================================================
// portfolioData.js — ALL content for the portfolio lives here.
// Components only read from this file.
// ============================================================

export const personalInfo = {
  name: "Bharathi.O",
  brandName: "Bharathi.O",
  role: "Data Analyst",
  city: "Bangalore, India",
  phone: "9986294856",
  email: "bharathi3102@gmail.com",
};

export const academy = {
  name: "TAP Academy",
  url: "https://thetapacademy.com/",
};

export const socialLinks = {
  instagram: "",
  youtube: "",
  linkedin: "https://linkedin.com/in/bharathi-o-0a2a71358",
  github: "https://github.com/bharathi3115",
};

export const heroContent = {
  finalWord: "PORTFOLIO",
  ctaLabel: "Contact",
};

export const aboutContent = {
  heading: "Intro",
  greeting: "Hey, I'm Bharathi.",
  paragraph:
    "A detail-oriented Data Analyst passionate about uncovering actionable insights from complex datasets and transforming raw data into strategic business value. Skilled in SQL, Python, Power BI, and database systems, I focus on building robust queries and intuitive dashboards while sharpening my skills through the placement training program at TAP Academy. Constantly exploring modern analytics and database technologies like MongoDB to drive data-informed decision-making.",
  highlights: ["SQL", "Python", "Power BI", "MongoDB"],
};

export const skillRows = [
  {
    label: "Data Analysis",
    items: ["Power BI", "Advanced Excel", "Data Analysis", "Data Modeling", "DAX", "Statistical Analysis", "Business Intelligence"],
  },
  {
    label: "Databases & Querying",
    items: ["SQL", "PostgreSQL", "MySQL", "MongoDB", "Database Design", "Complex Joins", "Aggregation Pipelines"],
  },
  {
    label: "Programming",
    items: ["Python", "Pandas", "NumPy", "Matplotlib", "Seaborn", "Jupyter", "REST APIs"],
  },
  {
    label: "Tools & Workflow",
    items: ["Git", "GitHub", "VS Code", "Excel Dashboards", "ETL Pipelines", "Tableau", "Data Cleaning"],
  },
];

export const servicesContent = {
  headingLines: ["WHAT I", "CAN DO"],
  items: [
    {
      title: "DATA ANALYSIS & INSIGHTS",
      description:
        "I uncover hidden patterns, trends, and correlations across complex datasets to deliver actionable business insights.",
      capabilities: [
        "Exploratory Data Analysis",
        "Statistical Modeling",
        "Data Cleaning & Preparation",
        "Predictive Analytics",
        "Business Reporting",
      ],
      cta: { label: "VIEW PROJECTS", href: "#projects" },
    },
    {
      title: "BUSINESS INTELLIGENCE & DASHBOARDS",
      description:
        "I design intuitive, interactive visual dashboards that empower stakeholders to make informed decisions quickly.",
      capabilities: ["Power BI Dashboards", "Excel Advanced Reporting", "DAX Measures & KPIs", "Data Storytelling", "Automated Metrics"],
    },
    {
      title: "DATABASE DESIGN & SQL QUERYING",
      description:
        "I write performant SQL queries and architect robust data models to manage and extract structured and unstructured information.",
      capabilities: ["Complex SQL Joins", "Aggregations & Grouping", "Schema Architecture", "MongoDB Aggregation", "Database Optimization"],
    },
    {
      title: "ETL & DATA PROCESSING",
      description:
        "I construct reliable data processing pipelines that ingest, transform, and validate data for analysis.",
      capabilities: ["Python Pandas Pipelines", "Data Extraction & Cleansing", "Data Transformation", "Data Validation", "Automated Reporting"],
    },
  ],
};

// Words wrapped in *asterisks* are shown as light italic serif in gray.
export const projectsContent = {
  headingMain: "Selected",
  headingAccent: "work",
  description:
    "As an analyst focused on actionable insights, clarity, and impactful data-driven decision making.",
  readMore: { label: "Read More", href: "#projects" },
  items: [
    {
      id: "project-1",
      number: "01",
      title: ["CAMPUS BAZAAR", "*student* MARKETPLACE"],
      description:
        "A collaborative student marketplace platform built to streamline peer-to-peer campus commerce, featuring product listings, categorized discovery, and responsive user workflows.",
      liveUrl: "https://campus-bazar-8y9b.vercel.app/",
      githubUrl: "https://github.com/bharathi3115",
    },
  ],
};

export const contactContent = {
  heading: "Get in touch",
  followLabel: "Follow us",
};

export const footerContent = {
  connectLabel: "Connect with me",
  navLinks: [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Projects", href: "#projects" },
  ],
  ctaHeading: "Let's build something",
  ctaText: "Open for freelance opportunities and collaborations.",
  ctaLabel: "Get in touch",
};

// EmailJS — values come from .env.local (variables must start with VITE_)
export const emailjsConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || "YOUR_EMAILJS_SERVICE_ID",
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "YOUR_EMAILJS_TEMPLATE_ID",
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "YOUR_EMAILJS_PUBLIC_KEY",
};
