import React from 'react';
import { VirtualRootSettings, VirtualApp } from '../types';
import { 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  ToggleLeft, 
  ToggleRight, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  Terminal, 
  Lock, 
  EyeOff, 
  Layers, 
  Info,
  Sparkles,
  Zap
} from 'lucide-react';

interface RootCenterProps {
  rootSettings: VirtualRootSettings;
  apps: VirtualApp[];
  onToggleRootMaster: () => void;
  onToggleStealthMode: () => void;
  onToggleModule: (moduleId: string) => void;
  onSelectRootMode: (mode: VirtualRootSettings['rootMode']) => void;
  onClose: () => void;
}

export const RootCenter: React.FC<RootCenterProps> = ({
  rootSettings,
  apps,
  onToggleRootMaster,
  onToggleStealthMode,
  onToggleModule,
  onSelectRootMode,
  onClose
}) => {
  return (
    <div id="root-center-container" className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
      {/* Header */}
      <div className="bg-slate-950/90 border-b border-slate-800/80 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-white font-semibold text-sm">
                VIRTUAL ROOT & SUPERUSER CONTROL CENTER
              </h2>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${
                rootSettings.isRootEnabled
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {rootSettings.isRootEnabled ? 'ROOT DAEMON ACTIVE' : 'ROOT UNLOADED'}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Userland Virtual SU Sandbox • Isolated Mount Namespaces • Zero Host Modification
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-slate-300 transition-colors"
        >
          Back to Arena
        </button>
      </div>

      {/* Main Grid */}
      <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Root Master Toggle & Security Guard */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          {/* Master Switch Card */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-emerald-400" />
                  Virtual Root Superuser (su)
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Grants virtual /system/xbin/su access to tools inside the sandbox.
                </p>
              </div>

              <button
                id="toggle-master-root-btn"
                onClick={onToggleRootMaster}
                className="text-emerald-400 hover:text-emerald-300 transition-colors"
                title={rootSettings.isRootEnabled ? 'Disable Root' : 'Enable Root'}
              >
                {rootSettings.isRootEnabled ? (
                  <ToggleRight className="w-9 h-9" />
                ) : (
                  <ToggleLeft className="w-9 h-9 text-slate-600" />
                )}
              </button>
            </div>

            {/* Architecture Mode Selector */}
            <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-2">
              <span className="text-[11px] font-mono text-slate-400">Virtualization Root Engine:</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'magisk_zygisk', label: 'Magisk Zygisk', desc: 'DenyList + Modules' },
                  { id: 'kernel_su_virtual', label: 'KernelSU Sandbox', desc: 'App-level Hooks' },
                  { id: 'supersu_standard', label: 'SuperSU Legacy', desc: 'Simple SU daemon' }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => onSelectRootMode(mode.id as any)}
                    className={`p-2.5 rounded-lg border text-left flex flex-col gap-1 transition-all ${
                      rootSettings.rootMode === mode.id
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-xs font-semibold">{mode.label}</span>
                    <span className="text-[10px] font-mono opacity-70">{mode.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Anti-Cheat & Ban Protection Status */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-400" />
                Anti-Cheat & Stealth Shield (CODM Safe)
              </h3>
              <button
                id="toggle-stealth-mode-btn"
                onClick={onToggleStealthMode}
                className="text-sky-400 hover:text-sky-300 transition-colors"
                title="Toggle Stealth Mode"
              >
                {rootSettings.stealthMode ? (
                  <ToggleRight className="w-8 h-8" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-slate-600" />
                )}
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              When Stealth is ON, virtual root hooks and su binaries are unmounted from <code className="bg-slate-900 px-1 py-0.5 rounded text-sky-300 font-mono">com.activision.callofduty.shooter</code>'s mount namespace before process launch.
            </p>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Tencent ACE Detection:</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 100% Undetected (Isolated)
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Play Integrity API:</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> MEETS_DEVICE_INTEGRITY
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Anti-Ban Safety Rating:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  {rootSettings.antiCheatBypassGrade}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Zygisk Modules & Per-App Root Table */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          {/* Zygisk Performance & Hook Modules */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                Virtual Zygisk Performance Modules
              </h3>
              <span className="text-[10px] font-mono text-slate-400">
                {rootSettings.zygiskModules.filter((m) => m.enabled).length} of {rootSettings.zygiskModules.length} Active
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {rootSettings.zygiskModules.map((mod) => (
                <div
                  key={mod.id}
                  className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 flex items-start justify-between gap-3"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-100">{mod.name}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                        {mod.version}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      {mod.description}
                    </p>
                  </div>

                  <button
                    onClick={() => onToggleModule(mod.id)}
                    className={`p-1 rounded transition-colors ${
                      mod.enabled ? 'text-emerald-400' : 'text-slate-600'
                    }`}
                  >
                    {mod.enabled ? (
                      <ToggleRight className="w-7 h-7" />
                    ) : (
                      <ToggleLeft className="w-7 h-7" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Superuser Access Grants Matrix */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-amber-400" />
                Superuser Authorization Table
              </h3>
              <span className="text-[10px] font-mono text-slate-400">
                Virtual UID 0 Grants
              </span>
            </div>

            <div className="divide-y divide-slate-800/80">
              {apps.map((app) => (
                <div key={app.id} className="py-2 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-200 font-medium">{app.name}</span>
                    <span className="text-[10px] text-slate-500 truncate max-w-[140px]">{app.packageName}</span>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] ${
                    app.rootAccess === 'granted'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : app.rootAccess === 'stealth_hidden'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'bg-slate-800 text-slate-500'
                  }`}>
                    {app.rootAccess === 'granted' ? 'UID 0 Root' : app.rootAccess === 'stealth_hidden' ? 'DenyList Hidden' : 'Restricted'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
