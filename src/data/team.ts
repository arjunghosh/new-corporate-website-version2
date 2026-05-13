export interface TeamMember {
  name: string;
  role: string;
  years: string;
  bio: string;
  photo: string;
  linkedin: string;
  prior: string[];
}

export const founders: TeamMember[] = [
  {
    name: 'Ankush Shah',
    role: 'CEO & Founder',
    years: '24+ years',
    bio: 'Twenty-four years as a data partner to large BFSI and manufacturing enterprises, globally. Columbia Business School. ICF-certified Leadership Coach.',
    photo: '/assets/team/ankush.jpeg',
    linkedin: 'https://www.linkedin.com/in/ankushshah/',
    prior: ['Delta Technologies', 'Exponentia.ai'],
  },
  {
    name: 'Vishal Dhure',
    role: 'COO & CRO',
    years: '26 years',
    bio: 'Twenty-six years inside tier-one global IT services firms, leading large data and analytics delivery programs. Owns the commercial engine and delivery operations.',
    photo: '/assets/team/vishal.jpeg',
    linkedin: 'https://www.linkedin.com/in/vishaldhure/',
    prior: ['Tech Mahindra', 'Polestar Solutions'],
  },
  {
    name: 'Arun Bhatia',
    role: 'Chief Tech Program Manager',
    years: '33 years',
    bio: 'Thirty-three years inside tier-one IT services and product companies as a BI and data-architecture specialist. He predates the modern lakehouse by a decade.',
    photo: '/assets/team/arun.png',
    linkedin: 'https://www.linkedin.com/in/bhatiaarun/',
    prior: ['HP', 'DXC Technology', 'LTIMindtree'],
  },
  {
    name: 'Arjun Ghosh',
    role: 'Chief AI & Tech Officer',
    years: '22+ years',
    bio: 'Twenty-two years across tier-one global IT services firms, leading enterprise AI and digital-transformation programs. XLRI · IIM Kozhikode · Cornell (Chief AI Officer programme).',
    photo: '/assets/team/arjun.jpeg',
    linkedin: 'https://www.linkedin.com/in/arjunghosh/',
    prior: ['Accenture', 'EY'],
  },
];
