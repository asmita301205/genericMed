import React, { useState } from 'react';
import { HotlinkAsset, AppScreen } from '../types';
import { Upload, Link2, Code, Image as ImageIcon, CheckCircle, Trash2, Plus, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

interface HotlinkStudioProps {
  hotlinks: HotlinkAsset[];
  onAddHotlink: (asset: HotlinkAsset) => void;
  onRemoveHotlink: (id: string) => void;
  screens: AppScreen[];
  onBindScreenImage: (screenId: string, imageUrl: string) => void;
  onNavigateToScreen: (screenId: string) => void;
}

export const HotlinkStudio: React.FC<HotlinkStudioProps> = ({
  hotlinks,
  onAddHotlink,
  onRemoveHotlink,
  screens,
  onBindScreenImage,
  onNavigateToScreen,
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [titleInput, setTitleInput] = useState('');
  const [targetScreen, setTargetScreen] = useState(screens[0]?.id || 'screen-dashboard');
  const [htmlSnippet, setHtmlSnippet] = useState('');
  const [parseSuccessMessage, setParseSuccessMessage] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // Parse HTML snippet for <img> tags
  const handleParseHtml = () => {
    if (!htmlSnippet.trim()) return;

    // Regex to match img src
    const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
    let match;
    let count = 0;

    while ((match = imgRegex.exec(htmlSnippet)) !== null) {
      const src = match[1];
      if (src) {
        // Look for alt attribute as title
        const altMatch = /alt=["']([^"']+)["']/i.exec(match[0]);
        const title = altMatch ? altMatch[1] : `Hotlinked Image ${hotlinks.length + count + 1}`;

        const newAsset: HotlinkAsset = {
          id: `hotlink-${Date.now()}-${count}`,
          url: src,
          title: title,
          screenTarget: targetScreen,
          timestamp: new Date().toLocaleTimeString(),
          status: 'active'
        };

        onAddHotlink(newAsset);
        onBindScreenImage(targetScreen, src);
        count++;
      }
    }

    if (count > 0) {
      setParseSuccessMessage(`Successfully extracted and bound ${count} image${count > 1 ? 's' : ''} from HTML!`);
      setHtmlSnippet('');
      setTimeout(() => setParseSuccessMessage(null), 4000);
    } else {
      // If no <img> tags found, try parsing as direct URL
      if (htmlSnippet.startsWith('http://') || htmlSnippet.startsWith('https://')) {
        handleAddDirectUrl(htmlSnippet.trim(), 'Hotlinked Asset');
        setHtmlSnippet('');
      } else {
        setParseSuccessMessage('No <img src="..."> tags or valid URLs found in the pasted snippet.');
        setTimeout(() => setParseSuccessMessage(null), 4000);
      }
    }
  };

  const handleAddDirectUrl = (customUrl?: string, customTitle?: string) => {
    const url = customUrl || urlInput.trim();
    if (!url) return;

    const newAsset: HotlinkAsset = {
      id: `hotlink-${Date.now()}`,
      url,
      title: customTitle || titleInput.trim() || `Screen Asset ${hotlinks.length + 1}`,
      screenTarget: targetScreen,
      timestamp: new Date().toLocaleTimeString(),
      status: 'active'
    };

    onAddHotlink(newAsset);
    onBindScreenImage(targetScreen, url);

    setUrlInput('');
    setTitleInput('');
    setParseSuccessMessage(`Asset hotlinked and mapped to "${screens.find(s => s.id === targetScreen)?.name || 'Screen'}"`);
    setTimeout(() => setParseSuccessMessage(null), 3500);
  };

  // Drag and drop local photo files
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processLocalFiles(files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processLocalFiles(files);
    }
  };

  const processLocalFiles = (files: FileList) => {
    Array.from(files).forEach((file, idx) => {
      if (file.type.startsWith('image/')) {
        const objectUrl = URL.createObjectURL(file);
        const newAsset: HotlinkAsset = {
          id: `local-photo-${Date.now()}-${idx}`,
          url: objectUrl,
          title: file.name.replace(/\.[^/.]+$/, ''),
          screenTarget: targetScreen,
          timestamp: new Date().toLocaleTimeString(),
          status: 'active'
        };

        onAddHotlink(newAsset);
        onBindScreenImage(targetScreen, objectUrl);
      }
    });

    setParseSuccessMessage(`Loaded photo and applied to screen layout.`);
    setTimeout(() => setParseSuccessMessage(null), 3500);
  };

  // Preset sample photography & design mockups
  const samplePresets = [
    {
      title: 'Modern Analytics Dashboard Mockup',
      url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      screen: 'screen-dashboard'
    },
    {
      title: 'Enterprise Architecture & Cloud Blueprint',
      url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      screen: 'screen-analytics'
    },
    {
      title: 'Product Detail & Specification Canvas',
      url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
      screen: 'screen-detail'
    }
  ];

  return (
    <div id="hotlink-studio-root" className="w-full max-w-7xl mx-auto space-y-6">
      {/* Studio Header Card */}
      <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                <ImageIcon className="w-3.5 h-3.5" />
                Asset Ingestion Studio
              </span>
              <span className="text-xs font-mono text-zinc-500">FR-01 Hotlinking Engine</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
              Photo & Screen Hotlinking Studio
            </h1>
            <p className="text-sm text-zinc-600">
              Directly upload your photos, paste HTML snippets with <code className="bg-zinc-100 px-1 py-0.5 rounded font-mono text-zinc-800">&lt;img&gt;</code> tags, or bind external hotlinked URLs to live application screens.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-zinc-600 bg-zinc-50 px-3 py-1.5 rounded-lg border border-zinc-200">
            <span>Active Assets:</span>
            <span className="font-bold text-zinc-900 font-mono">{hotlinks.length}</span>
          </div>
        </div>

        {parseSuccessMessage && (
          <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{parseSuccessMessage}</span>
          </div>
        )}
      </div>

      {/* 2-Column Workflow: Ingestion Methods (Left) & Active Hotlinked Screens (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Ingestion Methods */}
        <div className="lg:col-span-6 space-y-6">
          {/* Target Screen Selector */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs space-y-3">
            <label className="text-xs font-semibold text-zinc-700 block">
              1. Target Screen for Ingested Photo:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {screens.map(s => (
                <button
                  key={s.id}
                  onClick={() => setTargetScreen(s.id)}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                    targetScreen === s.id
                      ? 'border-zinc-900 bg-zinc-900 text-white font-medium shadow-xs'
                      : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700'
                  }`}
                >
                  <p className="truncate font-semibold">{s.name}</p>
                  <p className={`text-[10px] truncate ${targetScreen === s.id ? 'text-zinc-300' : 'text-zinc-500'}`}>
                    {s.badge}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Option A: Drop Photo or File Upload */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                <Upload className="w-4 h-4 text-zinc-700" />
                Upload Photo or Mockup
              </h2>
              <span className="text-[11px] text-zinc-500">PNG, JPG, WebP, SVG</span>
            </div>

            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                dragOver
                  ? 'border-zinc-900 bg-zinc-50'
                  : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50/50'
              }`}
            >
              <ImageIcon className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
              <p className="text-xs font-medium text-zinc-800">
                Drag and drop your photo or screen screenshot here
              </p>
              <p className="text-[11px] text-zinc-500 mt-1">
                or select from your device to instantly bind to the screen
              </p>

              <label className="mt-3 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 text-white hover:bg-zinc-800 cursor-pointer transition-colors shadow-xs">
                <span>Browse Photo File</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileInput}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Option B: Parse HTML with <img> tags */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs space-y-3">
            <h2 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
              <Code className="w-4 h-4 text-zinc-700" />
              Hotlink from HTML Markup
            </h2>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Paste any raw HTML snippet containing <code className="bg-zinc-100 px-1 py-0.5 rounded font-mono text-zinc-800">&lt;img src="..."&gt;</code> tags. The engine will automatically extract the URLs and map them.
            </p>

            <textarea
              value={htmlSnippet}
              onChange={(e) => setHtmlSnippet(e.target.value)}
              placeholder={`Example:\n<div class="screen">\n  <img src="https://images.unsplash.com/..." alt="Dashboard Mockup" />\n</div>`}
              rows={3}
              className="w-full p-2.5 text-xs font-mono rounded-lg border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-zinc-400 text-zinc-900"
            />

            <button
              onClick={handleParseHtml}
              className="w-full py-2 px-4 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Extract & Hotlink Images from HTML</span>
            </button>
          </div>

          {/* Option C: Direct Image URL */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs space-y-3">
            <h2 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
              <Link2 className="w-4 h-4 text-zinc-700" />
              Direct Image URL Hotlink
            </h2>

            <div className="space-y-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/mockup-screen.png"
                className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-zinc-400 text-zinc-900"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  placeholder="Asset Title (e.g. Executive KPI Screen)"
                  className="flex-1 px-3 py-2 text-xs rounded-lg border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-zinc-400 text-zinc-900"
                />
                <button
                  onClick={() => handleAddDirectUrl()}
                  className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium transition-colors shadow-xs"
                >
                  Hotlink URL
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Ingested Asset Gallery & Quick Presets */}
        <div className="lg:col-span-6 space-y-6">
          {/* Quick Presets */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Curated UI Mockup Presets
            </h2>
            <div className="space-y-2">
              {samplePresets.map((preset, pIdx) => (
                <div key={pIdx} className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-200 hover:bg-zinc-50/80 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={preset.url}
                      alt={preset.title}
                      referrerPolicy="no-referrer"
                      className="w-12 h-8 rounded object-cover border border-zinc-200 bg-zinc-100"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-zinc-900 truncate">{preset.title}</p>
                      <p className="text-[11px] text-zinc-500 truncate">Preset Hotlink</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddDirectUrl(preset.url, preset.title)}
                    className="px-2.5 py-1 text-xs font-medium rounded border border-zinc-200 hover:bg-white text-zinc-700 transition-colors shrink-0"
                  >
                    Apply
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Active Hotlinked Assets List */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-zinc-700" />
                Active Screen Assets ({hotlinks.length})
              </h2>
              <span className="text-xs text-zinc-500">Live in Layout</span>
            </div>

            {hotlinks.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-zinc-200 rounded-xl p-6 text-zinc-500 text-xs space-y-2">
                <AlertCircle className="w-6 h-6 text-zinc-400 mx-auto" />
                <p className="font-medium text-zinc-700">No custom photo or hotlinks active yet.</p>
                <p>Upload your photo or apply one of the curated presets above.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {hotlinks.map((asset) => {
                  const targetScreenObj = screens.find(s => s.id === asset.screenTarget);
                  return (
                    <div
                      key={asset.id}
                      className="p-3 rounded-lg border border-zinc-200 hover:border-zinc-300 transition-colors bg-white flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={asset.url}
                          alt={asset.title}
                          referrerPolicy="no-referrer"
                          className="w-14 h-10 rounded object-cover border border-zinc-200 bg-zinc-100 shrink-0"
                          onError={(e) => {
                            // Fallback visual
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80';
                          }}
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-zinc-900 truncate">{asset.title}</p>
                          <div className="flex items-center gap-2 text-[11px] text-zinc-500 mt-0.5">
                            <span className="bg-zinc-100 px-1.5 py-0.2 rounded font-medium text-zinc-700">
                              Bound to: {targetScreenObj?.name || 'Screen'}
                            </span>
                            <span>•</span>
                            <span className="font-mono">{asset.timestamp}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => onNavigateToScreen(asset.screenTarget)}
                          title="View Screen in Core App"
                          className="p-1.5 rounded text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onRemoveHotlink(asset.id)}
                          title="Remove Hotlink"
                          className="p-1.5 rounded text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
