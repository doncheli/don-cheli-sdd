import { useState } from 'react';
import {
  CheckCircle, Clock, DollarSign, AlertTriangle, TestTube, Pen, Play,
  ChevronDown, ChevronRight, FileText, Database, Globe, FolderTree, Bug, Server,
  Layout, Lock, Layers, Code, GitBranch,
} from 'lucide-react';

// ── Analysis engine ──

interface PlanAnalysis {
  summary: string;
  tech: string[];
  features: { name: string; detail: string }[];
  screens: string[];
  entities: { name: string; fields: string[] }[];
  endpoints: { method: string; path: string; description: string }[];
  architecture: { pattern: string; description: string }[];
  testStrategy: { type: string; description: string; count: string }[];
  fileStructure: { path: string; description: string }[];
  risks: { level: 'low' | 'medium' | 'high'; description: string }[];
  dependencies: string[];
}

function analyzeRequirements(fullTask: string): PlanAnalysis {
  const lower = fullTask.toLowerCase();

  // Summary
  const summary = fullTask.split('\n')[0].substring(0, 300) || 'Project based on provided requirements';

  // Tech detection
  const techMap: Record<string, string[]> = {
    'React': ['react','jsx','tsx','next.js','nextjs','vite'], 'Vue.js': ['vue','nuxt'], 'Angular': ['angular'],
    'Node.js': ['node','express','fastify','nestjs','koa'], 'Python/Django': ['python','django'], 'Python/FastAPI': ['python','fastapi','flask'],
    'TypeScript': ['typescript','ts','type'], 'PostgreSQL': ['postgres','postgresql','sql'], 'MongoDB': ['mongo','mongodb','nosql'],
    'MySQL': ['mysql','mariadb'], 'Redis': ['redis','cache'], 'Docker': ['docker','container','kubernetes'],
    'REST API': ['api','endpoint','rest','crud'], 'GraphQL': ['graphql','apollo','relay'],
    'Stripe': ['stripe','payment','checkout','billing'], 'JWT Auth': ['auth','login','jwt','oauth','session','token'],
    'WebSocket': ['websocket','real-time','realtime','socket','chat','live'],
    'S3/Storage': ['upload','file','s3','storage','media','image'], 'Tailwind CSS': ['tailwind','css'],
    'Prisma/ORM': ['database','schema','model','prisma','sequelize','typeorm'],
  };
  const tech = Object.entries(techMap).filter(([, kws]) => kws.some(k => lower.includes(k))).map(([name]) => name);
  if (tech.length === 0) tech.push('TypeScript', 'Node.js', 'React');
  if (!tech.some(t => t.includes('CSS'))) tech.push('Tailwind CSS');

  // Features
  const featureMap: { p: RegExp; name: string; detail: string }[] = [
    { p: /(?:login|register|sign.?up|auth|account|password)/i, name: 'Authentication', detail: 'User registration, login, password recovery, session management' },
    { p: /(?:dashboard|panel|overview|analytics|metrics|stats)/i, name: 'Dashboard', detail: 'Main dashboard with key metrics, charts, and activity overview' },
    { p: /(?:payment|checkout|billing|stripe|subscription|plan)/i, name: 'Payments', detail: 'Payment processing, billing history, subscription management' },
    { p: /(?:search|filter|sort|query)/i, name: 'Search & Filters', detail: 'Full-text search, advanced filtering, sortable results' },
    { p: /(?:upload|file|image|photo|media|gallery)/i, name: 'File Management', detail: 'File upload, image processing, media gallery, storage' },
    { p: /(?:notification|alert|email|sms|push)/i, name: 'Notifications', detail: 'Email, push, and in-app notifications with preferences' },
    { p: /(?:chat|message|conversation|inbox)/i, name: 'Messaging', detail: 'Real-time messaging, conversations, message history' },
    { p: /(?:admin|manage|backoffice|moderate)/i, name: 'Admin Panel', detail: 'Administration interface with user management and system settings' },
    { p: /(?:profile|settings|preferences|account)/i, name: 'User Profile', detail: 'Profile editing, avatar, preferences, account settings' },
    { p: /(?:cart|order|product|catalog|shop|inventory)/i, name: 'E-commerce', detail: 'Product catalog, shopping cart, order management, inventory' },
    { p: /(?:map|location|geo|address|route)/i, name: 'Geolocation', detail: 'Maps integration, location services, address management' },
    { p: /(?:report|export|csv|pdf|analytics)/i, name: 'Reports & Export', detail: 'Data reports, PDF/CSV export, analytics dashboards' },
    { p: /(?:role|permission|access|rbac)/i, name: 'Access Control', detail: 'Role-based permissions (admin, user, moderator), access policies' },
    { p: /(?:api|integration|webhook|third.?party)/i, name: 'Integrations', detail: 'Third-party API integrations, webhooks, external services' },
    { p: /(?:responsive|mobile|tablet|pwa)/i, name: 'Responsive Design', detail: 'Mobile-first responsive layout for all screen sizes' },
    { p: /(?:i18n|language|translate|locale|multi.?lang)/i, name: 'Internationalization', detail: 'Multi-language support with locale detection' },
    { p: /(?:dark.?mode|theme|appearance)/i, name: 'Theming', detail: 'Dark/light mode, customizable themes' },
  ];
  const features = featureMap.filter(f => f.p.test(fullTask)).map(f => ({ name: f.name, detail: f.detail }));
  if (features.length === 0) features.push({ name: 'Core Features', detail: 'Main application functionality based on your requirements' });

  // Screens
  const screenMap: { p: RegExp; s: string }[] = [
    { p: /(?:login|sign.?in)/i, s: 'Login' }, { p: /(?:register|sign.?up)/i, s: 'Registration' },
    { p: /(?:forgot|reset.?pass)/i, s: 'Password Recovery' }, { p: /(?:dashboard|home|main)/i, s: 'Dashboard' },
    { p: /(?:profile|account)/i, s: 'Profile / Account' }, { p: /(?:settings|config)/i, s: 'Settings' },
    { p: /(?:list|catalog|browse|index)/i, s: 'List / Catalog View' }, { p: /(?:detail|view|show|single)/i, s: 'Detail View' },
    { p: /(?:create|new|add|form)/i, s: 'Create / Edit Form' }, { p: /(?:cart|checkout)/i, s: 'Cart & Checkout' },
    { p: /(?:search|results)/i, s: 'Search Results' }, { p: /(?:admin|manage)/i, s: 'Admin Panel' },
    { p: /(?:notification|inbox)/i, s: 'Notifications' }, { p: /(?:chat|message)/i, s: 'Chat / Messages' },
    { p: /(?:report|analytics)/i, s: 'Reports' }, { p: /(?:error|404|500)/i, s: 'Error Pages (404, 500)' },
  ];
  const screens = screenMap.filter(s => s.p.test(fullTask)).map(s => s.s);
  if (screens.length === 0) screens.push('Main Application');
  screens.push('Loading / Skeleton States', 'Empty States');

  // Entities (extract nouns that look like data models)
  const entityMap: { p: RegExp; name: string; fields: string[] }[] = [
    { p: /(?:user|usuario|account)/i, name: 'User', fields: ['id', 'email', 'name', 'password_hash', 'role', 'avatar', 'created_at'] },
    { p: /(?:product|producto|item)/i, name: 'Product', fields: ['id', 'name', 'description', 'price', 'image_url', 'category', 'stock'] },
    { p: /(?:order|pedido|purchase)/i, name: 'Order', fields: ['id', 'user_id', 'total', 'status', 'items[]', 'shipping_address', 'created_at'] },
    { p: /(?:payment|pago|transaction)/i, name: 'Payment', fields: ['id', 'order_id', 'amount', 'method', 'status', 'stripe_id'] },
    { p: /(?:message|mensaje|chat)/i, name: 'Message', fields: ['id', 'sender_id', 'receiver_id', 'content', 'read', 'created_at'] },
    { p: /(?:notification|notificacion)/i, name: 'Notification', fields: ['id', 'user_id', 'type', 'title', 'body', 'read', 'created_at'] },
    { p: /(?:category|categoria)/i, name: 'Category', fields: ['id', 'name', 'slug', 'parent_id'] },
    { p: /(?:review|reseña|comment)/i, name: 'Review', fields: ['id', 'user_id', 'target_id', 'rating', 'content', 'created_at'] },
    { p: /(?:task|tarea|todo)/i, name: 'Task', fields: ['id', 'title', 'description', 'status', 'assignee_id', 'due_date'] },
    { p: /(?:project|proyecto)/i, name: 'Project', fields: ['id', 'name', 'description', 'owner_id', 'status', 'created_at'] },
  ];
  const entities = entityMap.filter(e => e.p.test(fullTask));
  if (entities.length === 0) entities.push({ p: /.*/, name: 'AppEntity', fields: ['id', 'name', 'data', 'created_at'] });

  // Endpoints
  const endpoints: { method: string; path: string; description: string }[] = [];
  if (/auth|login/i.test(fullTask)) {
    endpoints.push({ method: 'POST', path: '/api/auth/register', description: 'Create new user account' });
    endpoints.push({ method: 'POST', path: '/api/auth/login', description: 'Authenticate and get token' });
    endpoints.push({ method: 'GET', path: '/api/auth/me', description: 'Get current user profile' });
  }
  for (const e of entities.slice(0, 4)) {
    const plural = e.name.toLowerCase() + 's';
    endpoints.push({ method: 'GET', path: `/api/${plural}`, description: `List all ${plural}` });
    endpoints.push({ method: 'POST', path: `/api/${plural}`, description: `Create a ${e.name.toLowerCase()}` });
    endpoints.push({ method: 'GET', path: `/api/${plural}/:id`, description: `Get ${e.name.toLowerCase()} by ID` });
    endpoints.push({ method: 'PUT', path: `/api/${plural}/:id`, description: `Update ${e.name.toLowerCase()}` });
    endpoints.push({ method: 'DELETE', path: `/api/${plural}/:id`, description: `Delete ${e.name.toLowerCase()}` });
  }

  // Architecture
  const architecture: { pattern: string; description: string }[] = [
    { pattern: 'Clean Architecture', description: 'Separated layers: routes → controllers → services → repositories → database' },
  ];
  if (tech.some(t => t.includes('React'))) architecture.push({ pattern: 'Component-Based UI', description: 'Atomic Design: atoms → molecules → organisms → pages' });
  if (tech.some(t => t.includes('API'))) architecture.push({ pattern: 'REST API', description: 'Resource-based endpoints with standard HTTP methods (GET, POST, PUT, DELETE)' });
  if (/auth|jwt/i.test(lower)) architecture.push({ pattern: 'JWT Authentication', description: 'Stateless auth with access + refresh tokens, middleware protection' });
  if (/real.?time|websocket|chat/i.test(lower)) architecture.push({ pattern: 'Event-Driven', description: 'WebSocket connections for real-time updates and notifications' });

  // Test strategy
  const testStrategy = [
    { type: 'Unit Tests', description: 'Each function/component tested in isolation', count: `~${Math.max(features.length * 5, 10)} tests` },
    { type: 'Integration Tests', description: 'API endpoints tested with real database', count: `~${endpoints.length} tests` },
    { type: 'Component Tests', description: 'React components rendered and verified', count: `~${screens.length * 2} tests` },
  ];

  // File structure
  const fileStructure: { path: string; description: string }[] = [
    { path: 'src/', description: 'Source code root' },
    { path: 'src/components/', description: 'Reusable UI components (Atomic Design)' },
    { path: 'src/pages/', description: `${screens.length} page components` },
  ];
  if (tech.some(t => t.includes('API') || t.includes('Node'))) {
    fileStructure.push({ path: 'src/api/', description: 'API route handlers' });
    fileStructure.push({ path: 'src/services/', description: 'Business logic layer' });
    fileStructure.push({ path: 'src/models/', description: `${entities.length} data models` });
  }
  fileStructure.push({ path: 'src/lib/', description: 'Utilities, helpers, config' });
  fileStructure.push({ path: 'test/', description: 'All test files (TDD)' });
  fileStructure.push({ path: '.dc/specs/', description: 'Gherkin specifications' });
  fileStructure.push({ path: '.dc/design/', description: 'UI mockups (Atomic Design)' });

  // Risks
  const risks: PlanAnalysis['risks'] = [];
  if (features.length > 8) risks.push({ level: 'high', description: 'Large scope — consider reducing to MVP first' });
  if (/payment|stripe|billing/i.test(lower)) risks.push({ level: 'medium', description: 'Payment integration requires API keys and testing in sandbox mode' });
  if (/real.?time|websocket/i.test(lower)) risks.push({ level: 'medium', description: 'Real-time features add complexity — may need additional infrastructure' });
  if (entities.length > 5) risks.push({ level: 'medium', description: 'Complex data model — migrations and relationships need careful planning' });
  if (/deploy|production|hosting/i.test(lower)) risks.push({ level: 'low', description: 'Deployment config not included — you\'ll need to set up hosting separately' });
  if (risks.length === 0) risks.push({ level: 'low', description: 'Standard project — no unusual risks detected' });

  // Dependencies
  const dependencies: string[] = [];
  if (tech.some(t => t.includes('React'))) dependencies.push('react', 'react-dom', 'react-router-dom');
  if (tech.some(t => t.includes('Node'))) dependencies.push('express', 'cors', 'dotenv');
  if (tech.some(t => t.includes('TypeScript'))) dependencies.push('typescript', 'tsx');
  if (tech.some(t => t.includes('Prisma'))) dependencies.push('prisma', '@prisma/client');
  if (tech.some(t => t.includes('JWT'))) dependencies.push('jsonwebtoken', 'bcryptjs');
  if (tech.some(t => t.includes('Stripe'))) dependencies.push('stripe');
  if (tech.some(t => t.includes('Tailwind'))) dependencies.push('tailwindcss');
  dependencies.push('vitest'); // Always for TDD

  return { summary, tech, features, screens, entities, endpoints, architecture, testStrategy, fileStructure, risks, dependencies };
}

