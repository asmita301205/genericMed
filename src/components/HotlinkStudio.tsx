import React, { useState } from 'react';
import { HotlinkAsset, AppScreen } from '../types';
import {
  Upload,
  Link2,
  Code,
  Image as ImageIcon,
  CheckCircle,
  Trash2,
  Plus,
  Sparkles,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Package
} from 'lucide-react';

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
  const [targetScreen, setTargetScreen] = useState(screens[0]?.id || 'screen-discovery');
  const [htmlSnippet, setHtmlSnippet] = useState('');
  const [parseSuccessMessage, setParseSuccessMessage] = useState<string | null>(null);

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
        const title = altMatch ? altMatch[1] : `Medicine Packaging Photo ${hotlinks.length + count + 1}`;

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
      setParseSuccessMessage(`Successfully extracted and bound ${count} image(s) from HTML snippet!`);
      setHtmlSnippet('');
      setTimeout(() => setParseSuccessMessage(null), 4000);
    } else {
      setParseSuccessMessage('No valid <img src="..." /> tags found in the provided HTML snippet.');
      setTimeout(() => setParseSuccessMessage(null), 4000);
    }
  };

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    const newAsset: HotlinkAsset = {
      id: `hotlink-${Date.now()}`,
      url: urlInput.trim(),
      title: titleInput.trim() || `Medicine Asset ${hotlinks.length + 1}`,
      screenTarget: targetScreen,
      timestamp: new Date().toLocaleTimeString(),
      status: 'active'
    };

    onAddHotlink(newAsset);
    onBindScreenImage(targetScreen, urlInput.trim());

    setUrlInput('');
    setTitleInput('');
    setParseSuccessMessage('Direct hotlink registered and bound to screen!');
    setTimeout(() => setParseSuccessMessage(null), 3500);
  };

  return (
    <div id="hotlink-studio-root" className="w-full max-w-7xl mx-auto space-y-6">
      {/* Studio Header Card */}
      <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                HTML Hotlink & Packaging Asset Studio
              </span>
              <span className="text-xs font-mono text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">
                referrerpolicy="no-referrer"
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
              genericMed Asset & Packaging Studio
            </h1>
            <p className="text-sm text-zinc-600">
              Paste HTML snippets containing <code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">&lt;img src="..."&gt;</code> tags or hotlink medicine packaging photos, chemist store licenses, and prescription assets.
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs text-zinc-400 block">Total Hotlinked Assets</span>
            <span className="text-xl font-bold font-mono text-zinc-900">{hotlinks.length} Assets Active</span>
          </div>
        </div>

        {/* Success Alert */}
        {parseSuccessMessage && (
          <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{parseSuccessMessage}</span>
            </div>
            <span className="font-mono text-[11px] text-emerald-700">CDN Ingestion Verified</span>
          </div>
        )}

        {/* Target Screen Selector */}
        <div className="mt-4 pt-3 border-t border-zinc-100 flex flex-wrap items-center gap-3 text-xs">
          <span className="text-zinc-600 font-semibold">Active Destination Screen:</span>
          <select
            value={targetScreen}
            onChange={(e) => setTargetScreen(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-800 font-medium focus:outline-hidden"
          >
            {screens.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.badge} • {s.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Parser & Form */}
        <div className="lg:col-span-6 space-y-6">
          {/* HTML Snippet Parser Card */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
              <Code className="w-4 h-4 text-indigo-600" />
              <h3 className="text-base font-bold text-zinc-900">1. Extract from Raw HTML Snippet</h3>
            </div>
            <p className="text-xs text-zinc-600">
              Paste full HTML code from your browser or design export. The parser will automatically extract all <code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">&lt;img src="..."&gt;</code> attributes.
            </p>

            <textarea
              id="html-parser-textarea"
              value={htmlSnippet}
              onChange={(e) => setHtmlSnippet(e.target.value)}
              rows={5}
              placeholder={`<div class="product-gallery">\n  <img src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae" alt="Paracetamol IP Packaging" />\n</div>`}
              className="w-full p-3 font-mono text-xs rounded-lg border border-zinc-200 bg-zinc-50 focus:bg-white text-zinc-900 resize-none focus:outline-hidden focus:ring-2 focus:ring-zinc-900"
            />

            <button
              id="parse-html-btn"
              onClick={handleParseHtml}
              className="w-full py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Extract & Bind Packaging Photos to Screen
            </button>
          </div>

          {/* Direct URL Form */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
              <Link2 className="w-4 h-4 text-blue-600" />
              <h3 className="text-base font-bold text-zinc-900">2. Direct Packaging Image URL</h3>
            </div>

            <form onSubmit={handleManualAdd} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-600 font-medium block mb-1">Image HTTPS URL</label>
                <input
                  type="url"
                  required
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 bg-zinc-50 focus:bg-white text-zinc-900"
                />
              </div>

              <div>
                <label className="text-zinc-600 font-medium block mb-1">Asset Label / Medicine Name</label>
                <input
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  placeholder="e.g. Paracetamol Strip 10 Tabs"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 bg-zinc-50 focus:bg-white text-zinc-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-zinc-800 font-semibold text-xs transition-colors"
              >
                Register Hotlink Asset
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Hotlinked Assets Gallery */}
        <div className="lg:col-span-6 bg-white border border-zinc-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-zinc-900" />
              <h3 className="text-base font-bold text-zinc-900">Registered Hotlinked Packaging Assets</h3>
            </div>
            <span className="text-xs text-zinc-500 font-mono">{hotlinks.length} items</span>
          </div>

          <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
            {hotlinks.map(asset => {
              const target = screens.find(s => s.id === asset.screenTarget) || screens[0];

              return (
                <div key={asset.id} className="p-3 rounded-xl border border-zinc-200 bg-zinc-50/60 flex items-start gap-3">
                  <img
                    src={asset.url}
                    alt={asset.title}
                    referrerPolicy="no-referrer"
                    className="w-20 h-16 object-cover rounded-lg border border-zinc-200 shrink-0 bg-white"
                  />

                  <div className="flex-1 min-w-0 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-zinc-900 truncate">{asset.title}</h4>
                      <button
                        onClick={() => onRemoveHotlink(asset.id)}
                        className="text-zinc-400 hover:text-rose-600 p-1"
                        title="Delete asset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-zinc-500 truncate font-mono">{asset.url}</p>

                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <span className="text-zinc-500">
                        Target: <span className="font-semibold text-zinc-800">{target?.name}</span>
                      </span>

                      <button
                        onClick={() => onNavigateToScreen(asset.screenTarget)}
                        className="text-blue-600 hover:underline font-medium flex items-center gap-1"
                      >
                        View Screen
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
