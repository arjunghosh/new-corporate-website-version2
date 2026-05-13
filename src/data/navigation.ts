export interface NavLink {
  label: string;
  href: string;
}

export const navLinks: NavLink[] = [
  { label: 'Approach', href: '/approach' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Platforms', href: '/platforms' },
  { label: 'Trust & Security', href: '/trust-security' },
  { label: 'Insights', href: '/insights' },
  { label: 'About', href: '/about' },
];

export const navCta: NavLink = {
  label: 'Book the 2-Week Audit',
  href: '/book-audit',
};

export const footerLinks = {
  approach: [
    { label: 'Strategy · Build · Run', href: '/approach' },
    { label: 'FlexiContext™', href: '/context-engineering' },
    { label: 'Trust & Security', href: '/trust-security' },
  ],
  solutions: [
    { label: 'Data Governance', href: '/solutions-data-governance' },
    { label: 'Modern Data Platform', href: '/solutions-modern-data-platform' },
    { label: 'AI & ML Engineering', href: '/solutions-ai-ml-engineering' },
    { label: 'Analytics & BI', href: '/solutions-analytics-bi' },
    { label: 'FlexiAnalyst', href: '/solutions-flexianalyst' },
  ],
  company: [
    { label: 'About', href: '/about' },
    { label: 'Leadership', href: '/leadership' },
    { label: 'Insights', href: '/insights' },
    { label: 'Industries · BFSI', href: '/industries/bfsi' },
    { label: 'Book Audit', href: '/book-audit' },
    { label: 'hello@flexilytics.ai', href: 'mailto:hello@flexilytics.ai' },
  ],
} as const;