// ── Collapsible Section ──
function Section({ title, icon, defaultOpen = true, badge, children }: { title: string; icon: React.ReactNode; defaultOpen?: boolean; badge?: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-950 overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-gray-900/50 transition-colors" style={{ background: '#141416' }}>
        {icon}
        <span className="text-xs uppercase tracking-widest flex-1" style={{ color: '#E8E8EC' }}>{title}</span>
        {badge && <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ color: '#E8C547', background: '#E8C54715' }}>{badge}</span>}
        {open ? <ChevronDown className="w-3.5 h-3.5" style={{ color: '#56565E' }} /> : <ChevronRight className="w-3.5 h-3.5" style={{ color: '#56565E' }} />}
      </button>
      {open && <div className="px-4 py-3 border-t border-gray-800/50">{children}</div>}
    </div>
  );
}

// ── Main Component ──
interface Props {
  fullTask: string;
  attachedFiles: { name: string }[];
  sources: { type: string; name: string; value: string }[];
  estPhases: { id: string; name: string; role: string; avatar: string; desc: string; total: number; tdd: number }[];
  totalMin: number;
  totalNoTdd: number;
  complexity: string;
  isFree: boolean;
  provider: string;
  setProvider: (v: string) => void;
  agreed: boolean; setAgreed: (v: boolean) => void;
  signerName: string; setSignerName: (v: string) => void;
  signed: boolean; setSigned: (v: boolean) => void;
  onBack: () => void;
  onStart: () => void;
  error: string | null;
  sourceIcon: (type: string) => React.ReactNode;
}

