import { ArchitectureNode, ArchitectureConnection } from '../types';

export const ARCHITECTURE_LAYERS = [
  { id: 'client', name: 'Presentation & UI Layer', badge: 'Client SPA', color: 'border-blue-500 bg-blue-50/50 text-blue-700' },
  { id: 'gateway', name: 'Edge & Ingress Routing', badge: 'Reverse Proxy', color: 'border-indigo-500 bg-indigo-50/50 text-indigo-700' },
  { id: 'services', name: 'Application Logic Tier', badge: 'Services', color: 'border-emerald-500 bg-emerald-50/50 text-emerald-700' },
  { id: 'storage', name: 'Persistence & Cache', badge: 'Data Tier', color: 'border-amber-500 bg-amber-50/50 text-amber-700' },
  { id: 'external', name: 'CDN & Hotlinked Assets', badge: 'Asset Pipeline', color: 'border-purple-500 bg-purple-50/50 text-purple-700' },
];

export const ARCHITECTURE_NODES: ArchitectureNode[] = [
  {
    id: 'client-ui',
    layer: 'client',
    title: 'React 19 Presentation SPA',
    subtitle: 'Vite + React 19 + Tailwind v4',
    description: 'Single-page responsive frontend delivering interactive layouts, multi-screen mockups, and dynamic document visualizers with 60 FPS transitions.',
    tech: ['React 19', 'TypeScript', 'Tailwind CSS v4', 'Motion/React', 'Lucide Icons'],
    responsibilities: [
      'Render core application layout with fluid 12-column grid',
      'Execute interactive Desktop, Tablet, and Mobile viewport emulation',
      'Display synchronized PRD reader and interactive system architecture',
      'Provide drag-and-drop photo uploader and HTML hotlink parser'
    ],
    protocol: 'Virtual DOM / Client-side State'
  },
  {
    id: 'edge-proxy',
    layer: 'gateway',
    title: 'Nginx Ingress & Reverse Proxy',
    subtitle: 'Container Port 3000 Ingress',
    description: 'High-performance ingress controller routing HTTP/WebSocket traffic, managing frame-ancestor security, and terminating external connections.',
    tech: ['Nginx Reverse Proxy', 'CSP Headers', 'HTTP/2', 'Container Networking'],
    responsibilities: [
      'Bind strictly to Port 3000 for external traffic routing',
      'Enforce Content Security Policy (CSP) and frame embedding constraints',
      'Route static Vite assets vs. dynamic API endpoints seamlessly',
      'Protect upstream runtime against malformed payloads'
    ],
    protocol: 'HTTPS / WSS / HTTP 1.1'
  },
  {
    id: 'app-service',
    layer: 'services',
    title: 'Layout & Asset Engine',
    subtitle: 'Frontend Logic & Parser Subsystem',
    description: 'Core runtime service handling HTML parsing, regex-based <img> attribute extraction, image URL validation, and reactive state management.',
    tech: ['TypeScript Engine', 'HTML Tag Sanitizer', 'Local State Stores', 'Observer APIs'],
    responsibilities: [
      'Parse pasted HTML snippets to extract src, alt, and layout parameters',
      'Validate hotlinked URLs and detect CORS/loading errors safely',
      'Maintain reactive state across PRD viewer, architecture canvas, and app preview',
      'Manage local photo blob URLs and asset lifecycle'
    ],
    protocol: 'In-Memory State & DOM Events'
  },
  {
    id: 'storage-tier',
    layer: 'storage',
    title: 'State & Configuration Store',
    subtitle: 'Client Persistence & Metadata Registry',
    description: 'Durable client-side persistence managing active layout configurations, custom user hotlinks, PRD filter state, and device preview presets.',
    tech: ['LocalStorage API', 'Session Storage', 'metadata.json', 'JSON Schema'],
    responsibilities: [
      'Persist hotlinked photo assets and custom screen states across refreshes',
      'Save viewport dimensions and layout density preferences',
      'Synchronize application metadata with platform deployment manifests',
      'Maintain session history of viewed architecture components'
    ],
    protocol: 'Synchronous Key-Value Storage'
  },
  {
    id: 'asset-cdn',
    layer: 'external',
    title: 'Asset CDN & External Hotlinks',
    subtitle: 'Distributed Edge Asset Delivery',
    description: 'High-availability Content Delivery Network supplying hotlinked images, brand logos, mockup photos, and remote vector assets.',
    tech: ['External HTTPS Origins', 'CORS Safeguards', 'referrerPolicy="no-referrer"', 'Unsplash / Remote CDN'],
    responsibilities: [
      'Serve high-resolution mockup screenshots and photography',
      'Enforce referrer-policy="no-referrer" to prevent header leakage',
      'Supply vector icons and typography webfonts asynchronously',
      'Fallback to architectural blueprint placeholders on CDN timeout'
    ],
    protocol: 'HTTPS GET / Binary Media Stream'
  }
];

export const ARCHITECTURE_CONNECTIONS: ArchitectureConnection[] = [
  { from: 'client-ui', to: 'edge-proxy', label: 'HTTP / WebSockets', type: 'sync' },
  { from: 'edge-proxy', to: 'app-service', label: 'Route Ingress', type: 'sync' },
  { from: 'app-service', to: 'storage-tier', label: 'State Sync', type: 'sync' },
  { from: 'client-ui', to: 'asset-cdn', label: 'Hotlink Image Stream', type: 'asset' },
  { from: 'app-service', to: 'client-ui', label: 'Parsed Spec & State', type: 'async' },
];
