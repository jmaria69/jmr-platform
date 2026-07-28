export interface Project {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  tech: string[];
  status: "production" | "beta" | "development";
  category: "web" | "desktop" | "mobile" | "ai" | "automation";
  url?: string;
  github?: string;
  videoUrl?: string;
  image: string;
  color: string;
  sortOrder?: number;
  showOnHome?: boolean;
  showInLab?: boolean;
  metrics?: {
    users?: number;
    revenue?: number;
    rating?: number;
  };
}

export interface Visitor {
  id: string;
  ip: string;
  country: string;
  city: string;
  device: "mobile" | "tablet" | "desktop";
  os: "iOS" | "Android" | "Windows" | "macOS" | "Linux";
  browser: string;
  page: string;
  referrer: string;
  timestamp: Date;
  duration: number; // seconds
  projectViewed?: string;
}

export interface CRMContact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  source: "web" | "referral" | "social" | "direct" | "campaign";
  stage: "lead" | "contacted" | "qualified" | "proposal" | "negotiation" | "closed-won" | "closed-lost";
  value: number;
  notes: string;
  tags: string[];
  lastContact: Date;
  createdAt: Date;
  interactions: Interaction[];
}

export interface Interaction {
  id: string;
  type: "email" | "call" | "meeting" | "note" | "demo";
  date: Date;
  summary: string;
}

export interface DashboardStats {
  visitorsToday: number;
  visitorsWeek: number;
  visitorsMonth: number;
  activeNow: number;
  revenueTotal: number;
  revenueMonth: number;
  conversionRate: number;
  avgSessionDuration: number;
  bounceRate: number;
  trafficByDay: { label: string; visitors: number }[];
  trafficByMonth: { label: string; visitors: number }[];
  trafficByYear: { label: string; visitors: number }[];
  deviceData: { device: string; count: number }[];
  osData: { os: string; count: number }[];
  trafficByCountry: { country: string; visitors: number }[];
}

export interface CRMPipelineStage {
  id: string;
  name: string;
  contacts: CRMContact[];
  totalValue: number;
}
