export interface RosterMember {
  id: string;
  name: string;
  email: string;
  position: string;
  avatarUrl: string;
  roleType: 'Head' | 'Lead' | 'Member';
  employmentType: 'Permanent' | 'Contract';
}

export const PLACEHOLDER_ROSTER: RosterMember[] = [
  {
    id: 'm1',
    name: 'Heman',
    email: 'heman@company.com',
    position: 'Director of Engineering',
    roleType: 'Head',
    employmentType: 'Permanent',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=heman',
  },
  {
    id: 'm2',
    name: 'Nick',
    email: 'nick@company.com',
    position: 'Lead Frontend Engineer',
    roleType: 'Lead',
    employmentType: 'Permanent',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nick',
  },
  {
    id: 'm3',
    name: 'Jason',
    email: 'jason@company.com',
    position: 'Senior Frontend Developer',
    roleType: 'Member',
    employmentType: 'Permanent',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jason',
  },
  {
    id: 'm4',
    name: 'Issy',
    email: 'issy@company.com',
    position: 'UI/UX Designer',
    roleType: 'Member',
    employmentType: 'Permanent',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=issy',
  },
  {
    id: 'm5',
    name: 'Glenn',
    email: 'glenn@company.com',
    position: 'Fullstack Engineer',
    roleType: 'Member',
    employmentType: 'Contract',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=glenn',
  },
];

export const PLACEHOLDER_SCOPES = [
  {
    title: 'Infrastructure Management',
    desc: 'Cloud platforms, container networks, deployment pipeline scaling, and system uptime checks.',
  },
  {
    title: 'Application Development',
    desc: 'Building custom client tools, web portals, and system component modernizations.',
  },
  {
    title: 'Data Synchronization',
    desc: 'Maintaining real-time calculations and updates across downstream business models.',
  },
];

export const ROLE_WEIGHTS = { Head: 1, Lead: 2, Member: 3 } as const;
