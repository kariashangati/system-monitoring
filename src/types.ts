export interface AppConfig {
  urls: string[];
  proxies: string[];
  email: string;
  intervalSeconds: number;
  blockedLinks: string[];
  crawlEnabled: boolean;
  crawlDepth: number;
}

export interface UptimeLog {
  id: string;
  url: string;
  status: 'up' | 'down';
  timestamp: string;
  responseTime?: number;
  errorDetails?: string;
  proxyUsed?: string | null;
  isSubLink?: boolean;
  parentUrl?: string;
}

export interface CrawledLink {
  id: string;
  monitorId?: string;
  parentUrl: string;
  href: string;
  linkText?: string;
  isStatic: boolean;
  isDynamic: boolean;
  lastStatus: 'up' | 'down' | 'pending';
  lastChecked?: string;
  responseTime?: number;
  isBlocked: boolean;
  depth: number;
}
