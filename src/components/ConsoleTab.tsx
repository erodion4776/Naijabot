import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Send, HelpCircle, ShieldAlert, Terminal, MessageSquare, 
  Sparkles, CheckCircle, Flame, ShieldCheck 
} from 'lucide-react';
import { Log } from '../types';

interface CommandInfo {
  command: string;
  category: string;
  description: string;
  permissions: 'all' | 'admins' | 'owner';
  aliases: string[];
}

const COMMAND_DICTIONARY: CommandInfo[] = [
  { command: '/help', category: 'General', description: 'Lists all available bot command modules', permissions: 'all', aliases: ['/h', '/commands'] },
  { command: '/ping', category: 'Utility', description: 'Checks server heartbeat, round-trip connection speed', permissions: 'all', aliases: ['/p', '/heartbeat'] },
  { command: '/rules', category: 'General', description: 'Fetches the custom rulebook for this group chat', permissions: 'all', aliases: ['/guidelines'] },
  { command: '/groupinfo', category: 'Utility', description: 'Gets active member counts and moderation status', permissions: 'all', aliases: ['/info'] },
  { command: '/tagall', category: 'Moderation', description: 'Tags/notifies every single member in the chat', permissions: 'admins', aliases: ['/everyone', '/all'] },
  { command: '/settings', category: 'Admin', description: 'Shows active anti-spam, links, and template values', permissions: 'admins', aliases: ['/config'] },
  { command: '/mute', category: 'Moderation', description: 'Locks down the group chat (admins only allowed)', permissions: 'admins', aliases: ['/lock'] },
  { command: '/unmute', category: 'Moderation', description: 'Opens up the group chat to everyone', permissions: 'admins', aliases: ['/unlock'] },
  { command: '/kick', category: 'Moderation', description: 'Removes specified phone number from the group', permissions: 'admins', aliases: ['/remove'] },
  { command: '/ban', category: 'Moderation', description: 'Bans member and adds phone number to strike registry', permissions: 'admins', aliases: ['/blacklist'] },
];

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'system';
  senderName: string;
  text: string;
  timestamp: Date;
}

interface ConsoleTabProps {
  onSimulateLog: (type: Log['type'], message: string, level: Log['level']) => void;
}

