import React, { useState } from 'react';
import { ARCHITECTURE_NODES, ARCHITECTURE_LAYERS, ARCHITECTURE_CONNECTIONS } from '../data/architectureData';
import { ArchitectureNode } from '../types';
import { Layers, Network, Shield, Cpu, Database, Cloud, ArrowRight, CheckCircle2, Zap, Info, RefreshCw } from 'lucide-react';

export const ArchitectureDiagram: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('client-ui');
  const [isFlowActive, setIsFlowActive] = useState<boolean>(true);

  const selectedNode = ARCHITECTURE_NODES.find(n => n.id === selectedNodeId) || ARCHITECTURE_NODES[0];

  const getLayerIcon = (layerId: string) => {
    switch (layerId) {
      case 'client': return <Layers className="w-4 h-4 text-blue-600" />;
      case 'gateway': return <Shield className="w-4 h-4 text-indigo-600" />;
      case 'services': return <Cpu className="w-4 h-4 text-emerald-600" />;
      case 'storage': return <Database className="w-4 h-4 text-amber-600" />;
      case 'external': return <Cloud className="w-4 h-4 text-purple-600" />;
      default: return <Network className="w-4 h-4 text-zinc-600" />;
    }
  };

  return (
    <div id="architecture-diagram-root" className="w-full max-w-7xl mx-auto space-y-6">
      {/* Diagram Header Card */}
      <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                <Network className="w-3.5 h-3.5" />
                System Topology: Active Ingress & Hotlink Tier
              </span>
              <span className="text-xs font-mono text-zinc-500">Port 3000 Ingress</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
              High-Level System Architecture Diagram
            </h1>
            <p className="text-sm text-zinc-600">
              End-to-end topology diagram displaying presentation tier, edge ingress, parsing services, client persistence, and external CDN asset delivery.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFlowActive(!isFlowActive)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors shadow-xs ${
                isFlowActive
                  ? 'bg-zinc-900 text-white border-zinc-900'
                  : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
              }`}
            >
              <Zap className={`w-3.5 h-3.5 ${isFlowActive ? 'text-amber-400 fill-amber-400' : 'text-zinc-400'}`} />
              <span>{isFlowActive ? 'Data Stream Active' : 'Pause Flow Pulse'}</span>
            </button>
          </div>
        </div>

        {/* System Health Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 text-xs">
          {ARCHITECTURE_LAYERS.map(layer => (
            <div key={layer.id} className="p-2.5 rounded-lg border border-zinc-100 bg-zinc-50/70 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 font-medium">{layer.name}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <div className="font-mono text-[11px] text-zinc-800 font-semibold">{layer.badge}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Topology Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Visual Map (Left / Center) */}
        <div className="lg:col-span-8 bg-white border border-zinc-200 rounded-xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Interactive Tier Schematic (Select Node to Inspect)
            </h2>
            <span className="text-xs text-zinc-400">Click any card below</span>
          </div>

          {/* Layer Cards */}
          <div className="space-y-4">
            {ARCHITECTURE_LAYERS.map((layer, index) => {
              const node = ARCHITECTURE_NODES.find(n => n.layer === layer.id);
              if (!node) return null;
              const isSelected = selectedNodeId === node.id;

              return (
                <div key={layer.id} className="relative">
                  {/* Layer Connection Flow Indicator */}
                  {index > 0 && (
                    <div className="flex justify-center my-1">
                      <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400 bg-zinc-50 px-2 py-0.5 rounded border border-zinc-100">
                        <span className={`w-1.5 h-1.5 rounded-full ${isFlowActive ? 'bg-blue-500 animate-ping' : 'bg-zinc-300'}`}></span>
                        <span>{ARCHITECTURE_CONNECTIONS[index - 1]?.label || 'Direct Pipeline'}</span>
                        <ArrowRight className="w-3 h-3 text-zinc-400" />
                      </div>
                    </div>
                  )}

                  <div
                    id={`arch-node-${node.id}`}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`cursor-pointer rounded-xl p-4 border transition-all ${
                      isSelected
                        ? 'border-zinc-900 bg-zinc-50/90 shadow-md ring-2 ring-zinc-900/10'
                        : 'border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50/40 shadow-xs'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-zinc-100 border border-zinc-200 mt-0.5">
                          {getLayerIcon(node.layer)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-semibold text-zinc-900">{node.title}</h3>
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${layer.color}`}>
                              {layer.name}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-500 mt-0.5">{node.subtitle}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-center">
                        <span className="text-[11px] font-mono bg-zinc-100 text-zinc-600 px-2 py-1 rounded">
                          {node.protocol}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${isSelected ? 'bg-zinc-900 text-white' : 'text-zinc-400'}`}>
                          {isSelected ? 'Active' : 'Inspect'}
                        </span>
                      </div>
                    </div>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-zinc-100">
                      {node.tech.map((t, tIdx) => (
                        <span key={tIdx} className="text-[11px] bg-white border border-zinc-200 text-zinc-700 px-2 py-0.5 rounded font-mono">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Hotlink CDN Branch Callout */}
          <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/30 flex items-start gap-3">
            <Cloud className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <div className="font-semibold text-purple-950">External Asset & Image Hotlinking Architecture</div>
              <p className="text-purple-800 leading-relaxed">
                External images, screenshot mockups, and remote assets are requested asynchronously through standard HTTPS with <code className="bg-purple-100 px-1 py-0.5 rounded font-mono text-purple-900">referrerPolicy="no-referrer"</code>. In the event of network blockage or broken URLs, the client fallback pipeline serves deterministic SVG architectural blueprint placeholders.
              </p>
            </div>
          </div>
        </div>

        {/* Selected Node Technical Inspector (Right Column) */}
        <div className="lg:col-span-4 bg-white border border-zinc-200 rounded-xl p-6 shadow-xs space-y-6">
          <div className="border-b border-zinc-100 pb-4">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Component Deep-Dive Inspector
            </div>
            <h3 className="text-lg font-bold text-zinc-900 mt-1">
              {selectedNode.title}
            </h3>
            <p className="text-xs text-zinc-500 font-mono mt-0.5">{selectedNode.subtitle}</p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <span className="font-semibold text-zinc-900 block mb-1">Architecture Description</span>
              <p className="text-zinc-600 leading-relaxed">{selectedNode.description}</p>
            </div>

            <div>
              <span className="font-semibold text-zinc-900 block mb-1">Operational Protocol</span>
              <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200 font-mono text-zinc-800">
                {selectedNode.protocol}
              </div>
            </div>

            <div>
              <span className="font-semibold text-zinc-900 block mb-2">Core Responsibilities</span>
              <ul className="space-y-2">
                {selectedNode.responsibilities.map((r, rIdx) => (
                  <li key={rIdx} className="flex items-start gap-2 text-zinc-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="font-semibold text-zinc-900 block mb-2">Technology Dependencies</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedNode.tech.map((t, tIdx) => (
                  <span key={tIdx} className="px-2 py-1 bg-zinc-100 text-zinc-800 font-mono text-[11px] rounded border border-zinc-200">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-100 space-y-2">
              <div className="font-semibold text-zinc-900">Associated PRD Requirements</div>
              <div className="text-[11px] text-zinc-600 space-y-1">
                <div className="flex items-center justify-between p-1.5 rounded bg-zinc-50 border border-zinc-100">
                  <span className="font-mono font-medium text-zinc-800">FR-01 (Hotlinking Engine)</span>
                  <span className="text-emerald-600 font-medium">Mapped</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded bg-zinc-50 border border-zinc-100">
                  <span className="font-mono font-medium text-zinc-800">FR-02 (Viewport Emulation)</span>
                  <span className="text-emerald-600 font-medium">Mapped</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded bg-zinc-50 border border-zinc-100">
                  <span className="font-mono font-medium text-zinc-800">NFR-5.1 (Performance & 60fps)</span>
                  <span className="text-emerald-600 font-medium">Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
