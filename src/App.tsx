import React, { useState } from 'react';
import { 
  TargetFps, 
  VirtualApp, 
  DeviceProfile, 
  VirtualRootSettings, 
  EngineSettings,
  GarenaServerRegion
} from './types';
import { 
  INITIAL_DEVICE_PROFILES, 
  INITIAL_VIRTUAL_APPS, 
  INITIAL_ROOT_SETTINGS, 
  INITIAL_ENGINE_SETTINGS 
} from './data/mockData';
import { CodmArena } from './components/CodmArena';
import { VirtualPhone } from './components/VirtualPhone';
import { RootCenter } from './components/RootCenter';
import { DeviceSpoofer } from './components/DeviceSpoofer';
import { VirtualTerminal } from './components/VirtualTerminal';
import { EngineSettingsModal } from './components/EngineSettingsModal';
import { PhoneDownloadModal } from './components/PhoneDownloadModal';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { 
  Smartphone, 
  Crosshair, 
  Shield, 
  ShieldAlert, 
  Terminal, 
  Sliders, 
  Cpu, 
  Zap, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Activity,
  Sparkles,
  Layers,
  Globe,
  Download
} from 'lucide-react';

export default function App() {
  // Global States
  const [activeTab, setActiveTab] = useState<'arena' | 'phone' | 'root' | 'spoofer' | 'terminal'>('arena');
  const [apps, setApps] = useState<VirtualApp[]>(INITIAL_VIRTUAL_APPS);
  const [profiles, setProfiles] = useState<DeviceProfile[]>(INITIAL_DEVICE_PROFILES);
  const [activeProfile, setActiveProfile] = useState<DeviceProfile>(INITIAL_DEVICE_PROFILES[0]);
  const [rootSettings, setRootSettings] = useState<VirtualRootSettings>(INITIAL_ROOT_SETTINGS);
  const [engineSettings, setEngineSettings] = useState<EngineSettings>(INITIAL_ENGINE_SETTINGS);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // FPS Switcher
  const handleFpsChange = (newFps: TargetFps) => {
    setEngineSettings((prev) => ({
      ...prev,
      targetFps: newFps,
      refreshRateForce: newFps === 60 ? 90 : newFps
    }));
    setApps((prevApps) =>
      prevApps.map((a) => (a.id === 'app-codm' ? { ...a, targetFps: newFps } : a))
    );
    showToast(`Target frame rate updated to ${newFps} FPS (V-Sync locked)`);
  };

  // Root Master Toggle
  const handleToggleRootMaster = () => {
    setRootSettings((prev) => {
      const next = !prev.isRootEnabled;
      return {
        ...prev,
        isRootEnabled: next
      };
    });
    showToast(
      !rootSettings.isRootEnabled
        ? 'Virtual Root Superuser (su) activated inside sandbox'
        : 'Virtual Root Superuser disabled'
    );
  };

  // Root Stealth Mode Toggle
  const handleToggleStealthMode = () => {
    setRootSettings((prev) => ({
      ...prev,
      stealthMode: !prev.stealthMode,
      antiCheatBypassGrade: !prev.stealthMode ? 'A+ (Zero Detection)' : 'B (Basic Isolation)'
    }));
    showToast(
      !rootSettings.stealthMode
        ? 'Zygisk Shamiko Stealth ON: /system/xbin/su hidden from CODM'
        : 'Warning: Stealth disabled. Anti-cheat may detect virtual su hooks'
    );
  };

  // Toggle Zygisk Module
  const handleToggleModule = (modId: string) => {
    setRootSettings((prev) => ({
      ...prev,
      zygiskModules: prev.zygiskModules.map((m) =>
        m.id === modId ? { ...m, enabled: !m.enabled } : m
      )
    }));
    showToast('Virtual Zygisk module configuration updated');
  };

  // Select Device Profile
  const handleSelectProfile = (profile: DeviceProfile) => {
    setActiveProfile(profile);
    showToast(`Device spoofed to ${profile.name} (ro.product.model=${profile.model})`);
  };

  // Save Custom Profile
  const handleSaveCustomProfile = (newProfile: DeviceProfile) => {
    setProfiles((prev) => [newProfile, ...prev]);
    setActiveProfile(newProfile);
    showToast(`Custom device profile applied: ${newProfile.name}`);
  };

  // Toggle App Root Access
  const handleToggleAppRoot = (appId: string) => {
    setApps((prev) =>
      prev.map((a) => {
        if (a.id !== appId) return a;
        const nextAccess =
          a.rootAccess === 'granted'
            ? 'stealth_hidden'
            : a.rootAccess === 'stealth_hidden'
            ? 'denied'
            : 'granted';
        return { ...a, rootAccess: nextAccess };
      })
    );
    showToast('Updated app root authorization policy');
  };

  // Add Cloned App
  const handleAddApp = (newApp: Partial<VirtualApp>) => {
    const fullApp: VirtualApp = {
      id: `app-${Date.now()}`,
      name: newApp.name || 'Cloned App',
      packageName: newApp.packageName || 'com.virtual.app',
      category: newApp.category || 'Game',
      icon: newApp.icon || 'Smartphone',
      version: newApp.version || 'v1.0',
      sizeMb: newApp.sizeMb || 120,
      ramUsageMb: newApp.ramUsageMb || 180,
      status: 'idle',
      targetFps: newApp.targetFps || 120,
      deviceProfileId: activeProfile.id,
      is64Bit: true,
      rootAccess: newApp.rootAccess || 'stealth_hidden',
      dataSizeMb: 100,
      cacheSizeMb: 20,
      customFlags: ['--isolated-sandbox', '--target-refresh-120']
    };
    setApps((prev) => [fullApp, ...prev]);
    showToast(`Cloned ${fullApp.name} into virtual sandbox`);
  };

  // Remove App
  const handleRemoveApp = (appId: string) => {
    setApps((prev) => prev.filter((a) => a.id !== appId));
    showToast('Removed app instance from virtual container');
  };

  // Launch App
  const handleLaunchApp = (app: VirtualApp) => {
    setApps((prev) =>
      prev.map((a) => ({
        ...a,
        status: a.id === app.id ? 'running' : a.status
      }))
    );
    setActiveTab('arena');
    showToast(`Launching ${app.name} in 120Hz V-Sync Execution Arena`);
  };

  // Change Garena Server
  const handleServerChange = (server: GarenaServerRegion) => {
    setEngineSettings((prev) => ({ ...prev, garenaServer: server }));
    const serverLabel = 
      server === 'philippines' ? 'Philippines (PH - 22ms)' : 
      server === 'sea_singapore' ? 'SEA (SG/MY - 18ms)' : 
      server === 'indonesia' ? 'Indonesia (ID - 25ms)' : 
      server === 'thailand' ? 'Thailand (TH - 28ms)' : 'Taiwan (TW - 34ms)';
    showToast(`Connected to Garena Server: ${serverLabel}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500/30">
      {/* PWA Mobile Installation & Troubleshooting Banner */}
      <PWAInstallBanner onOpenDownloadModal={() => setIsDownloadModalOpen(true)} />

      {/* Top Application Bar */}
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 via-sky-500 to-emerald-500 flex items-center justify-center text-slate-950 shadow-lg shadow-red-500/20 font-black text-base">
            PS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold tracking-tight text-white flex items-center gap-2">
                PARALLEL SPACE ULTRA
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-black bg-red-500 text-white">
                  CODM GARENA
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-black bg-emerald-500 text-slate-950">
                  120 FPS ROOTED
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 font-mono hidden sm:block">
              Rooted Virtual Space Sandbox • CODM Garena (com.garena.game.codm) 90-120Hz Passthrough Engine
            </p>
          </div>
        </div>

        {/* Quick Diagnostics Badges */}
        <div className="flex items-center gap-2 font-mono text-xs">
          {/* Garena Regional Server Badge */}
          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="px-2.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 flex items-center gap-1.5 transition-colors"
            title="Click to switch Garena Regional Server"
          >
            <Globe className="w-3.5 h-3.5 text-red-400" />
            <span className="font-medium">
              Garena: {engineSettings.garenaServer === 'philippines' ? '🇵🇭 PH (22ms)' : engineSettings.garenaServer === 'sea_singapore' ? '🇸🇬 SEA (18ms)' : engineSettings.garenaServer === 'indonesia' ? '🇮🇩 ID (25ms)' : engineSettings.garenaServer === 'thailand' ? '🇹🇭 TH (28ms)' : '🇹🇼 TW (34ms)'}
            </span>
          </button>

          {/* Spoofed Model Badge */}
          <button
            onClick={() => setActiveTab('spoofer')}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-slate-200 flex items-center gap-1.5 transition-colors"
            title="Click to change spoofed device model"
          >
            <Smartphone className="w-3.5 h-3.5 text-sky-400" />
            <span className="truncate max-w-[130px] font-medium">{activeProfile.model}</span>
          </button>

          {/* Virtual Root Badge */}
          <button
            onClick={() => setActiveTab('root')}
            className={`px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 transition-colors ${
              rootSettings.isRootEnabled
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
            title="Click to configure Superuser and Anti-Ban Stealth"
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="font-medium">
              {rootSettings.isRootEnabled ? 'Root: Active (Stealth)' : 'Root: Disabled'}
            </span>
          </button>

          {/* Direct Phone Download CTA */}
          <button
            id="header-download-phone-btn"
            onClick={() => setIsDownloadModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 hover:from-red-400 hover:to-amber-400 text-white font-bold text-xs font-mono flex items-center gap-1.5 shadow-lg shadow-red-500/25 transition-all cursor-pointer"
            title="Download CODM Garena and setup 120Hz companion on your phone"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download to Phone</span>
            <span className="sm:hidden">Download</span>
          </button>

          {/* Missing Install Option Quick Guide */}
          <button
            id="header-troubleshoot-install-btn"
            onClick={() => setIsDownloadModalOpen(true)}
            className="px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold text-xs font-mono flex items-center gap-1.5 transition-colors"
            title="Don't see 'Install app' or 'Add to Home screen'? Click for quick fix"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Missing "Install"?</span>
          </button>

          {/* Engine Settings Button */}
          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors"
            title="Open Graphics & Engine Tuning"
          >
            <Sliders className="w-4 h-4 text-sky-400" />
          </button>
        </div>
      </header>

      {/* Navigation Tabs Strip */}
      <nav className="bg-slate-900/50 border-b border-slate-800/80 px-4 sm:px-6 flex items-center gap-1 overflow-x-auto text-xs font-mono">
        <button
          id="tab-arena-btn"
          onClick={() => setActiveTab('arena')}
          className={`py-3 px-3.5 border-b-2 font-medium flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'arena'
              ? 'border-red-500 text-red-400 bg-red-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Crosshair className="w-4 h-4" />
          <span>CODM Garena 120Hz Arena</span>
        </button>

        <button
          id="tab-phone-btn"
          onClick={() => setActiveTab('phone')}
          className={`py-3 px-3.5 border-b-2 font-medium flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'phone'
              ? 'border-sky-500 text-sky-400 bg-sky-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Virtual Phone & Apps ({apps.length})</span>
        </button>

        <button
          id="tab-root-btn"
          onClick={() => setActiveTab('root')}
          className={`py-3 px-3.5 border-b-2 font-medium flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'root'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Virtual Root & Anti-Cheat</span>
        </button>

        <button
          id="tab-spoofer-btn"
          onClick={() => setActiveTab('spoofer')}
          className={`py-3 px-3.5 border-b-2 font-medium flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'spoofer'
              ? 'border-sky-500 text-sky-400 bg-sky-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>120FPS Device Spoofer</span>
        </button>

        <button
          id="tab-terminal-btn"
          onClick={() => setActiveTab('terminal')}
          className={`py-3 px-3.5 border-b-2 font-medium flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'terminal'
              ? 'border-purple-500 text-purple-400 bg-purple-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Root Shell Terminal</span>
        </button>

        <button
          id="tab-download-btn"
          onClick={() => setIsDownloadModalOpen(true)}
          className="py-3 px-3.5 border-b-2 font-medium flex items-center gap-1.5 transition-all shrink-0 border-transparent text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 ml-auto"
        >
          <Download className="w-3.5 h-3.5 text-amber-400" />
          <span>Download to Phone</span>
        </button>
      </nav>

      {/* Main Workspace Body */}
      <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto flex flex-col gap-6">
        {/* Notification Toast */}
        {notification && (
          <div className="bg-slate-900 border border-sky-500/40 text-slate-200 px-4 py-2.5 rounded-xl text-xs font-mono flex items-center justify-between gap-3 shadow-xl animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{notification}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-slate-500 hover:text-slate-300 text-xs"
            >
              ✕
            </button>
          </div>
        )}

        {/* View Switcher */}
        {activeTab === 'arena' && (
          <div className="flex flex-col gap-6">
            <CodmArena
              engineSettings={engineSettings}
              activeProfile={activeProfile}
              onFpsChange={handleFpsChange}
              onServerChange={handleServerChange}
              onOpenSettings={() => setIsSettingsModalOpen(true)}
              onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
            />

            {/* Technical Architecture Quick Reference for Running CODM at 120 FPS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sky-400 text-xs font-mono font-bold">
                  <Zap className="w-4 h-4" />
                  <span>1. ZERO-COPY VULKAN (GARENA)</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  CODM Garena (<code className="text-red-400 font-mono">com.garena.game.codm</code>) renders directly into <code className="text-sky-300 font-mono">AHardwareBuffer</code> GPU memory without double-buffering through Android's window manager, guaranteeing a razor-sharp 8.33ms frame interval.
                </p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold">
                  <Cpu className="w-4 h-4" />
                  <span>2. GARENA 120 FPS WHITELIST HOOK</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  CODM Garena restricts the "ULTRA" (120 FPS) frame rate behind a manufacturer model whitelist. The virtual sandbox intercepts <code className="text-emerald-300 font-mono">ro.product.model</code> and reports tournament flagship status.
                </p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-purple-400 text-xs font-mono font-bold">
                  <ShieldAlert className="w-4 h-4" />
                  <span>3. GARENA ACE STEALTH (0 BAN RISK)</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The virtual root daemon is granted to optimization tools (GFX Tool, Termux), while isolated from Garena's customized Anti-Cheat Expert (ACE) daemon to eliminate ban risks.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'phone' && (
          <VirtualPhone
            apps={apps}
            activeProfile={activeProfile}
            rootSettings={rootSettings}
            onLaunchApp={handleLaunchApp}
            onToggleRootAccess={handleToggleAppRoot}
            onAddApp={handleAddApp}
            onRemoveApp={handleRemoveApp}
            onOpenRootCenter={() => setActiveTab('root')}
            onOpenDeviceSpoofer={() => setActiveTab('spoofer')}
            onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
          />
        )}

        {activeTab === 'root' && (
          <RootCenter
            rootSettings={rootSettings}
            apps={apps}
            onToggleRootMaster={handleToggleRootMaster}
            onToggleStealthMode={handleToggleStealthMode}
            onToggleModule={handleToggleModule}
            onSelectRootMode={(mode) => {
              setRootSettings((prev) => ({ ...prev, rootMode: mode }));
              showToast(`Switched virtual root mode to ${mode}`);
            }}
            onClose={() => setActiveTab('arena')}
          />
        )}

        {activeTab === 'spoofer' && (
          <DeviceSpoofer
            profiles={profiles}
            activeProfile={activeProfile}
            onSelectProfile={handleSelectProfile}
            onSaveCustomProfile={handleSaveCustomProfile}
            onClose={() => setActiveTab('arena')}
          />
        )}

        {activeTab === 'terminal' && (
          <VirtualTerminal
            activeProfile={activeProfile}
            engineSettings={engineSettings}
            isRootEnabled={rootSettings.isRootEnabled}
            onClose={() => setActiveTab('arena')}
          />
        )}
      </main>

      {/* Engine Tuning Modal */}
      {isSettingsModalOpen && (
        <EngineSettingsModal
          settings={engineSettings}
          activeProfile={activeProfile}
          onUpdateSettings={(newSettings) => {
            setEngineSettings(newSettings);
            showToast('Engine tuning settings updated');
          }}
          onClose={() => setIsSettingsModalOpen(false)}
        />
      )}

      {/* Phone Download & Mobile Setup Modal */}
      <PhoneDownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        activeProfile={activeProfile}
        engineSettings={engineSettings}
      />

      {/* Minimal Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 px-6 py-4 text-center text-xs font-mono text-slate-500 flex flex-wrap items-center justify-between gap-2">
        <span>Parallel Space Ultra 120FPS • Virtual Userland Root Sandbox</span>
        <span className="text-slate-400">
          Target: 90–120 FPS Stable • Choreographer V-Sync Sync: Active
        </span>
      </footer>
    </div>
  );
}
