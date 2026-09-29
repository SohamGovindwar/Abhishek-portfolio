import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { ArrowDown, ArrowUpRight, Award, BriefcaseBusiness, Check, ChevronDown, Clipboard, ExternalLink, FileText, GraduationCap, Linkedin, Mail, MapPin, Menu, Moon, Phone, Send, Settings2, ShieldCheck, Sparkles, Sun, X, Zap } from 'lucide-react';
import resumePdf from '@assets/Abhishek_Govindwar_Resume_Color_1790678090758.pdf';

type Project = {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
  tags: string[];
  detail: string;
  bullets: string[];
  impact: string;
};

const navItems = [
  { id: 'about', label: 'Profile' },
  { id: 'capabilities', label: 'Capabilities' },
  { id: 'work', label: 'Selected work' },
  { id: 'experience', label: 'Experience' },
  { id: 'credentials', label: 'Credentials' },
  { id: 'contact', label: 'Contact' },
];

const projects: Project[] = [
  {
    id: 'salesforce-delivery',
    eyebrow: 'Salesforce implementation',
    title: 'Implementation that holds up after go-live',
    summary: 'Enterprise client onboarding, upgrades, consulting engagements, and post-launch support across Salesforce environments.',
    tags: ['Flows', 'Apex', 'Triggers', 'Security', 'Omni-Channel'],
    detail: 'Translated business requirements into scalable Salesforce solutions, then carried the work through delivery, administration, and adoption.',
    bullets: [
      'Managed administration for 75+ client organizations, including user provisioning, permissions, security, and sandbox/environment configuration.',
      'Built reusable delivery templates for recurring client use cases and supported approximately 50 technical support tickets.',
      'Worked across Service Cloud and Omni-Channel implementations with consistent, high-quality delivery.',
    ],
    impact: '250+ projects delivered with about 85% completed on schedule.',
  },
  {
    id: 'ai-enabled-delivery',
    eyebrow: 'AI-enabled delivery',
    title: 'Practical AI for faster solution delivery',
    summary: 'Client-facing AI voice and chat bot builds paired with prompt engineering, documentation, and careful human review.',
    tags: ['Agentforce', 'Custom GPTs', 'Claude', 'ChatGPT', 'Prompt engineering'],
    detail: 'Used AI as a delivery multiplier without losing the discipline of requirements, validation, and clear client documentation.',
    bullets: [
      'Built and deployed AI voice and chat bots, including Agentforce work with Omni-Channel for Service Cloud.',
      'Built a custom GPT and used ChatGPT to generate and refine prompts for client AI bots.',
      'Used Claude for project plans, solution designs, and technical documentation; used Claude Code to automate recurring daily tasks.',
    ],
    impact: '10+ reusable templates created to standardize delivery and reduce per-project effort.',
  },
];

const skillGroups = [
  { title: 'Salesforce delivery', icon: Settings2, items: ['Implementation & configuration', 'Administration', 'Flows', 'Apex', 'Triggers', 'Service Cloud', 'Omni-Channel'] },
  { title: 'Governance & operations', icon: ShieldCheck, items: ['Security & permissions', 'User provisioning', 'Sandbox management', 'REST API', 'Data Loader', 'Jira', 'Technical documentation'] },
  { title: 'AI solutions', icon: Sparkles, items: ['Agentforce', 'AI voice & chat bots', 'Prompt engineering', 'Custom GPTs', 'Claude', 'ChatGPT', 'Claude Code'] },
];

