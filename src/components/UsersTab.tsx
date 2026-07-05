import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldAlert, ShieldX, UserCheck, AlertTriangle, 
  Trash2, ShieldCheck, Search 
} from 'lucide-react';
import { User } from '../types';

interface UsersTabProps {
  users: User[];
  onUpdateUser: (id: string, updatedData: Partial<User>) => void;
}

export function UsersTab({ users, onUpdateUser }: UsersTabProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleWarnUser = (user: User) => {
    const newWarnCount = user.warningCount + 1;
    let newStatus = user.status;
    let newStrikeCount = user.strikeCount;

    if (newWarnCount >= 5) {
      newStatus = 'BANNED';
      newStrikeCount = Math.min(3, user.strikeCount + 1);
    } else {
      newStatus = 'WARNED';
    }

    onUpdateUser(user.id, {
      warningCount: newWarnCount,
      strikeCount: newStrikeCount,
      status: newStatus,
    });
  };

  const handleStrikeUser = (user: User) => {
    const newStrike = Math.min(3, user.strikeCount + 1);
    const newStatus = newStrike >= 3 ? 'BANNED' : user.status;

    onUpdateUser(user.id, {
      strikeCount: newStrike,
      status: newStatus,
    });
  };

  const handlePardonUser = (user: User) => {
    onUpdateUser(user.id, {
      warningCount: 0,
      strikeCount: 0,
      status: 'CLEAN',
    });
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.whatsappId.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Filters and search header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-white font-sans">Warnings & Penalty Registry</h3>
          <p className="text-xs text-slate-400 font-sans">Configure warnings and strikes for members across all tracked channels.</p>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name or number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs rounded-xl pl-9 pr-4 py-2 w-full sm:w-64 text-slate-200 focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Grid of users */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredUsers.length === 0 ? (
          <div className="col-span-full bg-slate-900/30 border border-slate-800/40 p-12 text-center text-slate-500 rounded-2xl">
            No community members found matching the search criteria.
          </div>
        ) : (
          filteredUsers.map((user) => (
            <motion.div
              layout
              key={user.id}
              className={`bg-slate-900 border rounded-xl p-5 flex flex-col justify-between gap-4 transition duration-200 ${
                user.status === 'BANNED' ? 'border-rose-500/20 bg-rose-950/5' : 'border-slate-800'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-white text-sm font-sans">{user.name}</h4>
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      user.status === 'BANNED' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                      user.status === 'WARNED' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {user.status}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-slate-400">{user.whatsappId}</p>
                </div>

                {/* Scorecards */}
                <div className="flex items-center gap-2">
                  <div className="text-center bg-slate-950/60 border border-slate-800 rounded-lg px-2.5 py-1.5">
                    <p className="text-[10px] font-mono text-slate-500 uppercase">Warns</p>
                    <p className="text-sm font-bold text-slate-200 font-mono">{user.warningCount}/5</p>
                  </div>
                  <div className="text-center bg-slate-950/60 border border-slate-800 rounded-lg px-2.5 py-1.5">
                    <p className="text-[10px] font-mono text-slate-500 uppercase">Strikes</p>
                    <p className="text-sm font-bold text-rose-400 font-mono">{user.strikeCount}/3</p>
                  </div>
                </div>
              </div>

              {/* Warnings meters */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>Warning Meter (5 triggers auto-ban)</span>
                  <span>{user.warningCount * 20}%</span>
                </div>
                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`h-full flex-1 rounded-sm transition duration-300 ${
                        idx < user.warningCount 
                          ? (user.warningCount >= 4 ? 'bg-rose-500 animate-pulse' : 'bg-amber-500') 
                          : 'bg-slate-800/80'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Actions Button Panel */}
              <div className="flex items-center justify-between border-t border-slate-800/60 pt-3 mt-1">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleWarnUser(user)}
                    disabled={user.status === 'BANNED'}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition duration-200 cursor-pointer ${
                      user.status === 'BANNED'
                        ? 'bg-slate-800/50 text-slate-650 border border-transparent'
                        : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Warn User
                  </button>
                  <button
                    onClick={() => handleStrikeUser(user)}
                    disabled={user.status === 'BANNED'}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition duration-200 cursor-pointer ${
                      user.status === 'BANNED'
                        ? 'bg-slate-800/50 text-slate-650 border border-transparent'
                        : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    <ShieldX className="h-3.5 w-3.5" />
                    Strike
                  </button>
                </div>

                <button
                  onClick={() => handlePardonUser(user)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-750 transition duration-200 cursor-pointer"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  Pardon
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
