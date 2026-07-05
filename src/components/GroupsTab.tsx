import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, Settings, ShieldAlert, FileText, Check, 
  AlertCircle, PlusCircle, MessageSquarePlus 
} from 'lucide-react';
import { Group } from '../types';

interface GroupsTabProps {
  groups: Group[];
  onUpdateGroup: (id: string, updatedData: Partial<Group>) => void;
  onCreateGroup: (group: { id: string; name: string; description: string }) => void;
}

export function GroupsTab({ groups, onUpdateGroup, onCreateGroup }: GroupsTabProps) {
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(groups[0] || null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states for creating new group
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGroupId, setNewGroupId] = useState('');
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [addError, setAddError] = useState('');

  // Editable settings fields
  const [antiSpam, setAntiSpam] = useState(selectedGroup?.settings.antiSpam || false);
  const [antiLinks, setAntiLinks] = useState(selectedGroup?.settings.antiLinks || false);
  const [antiBadWords, setAntiBadWords] = useState(selectedGroup?.settings.antiBadWords || false);
  const [antiFlood, setAntiFlood] = useState(selectedGroup?.settings.antiFlood || false);
  const [welcomeMsg, setWelcomeMsg] = useState(selectedGroup?.settings.welcomeMessage || '');
  const [goodbyeMsg, setGoodbyeMsg] = useState(selectedGroup?.settings.goodbyeMessage || '');
  const [rulesMsg, setRulesMsg] = useState(selectedGroup?.settings.rulesMessage || '');
  const [groupStatus, setGroupStatus] = useState<Group['status']>(selectedGroup?.status || 'ACTIVE');

  // Keep state updated when selected group changes
  React.useEffect(() => {
    if (selectedGroup) {
      setAntiSpam(selectedGroup.settings.antiSpam);
      setAntiLinks(selectedGroup.settings.antiLinks);
      setAntiBadWords(selectedGroup.settings.antiBadWords);
      setAntiFlood(selectedGroup.settings.antiFlood);
      setWelcomeMsg(selectedGroup.settings.welcomeMessage);
      setGoodbyeMsg(selectedGroup.settings.goodbyeMessage);
      setRulesMsg(selectedGroup.settings.rulesMessage);
      setGroupStatus(selectedGroup.status);
    }
  }, [selectedGroup]);

  const handleSave = async () => {
    if (!selectedGroup) return;
    setIsSaving(true);
    setSaveSuccess(false);

    const updatedData: Partial<Group> = {
      status: groupStatus,
      settings: {
        antiSpam,
        antiLinks,
        antiBadWords,
        antiFlood,
        welcomeMessage: welcomeMsg,
        goodbyeMessage: goodbyeMsg,
        rulesMessage: rulesMsg,
      }
    };

    try {
      await onUpdateGroup(selectedGroup.id, updatedData);
      
      // Update local state copy to match
      setSelectedGroup({
        ...selectedGroup,
        status: groupStatus,
        settings: {
          ...selectedGroup.settings,
          ...updatedData.settings
        }
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');

    if (!newGroupId.endsWith('@g.us')) {
      setAddError('WhatsApp Group ID must end with @g.us (e.g. 12345678@g.us)');
      return;
    }

    if (!newGroupName.trim()) {
      setAddError('Group name is required');
      return;
    }

    onCreateGroup({
      id: newGroupId,
      name: newGroupName,
      description: newGroupDesc
    });

    // Reset Form
    setNewGroupId('');
    setNewGroupName('');
    setNewGroupDesc('');
    setShowAddForm(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Sidebar - Groups List */}
      <div className="space-y-4 lg:col-span-1">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-400 font-sans tracking-wider uppercase">Active Chats ({groups.length})</h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-medium font-sans cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            Add Group
          </button>
        </div>

        {/* Add Group Form */}
        {showAddForm && (
          <motion.form 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleCreateGroup}
            className="bg-slate-900 border border-emerald-500/20 p-4 rounded-xl space-y-3"
          >
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">WhatsApp JID</label>
              <input
                type="text"
                placeholder="e.g. 1203632948@g.us"
                value={newGroupId}
                onChange={e => setNewGroupId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-1.5 text-xs font-mono focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Group Name</label>
              <input
                type="text"
                placeholder="Naija Developers"
                value={newGroupName}
                onChange={e => setNewGroupName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-1.5 text-xs font-sans focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Description</label>
              <textarea
                placeholder="Lively community for sharing code..."
                value={newGroupDesc}
                onChange={e => setNewGroupDesc(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-1.5 text-xs font-sans focus:border-emerald-500 focus:outline-none h-16 resize-none"
              />
            </div>
            {addError && (
              <p className="text-[10px] text-rose-400 font-sans flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {addError}
              </p>
            )}
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg py-1.5 text-xs font-semibold font-sans cursor-pointer text-center"
              >
                Register
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="flex-1 bg-slate-800 hover:bg-slate-750 text-slate-400 rounded-lg py-1.5 text-xs font-semibold font-sans cursor-pointer text-center"
              >
                Cancel
              </button>
            </div>
          </motion.form>
        )}

        <div className="space-y-2">
          {groups.map((group) => (
            <button
              key={group.id}
              onClick={() => setSelectedGroup(group)}
              className={`w-full text-left p-4 rounded-xl border transition duration-200 cursor-pointer ${
                selectedGroup?.id === group.id
                  ? 'bg-slate-900 border-emerald-500/30'
                  : 'bg-slate-900/40 border-slate-800/60 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-white font-sans text-sm truncate max-w-[160px]">{group.name}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                  group.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400' :
                  group.status === 'MUTED' ? 'bg-amber-500/10 text-amber-400' :
                  'bg-slate-800 text-slate-400'
                }`}>
                  {group.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans line-clamp-1 mb-2">{group.description}</p>
              <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500">
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {group.memberCount} members
                </span>
                <span>•</span>
                <span>{group.adminCount} admins</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Settings Panel */}
      <div className="lg:col-span-2">
        {selectedGroup ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-5">
              <div>
                <h2 className="text-lg font-bold text-white font-sans">{selectedGroup.name}</h2>
                <p className="text-xs font-mono text-slate-500 mt-1">ID: {selectedGroup.id}</p>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-400 font-sans">Chat Status:</label>
                <select
                  value={groupStatus}
                  onChange={(e) => setGroupStatus(e.target.value as Group['status'])}
                  className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="ACTIVE">ACTIVE (Moderate & Bot Commands)</option>
                  <option value="MUTED">MUTED (Bot silent)</option>
                  <option value="INACTIVE">INACTIVE (Bot ignored)</option>
                </select>
              </div>
            </div>

            {/* Moderation Rules (Toggles) */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800/40 pb-2">
                <ShieldAlert className="h-4 w-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wide">Automated Moderation Guard</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Anti Spam */}
                <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800/50">
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-slate-200 font-sans">Anti Spam Guard</p>
                    <p className="text-[10px] text-slate-500 font-sans">Auto-warn users sending repetitive files/text</p>
                  </div>
                  <button
                    onClick={() => setAntiSpam(!antiSpam)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                      antiSpam ? 'bg-emerald-500' : 'bg-slate-800'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      antiSpam ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                {/* Anti Links */}
                <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800/50">
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-slate-200 font-sans">Anti External Links</p>
                    <p className="text-[10px] text-slate-500 font-sans">Delete unapproved website/invite urls</p>
                  </div>
                  <button
                    onClick={() => setAntiLinks(!antiLinks)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                      antiLinks ? 'bg-emerald-500' : 'bg-slate-800'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      antiLinks ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                {/* Anti Bad Words */}
                <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800/50">
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-slate-200 font-sans">Anti Bad Words</p>
                    <p className="text-[10px] text-slate-500 font-sans">Censor offensive/toxic nigerian slang</p>
                  </div>
                  <button
                    onClick={() => setAntiBadWords(!antiBadWords)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                      antiBadWords ? 'bg-emerald-500' : 'bg-slate-800'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      antiBadWords ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                {/* Anti Flood */}
                <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800/50">
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-slate-200 font-sans">Anti Rapid Flood</p>
                    <p className="text-[10px] text-slate-500 font-sans">Mute chat temporarily if flooded with lines</p>
                  </div>
                  <button
                    onClick={() => setAntiFlood(!antiFlood)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                      antiFlood ? 'bg-emerald-500' : 'bg-slate-800'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      antiFlood ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Custom Messaging Templates */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800/40 pb-2">
                <FileText className="h-4 w-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wide">Custom Message Templates</h3>
              </div>

              <div className="space-y-3">
                {/* Welcome Template */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs text-slate-300 font-medium">Welcome Broadcast</label>
                    <span className="text-[10px] font-mono text-slate-500">Variables: {'{user}'}, {'{name}'}</span>
                  </div>
                  <textarea
                    value={welcomeMsg}
                    onChange={(e) => setWelcomeMsg(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 h-16 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Goodbye Template */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs text-slate-300 font-medium">Goodbye Broadcast</label>
                    <span className="text-[10px] font-mono text-slate-500">Variables: {'{user}'}</span>
                  </div>
                  <textarea
                    value={goodbyeMsg}
                    onChange={(e) => setGoodbyeMsg(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 h-16 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Rules Message */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs text-slate-300 font-medium">Group Guidelines (/rules command response)</label>
                  </div>
                  <textarea
                    value={rulesMsg}
                    onChange={(e) => setRulesMsg(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 h-20 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Save Buttons */}
            <div className="flex items-center justify-between border-t border-slate-800 pt-5">
              <div className="text-[10px] font-mono text-slate-500">
                *Changes will apply instantly to Baileys socket.
              </div>
              <div className="flex items-center gap-3">
                {saveSuccess && (
                  <motion.span 
                    initial={{ opacity: 0, x: 5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xs text-emerald-400 font-medium flex items-center gap-1"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Settings Saved
                  </motion.span>
                )}
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition duration-200 flex items-center gap-2 cursor-pointer"
                >
                  {isSaving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </div>

          </motion.div>
        ) : (
          <div className="bg-slate-900/30 border border-slate-800/40 rounded-2xl p-12 text-center text-slate-500">
            Select a group from the list or register a new one to start configuring.
          </div>
        )}
      </div>
    </div>
  );
}
