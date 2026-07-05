import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Terminal, ShieldCheck, Settings, Users, Activity, 
  HelpCircle, Sparkles, MessageSquare, AlertOctagon 
} from 'lucide-react';

import { SystemStats, Group, User, Log } from './types';
import { DashboardTab } from './components/DashboardTab';
import { GroupsTab } from './components/GroupsTab';
import { UsersTab } from './components/UsersTab';
import { ConsoleTab } from './components/ConsoleTab';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'groups' | 'users' | 'console'>('dashboard');
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all data from Express API
  const fetchData = async () => {
    setLoading(true);
    try {
      const [healthRes, groupsRes, usersRes, logsRes] = await Promise.all([
        fetch('/api/health'),
        fetch('/api/groups'),
        fetch('/api/users'),
        fetch('/api/logs')
      ]);

      if (healthRes.ok && groupsRes.ok && usersRes.ok && logsRes.ok) {
        const healthData = await healthRes.json();
        const groupsData = await groupsRes.json();
        const usersData = await usersRes.json();
        const logsData = await logsRes.json();

        // Preserve connection simulation in state if active
        setStats(prev => ({
          ...healthData,
          bot: {
            ...healthData.bot,
            connectionStatus: prev?.bot.connectionStatus || 'DISCONNECTED'
          }
        }));
        setGroups(groupsData);
        setUsers(usersData);
        setLogs(logsData);
      }
    } catch (err) {
      console.error('Failed to fetch platform metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSimulateConnection = async (connect: boolean) => {
    if (connect) {
      // Step 1: Set state to connecting
      setStats(prev => prev ? {
        ...prev,
        bot: { ...prev.bot, connectionStatus: 'CONNECTING' }
      } : null);

      // Add a simulation warning log
      await handleSimulateLog('connection', 'Connecting to Baileys multi-device servers...', 'info');

      // Step 2: Set to connected after a quick delay
      setTimeout(async () => {
        setStats(prev => prev ? {
          ...prev,
          bot: { ...prev.bot, connectionStatus: 'CONNECTED', sessionActive: true }
        } : null);
        await handleSimulateLog('connection', '✅ Baileys socket initialized. WhatsApp session successfully restored.', 'info');
        await handleSimulateLog('reconnect', 'NaijaBot fully Synced. Registered chats loaded.', 'info');
      }, 2500);

    } else {
      setStats(prev => prev ? {
        ...prev,
        bot: { ...prev.bot, connectionStatus: 'DISCONNECTED', sessionActive: false }
      } : null);
      await handleSimulateLog('connection', '⛔ WhatsApp session closed by remote command', 'warn');
    }
  };

  const handleSimulateLog = async (type: Log['type'], message: string, level: Log['level']) => {
    try {
      const res = await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, message, level })
      });
      if (res.ok) {
        const newLog = await res.json();
        setLogs(prev => [newLog, ...prev]);
      }
    } catch (err) {
      console.error('Failed to simulate log:', err);
    }
  };

  const handleUpdateGroup = async (id: string, updatedFields: Partial<Group>) => {
    try {
      const res = await fetch(`/api/groups/${id}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
      if (res.ok) {
        const updatedGroup = await res.json();
        setGroups(prev => prev.map(g => g.id === id ? updatedGroup : g));
        // Refresh logs list to catch server log response
        const logsRes = await fetch('/api/logs');
        if (logsRes.ok) {
          setLogs(await logsRes.json());
        }
      }
    } catch (err) {
      console.error('Failed to update group:', err);
    }
  };

  const handleCreateGroup = async (newGroupData: { id: string; name: string; description: string }) => {
    try {
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGroupData)
      });
      if (res.ok) {
        const newGroup = await res.json();
        setGroups(prev => [...prev, newGroup]);
        
        // Refresh logs list
        const logsRes = await fetch('/api/logs');
        if (logsRes.ok) {
          setLogs(await logsRes.json());
        }
      }
    } catch (err) {
      console.error('Failed to register group:', err);
    }
  };

  const handleUpdateUser = async (id: string, updatedFields: Partial<User>) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
        
        // Refresh logs list
        const logsRes = await fetch('/api/logs');
        if (logsRes.ok) {
          setLogs(await logsRes.json());
        }
      }
    } catch (err) {
      console.error('Failed to update user warnings:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-400 antialiased">
      {/* Decorative Blur Elements */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] bg-slate-800/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Top Navigation */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-950/80 border-b border-slate-900 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="h-5 w-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-md font-bold tracking-tight text-white font-sans">NaijaBot</h1>
                <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded-md font-bold uppercase">Phase 1 Dev</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">WhatsApp Group Management Platform</p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold font-sans transition cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="h-3.5 w-3.5" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('groups')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold font-sans transition cursor-pointer ${
                activeTab === 'groups'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Settings className="h-3.5 w-3.5" />
              Groups Config
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold font-sans transition cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              Warnings
            </button>
            <button
              onClick={() => setActiveTab('console')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold font-sans transition cursor-pointer ${
                activeTab === 'console'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="h-3.5 w-3.5" />
              Bot Sandbox
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {loading && logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <div className="h-6 w-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-mono text-slate-400">Loading NaijaBot metrics...</p>
          </div>
        ) : (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === 'dashboard' && (
              <DashboardTab 
                stats={stats} 
                logs={logs} 
                loading={loading} 
                onRefresh={fetchData} 
                onSimulateConnection={handleSimulateConnection} 
              />
            )}

            {activeTab === 'groups' && (
              <GroupsTab 
                groups={groups} 
                onUpdateGroup={handleUpdateGroup} 
                onCreateGroup={handleCreateGroup} 
              />
            )}

            {activeTab === 'users' && (
              <UsersTab 
                users={users} 
                onUpdateUser={handleUpdateUser} 
              />
            )}

            {activeTab === 'console' && (
              <ConsoleTab 
                onSimulateLog={handleSimulateLog} 
              />
            )}
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/40 py-6 px-6 text-center text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 NaijaBot. Highly Scalable WhatsApp Orchestration Layer.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-emerald-400 transition">Documentation</a>
            <span>•</span>
            <a href="#" className="hover:text-emerald-400 transition">REST API</a>
            <span>•</span>
            <a href="#" className="hover:text-emerald-400 transition">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
