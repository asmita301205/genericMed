export type ActiveTab = 'app' | 'architecture' | 'prd' | 'photos';

export interface PrdSection {
  id: string;
  number: string;
  title: string;
  summary: string;
  content: {
    subtitle?: string;
    paragraphs?: string[];
    bullets?: string[];
    table?: {
      headers: string[];
      rows: string[][];
    };
  }[];
}

export interface ArchitectureNode {
  id: string;
  layer: 'client' | 'gateway' | 'services' | 'storage' | 'external';
  title: string;
  subtitle: string;
  description: string;
  tech: string[];
  responsibilities: string[];
  protocol: string;
}

export interface ArchitectureConnection {
  from: string;
  to: string;
  label: string;
  type: 'sync' | 'async' | 'asset';
}

export interface AppScreen {
  id: string;
  name: string;
  category: 'dashboard' | 'detail' | 'editor' | 'analytics';
  description: string;
  badge: string;
  imageUrl?: string;
  fallbackIcon: string;
  features: string[];
  status: 'Ready' | 'In Review' | 'Draft';
}

export interface HotlinkAsset {
  id: string;
  url: string;
  title: string;
  screenTarget: string;
  timestamp: string;
  status: 'active' | 'error' | 'loading';
  dimensions?: string;
}
