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

export interface SystemStats {
  status: string;
  timestamp: string;
  uptime: number;
  system: {
    platform: string;
    arch: string;
    nodeVersion: string;
    cpuCount: number;
    freeMemory: number;
    totalMemory: number;
  };
  bot: {
    connectionStatus: 'CONNECTED' | 'DISCONNECTED' | 'CONNECTING';
    sessionActive: boolean;
    reconnectsCount: number;
    groupsCount: number;
  };
}
