export interface GroupSettings {
  antiSpam: boolean;
  antiLinks: boolean;
  antiBadWords: boolean;
  antiFlood: boolean;
  welcomeMessage: string;
  goodbyeMessage: string;
  rulesMessage: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  status: 'ACTIVE' | 'MUTED' | 'INACTIVE';
  adminCount: number;
  settings: GroupSettings;
}

export interface User {
  id: string;
  whatsappId: string;
  name: string;
  warningCount: number;
  strikeCount: number;
  status: 'CLEAN' | 'WARNED' | 'BANNED';
}

export interface Log {
  id: string;
  timestamp: string;
  type: 'connection' | 'command' | 'error' | 'reconnect' | 'api';
  message: string;
  level: 'info' | 'warn' | 'error' | 'debug';
}

// Seed Initial Data
export const mockGroups: Group[] = [
  {
    id: '120363198302910@g.us',
    name: 'Naija Tech Founders 🇳🇬',
    description: 'The official group for tech founders in Lagos, Abuja, and Port Harcourt. Sharing tech trends, business insights, and growth hacks.',
    memberCount: 245,
    status: 'ACTIVE',
    adminCount: 5,
    settings: {
      antiSpam: true,
      antiLinks: true,
      antiBadWords: true,
      antiFlood: false,
      welcomeMessage: 'Welcome to Naija Tech Founders, {user}! Please introduce yourself and state your startup name.',
      goodbyeMessage: 'Goodbye {user}, wishing you success on your journey.',
      rulesMessage: '1. No spam or links without context.\n2. Respect other founders.\n3. Keep it professional.'
    }
  },
  {
    id: '120363294812392@g.us',
    name: 'Alaba Market Electronics Hub 🔌',
    description: 'Wholesalers, retailers, and dealers of genuine consumer electronics in Nigeria.',
    memberCount: 512,
    status: 'ACTIVE',
    adminCount: 3,
    settings: {
      antiSpam: false,
      antiLinks: false,
      antiBadWords: true,
      antiFlood: true,
      welcomeMessage: 'Welcome {user} to the hub! Read the rules and start trading safely.',
      goodbyeMessage: '{user} left the hub.',
      rulesMessage: '1. No fake products.\n2. Verify transactions before payment.\n3. Respect other dealers.'
    }
  },
  {
    id: '120363319082390@g.us',
    name: 'Lekki Residents Association 🏘️',
    description: 'Community development, security updates, and local events within Lekki Phase 1.',
    memberCount: 189,
    status: 'MUTED',
    adminCount: 4,
    settings: {
      antiSpam: true,
      antiLinks: true,
      antiBadWords: true,
      antiFlood: true,
      welcomeMessage: 'Welcome resident {user} to LERA updates. Stay safe!',
      goodbyeMessage: '{user} has relocated.',
      rulesMessage: '1. Official communications only.\n2. No advertising of external platforms.\n3. No politics/religion.'
    }
  }
];

export const mockUsers: User[] = [
  {
    id: 'user_1',
    whatsappId: '2348030000001@s.whatsapp.net',
    name: 'Chinedu Okafor',
    warningCount: 0,
    strikeCount: 0,
    status: 'CLEAN'
  },
  {
    id: 'user_2',
    whatsappId: '2348123456789@s.whatsapp.net',
    name: 'Tunde Bakare',
    warningCount: 1,
    strikeCount: 0,
    status: 'WARNED'
  },
  {
    id: 'user_3',
    whatsappId: '2347098765432@s.whatsapp.net',
    name: 'Funmi Adeniyi',
    warningCount: 3,
    strikeCount: 1,
    status: 'WARNED'
  },
  {
    id: 'user_4',
    whatsappId: '2349088887777@s.whatsapp.net',
    name: 'Unknown Spammer',
    warningCount: 5,
    strikeCount: 3,
    status: 'BANNED'
  }
];

export const mockLogs: Log[] = [
  {
    id: 'log_1',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    type: 'connection',
    message: 'NaijaBot session initializing...',
    level: 'info'
  },
  {
    id: 'log_2',
    timestamp: new Date(Date.now() - 3600000 * 1.9).toISOString(),
    type: 'connection',
    message: 'WhatsApp session credentials loaded successfully',
    level: 'info'
  },
  {
    id: 'log_3',
    timestamp: new Date(Date.now() - 3600000 * 1.8).toISOString(),
    type: 'connection',
    message: 'QR code generated, waiting for authentication scan',
    level: 'warn'
  },
  {
    id: 'log_4',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    type: 'api',
    message: 'GET /api/health received from client dashboard',
    level: 'info'
  }
];

export function addLog(type: Log['type'], message: string, level: Log['level'] = 'info'): Log {
  const newLog: Log = {
    id: `log_${Date.now()}`,
    timestamp: new Date().toISOString(),
    type,
    message,
    level
  };
  mockLogs.unshift(newLog); // Put new logs at the beginning
  // Keep logs size bounded
  if (mockLogs.length > 100) {
    mockLogs.pop();
  }
  return newLog;
}
