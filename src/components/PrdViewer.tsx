import React, { useState, useMemo } from 'react';
import { PRD_SECTIONS } from '../data/prdData';
import { FileText, Search, Copy, Check, ExternalLink, ShieldCheck, ArrowUpRight } from 'lucide-react';

export const PrdViewer: React.FC = () => {
  const [selectedSectionId, setSelectedSectionId] = useState<string>(PRD_SECTIONS[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return PRD_SECTIONS;
    const q = searchQuery.toLowerCase();
    return PRD_SECTIONS.filter(sec =>
      sec.title.toLowerCase().includes(q) ||
      sec.summary.toLowerCase().includes(q) ||
      sec.content.some(c =>
        c.subtitle?.toLowerCase().includes(q) ||
        c.paragraphs?.some(p => p.toLowerCase().includes(q)) ||
        c.bullets?.some(b => b.toLowerCase().includes(q))
      )
    );
  }, [searchQuery]);

  const activeSection = useMemo(() => {
    return PRD_SECTIONS.find(s => s.id === selectedSectionId) || PRD_SECTIONS[0];
  }, [selectedSectionId]);

  const handleCopyMarkdown = () => {
    let md = `# Product Requirements Document (PRD)\n## Product Blueprint & Application Suite\n\n`;
    PRD_SECTIONS.forEach(s => {
      md += `### ${s.number} ${s.title}\n*${s.summary}*\n\n`;
      s.content.forEach(c => {
        if (c.subtitle) md += `#### ${c.subtitle}\n`;
        if (c.paragraphs) md += c.paragraphs.join('\n\n') + '\n\n';
        if (c.bullets) md += c.bullets.map(b => `- ${b}`).join('\n') + '\n\n';
        if (c.table) {
          md += `| ${c.table.headers.join(' | ')} |\n`;
          md += `| ${c.table.headers.map(() => '---').join(' | ')} |\n`;
          c.table.rows.forEach(r => {
            md += `| ${r.join(' | ')} |\n`;
          });
          md += '\n';
        }
      });
    });

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div id="prd-viewer-root" className="w-full max-w-7xl mx-auto space-y-6">
      {/* PRD Header Card */}
      <div id="prd-header-card" className="bg-white border border-zinc-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                Status: Formal Specification Approved
              </span>
              <span className="text-xs font-mono text-zinc-500">v1.4.0-PROD</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
              Product Requirements Document (PRD)
            </h1>
            <p className="text-sm text-zinc-600">
              Formal baseline defining functional scope, layout hierarchy, asset hotlinking architecture, and acceptance verification.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="prd-copy-btn"
              onClick={handleCopyMarkdown}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 transition-colors shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Copied to Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-zinc-500" />
                  <span>Copy PRD as Markdown</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Metadata Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
          <div>
            <span className="text-zinc-400 block font-medium">Document ID</span>
            <span className="text-zinc-900 font-mono font-semibold">PRD-CORE-2026-09</span>
          </div>
          <div>
            <span className="text-zinc-400 block font-medium">Target Architecture</span>
            <span className="text-zinc-900 font-medium">Full-Stack React + Cloud CDN</span>
          </div>
          <div>
            <span className="text-zinc-400 block font-medium">Layout Target</span>
            <span className="text-zinc-900 font-medium">Multi-Screen Responsive SPA</span>
          </div>
          <div>
            <span className="text-zinc-400 block font-medium">Asset Protocol</span>
            <span className="text-zinc-900 font-medium">Hotlinked HTTPS + Fallback</span>
          </div>
        </div>
      </div>

      {/* Main PRD Layout: Sidebar Index + Content Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Navigation Sidebar */}
        <div id="prd-sidebar" className="lg:col-span-4 bg-white border border-zinc-200 rounded-xl p-4 shadow-xs space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="prd-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search specifications, FRs, NFRs..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-zinc-400 text-zinc-900 transition-all"
            />
          </div>

          <div className="space-y-1 max-h-[540px] overflow-y-auto pr-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 px-2 py-1">
              Table of Contents
            </div>
            {filteredSections.map(sec => {
              const isSelected = sec.id === selectedSectionId;
              return (
                <button
                  key={sec.id}
                  id={`prd-nav-item-${sec.id}`}
                  onClick={() => setSelectedSectionId(sec.id)}
                  className={`w-full text-left p-2.5 rounded-lg text-xs transition-all flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-zinc-900 text-white font-medium shadow-xs'
                      : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900'
                  }`}
                >
                  <span className={`font-mono text-[11px] font-semibold px-1.5 py-0.5 rounded ${
                    isSelected ? 'bg-zinc-800 text-zinc-200' : 'bg-zinc-100 text-zinc-500'
                  }`}>
                    {sec.number}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium">{sec.title}</p>
                    <p className={`text-[11px] line-clamp-1 ${isSelected ? 'text-zinc-300' : 'text-zinc-400'}`}>
                      {sec.summary}
                    </p>
                  </div>
                </button>
              );
            })}
            {filteredSections.length === 0 && (
              <div className="text-center py-6 text-xs text-zinc-500">
                No matching requirement sections found.
              </div>
            )}
          </div>
        </div>

        {/* Content Pane */}
        <div id="prd-content-pane" className="lg:col-span-8 bg-white border border-zinc-200 rounded-xl p-6 sm:p-8 shadow-xs space-y-8">
          {/* Section Heading */}
          <div className="border-b border-zinc-100 pb-5 space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs text-zinc-500">
              <span>Section {activeSection.number}</span>
              <span>•</span>
              <span className="text-zinc-700 font-medium">Formal Requirement Artifact</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
              {activeSection.title}
            </h2>
            <p className="text-sm text-zinc-600 leading-relaxed">
              {activeSection.summary}
            </p>
          </div>

          {/* Section Body */}
          <div className="space-y-6">
            {activeSection.content.map((item, idx) => (
              <div key={idx} className="space-y-3">
                {item.subtitle && (
                  <h3 className="text-base font-semibold text-zinc-900 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 inline-block"></span>
                    {item.subtitle}
                  </h3>
                )}

                {item.paragraphs && (
                  <div className="space-y-2 text-sm text-zinc-700 leading-relaxed">
                    {item.paragraphs.map((p, pIdx) => (
                      <p key={pIdx}>{p}</p>
                    ))}
                  </div>
                )}

                {item.bullets && (
                  <ul className="space-y-2 text-sm text-zinc-700">
                    {item.bullets.map((b, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2.5">
                        <span className="text-zinc-400 mt-1 select-none font-bold">›</span>
                        <span className="flex-1 leading-relaxed">{b}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {item.table && (
                  <div className="overflow-x-auto rounded-lg border border-zinc-200 mt-3">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-zinc-50 text-zinc-600 font-semibold border-b border-zinc-200">
                        <tr>
                          {item.table.headers.map((h, hIdx) => (
                            <th key={hIdx} className="px-3.5 py-2.5">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 text-zinc-700">
                        {item.table.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-zinc-50/75 transition-colors">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className={`px-3.5 py-2.5 align-top ${cIdx === 0 ? 'font-medium text-zinc-900 font-mono' : ''}`}>
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Navigator Footer */}
          <div className="border-t border-zinc-100 pt-5 flex items-center justify-between">
            <div className="text-xs text-zinc-500">
              Document maintained in sync with <code className="bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-800">/src/App.tsx</code>
            </div>
            <div className="flex items-center gap-2">
              {PRD_SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSectionId(s.id)}
                  title={s.title}
                  className={`w-7 h-7 rounded text-xs font-mono font-medium transition-colors ${
                    s.id === selectedSectionId
                      ? 'bg-zinc-900 text-white'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  {s.number.replace('.0', '')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
