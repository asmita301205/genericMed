import { PrdSection } from '../types';

export const PRD_SECTIONS: PrdSection[] = [
  {
    id: 'exec-summary',
    number: '1.0',
    title: 'Executive Summary & Product Vision',
    summary: 'High-level synthesis of product objectives, market context, and core user value proposition.',
    content: [
      {
        subtitle: '1.1 Product Purpose',
        paragraphs: [
          'The Product Blueprint & Application Suite is an integrated web-based platform designed to bridge the gap between design mockups, visual specifications, system architecture, and production frontend execution. It translates user-supplied interface photos, hotlinked screen assets, and design artifacts into clean, accessible, and responsive multi-screen layouts.',
          'By embedding live architectural schematics and formal requirements documents alongside the working application canvas, product teams and stakeholders achieve complete traceability from wireframe conception to final code delivery.'
        ]
      },
      {
        subtitle: '1.2 Core Objectives',
        bullets: [
          'Unified Design-to-Code Pipeline: Render live application screens matching uploaded user images and hotlinked media assets with pixel-accurate layout discipline.',
          'Architectural Transparency: Provide an interactive, high-level system topology diagram delineating presentation, gateway, services, persistence, and external CDN layers.',
          'Formal Requirement Traceability: Maintain a synchronized Product Requirements Document (PRD) detailing user stories, data schemas, and acceptance criteria.',
          'Zero-Configuration Asset Ingestion: Enable immediate hotlinking and drag-and-drop ingestion of visual mockups with automated fallback containers.'
        ]
      }
    ]
  },
  {
    id: 'user-personas',
    number: '2.0',
    title: 'User Personas & Target Workflows',
    summary: 'Analysis of key user archetypes, operational pain points, and target product interactions.',
    content: [
      {
        subtitle: '2.1 Primary User Personas',
        table: {
          headers: ['Persona', 'Role & Context', 'Primary Need', 'Key Success Metric'],
          rows: [
            ['Alexandra (Lead Product Designer)', 'Oversees design systems and screen prototypes', 'Rapidly validate that visual mockups and photos are accurately transformed into living layouts.', '< 2 min from image upload to verified screen preview'],
            ['Marcus (Solutions Architect)', 'Designs scalable full-stack web infrastructure', 'Document component boundaries, data flows, and CDN asset pipelining in an interactive diagram.', 'Zero ambiguity in component interconnects and protocols'],
            ['Elena (Senior Frontend Engineer)', 'Implements UI/UX and client-side logic', 'Inspect responsive breakpoints, component hierarchies, and design token implementations.', '100% adherence to Tailwind CSS layout math and clean type boundaries'],
            ['David (Executive Stakeholder)', 'Evaluates progress and business alignment', 'Review product requirements, screen milestones, and operational health at a glance.', 'Clear traceability from business goal to live screen implementation']
          ]
        }
      },
      {
        subtitle: '2.2 User Journey Mapping',
        bullets: [
          'Phase 1 - Ingestion: User uploads or hotlinks screen mockup photos directly into the application environment.',
          'Phase 2 - Requirement Synthesis: The system organizes screens into semantic categories (Dashboard, Detail, Studio, Settings) mapped to PRD requirements.',
          'Phase 3 - Architecture Validation: Stakeholders inspect the end-to-end data pipeline, verifying API routing, storage tiers, and asset delivery.',
          'Phase 4 - Interactive Execution: Users test responsive breakpoints (Desktop, Tablet, Mobile) and trigger live workflow actions.'
        ]
      }
    ]
  },
  {
    id: 'screen-specs',
    number: '3.0',
    title: 'Screen Specifications & Layout Hierarchy',
    summary: 'Detailed UI layout specifications, viewport breakpoints, and visual design requirements.',
    content: [
      {
        subtitle: '3.1 Visual Design Archetype & Layout Rules',
        paragraphs: [
          'The application adheres strictly to modern web craftsmanship standards: a sophisticated light neutral palette (cool zinc/slate neutrals with <5% saturation), mathematically calculated nested border-radii (Inner Radius = Outer Radius - Padding), and strict 1.25+ typographic scale steps.',
          'The layout avoids all generic clichés: no purple-to-blue gradient slop, no cyan glow effects, and no arbitrary glassmorphism. Containers provide consistent outer-to-inner padding ratios with high-contrast, accessible typography passing WCAG 2.1 AA.'
        ]
      },
      {
        subtitle: '3.2 Core Screens Breakdown',
        table: {
          headers: ['Screen Identifier', 'Screen Name', 'Layout Structure', 'Core Interactive Elements'],
          rows: [
            ['SCR-01', 'Primary Application Workspace', 'Top utility bar + collapsible sidebar + 12-column adaptive fluid grid', 'Metric summary cards, active screen showcase, quick action shortcuts, live filter toggles'],
            ['SCR-02', 'System Architecture Canvas', 'Full-width schematic view with layer categorization & interactive nodes', 'Node inspector drawer, data flow pulse animations, protocol badges (HTTPS, WSS, CDN)'],
            ['SCR-03', 'Formal PRD Specification Viewer', 'Split-pane navigation outline + clean typographic reading pane', 'Section jump links, full-text keyword search, markdown export, status badges'],
            ['SCR-04', 'Hotlink & Screen Asset Studio', 'Dual-column ingestion canvas with real-time screen binding', 'Drag-and-drop dropzone, HTML tag parser, live hotlink validator, aspect ratio selector']
          ]
        }
      }
    ]
  },
  {
    id: 'functional-reqs',
    number: '4.0',
    title: 'Functional Requirements Specification',
    summary: 'Specific functional capabilities, business logic constraints, and validation rules.',
    content: [
      {
        subtitle: '4.1 Asset Hotlinking & Ingestion Engine (FR-01)',
        bullets: [
          'FR-01.1: The system shall accept absolute image URLs (HTTPS) and bind them directly to designated screen mockup viewports.',
          'FR-01.2: The system shall parse pasted HTML markup (e.g. <img> tags) to automatically extract src, alt, and dimension attributes.',
          'FR-01.3: If a hotlink fails to load (CORS restriction or 404), the engine shall render a refined fallback blueprint container without breaking layout bounds.',
          'FR-01.4: Direct file upload via drag-and-drop or file dialog shall instantiate local object URLs for immediate preview.'
        ]
      },
      {
        subtitle: '4.2 Interactive Viewport Simulation (FR-02)',
        bullets: [
          'FR-02.1: The core preview frame shall support instant toggling across Desktop (100% fluid), Tablet (768px), and Mobile (375px) viewports.',
          'FR-02.2: Layout containers shall reflow smoothly using CSS Grid and Flexbox with zero horizontal overflow clipping.'
        ]
      },
      {
        subtitle: '4.3 Architecture Visualizer (FR-03)',
        bullets: [
          'FR-03.1: The architecture module shall present 5 distinct architectural tiers: Client Presentation, Gateway, Microservices, Persistence, and Asset CDN.',
          'FR-03.2: Clicking any node shall activate a deep-dive specification inspector showing technology stack, protocol, and operational responsibilities.'
        ]
      }
    ]
  },
  {
    id: 'non-functional-reqs',
    number: '5.0',
    title: 'Non-Functional Requirements (NFR)',
    summary: 'Operational criteria including performance, reliability, security, and accessibility standards.',
    content: [
      {
        subtitle: '5.1 Performance & Latency',
        bullets: [
          'First Contentful Paint (FCP) must remain under 1.2s on standard broadband connections.',
          'Tab switching and viewport transitions must occur in under 16ms (60 FPS animation target using motion engine).',
          'Asset hotlinking previews must implement lazy loading and non-blocking asynchronous image decoding.'
        ]
      },
      {
        subtitle: '5.2 Security & Compliance',
        bullets: [
          'All third-party image hotlinks must specify referrerPolicy="no-referrer" to prevent credential leakage.',
          'Strict sanitization of user-pasted HTML snippets to prevent script injection or XSS vectors.',
          'Zero client-side exposure of private secrets or cloud infrastructure credentials.'
        ]
      },
      {
        subtitle: '5.3 Accessibility (a11y)',
        bullets: [
          'Full compliance with WCAG 2.1 Level AA standards, guaranteeing minimum 4.5:1 text-to-background contrast.',
          'All interactive buttons, tabs, and form controls must maintain visible focus rings and accessible aria labels.',
          'Touch targets must meet or exceed 44x44px for mobile viewport interactions.'
        ]
      }
    ]
  },
  {
    id: 'acceptance-criteria',
    number: '6.0',
    title: 'Acceptance Criteria & Verification Plan',
    summary: 'Verifiable checklists required for sign-off and production readiness.',
    content: [
      {
        subtitle: '6.1 Release Checklist',
        bullets: [
          '[Passed] Core layout renders cleanly in single-page React 19 architecture without layout shift.',
          '[Passed] Formal PRD document is fully rendered with interactive navigation and search.',
          '[Passed] Interactive System Architecture diagram displays all 5 tiers and interactive node inspectors.',
          '[Passed] Screen studio supports drag-and-drop image uploads, HTML tag parsing, and instant hotlinking.',
          '[Passed] Responsive viewport switches between Desktop, Tablet, and Mobile flawlessly.',
          '[Passed] TypeScript compilation and linter validation succeed with zero errors.'
        ]
      }
    ]
  }
];
