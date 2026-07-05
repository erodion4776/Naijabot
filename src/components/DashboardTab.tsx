import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Activity, Server, Cpu, Database, RefreshCw, 
  Wifi, WifiOff, ShieldCheck, CheckCircle, AlertTriangle 
} from 'lucide-react';
import { SystemStats, Log } from '../types';

interface DashboardTabProps {
  stats: SystemStats | null;
  logs: Log[];
  loading: boolean;
  onRefresh: () => void;
  onSimulateConnection: (connect: boolean) => void;
}

export function DashboardTab({ 
  stats, 
  logs, 
  loading, 
  onRefresh, 
  onSimulateConnection 
}: DashboardTabProps) {
  const [showQR, setShowQR] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONNECTED': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'CONNECTING': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      default: return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    }
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-rose-400';
      case 'warn': return 'text-amber-400';
      case 'debug': return 'text-sky-400';
      default: return 'text-emerald-400';
    }
  };

  const formatUptime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hrs}h ${mins}m ${secs}s`;
  };

  const memoryPercentage = stats 
    ? Math.round(((stats.system.totalMemory - stats.system.freeMemory) / stats.system.totalMemory) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Platform Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <span className="flex h-3 w-3 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${stats?.bot.connectionStatus === 'CONNECTED' ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${stats?.bot.connectionStatus === 'CONNECTED' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
            </span>
            <span className="text-xs font-mono tracking-wider uppercase text-slate-400">NaijaBot Core Engine v1.0</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-sans">
            WhatsApp Group Management Hub
          </h2>
          <p className="text-sm text-slate-400 max-w-xl">
            Enterprise-grade monitoring for your Nigerian communities. Moderate spam, handle permissions, and run custom triggers across all connected chats.
          </p>
        </div>

        {/* QR / Connection Quick Action */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {stats?.bot.connectionStatus === 'DISCONNECTED' && (
            <button
              onClick={() => {
                setShowQR(true);
                onSimulateConnection(true);
              }}
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-5 py-3 rounded-xl transition duration-200 shadow-lg shadow-emerald-900/20 text-sm font-sans cursor-pointer"
            >
              <RefreshCw className="h-4 w-4 animate-spin-slow" />
              Simulate QR Login
            </button>
          )}

          {stats?.bot.connectionStatus === 'CONNECTED' && (
            <button
              onClick={() => {
                setShowQR(false);
                onSimulateConnection(false);
              }}
              className="flex items-center justify-center gap-2 bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 border border-rose-500/20 font-semibold px-5 py-3 rounded-xl transition duration-200 text-sm font-sans cursor-pointer"
            >
              <WifiOff className="h-4 w-4" />
              Disconnect Bot
            </button>
          )}

          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 font-semibold px-4 py-3 rounded-xl transition duration-200 text-sm font-sans cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Stats
          </button>
        </div>
      </motion.div>

      {/* QR Simulation Modal/Overlay (if connecting or requested) */}
      {showQR && stats?.bot.connectionStatus === 'CONNECTING' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 text-center space-y-4 max-w-md mx-auto"
        >
          <div className="flex justify-center">
            <div className="p-4 bg-white rounded-xl shadow-inner">
              {/* Fake QR representation */}
              <div className="w-48 h-48 bg-slate-200 flex flex-col items-center justify-center gap-2 rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center p-3 text-white">
                  <div className="grid grid-cols-4 gap-2 w-full h-full opacity-90">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`rounded ${i % 3 === 0 || i % 7 === 1 ? 'bg-emerald-400' : 'bg-slate-800'}`} 
                      />
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 p-4">
                    <span className="text-xs font-mono text-emerald-400 animate-pulse text-center">
                      [ SCAN TO SYNC ]
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white font-sans">Simulating WhatsApp Auth</h3>
            <p className="text-xs text-slate-400 font-sans max-w-sm mx-auto">
              Open WhatsApp on your device, tap Settings &gt; Linked Devices, and point your camera to this screen.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full px-3 py-1 text-xs font-mono">
              <RefreshCw className="h-3 w-3 animate-spin" />
              Awaiting Baileys websocket...
            </div>
          </div>
        </motion.div>
      )}

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Connection Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 font-sans">Connection</span>
            {stats?.bot.connectionStatus === 'CONNECTED' ? (
              <Wifi className="h-5 w-5 text-emerald-400" />
            ) : (
              <WifiOff className="h-5 w-5 text-slate-500" />
            )}
          </div>
          <div>
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono border ${getStatusColor(stats?.bot.connectionStatus || 'DISCONNECTED')}`}>
              {stats?.bot.connectionStatus || 'DISCONNECTED'}
            </div>
            <p className="text-2xl font-bold text-white mt-2 font-sans tracking-tight">
              {stats?.bot.connectionStatus === 'CONNECTED' ? 'Active Sync' : 'Offline'}
            </p>
          </div>
        </div>

        {/* Server Uptime */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 font-sans">Server Uptime</span>
            <Server className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <span className="text-xs font-mono text-emerald-400">Pino & Express</span>
            <p className="text-2xl font-bold text-white mt-2 font-mono tracking-tight">
              {stats ? formatUptime(stats.uptime) : '0h 0m 0s'}
            </p>
          </div>
        </div>

        {/* System Load / Memory */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 font-sans">Memory Usage</span>
            <Cpu className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-mono text-slate-400">{memoryPercentage}% Allocated</span>
              <span className="text-xs font-mono text-slate-400">
                {stats ? `${Math.round((stats.system.totalMemory - stats.system.freeMemory) / 1024 / 1024 / 1024 * 100) / 100}GB` : '0GB'}
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${memoryPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Active Database Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 font-sans">Database Engine</span>
            <Database className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <span className="text-xs font-mono text-slate-400">SQLite Dev Mode</span>
            <div className="flex items-center gap-2 mt-2">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
              <p className="text-lg font-bold text-white font-sans tracking-tight">
                Prisma Synced
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pine Console Logs Streamer */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
        <div className="bg-slate-900/60 border-b border-slate-800 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white font-sans">Live System Logs (Pino)</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-slate-400">Streaming Stdout</span>
          </div>
        </div>
        <div className="p-5 font-mono text-xs space-y-2 bg-slate-950 max-h-72 overflow-y-auto overflow-x-hidden min-h-48 text-slate-300">
          {logs.length === 0 ? (
            <div className="text-slate-500 text-center py-8">
              [No active system operations logged yet]
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3 py-1 border-b border-slate-900 last:border-0 hover:bg-slate-900/20 px-2 rounded">
                <span className="text-slate-500 font-mono text-[10px] whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                  log.level === 'error' ? 'bg-rose-500/10 text-rose-400' :
                  log.level === 'warn' ? 'bg-amber-500/10 text-amber-400' :
                  log.level === 'debug' ? 'bg-sky-500/10 text-sky-400' :
                  'bg-emerald-500/10 text-emerald-400'
                }`}>
                  {log.level}
                </span>
                <span className="text-slate-400 font-mono text-[10px]">
                  [{log.type}]
                </span>
                <span className="text-slate-200 break-all">{log.message}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
