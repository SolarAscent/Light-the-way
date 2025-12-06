export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'Development' | 'Production' | 'Research';
  url?: string;
  tags: string[];
  lastUpdated: string;
}

export interface DocPage {
  id: string;
  title: string;
  content: string; // Markdown supported
  lastEdited: string;
  authorId?: string;
}

export interface ActivityLog {
  date: string;
  hours: number;
  commits: number;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  WIKI = 'WIKI',
  ACTIVITY = 'ACTIVITY',
  SETTINGS = 'SETTINGS',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'editor' | 'viewer';
  contributionScore: number;
}

export interface ChangeRequest {
  id: string;
  docId: string;
  docTitle: string;
  userId: string;
  userName: string;
  proposedContent: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface FileSystemNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
  source: 'local' | 'nas' | 'api' | 'cloud';
  size?: string; // e.g. "2.4 MB"
  uploadDate?: string;
  children?: FileSystemNode[];
}

export interface SystemLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  status: 'Success' | 'Warning' | 'Error';
}