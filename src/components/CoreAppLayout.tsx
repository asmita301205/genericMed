import React, { useState } from 'react';
import { AppScreen, HotlinkAsset } from '../types';
import {
  LayoutDashboard,
  Layers,
  FileText,
  Image as ImageIcon,
  Monitor,
  Tablet,
  Smartphone,
  Search,
  Bell,
  SlidersHorizontal,
  ArrowUpRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  FolderOpen,
  Filter
} from 'lucide-react';

interface CoreAppLayoutProps {
  screens: AppScreen[];
  activeScreenId: string;
  onSelectScreen: (screenId: string) => void;
  hotlinks: HotlinkAsset[];
  onOpenStudio: () => void;
  onOpenArchitecture: () => void;
  onOpenPrd: () => void;
}

export const CoreAppLayout: React.FC<CoreAppLayoutProps> = ({
  screens,
  activeScreenId,
  onSelectScreen,
  hotlinks,
  onOpenStudio,
  onOpenArchitecture,
  onOpenPrd,
}) => {
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [searchFilter, setSearchFilter] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'dashboard' | 'detail' | 'analytics'>('all');

  const activeScreen = screens.find(s => s.id === activeScreenId) || screens[0];

  const filteredScreens = screens.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
                          s.description.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesCat = activeCategory === 'all' || s.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const getViewportWidthClass = () => {
    switch (viewportMode) {
      case 'mobile': return 'max-w-[390px] mx-auto border-x border-zinc-300 shadow-2xl';
      case 'tablet': return 'max-w-[768px] mx-auto border-x border-zinc-300 shadow-xl';
      default: return 'w-full';
    }
  };

  return (
    <div id="core-app-layout-root" className="w-full space-y-6">
      {/* Top Application Utility Toolbar */}
      <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Active Screen Info & Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 pr-3 border-r border-zinc-200">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold text-zinc-900 font-mono uppercase tracking-wider">
              {activeScreen.badge}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-lg">
            {(['all', 'dashboard', 'detail', 'analytics'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md capitalize transition-colors ${
                  activeCategory === cat
                    ? 'bg-white text-zinc-900 shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Viewport Mode Switcher & Quick Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-zinc-100 p-1 rounded-lg border border-zinc-200">
            <button
              onClick={() => setViewportMode('desktop')}
              title="Desktop Viewport (100%)"
              className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
                viewportMode === 'desktop' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Desktop</span>
            </button>
            <button
              onClick={() => setViewportMode('tablet')}
              title="Tablet Viewport (768px)"
              className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
                viewportMode === 'tablet' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tablet</span>
            </button>
            <button
              onClick={() => setViewportMode('mobile')}
              title="Mobile Viewport (375px)"
              className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
                viewportMode === 'mobile' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mobile</span>
            </button>
          </div>

          <button
            onClick={onOpenStudio}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium transition-colors shadow-xs"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Hotlink Photo</span>
          </button>
        </div>
      </div>

      {/* Screen Selector Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {filteredScreens.map(s => {
          const isSelected = s.id === activeScreenId;
          const hasCustomPhoto = !!s.imageUrl;
          return (
            <button
              key={s.id}
              onClick={() => onSelectScreen(s.id)}
              className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden ${
                isSelected
                  ? 'border-zinc-900 bg-white ring-2 ring-zinc-900/10 shadow-md'
                  : 'border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50/50 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                  isSelected ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600'
                }`}>
                  {s.badge}
                </span>
                {hasCustomPhoto && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-purple-700 bg-purple-50 border border-purple-200 px-1.5 py-0.5 rounded font-medium">
                    <Sparkles className="w-3 h-3 text-purple-600" />
                    Photo Linked
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-zinc-900 mt-2 truncate">{s.name}</h3>
              <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5">{s.description}</p>
            </button>
          );
        })}
      </div>

      {/* Responsive Viewport Simulator Frame */}
      <div className="bg-zinc-100/80 p-3 sm:p-6 rounded-2xl border border-zinc-200/80 transition-all">
        <div className={`transition-all duration-300 bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm ${getViewportWidthClass()}`}>
          {/* Mock Browser/App Header */}
          <div className="bg-zinc-50 border-b border-zinc-200 px-4 py-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span className="text-[11px] font-mono text-zinc-500 ml-2">
                https://app.blueprint.local/{activeScreen.badge.toLowerCase()}
              </span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400 text-[11px]">
              <span>{viewportMode.toUpperCase()} VIEWPORT</span>
            </div>
          </div>

          {/* Render Active Screen Content */}
          <div className="p-4 sm:p-6 space-y-6">
            {/* Screen Header inside preview */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-zinc-400">{activeScreen.badge}</span>
                  <span className="text-zinc-300">•</span>
                  <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {activeScreen.status}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 mt-1">{activeScreen.name}</h2>
                <p className="text-xs sm:text-sm text-zinc-600 mt-0.5">{activeScreen.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenStudio}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 hover:bg-zinc-50 text-zinc-700 transition-colors shadow-2xs"
                >
                  Change Mockup Photo
                </button>
              </div>
            </div>

            {/* Hotlinked Photo or Visual Mockup Canvas */}
            {activeScreen.imageUrl ? (
              <div className="space-y-4">
                <div className="relative rounded-xl overflow-hidden border border-zinc-200 bg-zinc-950 group">
                  <img
                    src={activeScreen.imageUrl}
                    alt={activeScreen.name}
                    referrerPolicy="no-referrer"
                    className="w-full max-h-[520px] object-cover object-top transition-transform duration-500 group-hover:scale-[1.01]"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80';
                    }}
                  />
                  <div className="absolute top-3 right-3 bg-zinc-900/80 backdrop-blur-xs text-white text-[11px] font-mono px-2.5 py-1 rounded-md border border-white/20 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Hotlinked Visual Asset</span>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-200 text-xs flex items-center justify-between">
                  <span className="text-zinc-600">
                    Source: <code className="text-zinc-900 font-mono truncate max-w-xs inline-block align-bottom">{activeScreen.imageUrl}</code>
                  </span>
                  <button
                    onClick={onOpenStudio}
                    className="text-zinc-900 font-semibold hover:underline flex items-center gap-1"
                  >
                    Configure in Studio <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : null}

            {/* Live Interactive Dashboard Metrics / Components */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-1">
                <span className="text-xs text-zinc-500 font-medium">Daily Active Throughput</span>
                <div className="text-2xl font-bold text-zinc-900 font-mono">148.2k req</div>
                <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+14.8% vs last week</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-1">
                <span className="text-xs text-zinc-500 font-medium">Ingress Latency (p99)</span>
                <div className="text-2xl font-bold text-zinc-900 font-mono">18.4 ms</div>
                <div className="flex items-center gap-1 text-xs text-zinc-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Container Port 3000</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-1">
                <span className="text-xs text-zinc-500 font-medium">Architecture Traceability</span>
                <div className="text-2xl font-bold text-zinc-900 font-mono">100% Valid</div>
                <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>PRD Mapped</span>
                </div>
              </div>
            </div>

            {/* Features Specification Table for this Screen */}
            <div className="border border-zinc-200 rounded-xl p-5 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Core Functional Features (Mapped to PRD)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeScreen.features.map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-2.5 p-2 rounded-lg bg-zinc-50 text-xs text-zinc-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links to Architecture & PRD */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-zinc-900 text-white text-xs">
              <div>
                <p className="font-semibold text-white">Looking for System Topology or Specifications?</p>
                <p className="text-zinc-400 text-[11px] mt-0.5">Explore the high-level system diagram and formal PRD document.</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={onOpenArchitecture}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium transition-colors"
                >
                  Architecture Diagram
                </button>
                <button
                  onClick={onOpenPrd}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-zinc-100 text-zinc-900 font-medium transition-colors"
                >
                  View Formal PRD
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
