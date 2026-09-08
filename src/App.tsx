import React, { useState } from 'react';
import { ActiveTab, AppScreen, HotlinkAsset } from './types';
import { CoreAppLayout } from './components/CoreAppLayout';
import { ArchitectureDiagram } from './components/ArchitectureDiagram';
import { PrdViewer } from './components/PrdViewer';
import { HotlinkStudio } from './components/HotlinkStudio';
import {
  LayoutDashboard,
  Network,
  FileText,
  Image as ImageIcon,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

const INITIAL_SCREENS: AppScreen[] = [
  {
    id: 'screen-dashboard',
    name: 'Executive Workspace Dashboard',
    category: 'dashboard',
    description: 'Central operational hub showcasing key metrics, active system status, and screen navigation.',
    badge: 'SCR-01',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    fallbackIcon: 'LayoutDashboard',
    features: [
      'Multi-metric KPI summary grid with live trends',
      'Unified screen gallery with status indicators',
      'Interactive responsive viewport simulator',
      'Direct navigation to architecture and PRD specifications'
    ],
    status: 'Ready'
  },
  {
    id: 'screen-detail',
    name: 'Product & Visual Specification Canvas',
    category: 'detail',
    description: 'In-depth visual workbench displaying screen component breakdown, styling tokens, and layout math.',
    badge: 'SCR-02',
    imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    fallbackIcon: 'Layers',
    features: [
      'Mathematical spacing and border radius calculator',
      'Color contrast and WCAG 2.1 AA accessibility audit',
      'Hotlinked asset inspect and metadata viewer',
      'Component hierarchy mapping'
    ],
    status: 'Ready'
  },
  {
    id: 'screen-analytics',
    name: 'System Telemetry & Ingress Analytics',
    category: 'analytics',
    description: 'Live operational throughput, p99 latency metrics, and network connection diagnostics.',
    badge: 'SCR-03',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    fallbackIcon: 'TrendingUp',
    features: [
      'Container Port 3000 ingress traffic monitor',
      'Reverse proxy connection status & error rates',
      'CDN cache hit/miss ratio for external hotlinks',
      'Real-time data flow telemetry'
    ],
    status: 'In Review'
  },
  {
    id: 'screen-settings',
    name: 'System Policies & Security Controls',
    category: 'detail',
    description: 'Frame-ancestors policy, referrer controls, and cloud credential boundary configurations.',
    badge: 'SCR-04',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    fallbackIcon: 'Shield',
    features: [
      'Content Security Policy (CSP) inspection',
      'Referrer-policy enforcement (no-referrer)',
      'Storage synchronization & cache invalidation',
      'Export audit logs & PRD approval history'
    ],
    status: 'Ready'
  }
];

const INITIAL_HOTLINKS: HotlinkAsset[] = [
  {
    id: 'hl-1',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    title: 'Workspace Analytics Screen',
    screenTarget: 'screen-dashboard',
    timestamp: 'Initial Ingestion',
    status: 'active'
  },
  {
    id: 'hl-2',
    url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    title: 'Design Workbench Mockup',
    screenTarget: 'screen-detail',
    timestamp: 'Initial Ingestion',
    status: 'active'
  },
  {
    id: 'hl-3',
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    title: 'Cloud Architecture Telemetry',
    screenTarget: 'screen-analytics',
    timestamp: 'Initial Ingestion',
    status: 'active'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('app');
  const [activeScreenId, setActiveScreenId] = useState<string>('screen-dashboard');
  const [screens, setScreens] = useState<AppScreen[]>(INITIAL_SCREENS);
  const [hotlinks, setHotlinks] = useState<HotlinkAsset[]>(INITIAL_HOTLINKS);

  const handleAddHotlink = (asset: HotlinkAsset) => {
    setHotlinks(prev => [asset, ...prev]);
  };

  const handleRemoveHotlink = (id: string) => {
    setHotlinks(prev => prev.filter(h => h.id !== id));
  };

  const handleBindScreenImage = (screenId: string, imageUrl: string) => {
    setScreens(prev => prev.map(s => {
      if (s.id === screenId) {
        return { ...s, imageUrl };
      }
      return s;
    }));
  };

  const handleNavigateToScreen = (screenId: string) => {
    setActiveScreenId(screenId);
    setActiveTab('app');
  };

  return (
    <div id="app-container" className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col font-sans antialiased">
      {/* Top Application Header */}
      <header id="main-header" className="bg-white border-b border-zinc-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand & Suite Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-900 text-white flex items-center justify-center shadow-xs">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-zinc-900 tracking-tight">
                  Product Blueprint & Application Suite
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
                  v1.4
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 hidden sm:block">
                PRD Specifications • System Architecture • Core Screen Layout
              </p>
            </div>
          </div>

          {/* Core Navigation Tabs */}
          <nav id="nav-tabs" className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200">
            <button
              id="tab-core-app"
              onClick={() => setActiveTab('app')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'app'
                  ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Core App Layout</span>
              <span className="sm:hidden">App</span>
            </button>

            <button
              id="tab-architecture"
              onClick={() => setActiveTab('architecture')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'architecture'
                  ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">System Architecture</span>
              <span className="sm:hidden">Architecture</span>
            </button>

            <button
              id="tab-prd"
              onClick={() => setActiveTab('prd')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'prd'
                  ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Formal PRD</span>
              <span className="sm:hidden">PRD</span>
            </button>

            <button
              id="tab-photos"
              onClick={() => setActiveTab('photos')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'photos'
                  ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Photo & Hotlinks</span>
              <span className="sm:hidden">Photos</span>
              {hotlinks.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-zinc-900 text-white text-[10px] flex items-center justify-center font-mono">
                  {hotlinks.length}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Main Workspace Area */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'app' && (
          <CoreAppLayout
            screens={screens}
            activeScreenId={activeScreenId}
            onSelectScreen={setActiveScreenId}
            hotlinks={hotlinks}
            onOpenStudio={() => setActiveTab('photos')}
            onOpenArchitecture={() => setActiveTab('architecture')}
            onOpenPrd={() => setActiveTab('prd')}
          />
        )}

        {activeTab === 'architecture' && (
          <ArchitectureDiagram />
        )}

        {activeTab === 'prd' && (
          <PrdViewer />
        )}

        {activeTab === 'photos' && (
          <HotlinkStudio
            hotlinks={hotlinks}
            onAddHotlink={handleAddHotlink}
            onRemoveHotlink={handleRemoveHotlink}
            screens={screens}
            onBindScreenImage={handleBindScreenImage}
            onNavigateToScreen={handleNavigateToScreen}
          />
        )}
      </main>

      {/* Footer */}
      <footer id="main-footer" className="bg-white border-t border-zinc-200 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Formal Product Requirements & System Architecture Specification</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Container Ingress: Port 3000</span>
            <span>•</span>
            <span>WCAG 2.1 AA Compliant</span>
            <span>•</span>
            <span>Reactive State Sync</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
