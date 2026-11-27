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
  email: "bharathi3102a@gmail.com",
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
    "An aspiring Data Analyst with a strong passion for exploring data, uncovering patterns, and transforming complex datasets into meaningful business insights. I enjoy working with data, asking the right questions, and discovering the stories hidden behind numbers.\n\nSkilled in SQL, Python, Power BI, Excel, and database systems, I focus on data cleaning, analysis, visualization, and building interactive dashboards that support smarter decision-making. Currently gaining practical industry exposure through my internship at TAP Academy, where I continue to strengthen my analytical and technical skills.\n\nI'm constantly curious about how data drives business decisions and passionate about developing solutions that turn raw information into actionable insights. My goal is to grow as a Data Analyst and make a meaningful impact through data-driven thinking.",
  highlights: ["SQL", "Python", "Power BI", "Excel", "database systems", "TAP Academy"],
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
    {
      id: "project-2",
      number: "03",
      title: ["ROAD ACCIDENT", "ANALYSIS DASHBOARD"],
      category: "Data Analytics | Power BI | Numpy | Pandas",
      tags: ["Power BI", "Data Analytics", "Data Visualization", "DAX"],
      description:
        "An interactive Power BI dashboard developed to analyze road accident trends, casualties, and contributing factors. It provides insights into accident severity, road types, weather conditions, lighting conditions, accident timings, and geographical patterns to help identify road safety trends and support data-driven decisions.",
      primaryBtnLabel: "VIEW DASHBOARD",
      hasDashboardModal: true,
      githubUrl: "https://github.com/bharathi3115",
      images: [
        {
          id: "road-accident-overview",
          label: "Accident Overview",
          title: "Accident Overview & Trends",
          description:
            "Key metrics on total accidents (2M), casualties (2M), vehicles (3M), fatal accidents (26K), along with yearly trends, day-of-week distribution, and accident severity.",
        },
        {
          id: "road-accident-environment",
          label: "Road & Environment",
          title: "Road & Environmental Analysis",
          description:
            "Accidents by road type, weather conditions, urban vs rural area distribution, light conditions, and time of day breakdown.",
        },
        {
          id: "road-accident-casualty-analysis",
          label: "Surface & Casualty",
          title: "Road Surface & Casualty Analysis",
          description:
            "Accident distribution by road surface conditions, casualties by accident severity, and the relationship between vehicles, accidents, and casualties.",
        },
      ],
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
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || "",
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "",
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "",
  autoReplyTemplateId: import.meta.env.VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID || "",
};