const stats = [
  { value: 250, suffix: '+', label: 'projects delivered' },
  { value: 85, suffix: '%', prefix: '~', label: 'completed on schedule' },
  { value: 75, suffix: '+', label: 'client organizations' },
  { value: 10, suffix: '+', label: 'reusable templates' },
];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function App() {
  const [dark, setDark] = useState(() => localStorage.getItem('abhishek-theme') === 'dark');
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const [copied, setCopied] = useState(false);
  const [filter, setFilter] = useState('All');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [experienceOpen, setExperienceOpen] = useState(true);
  const [formState, setFormState] = useState<'idle' | 'success' | 'error'>('idle');
  const [formError, setFormError] = useState('');
  const [, setTouched] = useState<Record<string, boolean>>({});
  const [invalidFields, setInvalidFields] = useState<Record<string, boolean>>({});
  const [countsActive, setCountsActive] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const statsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('abhishek-theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    document.title = 'Abhishek Sanjay Govindwar | Salesforce & AI Delivery';
    const observed = navItems.map(({ id }) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveSection(visible.target.id);
    }, { rootMargin: '-22% 0px -62% 0px', threshold: [0, .15, .4] });
    observed.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!statsRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setCountsActive(true);
        observer.disconnect();
      }
    }, { threshold: .35 });
    observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const filteredProjects = useMemo(() => {
    if (filter === 'All') return projects;
    return projects.filter((project) => filter === 'AI delivery' ? project.id === 'ai-enabled-delivery' : project.id === 'salesforce-delivery');
  }, [filter]);

  const copyEmail = async () => {
    await navigator.clipboard?.writeText('abhishekgovindwar1234@gmail.com');
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const submitContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') ?? '').trim();
    const email = String(form.get('email') ?? '').trim();
    const message = String(form.get('message') ?? '').trim();
    const nextInvalid = {
      name: !name,
      email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      message: !message,
    };
    setTouched({ name: true, email: true, message: true });
    setInvalidFields(nextInvalid);
    if (nextInvalid.name || nextInvalid.email || nextInvalid.message) {
      setFormState('error');
      setFormError('Please add your name, a valid email, and a short message.');
      return;
    }
    setFormState('success');
    setFormError('');
    formRef.current?.reset();
    setTouched({});
    setInvalidFields({});
  };

  return (
    <div className="min-h-[100dvh] overflow-x-hidden bg-background text-foreground transition-colors duration-300">
      <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-5 sm:pt-5">
        <div className="glass-nav section-shell flex h-[64px] items-center justify-between rounded-2xl border border-border/80 px-3 sm:h-[72px] sm:px-4">
          <button data-testid="button-brand-home" onClick={() => scrollToId('top')} className="group flex min-h-11 items-center gap-3 text-left">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-[0_8px_24px_hsl(var(--primary)/.2)] transition duration-300 group-hover:-rotate-3 group-hover:scale-105">
              <span className="font-display text-sm font-bold">ASG</span>
            </span>
            <span className="hidden sm:block">
              <span className="block font-display text-[13px] font-bold tracking-tight">Abhishek Govindwar</span>
              <span className="font-mono-app text-[9px] uppercase tracking-[.16em] text-muted-foreground">Salesforce · AI delivery</span>
            </span>
          </button>
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
            {navItems.map((item) => (
              <button data-testid={`nav-${item.id}`} key={item.id} onClick={() => scrollToId(item.id)} className={`rounded-full px-3 py-2 text-[11px] font-semibold transition duration-300 ${activeSection === item.id ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
                {item.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button data-testid="button-theme-toggle" aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} onClick={() => setDark((value) => !value)} className="grid size-10 place-items-center rounded-full border border-border bg-card/80 text-muted-foreground transition duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary">
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button data-testid="button-mobile-menu" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)} className="relative z-50 grid size-10 place-items-center rounded-full border border-border bg-card/80 lg:hidden">
              {menuOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>
        <div className={`fixed inset-0 top-0 -z-10 bg-[hsl(var(--background)/.97)] backdrop-blur-2xl transition duration-300 lg:hidden ${menuOpen ? 'translate-x-0 opacity-100' : 'pointer-events-none translate-x-full opacity-0'}`}>
          <nav className="section-shell flex h-full flex-col justify-center gap-2 pt-12" aria-label="Mobile navigation">
            <p className="font-mono-app text-[10px] uppercase tracking-[.22em] text-primary">Navigate the practice</p>
            {navItems.map((item, index) => (
              <button data-testid={`mobile-nav-${item.id}`} key={item.id} onClick={() => { scrollToId(item.id); setMenuOpen(false); }} className={`flex min-h-14 items-center justify-between border-b border-border text-left font-display text-3xl font-bold tracking-tight transition ${activeSection === item.id ? 'text-primary' : 'text-foreground hover:text-primary'}`}>
                <span>{item.label}</span><span className="font-mono-app text-xs text-muted-foreground">0{index + 1}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="hero-section site-grid relative isolate overflow-hidden">
          <div className="pointer-events-none absolute left-1/2 top-16 -z-10 size-[min(72vw,780px)] -translate-x-1/2 rounded-full border border-primary/10" />
          <div className="hero-orbit pointer-events-none absolute left-1/2 top-16 -z-10 size-[min(72vw,780px)] -translate-x-1/2 rounded-full border border-dashed border-accent/20" />
          <div className="pointer-events-none absolute -right-40 top-20 -z-10 size-[420px] rounded-full bg-primary/10 blur-3xl" />
          <div className="section-shell grid min-h-[680px] items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.1fr_.9fr] lg:py-28">
            <div className="reveal">
              <div className="mb-7 flex items-center gap-3">
                <span className="h-px w-10 bg-accent" />
                <span className="font-mono-app text-[10px] font-medium uppercase tracking-[.24em] text-primary">Pune, Maharashtra, India</span>
              </div>
              <h1 className="hero-title max-w-4xl font-display font-bold leading-[.91] tracking-[-.075em] text-balance">
                Systems that make <span className="text-primary">adoption</span> feel inevitable.
              </h1>
              <p className="mt-8 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
                I&apos;m <strong className="font-semibold text-foreground">Abhishek Sanjay Govindwar</strong> — a Product Onboarding &amp; Implementation Specialist, Salesforce Administrator, and Agentforce &amp; AI Solutions practitioner.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <button data-testid="button-view-work" onClick={() => scrollToId('work')} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-[0_12px_28px_hsl(var(--primary)/.2)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_32px_hsl(var(--primary)/.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                  Explore selected work <ArrowDown size={16} />
                </button>
                <a data-testid="link-download-resume" href={resumePdf} download="Abhishek_Govindwar_Resume.pdf" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-border bg-card/80 px-5 py-3 text-sm font-bold transition duration-300 hover:-translate-y-1 hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  <FileText size={16} /> Download résumé
                </a>
              </div>
              <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-muted-foreground">
                <a data-testid="link-linkedin-hero" href="https://linkedin.com/in/abhishek-govindwar-b05905213" target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-2 font-semibold transition hover:text-primary"><Linkedin size={15} /> LinkedIn</a>
                <button data-testid="button-copy-email-hero" onClick={copyEmail} className="inline-flex min-h-10 items-center gap-2 font-semibold transition hover:text-primary"><Mail size={15} /> {copied ? 'Email copied' : 'Copy email'}</button>
              </div>
            </div>
            <div className="reveal reveal-delay-2">
              <div className="hero-panel relative overflow-hidden rounded-[2rem] border border-primary/20 bg-[hsl(220_38%_14%)] p-6 text-slate-100 shadow-[0_28px_80px_hsl(218_34%_12%/.2)] sm:p-8">
                <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-primary/25 blur-3xl" />
                <div className="relative">
                  <div className="flex items-center justify-between border-b border-white/10 pb-5">
                    <span className="font-mono-app text-[10px] uppercase tracking-[.22em] text-cyan-200/80">delivery profile / 01</span>
                    <span className="flex items-center gap-1.5 font-mono-app text-[10px] text-amber-200"><span className="size-1.5 animate-pulse rounded-full bg-amber-300" /> CURRENT</span>
                  </div>
                  <div className="py-10 sm:py-12">
                    <p className="font-mono-app text-xs text-cyan-200/70">01 — WHAT I DO</p>
                    <p className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">Translate complexity into momentum.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-5">
                    <div><p className="font-mono-app text-[10px] text-slate-400">FOCUS</p><p className="mt-1 text-sm font-semibold">CRM adoption</p></div>
                    <div><p className="font-mono-app text-[10px] text-slate-400">MODE</p><p className="mt-1 text-sm font-semibold">Build · enable · refine</p></div>
                  </div>
                  <div className="mt-7 flex flex-wrap gap-2">
                    {['Salesforce', 'Agentforce', 'AI delivery'].map((badge, index) => <span data-testid={`badge-tech-${index}`} key={badge} className="rounded-full border border-white/15 bg-white/[.06] px-3 py-2 text-[11px] font-semibold text-cyan-50 transition duration-300 hover:-translate-y-1 hover:border-cyan-200/60 hover:bg-white/10">{badge}</span>)}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 px-2 text-[11px] text-muted-foreground">
                <span className="font-mono-app uppercase tracking-[.14em]">Salesforce × Agentforce</span>
                <span className="inline-flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-emerald-500" /> open to meaningful work</span>
              </div>
            </div>
          </div>
        </section>

        <section ref={statsRef} aria-label="Career metrics" className="border-y border-border bg-card">
          <div className="section-shell grid grid-cols-2 divide-x divide-y divide-border sm:divide-y-0 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div data-testid={`stat-${index}`} key={stat.label} className="px-4 py-6 first:pl-0 sm:px-6 sm:py-8 md:px-8 md:py-9">
                <AnimatedStat active={countsActive} {...stat} />
              </div>
            ))}
          </div>
        </section>

        <section id="about" className="scroll-mt-24 py-24 md:py-32">
          <div className="section-shell grid gap-12 lg:grid-cols-[.72fr_1.28fr] lg:gap-24">
            <SectionHeading number="01" label="Profile" title={<>Calm in the handoff.<br /><span className="text-primary">Sharp in the details.</span></>} />
            <div className="max-w-2xl">
              <p className="text-xl font-medium leading-8 text-foreground">I work where products, processes, and people meet.</p>
              <p className="mt-6 leading-8 text-muted-foreground">At SMS Magic, I deliver Salesforce implementations and client onboarding from requirements through post-launch support. My work spans configuration, administration, automation, security, user provisioning, and sandbox management — always with the end user&apos;s next step in mind.</p>
              <p className="mt-5 leading-8 text-muted-foreground">Alongside the CRM work, I build practical AI-enabled delivery systems: Agentforce experiences, AI voice and chat bots, prompt systems, custom GPTs, and documentation workflows with Claude and ChatGPT. The throughline is simple: make complex systems easier to adopt and easier to run.</p>
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                <Fact label="Based in" value="Pune, Maharashtra, India" icon={MapPin} />
                <Fact label="Education" value="B.Tech Computer Science · 2022" icon={GraduationCap} />
                <Fact label="Recognized for" value="On-time, high-quality delivery" icon={Award} />
                <Fact label="Team impact" value="Mentored 10 new hires" icon={BriefcaseBusiness} />
              </div>
            </div>
          </div>
        </section>

        <section id="capabilities" className="scroll-mt-24 border-t border-border bg-muted/40 py-24 md:py-32">
          <div className="section-shell">
            <SectionHeading number="02" label="Capabilities" title={<>The stack behind<br /><span className="text-primary">the outcome.</span></>} />
            <div className="mt-14 grid gap-5 lg:grid-cols-3">
              {skillGroups.map((group, index) => {
                const Icon = group.icon;
                return <article data-testid={`capability-card-${index}`} key={group.title} className={`shine-card rounded-2xl border border-border bg-card p-6 shadow-[0_14px_40px_hsl(218_34%_12%/.04)] transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_22px_50px_hsl(var(--primary)/.1)] ${index === 1 ? 'lg:translate-y-8' : ''}`}>
                  <div className="flex items-start justify-between"><span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary"><Icon size={19} /></span><span className="font-mono-app text-[10px] text-muted-foreground">0{index + 1}</span></div>
                  <h3 className="mt-8 font-display text-xl font-bold">{group.title}</h3>
                  <div className="mt-5 flex flex-wrap gap-2">{group.items.map((item) => <span data-testid={`skill-${item.toLowerCase().replaceAll(' ', '-')}`} key={item} className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground">{item}</span>)}</div>
                </article>;
              })}
            </div>
            <div className="mt-20 grid gap-4 rounded-2xl border border-primary/20 bg-primary/[.06] p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
              <div><p className="font-mono-app text-[10px] uppercase tracking-[.2em] text-primary">delivery principle</p><p className="mt-3 font-display text-xl font-bold">Good implementation is not just configured. It is understood.</p></div>
              <span className="font-mono-app text-xs text-muted-foreground">requirements → solution → enablement</span>
            </div>
          </div>
        </section>

        <section id="work" className="scroll-mt-24 py-24 md:py-32">
          <div className="section-shell">
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <SectionHeading number="03" label="Selected work" title={<>Delivery with a<br /><span className="text-primary">clear point of view.</span></>} />
              <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter selected work">
                {['All', 'Salesforce', 'AI delivery'].map((item) => <button data-testid={`filter-${item.toLowerCase().replace(' ', '-')}`} role="tab" aria-selected={filter === item} key={item} onClick={() => setFilter(item)} className={`min-h-11 rounded-full border px-4 py-2 text-xs font-bold transition duration-300 ${filter === item ? 'border-primary bg-primary text-primary-foreground shadow-sm' : 'border-border bg-card text-muted-foreground hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary'}`}>{item}</button>)}
              </div>
            </div>
            <div className="mt-14 space-y-5">
              {filteredProjects.map((project, index) => {
                const isExpanded = expanded === project.id;
                return <article data-testid={`project-card-${project.id}`} key={project.id} className="group overflow-hidden rounded-2xl border border-border bg-card transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_18px_48px_hsl(var(--primary)/.08)]">
                  <button data-testid={`button-expand-${project.id}`} aria-expanded={isExpanded} onClick={() => setExpanded(isExpanded ? null : project.id)} className="grid min-h-11 w-full gap-7 p-6 text-left md:grid-cols-[80px_1fr_auto] md:p-8">
                    <span className="font-mono-app text-xs text-primary">0{index + 1} / 02</span>
                    <span><span className="font-mono-app text-[10px] uppercase tracking-[.2em] text-muted-foreground">{project.eyebrow}</span><span className="mt-3 block font-display text-2xl font-bold tracking-tight md:text-3xl">{project.title}</span><span className="mt-3 block max-w-2xl text-sm leading-6 text-muted-foreground">{project.summary}</span><span className="mt-5 flex flex-wrap gap-2">{project.tags.map((tag) => <span key={tag} className="rounded-md bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">{tag}</span>)}</span></span>
                    <span className={`mt-1 grid size-10 place-items-center self-start rounded-full border border-border text-muted-foreground transition duration-300 ${isExpanded ? 'rotate-180 border-primary text-primary' : 'group-hover:border-primary/50 group-hover:text-primary'}`}><ChevronDown size={17} /></span>
                  </button>
                  <div className={`grid transition-[grid-template-rows,opacity] duration-300 ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}><div className="min-h-0 overflow-hidden"><div className="grid gap-8 border-t border-border bg-muted/25 px-6 py-7 md:grid-cols-[1fr_.8fr] md:px-[calc(80px+2rem)] md:py-8">
                    <div><p className="text-sm leading-7 text-muted-foreground">{project.detail}</p><ul className="mt-5 space-y-3">{project.bullets.map((bullet) => <li key={bullet} className="flex gap-3 text-sm leading-6 text-muted-foreground"><Check size={16} className="mt-1 shrink-0 text-primary" />{bullet}</li>)}</ul></div>
                    <div className="rounded-xl border border-primary/20 bg-card p-5"><p className="font-mono-app text-[10px] uppercase tracking-[.18em] text-primary">documented impact</p><p className="mt-3 font-display text-xl font-bold leading-7">{project.impact}</p></div>
                  </div></div></div>
                </article>;
              })}
            </div>
          </div>
        </section>

        <section id="experience" className="scroll-mt-24 border-y border-border bg-[hsl(220_38%_14%)] py-24 text-slate-100 md:py-32">
          <div className="section-shell grid gap-14 lg:grid-cols-[.72fr_1.28fr] lg:gap-24">
            <div><p className="font-mono-app text-[10px] uppercase tracking-[.22em] text-cyan-200/70">04 / Experience</p><h2 className="mt-5 font-display text-4xl font-bold leading-tight tracking-[-.04em] md:text-5xl">One role.<br /><span className="text-cyan-300">Many surfaces.</span></h2><p className="mt-6 max-w-sm leading-7 text-slate-300">A product onboarding role with the range of an implementation, admin, solutions, and enablement practice.</p></div>
            <div className="relative border-l border-white/15 pl-7 md:pl-10">
              <span className="absolute -left-[5px] top-1 size-2 rounded-full bg-accent ring-4 ring-accent/15" />
              <button data-testid="button-toggle-experience" aria-expanded={experienceOpen} onClick={() => setExperienceOpen((value) => !value)} className="flex min-h-11 w-full flex-wrap items-center justify-between gap-2 text-left">
                <span className="font-display text-2xl font-bold">SMS Magic</span><span className="font-mono-app text-[10px] text-cyan-200/70">09/2023 — PRESENT <ChevronDown className={`ml-2 inline transition duration-300 ${experienceOpen ? 'rotate-180' : ''}`} size={15} /></span>
              </button>
              <p className="mt-2 text-sm font-medium text-cyan-200">Product Onboarding &amp; Implementation Specialist · Pune, India</p>
              <div className={`grid transition-[grid-template-rows,opacity] duration-300 ${experienceOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}><div className="min-h-0 overflow-hidden"><div className="mt-8 space-y-4 text-sm leading-7 text-slate-300">
                <p><strong className="text-slate-100">Delivered</strong> 250+ projects including Salesforce implementations, client onboarding, upgrades, consulting engagements, and AI voice and chat bot builds.</p>
                <p><strong className="text-slate-100">Built</strong> 10+ reusable templates, deployed Agentforce with Omni-Channel for Service Cloud, and managed administration for 75+ client organizations.</p>
                <p><strong className="text-slate-100">Earned</strong> 20+ CSATs and AppExchange recommendations; resolved delivery and implementation issues on approximately 50 support tickets.</p>
                <p><strong className="text-slate-100">Mentored</strong> and trained 10 new hires, while creating training materials and custom documentation to support product adoption.</p>
              </div>
              <div className="mt-10 flex flex-wrap gap-2">{['Requirements', 'Solution design', 'Project planning', 'Technical training', 'Post-launch support'].map((item) => <span key={item} className="rounded-full border border-white/15 px-3 py-1.5 text-[11px] text-slate-300 transition hover:border-cyan-200/60 hover:text-cyan-100">{item}</span>)}</div></div></div>
            </div>
          </div>
        </section>

        <section id="credentials" className="scroll-mt-24 py-24 md:py-32">
          <div className="section-shell">
            <SectionHeading number="05" label="Credentials" title={<>Proof, not<br /><span className="text-primary">performance.</span></>} />
            <div className="mt-14 grid gap-5 lg:grid-cols-[1fr_.75fr]">
              <div className="rounded-2xl border border-border bg-card p-6 md:p-8"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-accent/20 text-accent-foreground"><Award size={19} /></span><h3 className="font-display text-xl font-bold">Certifications</h3></div><div className="mt-7 grid gap-3 sm:grid-cols-2">{['Salesforce Platform Administrator', 'Salesforce AI Associate', 'Salesforce Agentforce Specialist', 'Claude Code 101', 'AI Fluency: Framework and Foundations'].map((item, index) => <div data-testid={`certification-${index}`} key={item} tabIndex={0} className="shine-card group rounded-xl border border-border bg-background p-4 transition duration-300 hover:-translate-y-1 hover:rotate-[.5deg] hover:border-primary/50 hover:shadow-[0_14px_28px_hsl(var(--primary)/.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><div className="flex items-start justify-between gap-3"><span className="text-sm font-semibold leading-5">{item}</span><span className="font-mono-app text-[10px] text-primary">0{index + 1}</span></div><span className="mt-5 block text-[10px] uppercase tracking-[.16em] text-muted-foreground transition group-hover:text-primary">Verified credential</span></div>)}</div></div>
              <div className="rounded-2xl border border-border bg-muted/40 p-6 md:p-8"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary"><Zap size={19} /></span><h3 className="font-display text-xl font-bold">Awards &amp; recognition</h3></div><div className="mt-7 space-y-4"><Recognition title="Q2 2025 Rewards & Recognition" detail="Onboarding & Implementation Team, SMS Magic — recognized for on-time, high-quality delivery." /><Recognition title="Proactive Excellence in Project Implementation" detail="SMS Magic, 2024 — recognized for initiative, ownership, and improved implementation efficiency." /></div></div>
            </div>
            <div className="mt-5 flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 md:flex-row md:items-center md:justify-between md:p-8"><div className="flex gap-4"><GraduationCap className="mt-1 shrink-0 text-primary" size={22} /><div><p className="font-mono-app text-[10px] uppercase tracking-[.2em] text-muted-foreground">education</p><p className="mt-2 font-display text-xl font-bold">B.Tech, Computer Science</p><p className="mt-1 text-sm text-muted-foreground">St. Mary&apos;s Group of Institutions, Hyderabad, Telangana · 2022</p></div></div><span className="font-mono-app text-xs text-primary">GRADUATED / 2022</span></div>
          </div>
        </section>

        <section id="contact" className="scroll-mt-24 border-t border-border bg-muted/40 py-24 md:py-32">
          <div className="section-shell grid gap-14 lg:grid-cols-[.85fr_1.15fr] lg:gap-24">
            <div><SectionHeading number="06" label="Contact" title={<>Let&apos;s make the<br /><span className="text-primary">next system clearer.</span></>} /><p className="mt-7 max-w-md leading-7 text-muted-foreground">For Salesforce implementation, product onboarding, Agentforce, or AI-enabled delivery work, reach out directly.</p><div className="mt-9 space-y-4"><a data-testid="link-contact-email" href="mailto:abhishekgovindwar1234@gmail.com" className="flex min-h-10 items-center gap-3 text-sm font-semibold transition hover:text-primary"><Mail size={17} className="text-primary" /> abhishekgovindwar1234@gmail.com</a><a data-testid="link-contact-phone" href="tel:+917448270375" className="flex min-h-10 items-center gap-3 text-sm font-semibold transition hover:text-primary"><Phone size={17} className="text-primary" /> +91 74482 70375</a><a data-testid="link-contact-linkedin" href="https://linkedin.com/in/abhishek-govindwar-b05905213" target="_blank" rel="noreferrer" className="flex min-h-10 items-center gap-3 text-sm font-semibold transition hover:text-primary"><Linkedin size={17} className="text-primary" /> linkedin.com/in/abhishek-govindwar-b05905213 <ExternalLink size={13} /></a></div></div>
            <form ref={formRef} onSubmit={submitContact} className="rounded-2xl border border-border bg-card p-6 shadow-[0_18px_50px_hsl(218_34%_12%/.05)] md:p-8" noValidate>
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Name" name="name" placeholder=" " testId="input-contact-name" invalid={invalidFields.name} onBlur={() => setTouched((value) => ({ ...value, name: true }))} />
                <Field label="Email" name="email" type="email" placeholder=" " testId="input-contact-email" invalid={invalidFields.email} onBlur={() => setTouched((value) => ({ ...value, email: true }))} />
              </div>
              <div className="mt-6"><Field label="Message" name="message" placeholder=" " testId="input-contact-message" textarea invalid={invalidFields.message} onBlur={() => setTouched((value) => ({ ...value, message: true }))} /></div>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4"><button data-testid="button-send-message" type="submit" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"><Send size={15} /> Send message</button>{formState === 'success' && <p data-testid="status-contact-success" className="flex animate-[reveal_.4s_ease-out] items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400"><Check size={15} /> Thanks — your message is ready to send.</p>}{formState === 'error' && <p data-testid="status-contact-error" role="alert" className="text-xs font-semibold text-destructive">{formError}</p>}</div>
              <p className="mt-5 text-[11px] leading-5 text-muted-foreground">This form validates your message locally. For a direct response, email Abhishek using the address above.</p>
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-card py-8">
        <div className="section-shell flex flex-col justify-between gap-5 text-xs text-muted-foreground sm:flex-row sm:items-center"><p>© {new Date().getFullYear()} Abhishek Sanjay Govindwar</p><div className="flex items-center gap-5"><button data-testid="button-copy-email-footer" onClick={copyEmail} className="inline-flex min-h-10 items-center gap-2 transition hover:text-primary"><Clipboard size={14} /> {copied ? 'Copied' : 'Copy email'}</button><button data-testid="button-back-to-top" onClick={() => scrollToId('top')} className="inline-flex min-h-10 items-center gap-2 font-semibold text-foreground transition hover:text-primary">Back to top <ArrowUpRight size={14} /></button></div></div>
      </footer>
    </div>
  );
}

function SectionHeading({ number, label, title }: { number: string; label: string; title: ReactNode }) {
  return <div><p className="font-mono-app text-[10px] uppercase tracking-[.22em] text-primary">{number} / {label}</p><h2 className="mt-5 font-display text-4xl font-bold leading-[1.02] tracking-[-.055em] md:text-5xl">{title}</h2></div>;
}

function Fact({ label, value, icon: Icon }: { label: string; value: string; icon: typeof MapPin }) {
  return <div className="flex gap-3 border-t border-border pt-4"><Icon size={16} className="mt-0.5 shrink-0 text-primary" /><div><p className="font-mono-app text-[10px] uppercase tracking-[.15em] text-muted-foreground">{label}</p><p className="mt-1 text-sm font-semibold">{value}</p></div></div>;
}

function AnimatedStat({ value, suffix, prefix = '', label, active }: { value: number; suffix: string; prefix?: string; label: string; active: boolean }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!active) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setDisplay(value);
      return;
    }
    let current = 0;
    const step = Math.max(1, Math.ceil(value / 26));
    const timer = window.setInterval(() => {
      current = Math.min(value, current + step);
      setDisplay(current);
      if (current >= value) window.clearInterval(timer);
    }, 32);
    return () => window.clearInterval(timer);
  }, [active, value]);

  return <><p className="font-display text-3xl font-bold tracking-tight text-primary md:text-4xl">{prefix}{display}{suffix}</p><p className="mt-1 max-w-[140px] text-xs leading-5 text-muted-foreground">{label}</p></>;
}

function Recognition({ title, detail }: { title: string; detail: string }) {
  return <article tabIndex={0} className="shine-card rounded-xl border border-border bg-card p-5 transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_14px_30px_hsl(var(--primary)/.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><p className="font-semibold">{title}</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{detail}</p></article>;
}

function Field({ label, name, type = 'text', placeholder, testId, textarea = false, invalid, onBlur }: { label: string; name: string; type?: string; placeholder: string; testId: string; textarea?: boolean; invalid?: boolean; onBlur: () => void }) {
  const Tag = textarea ? 'textarea' : 'input';
  const inputClass = `w-full rounded-xl border ${invalid ? 'border-destructive' : 'border-input'} bg-background px-4 pb-3 pt-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15`;
  return <div className="field-shell">{textarea ? <Tag id={testId} data-testid={testId} aria-label={label} aria-invalid={invalid} name={name} rows={5} placeholder={placeholder} onBlur={onBlur} className={`${inputClass} resize-none`} /> : <Tag id={testId} data-testid={testId} aria-label={label} aria-invalid={invalid} name={name} type={type} placeholder={placeholder} onBlur={onBlur} className={inputClass} />}<label htmlFor={testId}>{label}</label>{invalid ? <span className="mt-1 block text-[11px] text-destructive">{name === 'email' ? 'Enter a valid email address.' : `${label} is required.`}</span> : null}</div>;
}

export default App;