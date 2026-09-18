import React, { useState } from 'react';
import { VirtualApp, DeviceProfile, VirtualRootSettings } from '../types';
import { 
  Smartphone, 
  Wifi, 
  BatteryMedium, 
  Plus, 
  Play, 
  Square, 
  Trash2, 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  Cpu, 
  Crosshair, 
  Gauge, 
  Terminal, 
  MessageSquare, 
  Info,
  Sparkles,
  ExternalLink,
  Sliders,
  CheckCircle2,
  Lock,
  Download
} from 'lucide-react';

interface VirtualPhoneProps {
  apps: VirtualApp[];
  activeProfile: DeviceProfile;
  rootSettings: VirtualRootSettings;
  onLaunchApp: (app: VirtualApp) => void;
  onToggleRootAccess: (appId: string) => void;
  onAddApp: (newApp: Partial<VirtualApp>) => void;
  onRemoveApp: (appId: string) => void;
  onOpenRootCenter: () => void;
  onOpenDeviceSpoofer: () => void;
  onOpenDownloadModal?: () => void;
}

export const VirtualPhone: React.FC<VirtualPhoneProps> = ({
  apps,
  activeProfile,
  rootSettings,
  onLaunchApp,
  onToggleRootAccess,
  onAddApp,
  onRemoveApp,
  onOpenRootCenter,
  onOpenDeviceSpoofer,
  onOpenDownloadModal
}) => {
  const [selectedApp, setSelectedApp] = useState<VirtualApp | null>(apps[0] || null);
  const [isCloneModalOpen, setIsCloneModalOpen] = useState(false);
  const [newAppName, setNewAppName] = useState('');
  const [newAppPkg, setNewAppPkg] = useState('');
  const [newAppCategory, setNewAppCategory] = useState<'Game' | 'Root Utility' | 'Optimizer' | 'System'>('Game');
  const [newAppRoot, setNewAppRoot] = useState<'granted' | 'stealth_hidden' | 'denied'>('denied');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Crosshair':
        return <Crosshair className="w-6 h-6 text-amber-400" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-6 h-6 text-emerald-400" />;
      case 'Gauge':
        return <Gauge className="w-6 h-6 text-sky-400" />;
      case 'Terminal':
        return <Terminal className="w-6 h-6 text-purple-400" />;
      case 'Cpu':
        return <Cpu className="w-6 h-6 text-rose-400" />;
      case 'MessageSquare':
        return <MessageSquare className="w-6 h-6 text-emerald-500" />;
      default:
        return <Smartphone className="w-6 h-6 text-slate-400" />;
    }
  };

  const handleCreateClone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppName.trim()) return;

    const newApp: Partial<VirtualApp> = {
      name: newAppName.trim(),
      packageName: newAppPkg.trim() || `com.virtual.${newAppName.toLowerCase().replace(/\s+/g, '')}`,
      category: newAppCategory,
      icon: newAppCategory === 'Game' ? 'Crosshair' : newAppCategory === 'Root Utility' ? 'ShieldAlert' : 'Smartphone',
      version: 'v1.0',
      sizeMb: Math.floor(Math.random() * 200 + 40),
      ramUsageMb: Math.floor(Math.random() * 300 + 100),
      status: 'idle',
      targetFps: newAppCategory === 'Game' ? 120 : 60,
      deviceProfileId: activeProfile.id,
      is64Bit: true,
      rootAccess: newAppRoot,
      dataSizeMb: 150,
      cacheSizeMb: 25,
      customFlags: ['--isolated-storage', '--binder-proxy']
    };

    onAddApp(newApp);
    setNewAppName('');
    setNewAppPkg('');
    setIsCloneModalOpen(false);
  };

  return (
    <div id="virtual-phone-container" className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-full">
      {/* Phone Header Strip */}
      <div className="bg-slate-950/90 border-b border-slate-800/80 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-mono font-semibold text-slate-200">
            VIRTUAL CONTAINER OS 14.0
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
            64-BIT ZYGOTE
          </span>
        </div>

        {/* Android Status Bar Simulation */}
        <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
          <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
            120Hz
          </span>
          <span className="flex items-center gap-1">
            <Wifi className="w-3.5 h-3.5 text-slate-300" /> 5G
          </span>
          <span className="flex items-center gap-1">
            <BatteryMedium className="w-3.5 h-3.5 text-slate-300" /> 98%
          </span>
          <span className="text-slate-300 font-medium">12:00</span>
        </div>
      </div>

      {/* Virtual Device Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-4 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-sky-400 shadow-inner">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white">
                Spoofed Environment: {activeProfile.name}
              </h3>
              {activeProfile.officialTournamentPhone && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  CODM OFFICIAL
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Model: {activeProfile.model} | GPU: {activeProfile.glRenderer}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="change-device-profile-btn"
            onClick={onOpenDeviceSpoofer}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-slate-300 flex items-center gap-1.5 transition-colors"
          >
            <Sliders className="w-3 h-3 text-sky-400" />
            <span>Switch Device Profile</span>
          </button>
          <button
            id="virtual-root-status-btn"
            onClick={onOpenRootCenter}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-colors ${
              rootSettings.isRootEnabled
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
            }`}
          >
            <Shield className="w-3 h-3" />
            <span>Virtual Root: {rootSettings.isRootEnabled ? 'ON (Stealth)' : 'OFF'}</span>
          </button>
          {onOpenDownloadModal && (
            <button
              id="phone-open-download-modal-btn"
              onClick={onOpenDownloadModal}
              className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-400 hover:to-amber-400 text-white font-bold text-xs font-mono flex items-center gap-1.5 transition-all shadow-md shadow-red-500/20"
            >
              <Download className="w-3 h-3" />
              <span>Install to Real Phone</span>
            </button>
          )}
        </div>
      </div>

      {/* Real Phone Quick Setup Banner */}
      {onOpenDownloadModal && (
        <div className="mx-5 mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
            <span className="text-slate-200">
              Ready to play on your actual Android or iOS device?
            </span>
            <span className="text-slate-400 hidden sm:inline">
              Download CODM Garena APK / Play Store & 120Hz unlock script
            </span>
          </div>
          <button
            onClick={onOpenDownloadModal}
            className="px-3 py-1 rounded-lg bg-red-500 hover:bg-red-400 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3 h-3" />
            <span>Get Download Links</span>
          </button>
        </div>
      )}

      {/* Main Apps Grid & Details Split */}
      <div className="flex-1 p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Side: Installed Virtual Apps Grid */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Sandboxed Virtual Apps ({apps.length})
              </span>
              <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                Isolated Storage
              </span>
            </div>
            <button
              id="clone-new-app-btn"
              onClick={() => setIsCloneModalOpen(true)}
              className="px-2.5 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 text-xs font-mono flex items-center gap-1 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Clone / Add App</span>
            </button>
          </div>

          {/* Grid of Apps */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {apps.map((app) => {
              const isSelected = selectedApp?.id === app.id;
              return (
                <div
                  key={app.id}
                  id={`app-card-${app.id}`}
                  onClick={() => setSelectedApp(app)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-3 relative group ${
                    isSelected
                      ? 'bg-slate-800/90 border-sky-500/60 shadow-lg shadow-sky-500/10 ring-1 ring-sky-500/40'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700'
                  }`}
                >
                  {/* Status Badges */}
                  <div className="flex items-center justify-between w-full">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-inner">
                      {getIcon(app.icon)}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {app.packageName === 'com.garena.game.codm' && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-red-500/25 text-red-300 border border-red-500/40">
                          GARENA
                        </span>
                      )}
                      {app.targetFps >= 90 && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          {app.targetFps} FPS
                        </span>
                      )}
                      {app.rootAccess === 'stealth_hidden' && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30" title="Root hidden by Zygisk Shamiko to prevent anti-cheat detection">
                          STEALTH
                        </span>
                      )}
                      {app.rootAccess === 'granted' && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          # SU ROOT
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-slate-100 truncate">
                      {app.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-mono truncate">
                      {app.packageName}
                    </p>
                  </div>

                  {/* Footer status */}
                  <div className="flex items-center justify-between text-[10px] font-mono pt-2 border-t border-slate-800/60">
                    <span className="text-slate-400">{app.category}</span>
                    <span className={app.status === 'running' ? 'text-emerald-400 flex items-center gap-1 font-semibold' : 'text-slate-400'}>
                      {app.status === 'running' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                      {app.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Selected App Inspector & Configuration */}
        <div className="lg:col-span-5 bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between gap-4">
          {selectedApp ? (
            <>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                      {getIcon(selectedApp.icon)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        {selectedApp.name}
                        {selectedApp.is64Bit && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-slate-800 text-slate-300">
                            arm64-v8a
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-slate-400 font-mono">
                        {selectedApp.packageName}
                      </p>
                    </div>
                  </div>

                  {selectedApp.id !== 'app-codm' && selectedApp.id !== 'app-magisk' && (
                    <button
                      id="remove-selected-app-btn"
                      onClick={() => onRemoveApp(selectedApp.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition-colors"
                      title="Uninstall cloned instance"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-2 bg-slate-900/80 border border-slate-800/80 rounded-xl p-2.5 text-xs font-mono">
                  <div>
                    <div className="text-[10px] text-slate-400">RAM Allocation</div>
                    <div className="text-slate-200 font-semibold">{selectedApp.ramUsageMb} MB</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Storage / OBB</div>
                    <div className="text-slate-200 font-semibold">{(selectedApp.sizeMb / 1024).toFixed(1)} GB</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Refresh Rate</div>
                    <div className="text-emerald-400 font-bold">{selectedApp.targetFps} Hz</div>
                  </div>
                </div>

                {/* Root Permission Policy */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-sky-400" /> Root Superuser Policy:
                    </span>
                    <button
                      id="toggle-app-root-btn"
                      onClick={() => onToggleRootAccess(selectedApp.id)}
                      className={`text-xs font-mono px-2 py-1 rounded-lg border transition-all ${
                        selectedApp.rootAccess === 'granted'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : selectedApp.rootAccess === 'stealth_hidden'
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {selectedApp.rootAccess === 'granted' ? 'Granted (# su)' : selectedApp.rootAccess === 'stealth_hidden' ? 'Stealth Hidden' : 'Denied'}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {selectedApp.id === 'app-codm' ? (
                      <span className="text-purple-300 font-mono">
                        Root is isolated & hidden from Call of Duty using Virtual Zygisk Shamiko. Tencent ACE anti-cheat cannot detect `/system/xbin/su` or zygote hooks.
                      </span>
                    ) : selectedApp.rootAccess === 'granted' ? (
                      'Granted full superuser permissions inside virtual space with direct pty access.'
                    ) : (
                      'Standard sandboxed unprivileged execution.'
                    )}
                  </p>
                </div>

                {/* Launch Flags */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-mono text-slate-400">Active Virtual Flags:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedApp.customFlags.map((flag, idx) => (
                      <span key={idx} className="text-[10px] font-mono bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-800">
                        {flag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
                <button
                  id="launch-app-action-btn"
                  onClick={() => onLaunchApp(selectedApp)}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-slate-950 font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 transition-all"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Execute in 120Hz Arena</span>
                </button>
                <button
                  id="clear-app-cache-btn"
                  onClick={() => {
                    alert(`Purged ${selectedApp.cacheSizeMb}MB shader cache from ${selectedApp.name}`);
                  }}
                  className="px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-mono transition-colors"
                  title="Purge Shader Cache"
                >
                  Purge Cache
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 text-xs font-mono py-12">
              Select an app to inspect virtual sandbox properties.
            </div>
          )}
        </div>
      </div>

      {/* Clone App Modal */}
      {isCloneModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-md w-full shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-sky-400" />
                Clone App into Virtual Sandbox
              </h3>
              <button
                onClick={() => setIsCloneModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-1.5 font-mono text-xs">
              <span className="text-slate-400 text-[11px]">Quick Presets:</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setNewAppName('Call of Duty: Mobile (Garena)');
                    setNewAppPkg('com.garena.game.codm');
                    setNewAppCategory('Game');
                    setNewAppRoot('stealth_hidden');
                  }}
                  className="px-2 py-1 rounded bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 text-[11px]"
                >
                  + CODM Garena
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNewAppName('Call of Duty: Mobile (Global)');
                    setNewAppPkg('com.activision.callofduty.shooter');
                    setNewAppCategory('Game');
                    setNewAppRoot('stealth_hidden');
                  }}
                  className="px-2 py-1 rounded bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-300 text-[11px]"
                >
                  + CODM Global
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNewAppName('GFX Tool Pro 120FPS');
                    setNewAppPkg('eu.tsoml.graphicssettings');
                    setNewAppCategory('Optimizer');
                    setNewAppRoot('granted');
                  }}
                  className="px-2 py-1 rounded bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-[11px]"
                >
                  + GFX Tool 120Hz
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateClone} className="flex flex-col gap-3 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">Application Name</label>
                <input
                  type="text"
                  placeholder="e.g., PUBG Mobile, Apex, Discord"
                  value={newAppName}
                  onChange={(e) => setNewAppName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Package Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g., com.tencent.ig"
                  value={newAppPkg}
                  onChange={(e) => setNewAppPkg(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Category</label>
                <select
                  value={newAppCategory}
                  onChange={(e) => setNewAppCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-sky-500"
                >
                  <option value="Game">Game (120 FPS Target)</option>
                  <option value="Root Utility">Root Utility (Magisk/Xposed Module)</option>
                  <option value="Optimizer">Optimizer / GFX Tuner</option>
                  <option value="System">System / Cloned Social</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Virtual Root Policy</label>
                <select
                  value={newAppRoot}
                  onChange={(e) => setNewAppRoot(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-sky-500"
                >
                  <option value="stealth_hidden">Stealth Hidden (Anti-Cheat Safe - Recommended for Games)</option>
                  <option value="granted">Granted Root (Access to /system/xbin/su)</option>
                  <option value="denied">Denied (Standard Sandbox)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCloneModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold shadow-lg shadow-sky-500/20"
                >
                  Instantiate Clone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
