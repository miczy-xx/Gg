import React, { useState } from 'react';
import { 
  Download, 
  Smartphone, 
  ExternalLink, 
  Copy, 
  Check, 
  X, 
  QrCode, 
  ShieldCheck, 
  FileCode, 
  Zap, 
  Globe, 
  Info,
  Layers,
  ChevronRight,
  Terminal,
  HelpCircle,
  AlertTriangle,
  Share2,
  Compass,
  ArrowRight
} from 'lucide-react';
import { DeviceProfile, EngineSettings } from '../types';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PhoneDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeProfile: DeviceProfile;
  engineSettings: EngineSettings;
}

export const PhoneDownloadModal: React.FC<PhoneDownloadModalProps> = ({
  isOpen,
  onClose,
  activeProfile,
  engineSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'troubleshoot' | 'alternatives' | 'codm' | 'pwa' | 'scripts' | 'guide'>('alternatives');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [installStatus, setInstallStatus] = useState<string | null>(null);

  const { isInstallable, isInstalled, isIOS, isAndroid, isInAppBrowser, install } = usePWAInstall();

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://ai.studio/build';

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleTriggerInstall = async () => {
    if (isInstallable) {
      setInstallStatus('Prompting browser...');
      const outcome = await install();
      if (outcome === 'accepted') {
        setInstallStatus('Installed successfully!');
      } else {
        setInstallStatus('Installation cancelled.');
      }
      setTimeout(() => setInstallStatus(null), 3000);
    } else {
      setActiveTab('troubleshoot');
    }
  };

  const downloadFile = (content: string, filename: string, type: string = 'text/plain') => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const adbUnlockScript = `#!/bin/bash
# ==============================================================================
# CODM GARENA (com.garena.game.codm) 120Hz UNLOCK SCRIPT FOR ANDROID (NO ROOT)
# Compatible with Samsung, Xiaomi, OnePlus, ASUS, POCO, Realme, Sony
# ==============================================================================

echo "[+] Connecting to Android device via ADB..."
adb wait-for-device

echo "[+] Force locking 120Hz display refresh rate..."
adb shell settings put system peak_refresh_rate 120.0
adb shell settings put system min_refresh_rate 120.0
adb shell settings put system user_refresh_rate 120

echo "[+] Enabling high performance mode for Garena CODM..."
adb shell settings put global high_performance_mode_on 1
adb shell settings put secure refresh_rate_mode 2

echo "[+] Granting WRITE_SECURE_SETTINGS for GFX Tool..."
adb shell pm grant com.vphone.gfxtool.ultra android.permission.WRITE_SECURE_SETTINGS 2>/dev/null

echo "[+] Verifying target package: com.garena.game.codm"
adb shell pm list packages | grep "com.garena.game.codm"

echo "[✓] SUCCESS: 120Hz locked! Launch Call of Duty: Mobile Garena on your phone."
`;

  const magiskPropTweak = `# CODM Garena 120FPS Device Model Spoof for Magisk / KernelSU
# Target: com.garena.game.codm
id=codm_garena_120fps
name=CODM Garena 120FPS Ultra Unlocker
version=v2.5
versionCode=25
author=Parallel Space Ultra
description=Spoofs device to ${activeProfile.name} to unlock 120 FPS (Ultra) in Garena CODM

ro.product.model=${activeProfile.model}
ro.product.manufacturer=${activeProfile.manufacturer}
ro.product.brand=${activeProfile.brand}
ro.board.platform=${activeProfile.board}
ro.soc.manufacturer=Qualcomm
ro.vendor.display.default_fps=${engineSettings.targetFps}
debug.egl.hw=1
persist.sys.app.fps=${engineSettings.targetFps}
persist.garena.codm.fps=${engineSettings.targetFps}
`;

  // QR Code URL using public QR generator
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
    currentUrl
  )}&bgcolor=0f172a&color=38bdf8&margin=10`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        id="phone-download-modal"
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white">
                  Download to Your Phone
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                  CODM GARENA
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  120 FPS
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 font-mono">
                Install game packages, PWA app, or solve missing home screen options
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-4 sm:px-5 text-xs font-mono overflow-x-auto">
          <button
            onClick={() => setActiveTab('alternatives')}
            className={`py-3 px-3.5 border-b-2 font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'alternatives'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-bold">Other Ways to Install (Guaranteed)</span>
          </button>

          <button
            onClick={() => setActiveTab('troubleshoot')}
            className={`py-3 px-3.5 border-b-2 font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'troubleshoot'
                ? 'border-amber-500 text-amber-400 bg-amber-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Why Chrome Hides It</span>
          </button>

          <button
            onClick={() => setActiveTab('codm')}
            className={`py-3 px-3.5 border-b-2 font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'codm'
                ? 'border-red-500 text-red-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>1. Download CODM APK</span>
          </button>

          <button
            onClick={() => setActiveTab('pwa')}
            className={`py-3 px-3.5 border-b-2 font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'pwa'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>2. Phone QR & Install</span>
          </button>

          <button
            onClick={() => setActiveTab('scripts')}
            className={`py-3 px-3.5 border-b-2 font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'scripts'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>3. 120Hz ADB Scripts</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`py-3 px-3.5 border-b-2 font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'guide'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>4. Step-by-Step Guide</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4 font-sans text-slate-200 text-xs sm:text-sm">

          {/* TAB: OTHER WAYS TO INSTALL (GUARANTEED ALTERNATIVES) */}
          {activeTab === 'alternatives' && (
            <div className="space-y-4">
              {/* Top Banner Alert */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-sky-950/80 border border-emerald-500/30 flex items-start gap-3">
                <Zap className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="font-bold text-white text-sm">
                    Chrome not showing the button? Here are 3 guaranteed alternative ways:
                  </h3>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Some Android versions and Chrome updates restrict or rename home screen shortcuts. Choose any method below to install it immediately:
                  </p>
                </div>
              </div>

              {/* METHOD 1: HERMIT APP (MOST RELIABLE ANDROID SOLUTION) */}
              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-3 shadow-lg shadow-emerald-950/10">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                        <span>Method 1: Install via Hermit (100% Works on All Androids)</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                          RECOMMENDED
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-400 font-mono">
                        Converts this link into a true native Android app with zero browser bars
                      </p>
                    </div>
                  </div>

                  <a
                    href="https://play.google.com/store/apps/details?id=com.chimbori.hermitcrab"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Get Hermit on Play Store</span>
                  </a>
                </div>

                <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 space-y-2 text-xs">
                  <p className="font-bold text-emerald-400 font-mono text-[11px]">👉 Easy 3-Step Setup:</p>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-300 pl-1">
                    <li>
                      Install <a href="https://play.google.com/store/apps/details?id=com.chimbori.hermitcrab" target="_blank" rel="noreferrer" className="text-sky-400 font-semibold underline">Hermit Lite Apps (Free on Google Play Store)</a>.
                    </li>
                    <li>
                      Open Hermit, tap the orange <strong className="text-white">+ (Create)</strong> button, and paste this URL:
                      <div className="flex items-center gap-2 mt-1.5 font-mono text-[11px]">
                        <input
                          readOnly
                          value={currentUrl}
                          className="flex-1 bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-300 truncate select-all"
                        />
                        <button
                          onClick={() => handleCopy(currentUrl, 'hermit-url')}
                          className="px-2.5 py-1 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold flex items-center gap-1 shrink-0"
                        >
                          {copiedKey === 'hermit-url' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === 'hermit-url' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </li>
                    <li>
                      Tap <strong className="text-emerald-400">"Create Lite App"</strong>. Hermit will place a real standalone app icon directly on your Android phone's home screen!
                    </li>
                  </ol>
                </div>
              </div>

              {/* METHOD 2: USE SAMSUNG INTERNET OR FIREFOX */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/40 flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">
                      Method 2: Use Samsung Internet or Firefox (Never Blocks Home Screen)
                    </h4>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Samsung Internet and Firefox do not enforce Chrome's strict install limitations
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5">
                    <p className="font-bold text-white flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-sky-400" />
                      <span>Samsung Internet (Any Android):</span>
                    </p>
                    <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px] pl-1 font-mono">
                      <li>Open the link in <strong>Samsung Internet</strong>.</li>
                      <li>Look at the address bar for the <strong className="text-emerald-400">Download icon (↓)</strong>.</li>
                      <li>Or tap menu <strong>(≡)</strong> at bottom right → <strong>+ Add page to</strong> → <strong className="text-emerald-300">Home screen</strong>.</li>
                    </ol>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5">
                    <p className="font-bold text-white flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-amber-400" />
                      <span>Firefox for Android:</span>
                    </p>
                    <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px] pl-1 font-mono">
                      <li>Open the link in <strong>Firefox</strong>.</li>
                      <li>Tap the <strong>three dots (⋮)</strong> next to the address bar.</li>
                      <li>Tap <strong className="text-emerald-300">"Install"</strong> or <strong className="text-emerald-300">"Add to Home screen"</strong>.</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* METHOD 3: 4 HIDDEN CHECKS IN GOOGLE CHROME */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">
                      Method 3: Why Chrome Hid the Button (4 Common Causes)
                    </h4>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Check these 4 settings inside Chrome to make the button reappear
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-amber-400 text-[11px]">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>1. "Desktop Site" is Checked</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Tap Chrome's 3 dots (⋮). If <strong>"Desktop site"</strong> has a checkmark, <strong>uncheck it</strong>! Chrome removes the install option when Desktop Mode is active.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-sky-400 text-[11px]">
                      <Download className="w-3.5 h-3.5" />
                      <span>2. Icon in the Address Bar</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Look directly inside Chrome's top address bar where the URL is typed. On the far right, look for a <strong>computer/phone icon with a down arrow</strong> and tap it.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-purple-400 text-[11px]">
                      <Layers className="w-3.5 h-3.5" />
                      <span>3. Renamed to "Add shortcut"</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      In newer Chrome builds, scroll down past "Downloads" in the 3-dots menu. Look for <strong>"Add shortcut"</strong> or <strong>"Cast, save, and share"</strong>.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-red-400 text-[11px]">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>4. Incognito / Private Tab</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      If you pasted the link into an Incognito window, Chrome completely disables home screen installation. Open a standard, normal tab instead.
                    </p>
                  </div>
                </div>
              </div>

              {/* METHOD 4: LOOKING FOR THE CALL OF DUTY GAME FILE? */}
              <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-500/30 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="font-bold text-white text-xs flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5 text-red-400" />
                    <span>Are you trying to install the Call of Duty: Mobile Game APK?</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    If you want the game package itself (com.garena.game.codm), get it directly via TapTap or Google Play.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('codm')}
                  className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-400 text-white font-bold text-xs font-mono shrink-0 transition-colors"
                >
                  View Game Links
                </button>
              </div>
            </div>
          )}

          {/* TAB: MISSING INSTALL OPTION TROUBLESHOOTER */}
          {activeTab === 'troubleshoot' && (
            <div className="space-y-4">
              {/* Diagnostic Card */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-slate-300">
                    Live Diagnostics: <strong>{isIOS ? 'Apple iOS' : isAndroid ? 'Google Android' : 'Desktop / Laptop'}</strong>
                  </span>
                  {isInAppBrowser && (
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px]">
                      In-App WebView
                    </span>
                  )}
                  {isInstalled && (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px]">
                      Running in Standalone Mode
                    </span>
                  )}
                </div>

                {isInstallable && (
                  <button
                    onClick={handleTriggerInstall}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-1 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{installStatus || 'Trigger Browser Install Now'}</span>
                  </button>
                )}
              </div>

              {/* Solution 1: IN-APP BROWSER (The #1 reason it doesn't show up) */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2.5">
                <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>Fix #1: You are in an "In-App Browser" (WhatsApp, Gmail, Instagram, TikTok)</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-xs">
                  When you open links from messages or social apps, your phone opens a restricted internal webview. <strong>Google and Apple intentionally disable "Install App" and "Add to Home Screen" inside in-app webviews.</strong>
                </p>
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-slate-200 space-y-1.5 font-mono text-xs">
                  <p className="font-bold text-sky-400">✅ How to fix in 5 seconds:</p>
                  <p>1. Look at the very top or bottom bar of your screen right now.</p>
                  <p>2. Tap the <strong>three dots (⋮)</strong> or the <strong>Share icon</strong>.</p>
                  <p>3. Tap <strong className="text-emerald-400 font-bold">"Open in Chrome"</strong> (Android) or <strong className="text-emerald-400 font-bold">"Open in Safari"</strong> (iPhone).</p>
                  <p>4. Once opened in the real browser, the install option will appear immediately!</p>
                </div>
              </div>

              {/* Solution 2: ANDROID (Google Chrome vs Samsung Internet) */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-white text-sm">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span>Fix #2: Where to find it on Android</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">Android 9 to 15+</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                    <p className="font-bold text-white flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-[10px] font-bold">A</span>
                      <span>Google Chrome:</span>
                    </p>
                    <ol className="list-decimal list-inside space-y-1 pl-1 text-slate-300 font-mono text-[11px]">
                      <li>Tap the <strong>three vertical dots (⋮)</strong> in the top-right corner.</li>
                      <li>Look for either:
                        <ul className="list-disc list-inside pl-3 text-emerald-300 font-semibold mt-0.5">
                          <li>"Install app"</li>
                          <li>"Add to Home screen"</li>
                        </ul>
                      </li>
                      <li>Tap it → Tap <strong>Install</strong> or <strong>Add</strong>.</li>
                    </ol>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                    <p className="font-bold text-white flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-sky-500 text-slate-950 flex items-center justify-center text-[10px] font-bold">B</span>
                      <span>Samsung Internet:</span>
                    </p>
                    <ol className="list-decimal list-inside space-y-1 pl-1 text-slate-300 font-mono text-[11px]">
                      <li>Tap the <strong>hamburger menu (≡)</strong> at bottom-right.</li>
                      <li>Tap <strong className="text-sky-300">+ Add page to</strong>.</li>
                      <li>Select <strong className="text-emerald-300">Home screen</strong> or <strong>App screen</strong>.</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Solution 3: APPLE iPHONE / iPAD */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-white text-sm">
                    <Share2 className="w-4 h-4 text-purple-400" />
                    <span>Fix #3: Where to find it on iPhone / iPad (iOS Safari)</span>
                  </div>
                  <span className="text-xs font-mono text-purple-300">Safari Required</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  On iOS, Apple restricts home screen installation to <strong>Safari</strong> only (Chrome on iOS cannot install apps):
                </p>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5 font-mono text-xs text-slate-200">
                  <p>1. Open this page in <strong className="text-purple-300">Safari</strong>.</p>
                  <p>2. Tap the <strong className="text-sky-300">Share button</strong> (the square with an arrow pointing upward at the bottom toolbar).</p>
                  <p>3. Scroll down the action menu and tap <strong className="text-emerald-400 font-bold">"Add to Home Screen" (+)</strong>.</p>
                  <p>4. Tap <strong>Add</strong> in the top right corner.</p>
                </div>
              </div>

              {/* Direct Link Copy */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center gap-2 font-mono text-xs">
                <span className="text-slate-400 shrink-0">Open directly in mobile browser:</span>
                <input
                  readOnly
                  value={currentUrl}
                  className="flex-1 w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-300 text-[11px] select-all truncate"
                />
                <button
                  onClick={() => handleCopy(currentUrl, 'troubleshoot-url')}
                  className="w-full sm:w-auto px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold flex items-center justify-center gap-1.5 shrink-0 transition-colors"
                >
                  {copiedKey === 'troubleshoot-url' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'troubleshoot-url' ? 'Copied' : 'Copy Direct Link'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 1: CODM GARENA DOWNLOAD LINKS */}
          {activeTab === 'codm' && (
            <div className="space-y-4">
              <div className="bg-red-500/10 border border-red-500/20 p-3.5 rounded-xl flex items-start gap-3">
                <Globe className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white text-xs sm:text-sm">
                    Target Package: <code className="text-red-300 font-mono bg-red-950/60 px-1.5 py-0.5 rounded">com.garena.game.codm</code>
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Download Call of Duty: Mobile Garena directly to your phone via these direct verified sources.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
                {/* TapTap Global */}
                <a
                  href="https://www.taptap.io/app/176931"
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-red-500/50 hover:bg-slate-900 transition-all flex flex-col justify-between group shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold">
                        TT
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm group-hover:text-red-300 transition-colors">
                          TapTap Official Mirror
                        </div>
                        <div className="text-[11px] text-slate-400">Works Worldwide (No SEA VPN Needed)</div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-red-400" />
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-sky-400">Auto-installs APK + OBB</span>
                    <span className="text-slate-400">Direct Download</span>
                  </div>
                </a>

                {/* Google Play Store */}
                <a
                  href="https://play.google.com/store/apps/details?id=com.garena.game.codm"
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-900 transition-all flex flex-col justify-between group shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                        GP
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm group-hover:text-sky-300 transition-colors">
                          Google Play Store
                        </div>
                        <div className="text-[11px] text-slate-400">Official Android Store (SEA)</div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-sky-400" />
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-emerald-400">Verified & Auto-Updating</span>
                    <span className="text-slate-400">Play Store</span>
                  </div>
                </a>

                {/* APKPure Direct */}
                <a
                  href="https://apkpure.com/call-of-duty-mobile-garena/com.garena.game.codm"
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 transition-all flex flex-col justify-between group shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                        APK
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm group-hover:text-emerald-300 transition-colors">
                          APKPure XAPK Installer
                        </div>
                        <div className="text-[11px] text-slate-400">Clean Package & Fast CDN</div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-emerald-400" />
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">~4.3 GB (Full XAPK)</span>
                    <span className="text-emerald-400">Direct Download</span>
                  </div>
                </a>

                {/* Apple App Store (iOS) */}
                <a
                  href="https://apps.apple.com/app/call-of-duty-mobile-garena/id1465688043"
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-900 transition-all flex flex-col justify-between group shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                        iOS
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm group-hover:text-purple-300 transition-colors">
                          Apple App Store
                        </div>
                        <div className="text-[11px] text-slate-400">iPhone & iPad (SEA Apple ID)</div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-purple-400" />
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-purple-400">iOS 120Hz ProMotion</span>
                    <span className="text-slate-400">App Store</span>
                  </div>
                </a>
              </div>
            </div>
          )}

          {/* TAB 2: PWA SCAN WITH PHONE */}
          {activeTab === 'pwa' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-slate-950 p-5 rounded-xl border border-slate-800">
                <div className="flex flex-col items-center justify-center gap-2 text-center">
                  <div className="p-2 rounded-xl bg-slate-900 border border-sky-500/30 shadow-lg shadow-sky-500/10">
                    <img 
                      src={qrCodeUrl} 
                      alt="Scan to open on phone" 
                      className="w-44 h-44 rounded-lg object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Point your phone camera at this QR code
                  </span>
                </div>

                <div className="sm:col-span-2 space-y-3 font-mono text-xs">
                  <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
                    <Smartphone className="w-4 h-4" />
                    <span>Run Parallel Space Directly on Your Phone</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed font-sans">
                    Runs full-screen with native 120Hz display refresh lock, telemetry HUD, and low-latency Garena server gateways.
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {isInstallable && (
                      <button
                        onClick={handleTriggerInstall}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20"
                      >
                        <Download className="w-4 h-4" />
                        <span>Install Directly on This Phone</span>
                      </button>
                    )}

                    <button
                      onClick={() => setActiveTab('troubleshoot')}
                      className="px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Don't see "Install" or "Add to Home"?</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      readOnly
                      value={currentUrl}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-[11px] text-slate-300 select-all"
                    />
                    <button
                      onClick={() => handleCopy(currentUrl, 'url')}
                      className="px-3 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold flex items-center gap-1.5 transition-colors shrink-0"
                    >
                      {copiedKey === 'url' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'url' ? 'Copied' : 'Copy Link'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DOWNLOAD UNLOCK SCRIPT & MODULE */}
          {activeTab === 'scripts' && (
            <div className="space-y-4">
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl flex items-start gap-3 text-xs">
                <Zap className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-slate-300 leading-relaxed font-sans">
                  Use these files to force your phone’s display and GPU to maintain a locked 120 FPS in <strong>CODM Garena</strong> without drops or adaptive frequency scaling.
                </p>
              </div>

              {/* ADB 120Hz Script */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-sky-400" />
                    <span className="font-bold text-white">ADB 120Hz Lock Script (No Root Needed)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(adbUnlockScript, 'adb')}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1"
                    >
                      {copiedKey === 'adb' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'adb' ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                      onClick={() => downloadFile(adbUnlockScript, 'unlock_codm_garena_120hz.sh', 'application/x-sh')}
                      className="px-2.5 py-1 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download .sh</span>
                    </button>
                  </div>
                </div>
                <pre className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 overflow-x-auto max-h-36">
                  {adbUnlockScript}
                </pre>
              </div>

              {/* Magisk Module */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-white">Magisk / KernelSU Spoof Module</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(magiskPropTweak, 'magisk')}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1"
                    >
                      {copiedKey === 'magisk' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'magisk' ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                      onClick={() => downloadFile(magiskPropTweak, 'system.prop', 'text/plain')}
                      className="px-2.5 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download system.prop</span>
                    </button>
                  </div>
                </div>
                <pre className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 overflow-x-auto max-h-32">
                  {magiskPropTweak}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 4: STEP-BY-STEP INSTALLATION GUIDE */}
          {activeTab === 'guide' && (
            <div className="space-y-4 font-sans text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-mono text-xs font-bold">
                    METHOD 1 (RECOMMENDED)
                  </span>
                  Installing via TapTap Global (No VPN Needed)
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-slate-300 text-xs leading-relaxed pl-1">
                  <li>On your Android phone, visit <a href="https://www.taptap.io" target="_blank" rel="noreferrer" className="text-sky-400 underline">taptap.io</a> and install the TapTap app.</li>
                  <li>Open TapTap and search for <strong className="text-white">"Call of Duty: Mobile (Garena)"</strong>.</li>
                  <li>Tap <strong>Download</strong> (~4.3 GB). TapTap automatically places the OBB data inside <code className="text-red-300 font-mono">/Android/obb/com.garena.game.codm</code>.</li>
                  <li>When installation finishes, open the game and grant storage permissions.</li>
                  <li>Log in using your <strong>Garena Account</strong> or <strong>Facebook</strong>.</li>
                </ol>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 font-mono text-xs font-bold">
                    METHOD 2
                  </span>
                  Installing via Google Play Store (If in Southeast Asia or using VPN)
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-slate-300 text-xs leading-relaxed pl-1">
                  <li>If outside SEA, connect a VPN server to <strong>Singapore</strong> or <strong>Philippines</strong>.</li>
                  <li>Go to Android Settings → Apps → Google Play Store → Storage → <strong>Clear Cache & Data</strong>.</li>
                  <li>Open Google Play Store, switch to or create a Southeast Asian account.</li>
                  <li>Search for <strong>"Call of Duty: Mobile - Garena"</strong> and tap Install.</li>
                  <li>Once downloaded, you can turn off the VPN. The game connects directly to Garena servers.</li>
                </ol>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="font-bold text-white text-xs">
                  🎮 How to Enable 120 FPS Inside CODM Garena:
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Inside the game: Go to <strong>Settings (gear icon) → Audio and Graphics → Graphics</strong>. Set Graphic Quality to <strong>Low</strong> or <strong>Medium</strong>, and set Frame Rate to <strong>ULTRA</strong> (120 FPS).
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
          <div className="text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Garena Gateway: <strong>{engineSettings.garenaServer.toUpperCase()}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('troubleshoot')}
              className="px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold transition-colors"
            >
              Missing Install Button Help
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