export function PlanReview(props: Props) {
  const plan = analyzeRequirements(props.fullTask);
  const fmt = (m: number) => m < 60 ? `${m}m` : `${Math.floor(m / 60)}h ${m % 60}m`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Development Plan</h2>
        <button onClick={props.onBack} className="text-xs text-gray-500 hover:text-gray-300 px-3 py-1.5 border border-gray-800 rounded-lg">Edit requirements</button>
      </div>

      {/* Summary */}
      <Section title="Project Summary" icon={<FileText className="w-3.5 h-3.5" style={{ color: '#E8C547' }} />} defaultOpen={true}>
        <p className="text-sm leading-relaxed" style={{ color: '#E8E8EC' }}>{plan.summary}</p>
        {(props.attachedFiles.length > 0 || props.sources.length > 0) && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {props.attachedFiles.map((f, i) => <span key={i} className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded" style={{ color: '#8E8E96', background: '#1A1A1E' }}>📎 {f.name}</span>)}
            {props.sources.map((s, i) => <span key={i} className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded" style={{ color: '#8E8E96', background: '#1A1A1E' }}>{props.sourceIcon(s.type)} {s.name || s.value.substring(0, 25)}</span>)}
          </div>
        )}
      </Section>

      {/* Tech Stack */}
      <Section title="Technology Stack" icon={<Code className="w-3.5 h-3.5" style={{ color: '#4ADE80' }} />} badge={`${plan.tech.length} technologies`}>
        <div className="flex flex-wrap gap-2">
          {plan.tech.map(t => <span key={t} className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{ color: '#4ADE80', background: '#4ADE8015', border: '1px solid #4ADE8030' }}>{t}</span>)}
        </div>
        {plan.dependencies.length > 0 && (
          <div className="mt-3 pt-3 border-t" style={{ borderColor: '#2A2A30' }}>
            <div className="text-[10px] uppercase tracking-widest mb-1.5" style={{ color: '#56565E' }}>npm packages</div>
            <div className="text-xs font-mono" style={{ color: '#8E8E96' }}>{plan.dependencies.join(', ')}</div>
          </div>
        )}
      </Section>

      {/* Features + Screens side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Section title="Features" icon={<CheckCircle className="w-3.5 h-3.5" style={{ color: '#4ADE80' }} />} badge={`${plan.features.length}`}>
          <div className="space-y-2">
            {plan.features.map((f, i) => (
              <div key={i}>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#4ADE80' }} />
                  <span className="text-xs font-medium" style={{ color: '#E8E8EC' }}>{f.name}</span>
                </div>
                <p className="text-[10px] ml-3" style={{ color: '#56565E' }}>{f.detail}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Screens" icon={<Layout className="w-3.5 h-3.5" style={{ color: '#E8C547' }} />} badge={`${plan.screens.length}`}>
          <div className="space-y-1">
            {plan.screens.map((s, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="text-[10px]" style={{ color: '#E8C547' }}>▪</span>
                <span className="text-xs" style={{ color: '#E8E8EC' }}>{s}</span>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* Architecture */}
      <Section title="Architecture" icon={<Layers className="w-3.5 h-3.5" style={{ color: '#E8C547' }} />} defaultOpen={true}>
        <div className="space-y-2">
          {plan.architecture.map((a, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0" style={{ color: '#E8C547', background: '#E8C54715' }}>{a.pattern}</span>
              <span className="text-xs" style={{ color: '#8E8E96' }}>{a.description}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Data Model + API side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Section title="Data Model" icon={<Database className="w-3.5 h-3.5" style={{ color: '#E8C547' }} />} badge={`${plan.entities.length} entities`}>
          <div className="space-y-3">
            {plan.entities.map((e, i) => (
              <div key={i}>
                <div className="text-xs font-bold" style={{ color: '#E8E8EC' }}>{e.name}</div>
                <div className="text-[10px] font-mono mt-0.5" style={{ color: '#56565E' }}>
                  {e.fields.join(' · ')}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="API Endpoints" icon={<Server className="w-3.5 h-3.5" style={{ color: '#E8C547' }} />} badge={`${plan.endpoints.length}`} defaultOpen={false}>
          <div className="space-y-1">
            {plan.endpoints.map((ep, i) => (
              <div key={i} className="flex items-center gap-2 text-[11px] font-mono">
                <span className="w-10 text-right font-bold shrink-0" style={{ color: ep.method === 'GET' ? '#4ADE80' : ep.method === 'POST' ? '#E8C547' : ep.method === 'PUT' ? '#E8C547' : '#F87171' }}>{ep.method}</span>
                <span style={{ color: '#E8E8EC' }}>{ep.path}</span>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* Test Strategy + File Structure */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Section title="Test Strategy (TDD)" icon={<TestTube className="w-3.5 h-3.5" style={{ color: '#4ADE80' }} />}>
          <div className="space-y-2">
            {plan.testStrategy.map((t, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium" style={{ color: '#E8E8EC' }}>{t.type}</span>
                  <p className="text-[10px]" style={{ color: '#56565E' }}>{t.description}</p>
                </div>
                <span className="text-xs font-mono shrink-0" style={{ color: '#4ADE80' }}>{t.count}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-2 border-t text-[10px]" style={{ borderColor: '#2A2A30', color: '#8E8E96' }}>
            Tests are written BEFORE code (Red → Green → Refactor). No // TODO stubs allowed.
          </div>
        </Section>

        <Section title="File Structure" icon={<FolderTree className="w-3.5 h-3.5" style={{ color: '#E8C547' }} />} defaultOpen={false}>
          <div className="space-y-1 font-mono text-[11px]">
            {plan.fileStructure.map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <span style={{ color: '#E8C547' }}>{f.path}</span>
                <span style={{ color: '#56565E' }}>— {f.description}</span>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* Risks */}
      <Section title="Risks & Considerations" icon={<Bug className="w-3.5 h-3.5" style={{ color: '#F87171' }} />}>
        <div className="space-y-2">
          {plan.risks.map((r, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded shrink-0 mt-0.5" style={{
                color: r.level === 'high' ? '#F87171' : r.level === 'medium' ? '#E8C547' : '#4ADE80',
                background: r.level === 'high' ? '#F8717115' : r.level === 'medium' ? '#E8C54715' : '#4ADE8015',
              }}>{r.level}</span>
              <span className="text-xs" style={{ color: '#E8E8EC' }}>{r.description}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-3">
        <div className="p-3 rounded-xl border text-center" style={{ borderColor: '#2A2A30', background: '#141416' }}>
          <Clock className="w-4 h-4 mx-auto mb-1" style={{ color: '#E8C547' }} />
          <div className="text-xl font-bold" style={{ color: '#E8E8EC' }}>{fmt(props.totalMin)}</div>
          <div className="text-[9px] uppercase tracking-widest" style={{ color: '#56565E' }}>Time</div>
        </div>
        <div className="p-3 rounded-xl border text-center" style={{ borderColor: '#2A2A30', background: '#141416' }}>
          <DollarSign className="w-4 h-4 mx-auto mb-1" style={{ color: '#4ADE80' }} />
          <div className="text-xl font-bold" style={{ color: '#4ADE80' }}>{props.isFree ? 'Free' : '$0.74'}</div>
          <div className="text-[9px] uppercase tracking-widest" style={{ color: '#56565E' }}>Cost</div>
        </div>
        <div className="p-3 rounded-xl border text-center" style={{ borderColor: '#2A2A30', background: '#141416' }}>
          <TestTube className="w-4 h-4 mx-auto mb-1" style={{ color: '#4ADE80' }} />
          <div className="text-xl font-bold" style={{ color: '#E8E8EC' }}>+{props.totalMin - props.totalNoTdd}m</div>
          <div className="text-[9px] uppercase tracking-widest" style={{ color: '#56565E' }}>TDD</div>
        </div>
        <div className="p-3 rounded-xl border text-center" style={{ borderColor: '#2A2A30', background: '#141416' }}>
          <AlertTriangle className="w-4 h-4 mx-auto mb-1" style={{ color: '#E8C547' }} />
          <div className="text-lg font-bold capitalize" style={{ color: props.complexity === 'simple' ? '#4ADE80' : props.complexity === 'medium' ? '#E8C547' : '#F87171' }}>{props.complexity}</div>
          <div className="text-[9px] uppercase tracking-widest" style={{ color: '#56565E' }}>Level</div>
        </div>
      </div>

      {/* Phases */}
      <Section title="Execution Phases" icon={<GitBranch className="w-3.5 h-3.5" style={{ color: '#E8C547' }} />} badge={`${props.estPhases.length} phases`}>
        <div className="space-y-1">
          {props.estPhases.map((p, i) => (
            <div key={p.id} className="flex items-center gap-3 py-1.5">
              <span className="text-xs w-4 text-right font-mono" style={{ color: '#56565E' }}>{i + 1}</span>
              <span className="text-lg">{p.avatar}</span>
              <div className="flex-1">
                <span className="text-xs font-medium" style={{ color: '#E8E8EC' }}>{p.name}</span>
                <span className="text-[10px] ml-2" style={{ color: '#56565E' }}>— {p.role}</span>
              </div>
              <span className="text-xs font-mono" style={{ color: '#E8E8EC' }}>{p.total}m</span>
              {p.tdd > 0 && <span className="text-[10px] font-mono" style={{ color: '#4ADE80' }}>+{p.tdd}m</span>}
            </div>
          ))}
        </div>
      </Section>

      {/* Provider */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl border" style={{ borderColor: '#2A2A30', background: '#141416' }}>
        <Globe className="w-4 h-4" style={{ color: '#8E8E96' }} />
        <span className="text-xs" style={{ color: '#8E8E96' }}>Provider:</span>
        <select value={props.provider} onChange={e => props.setProvider(e.target.value)} className="px-3 py-1.5 rounded-lg text-sm" style={{ background: '#1A1A1E', color: '#E8E8EC', border: '1px solid #2A2A30' }}>
          <option value="claude">Claude Code (free)</option><option value="ollama">Ollama (free, local)</option><option value="codex">Codex</option>
        </select>
      </div>

      {/* Safety */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl" style={{ background: '#4ADE8008', border: '1px solid #4ADE8020' }}>
        <Lock className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#4ADE80' }} />
        <div>
          <p className="text-xs font-medium" style={{ color: '#4ADE80' }}>Your project stays safe</p>
          <p className="text-[10px] mt-0.5" style={{ color: '#4ADE8080' }}>Isolated git worktree. Original NEVER modified until all gates pass. If anything fails, nothing changes.</p>
        </div>
      </div>

      {/* Agreement */}
      <div className="rounded-xl border-2 overflow-hidden" style={{ borderColor: props.signed ? '#4ADE8050' : '#2A2A30', background: props.signed ? '#4ADE8008' : '#141416' }}>
        <div className="px-5 py-3 border-b" style={{ borderColor: '#2A2A30' }}>
          <span className="text-xs uppercase tracking-widest" style={{ color: '#E8E8EC' }}>Agreement</span>
        </div>
        <div className="px-5 py-4 space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={props.agreed} onChange={e => { props.setAgreed(e.target.checked); if (!e.target.checked) props.setSigned(false); }}
              className="mt-1 w-5 h-5 rounded border-gray-600 bg-gray-900 text-purple-600 focus:ring-purple-500 cursor-pointer" />
            <span className="text-sm leading-relaxed" style={{ color: '#E8E8EC' }}>
              I reviewed the scope (<strong style={{ color: '#fff' }}>{plan.features.length} features</strong>, <strong style={{ color: '#fff' }}>{plan.screens.length} screens</strong>, <strong style={{ color: '#fff' }}>{plan.entities.length} data models</strong>), tech stack (<strong style={{ color: '#fff' }}>{plan.tech.slice(0, 3).join(', ')}</strong>), estimated time (<strong style={{ color: '#fff' }}>{fmt(props.totalMin)}</strong>), and {plan.risks.filter(r => r.level !== 'low').length} risk(s). <strong style={{ color: '#E8C547' }}>I approve this plan.</strong>
            </span>
          </label>
          {props.agreed && (
            <div className="pt-3 border-t" style={{ borderColor: '#2A2A30' }}>
              <label className="block text-[10px] uppercase tracking-widest mb-2" style={{ color: '#56565E' }}>Sign to confirm</label>
              <div className="flex gap-3">
                <input type="text" placeholder="Your name" value={props.signerName} onChange={e => props.setSignerName(e.target.value)}
                  className="flex-1 px-4 py-3 text-lg font-serif italic rounded-lg focus:outline-none" style={{ background: '#1A1A1E', color: '#fff', borderBottom: '2px solid #56565E' }} />
                <button onClick={() => { if (props.signerName.trim()) props.setSigned(true); }} disabled={!props.signerName.trim()}
                  className="flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium shrink-0" style={{
                    background: props.signed ? '#4ADE80' : props.signerName.trim() ? '#E8C547' : '#2A2A30',
                    color: props.signed || props.signerName.trim() ? '#fff' : '#56565E',
                  }}>
                  {props.signed ? <><CheckCircle className="w-4 h-4" /> Signed</> : <><Pen className="w-4 h-4" /> Sign</>}
                </button>
              </div>
              {props.signed && <p className="text-xs mt-2" style={{ color: '#4ADE80' }}>Approved by <strong>{props.signerName}</strong> — {new Date().toLocaleString()}</p>}
            </div>
          )}
        </div>
        {props.signed && (
          <div className="px-5 py-4 border-t flex justify-end" style={{ borderColor: '#4ADE8030', background: '#4ADE8008' }}>
            <button onClick={props.onStart} className="flex items-center gap-2 px-10 py-3.5 rounded-xl font-medium text-base text-white" style={{ background: '#4ADE80' }}>
              <Play className="w-5 h-5" /> Start Development
            </button>
          </div>
        )}
      </div>
      {props.error && <div className="p-4 rounded-xl text-sm" style={{ background: '#F8717115', border: '1px solid #F8717130', color: '#F87171' }}>{props.error}</div>}
    </div>
  );
}
