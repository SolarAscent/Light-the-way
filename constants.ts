import { Project, DocPage, ActivityLog, User, SystemLog, FileSystemNode, ChangeRequest } from './types';
import { Book, Activity, Box, LayoutGrid, ShieldCheck, Database } from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'DASHBOARD', label: 'Dashboard', icon: LayoutGrid },
  { id: 'WIKI', label: 'Knowledge Base', icon: Book },
  { id: 'ACTIVITY', label: 'Growth & Stats', icon: Activity },
  { id: 'SETTINGS', label: 'Resources & NAS', icon: Database },
  { id: 'ADMIN', label: 'Admin Console', icon: ShieldCheck, separate: true },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'TransMet Model',
    description: 'Deep learning based prediction of drug metabolism pathways using chemical structure analysis.',
    status: 'Development',
    tags: ['AI', 'Pharma', 'Python'],
    lastUpdated: '2 hours ago',
    url: '#'
  },
  {
    id: '2',
    name: 'Academic Data Hub',
    description: 'A centralized repository for processing and visualizing experimental datasets.',
    status: 'Research',
    tags: ['Data Viz', 'React', 'D3'],
    lastUpdated: '1 day ago'
  },
  {
    id: '3',
    name: 'BioLiterature Scraper',
    description: 'Automated tool to fetch and summarize latest papers from PubMed related to specific proteins.',
    status: 'Production',
    tags: ['Automation', 'NLP'],
    lastUpdated: '5 days ago'
  }
];

export const INITIAL_DOCS: DocPage[] = [
  {
    id: 'root',
    title: 'Introduction',
    content: '# Welcome to Nexus\n\nThis is your personal academic growth platform. Use the sidebar to navigate between your projects and documentation.\n\n## Goals\n- Track development of TransMet\n- Document research findings\n- Monitor coding activity\n\n## Math Example\nWe can render LaTeX equations easily:\n\n$$ E = mc^2 $$\n\nAnd inline math like $a^2 + b^2 = c^2$.',
    lastEdited: new Date().toISOString()
  },
  {
    id: 'transmet-docs',
    title: 'TransMet Architecture',
    content: '# TransMet Architecture\n\nThe model consists of a Graph Neural Network (GNN) for molecular encoding followed by a transformer decoder.\n\n## Key Components\n1. Input Processing\n2. Encoder Layers\n3. Prediction Head\n\n$$ \\mathcal{L} = -\\sum_{i=1}^N y_i \\log(\\hat{y}_i) $$',
    lastEdited: new Date().toISOString()
  },
  {
    id: 'research-notes',
    title: 'Research Notes',
    content: '# Weekly Sync\n\nDiscussed the new dataset integration. Need to clean the labels for enzyme types CYP450.',
    lastEdited: new Date().toISOString()
  }
];

export const MOCK_ACTIVITY_DATA: ActivityLog[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  return {
    date: date.toISOString().split('T')[0],
    hours: Math.random() * 5,
    commits: Math.floor(Math.random() * 10)
  };
});

export const MOCK_USERS: User[] = [
  { 
    id: '1', 
    name: 'Dr. John Doe', 
    email: 'john@mit.edu', 
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    role: 'admin', 
    contributionScore: 1250 
  },
  { 
    id: '2', 
    name: 'Sarah Smith', 
    email: 'sarah@lab.org', 
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    role: 'editor', 
    contributionScore: 890 
  },
  { 
    id: '3', 
    name: 'Mike Johnson', 
    email: 'mike@student.edu', 
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    role: 'viewer', 
    contributionScore: 320 
  },
];

export const MOCK_LOGS: SystemLog[] = [
  { id: '101', action: 'Project Created: TransMet', user: 'John Doe', timestamp: '10:42 AM', status: 'Success' },
  { id: '102', action: 'Failed Login Attempt', user: 'Unknown', timestamp: '09:15 AM', status: 'Warning' },
  { id: '103', action: 'NAS Synced: /data/biology', user: 'System', timestamp: '03:00 AM', status: 'Success' },
];

export const MOCK_FILE_SYSTEM: FileSystemNode[] = [
  {
    id: 'nas-1',
    name: 'Lab NAS Storage',
    type: 'folder',
    source: 'nas',
    size: '1.2 TB',
    children: [
      { id: 'f1', name: 'datasets_2023.csv', type: 'file', source: 'nas', size: '450 MB', uploadDate: '2023-10-15' },
      { id: 'f2', name: 'microscope_images', type: 'folder', source: 'nas', size: '800 GB', children: [] }
    ]
  },
  {
    id: 'cloud-1',
    name: 'Cloud Uploads',
    type: 'folder',
    source: 'cloud',
    size: '15 MB',
    children: [
      { id: 'c1', name: 'presentation_draft.pdf', type: 'file', source: 'cloud', size: '5 MB', uploadDate: '2023-10-20' },
      { id: 'c2', name: 'lab_logo.png', type: 'file', source: 'cloud', size: '2 MB', uploadDate: '2023-10-21' }
    ]
  },
  {
    id: 'api-1',
    name: 'PubMed API Stream',
    type: 'folder',
    source: 'api',
    size: 'N/A',
    children: [
      { id: 'a1', name: 'recent_queries.json', type: 'file', source: 'api', size: '12 KB', uploadDate: '2023-10-24' }
    ]
  }
];

export const MOCK_CHANGE_REQUESTS: ChangeRequest[] = [
  {
    id: 'cr-1',
    docId: 'transmet-docs',
    docTitle: 'TransMet Architecture',
    userId: '2',
    userName: 'Sarah Smith',
    proposedContent: '# TransMet Architecture v2\nUpdated with Transformer-XL backbone...',
    timestamp: '2023-10-25T14:30:00Z',
    status: 'pending'
  }
];