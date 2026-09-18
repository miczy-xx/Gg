import React, { useState } from 'react';
import { 
  Download, 
  Smartphone, 
  X, 
  HelpCircle, 
  Check, 
  AlertTriangle, 
  ExternalLink,
  Share2,
  Compass,
  Layers
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallBannerProps {
  onOpenDownloadModal: () => void;
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({ onOpenDownloadModal }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, isInAppBrowser, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [showTroubleshoot, setShowTroubleshoot] = useState(false);

  // If running in standalone mode (already installed), do not show
  if (isInstalled || dismissed) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      setInstalling(true);
      const res = await install();
      setInstalling(false);
      if (res === 'accepted') {
        setDismissed(true);
      }
    } else {
      // If browser hasn't fired beforeinstallprompt or on iOS, open the step-by-step troubleshooter
      setShowTroubleshoot(true);
    }
  };

  return (
    <>
      {/* Sticky Mobile Banner */}
      <div 
        id="pwa-install-banner"
        className="w-full bg-gradient-to-r from-red-950 via-slate-900 to-amber-950 border-b border-red-500/30 px-3 py-2 text-xs font-mono text-white flex items-center justify-between gap-2 shadow-lg shadow-black/40 z-30 relative"
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
            <Smartphone className="w-4 h-4" />
          </div>
          <div className="truncate">
            <div className="flex items-center gap-1.5 font-bold text-[11px] sm:text-xs">
              <span className="text-white truncate">Install Parallel Space on Phone</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] bg-red-500/30 text-red-300 font-bold border border-red-500/40 hidden xs:inline">
                120 FPS
              </span>
            </div>
            <p className="text-[10px] text-slate-300 truncate font-sans">
              {isInAppBrowser 
                ? '⚠️ You are in an In-App Browser (Tap here to fix)' 
                : isIOS 
                ? 'iOS Safari: Tap Share → Add to Home Screen'
                : 'Runs full-screen with native 120Hz unlocker'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleInstallClick}
            disabled={installing}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-400 hover:to-amber-400 text-white font-bold text-[11px] flex items-center gap-1 shadow-md shadow-red-500/20 active:scale-95 transition-transform"
          >
            <Download className="w-3 h-3" />
            <span>{installing ? 'Installing...' : isInstallable ? 'Install Now' : 'How to Install'}</span>
          </button>

          <button
            onClick={() => setShowTroubleshoot(true)}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white"
            title="Troubleshoot missing install option"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setDismissed(true)}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Interactive Missing Option Troubleshooter Modal */}
      {showTroubleshoot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl overflow-hidden font-sans text-slate-200">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Why is "Install App" missing?</h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Device: {isIOS ? 'iPhone / iPad' : isAndroid ? 'Android' : 'Desktop/Other'} • {isInAppBrowser ? 'In-App Webview Detected' : 'Browser Detected'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowTroubleshoot(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto space-y-4 text-xs">
              {/* Guaranteed Alternative: HERMIT LITE APP (PLAY STORE) */}
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 font-bold text-emerald-300 text-xs sm:text-sm">
                    <Smartphone className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Alternative #1: Install via Hermit (100% Guaranteed)</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    WORKS ALWAYS
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  If Chrome keeps hiding the button on your phone, you can turn this into an instant native app icon using <strong>Hermit Lite Apps</strong>:
                </p>
                <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 text-slate-200 space-y-1.5 font-mono text-[11px]">
                  <p>1. Download <a href="https://play.google.com/store/apps/details?id=com.chimbori.hermitcrab" target="_blank" rel="noreferrer" className="text-emerald-400 underline font-bold">Hermit from Google Play Store</a>.</p>
                  <p>2. Open Hermit and tap the orange <strong className="text-white">+ (Create)</strong> button.</p>
                  <p>3. Paste this website link and tap <strong className="text-emerald-400">"Create Lite App"</strong>.</p>
                  <p className="text-slate-400 text-[10px]">Hermit will immediately place a real app icon on your home screen that launches without any browser bars at 120Hz!</p>
                </div>
              </div>

              {/* Scenario 1: IN-APP BROWSER (Most common reason for missing menu item) */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-300 text-xs sm:text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Reason 1: Opened from WhatsApp, Instagram, TikTok, or Gmail</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  In-app browsers (WebViews) <strong>deliberately hide</strong> the "Install app" and "Add to Home Screen" buttons.
                </p>
                <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 text-slate-200 space-y-1 font-mono text-[11px]">
                  <p className="font-bold text-sky-400">👉 How to fix:</p>
                  <p>1. Look at the top right of your current screen for <strong>three dots (⋮)</strong> or a <strong>Share icon</strong>.</p>
                  <p>2. Tap it and choose <strong className="text-emerald-400">"Open in Chrome"</strong> or <strong className="text-emerald-400">"Open in Safari"</strong>.</p>
                  <p>3. The install option will immediately appear!</p>
                </div>
              </div>

              {/* Scenario 2: ANDROID (Chrome / Samsung Internet) */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span>Android Chrome & Samsung Internet:</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Android
                  </span>
                </div>
                
                <div className="space-y-2 text-slate-300">
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <p className="font-bold text-white mb-1">In Google Chrome:</p>
                    <ol className="list-decimal list-inside space-y-1 pl-1 text-[11px] text-slate-300">
                      <li>Tap the <strong>three dots (⋮)</strong> in the top-right corner of Chrome.</li>
                      <li>Look for either <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
                      <li>If neither shows, tap <strong>"Desktop site"</strong> off, or refresh the page once.</li>
                    </ol>
                  </div>

                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <p className="font-bold text-white mb-1">In Samsung Internet:</p>
                    <ol className="list-decimal list-inside space-y-1 pl-1 text-[11px] text-slate-300">
                      <li>Tap the <strong>hamburger menu (≡)</strong> at the bottom right.</li>
                      <li>Tap <strong className="text-sky-300">+ Add page to</strong>.</li>
                      <li>Select <strong>Home screen</strong> or <strong>App screen</strong>.</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Scenario 3: APPLE iOS (iPhone / iPad) */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <Share2 className="w-4 h-4 text-purple-400" />
                    <span>iPhone / iPad (Must Use Safari):</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    iOS
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Apple <strong>does not support</strong> "Install app" inside Google Chrome for iOS. You must open this page in <strong>Safari</strong>:
                </p>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-[11px] space-y-1 font-mono">
                  <p>1. Open this website in <strong className="text-purple-300">Safari</strong>.</p>
                  <p>2. Tap the <strong className="text-sky-300">Share icon</strong> (square with an upward arrow at the bottom toolbar).</p>
                  <p>3. Scroll down the menu and tap <strong className="text-emerald-400">"Add to Home Screen" (+)</strong>.</p>
                  <p>4. Tap <strong>Add</strong> in the top-right corner.</p>
                </div>
              </div>

              {/* Scenario 4: Looking for the Call of Duty: Mobile Game itself? */}
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 space-y-2">
                <div className="flex items-center gap-2 font-bold text-red-300 text-xs">
                  <Download className="w-4 h-4 text-red-400" />
                  <span>Looking to download Call of Duty: Mobile Garena APK directly?</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  If you want the game files directly onto your device without dealing with browser menus:
                </p>
                <button
                  onClick={() => {
                    setShowTroubleshoot(false);
                    onOpenDownloadModal();
                  }}
                  className="w-full py-2 rounded-lg bg-red-500 hover:bg-red-400 text-white font-bold text-xs font-mono flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Open CODM Garena Direct APK & Store Links</span>
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center justify-end">
              <button
                onClick={() => setShowTroubleshoot(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono"
              >
                Got It, Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