export function ConsoleTab({ onSimulateLog }: ConsoleTabProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_1',
      sender: 'system',
      senderName: 'System',
      text: '🤖 NaijaBot Command Simulation sandbox activated.',
      timestamp: new Date(Date.now() - 300000)
    },
    {
      id: 'msg_2',
      sender: 'bot',
      senderName: 'NaijaBot',
      text: '🇳🇬 Welcome to NaijaBot! Try sending a command like /help or /ping to see me in action.',
      timestamp: new Date(Date.now() - 290000)
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    const cleanCommand = userText.toLowerCase().split(' ')[0];
    
    const userMsg: ChatMessage = {
      id: `msg_u_${Date.now()}`,
      sender: 'user',
      senderName: 'Chinedu (You)',
      text: userText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    // Simulate logs in background
    onSimulateLog('command', `Received command: ${cleanCommand} from Chinedu`, 'info');

    // Bot Response Simulation Engine
    setTimeout(() => {
      let botResponse = '';
      let isError = false;

      // Find command in dict (either command or alias)
      const cmdInfo = COMMAND_DICTIONARY.find(
        c => c.command === cleanCommand || c.aliases.includes(cleanCommand)
      );

      if (!cmdInfo) {
        if (cleanCommand.startsWith('/')) {
          botResponse = `⚠️ Unknown command "${cleanCommand}". Send /help to view all active bot command modules.`;
          onSimulateLog('error', `Command execution failed: ${cleanCommand} not found`, 'warn');
        } else {
          botResponse = `ℹ️ NaijaBot commands start with a slash (/). Type /help to see all available admin utilities.`;
        }
      } else {
        // Successful command execution simulation
        onSimulateLog('command', `Executing command: ${cmdInfo.command} (Category: ${cmdInfo.category})`, 'debug');
        
        switch (cmdInfo.command) {
          case '/help':
            botResponse = `🌟 *NaijaBot Commands Dictionary* 🇳🇬\n\n` +
              COMMAND_DICTIONARY.map(c => `🔹 *${c.command}* (${c.permissions}) - ${c.description}`).join('\n');
            break;
          case '/ping':
            const speed = Math.floor(Math.random() * 80) + 12;
            botResponse = `🏓 *Pong!*\n\n• Server Status: *HEALTHY*\n• Latency: *${speed}ms*\n• Reconnects: *0*\n• Engine: *Baileys Multi-Device Websocket*`;
            break;
          case '/rules':
            botResponse = `📜 *Naija Tech Founders Rules* 🇳🇬\n\n1. No spam or affiliate links without context.\n2. Respect other founders.\n3. Keep transactions verified.\n4. No hate speech. Violation of rules triggers automatic warning system!`;
            break;
          case '/groupinfo':
            botResponse = `📊 *Group Metadata Analyzer*\n\n• Name: *Naija Tech Founders 🇳🇬*\n• Members: *245*\n• Admins: *5*\n• Anti-Spam: *ENABLED*\n• Anti-Links: *ENABLED*\n• Bot Status: *ACTIVE*`;
            break;
          case '/tagall':
            botResponse = `📣 *ATENTION EVERYONE!* (Requested by Admin Chinedu)\n\n@Tunde @Funmi @Okafor @Emeka @Halima @Tobi @Nneka\n\nPlease check active announcements inside pinned messages!`;
            break;
          case '/settings':
            botResponse = `⚙️ *Active Platform Configurations*\n\n• Prefix: */*\n• SQLite DB: *Syncing*\n• Warn Threshold: *5*\n• Strike Max: *3*\n• Welcome Broadcast: *Active*`;
            break;
          case '/mute':
            botResponse = `🔒 *Group Lockdown Active!*\n\nOnly group administrators are allowed to send messages in this chat until further notice.`;
            onSimulateLog('command', `Group lockdown active for chat 120363198302910@g.us`, 'warn');
            break;
          case '/unmute':
            botResponse = `🔓 *Group Opened!*\n\nAll members are now free to chat. Please remember to respect group rules.`;
            break;
          case '/kick':
            const parts = userText.split(' ');
            const target = parts.length > 1 ? parts[1] : 'user';
            botResponse = `🚪 *Action Executed: KICK*\n\nUser *${target}* has been successfully ejected from the group for spamming.`;
            onSimulateLog('command', `Ejected spammer ${target} from chat`, 'warn');
            break;
          case '/ban':
            const bParts = userText.split(' ');
            const bTarget = bParts.length > 1 ? bParts[1] : 'user';
            botResponse = `🚫 *Action Executed: BAN & BLACKLIST*\n\nUser *${bTarget}* banned permanently. Number blacklisted in Prisma storage.`;
            onSimulateLog('command', `Blacklisted and banned member ${bTarget}`, 'error');
            break;
          default:
            botResponse = `🤖 Command "${cmdInfo.command}" execution mock successful.`;
        }
      }

      const botMsg: ChatMessage = {
        id: `msg_b_${Date.now()}`,
        sender: isError ? 'system' : 'bot',
        senderName: 'NaijaBot',
        text: botResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    }, 600);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Dictionary Card (Left Column) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 lg:col-span-1 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Terminal className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white font-sans">Command Registry</h3>
          </div>
          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {COMMAND_DICTIONARY.map((cmd) => (
              <div 
                key={cmd.command} 
                onClick={() => setInputValue(cmd.command)}
                className="bg-slate-950 p-2.5 rounded-lg border border-slate-850 hover:border-emerald-500/30 transition duration-150 cursor-pointer text-left"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 font-mono">{cmd.command}</span>
                  <span className={`text-[8px] font-mono font-semibold px-1.5 py-0.5 rounded uppercase ${
                    cmd.permissions === 'admins' ? 'bg-rose-500/10 text-rose-400' :
                    cmd.permissions === 'owner' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {cmd.permissions}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 font-sans">{cmd.description}</p>
                <div className="flex gap-1 mt-1">
                  {cmd.aliases.map(a => (
                    <span key={a} className="text-[8px] font-mono text-slate-500">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-emerald-950/15 border border-emerald-500/10 rounded-xl p-3 text-[10px] text-slate-400 space-y-1 mt-2">
          <p className="font-bold text-slate-300">💡 Command Sandbox</p>
          <p>Click any command block to populate it into the WhatsApp mock simulator input. Test outputs instantly!</p>
        </div>
      </div>

      {/* Simulator Chat Frame (Right Column) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl lg:col-span-2 overflow-hidden flex flex-col h-[520px]">
        {/* Header */}
        <div className="bg-slate-950 border-b border-slate-850 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-sm font-sans shadow-inner shadow-emerald-400/20">
              🇳🇬
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-200 font-sans">Naija Tech Founders 🇳🇬</h4>
              <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                NaijaBot (Online)
              </p>
            </div>
          </div>
          <div className="text-[10px] font-mono text-slate-500 bg-slate-900 px-3 py-1 rounded-full">
            WhatsApp Group Simulator
          </div>
        </div>

        {/* Chat Stream */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-950/40 font-sans text-xs">
          {messages.map((msg) => {
            if (msg.sender === 'system') {
              return (
                <div key={msg.id} className="flex justify-center">
                  <span className="bg-slate-900/60 border border-slate-800/80 text-slate-400 px-3 py-1 rounded-full text-[10px] font-mono">
                    {msg.text}
                  </span>
                </div>
              );
            }

            const isMe = msg.sender === 'user';
            return (
              <div 
                key={msg.id} 
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] rounded-2xl p-3.5 space-y-1 ${
                  isMe 
                    ? 'bg-emerald-600 text-white rounded-tr-none shadow-md shadow-emerald-900/20' 
                    : 'bg-slate-900 text-slate-200 border border-slate-850 rounded-tl-none'
                }`}>
                  <div className="flex items-center justify-between gap-6">
                    <span className={`font-bold text-[10px] ${isMe ? 'text-emerald-200' : 'text-emerald-400'} font-mono`}>
                      {msg.senderName}
                    </span>
                    <span className="text-[9px] text-slate-405 opacity-60">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="whitespace-pre-line text-sm leading-relaxed break-words">{msg.text}</p>
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* Input Form */}
        <form 
          onSubmit={handleSendCommand}
          className="bg-slate-950 border-t border-slate-850 p-4 flex gap-2"
        >
          <input
            type="text"
            placeholder="Type a command (e.g. /ping, /help, /rules)..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-4 flex items-center justify-center cursor-pointer transition duration-200"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
