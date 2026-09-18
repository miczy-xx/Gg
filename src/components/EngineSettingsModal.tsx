import React, { useState } from 'react';
import { EngineSettings, DeviceProfile, GarenaServerRegion, CodmEdition } from '../types';
import { 
  Sliders, 
  Cpu, 
  Flame, 
  Zap, 
  ShieldCheck, 
  Download, 
  Check, 
  Copy, 
  Code,
  FileText,
  Globe,
  Radio,
  Wifi
} from 'lucide-react';

interface EngineSettingsModalProps {
  settings: EngineSettings;
  activeProfile: DeviceProfile;
  onUpdateSettings: (newSettings: EngineSettings) => void;
  onClose: () => void;
}

export const EngineSettingsModal: React.FC<EngineSettingsModalProps> = ({
  settings,
  activeProfile,
  onUpdateSettings,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'garena' | 'graphics' | 'cpu' | 'export'>('garena');
  const [copied, setCopied] = useState(false);

  const handleCopyConfig = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isGarena = settings.codmEdition === 'garena';
  const targetPkg = isGarena ? 'com.garena.game.codm' : 'com.activision.callofduty.shooter';

  const generatedBuildProp = `# VirtualSpace Ultra 120FPS build.prop tweak for Call of Duty: Mobile (${isGarena ? 'Garena' : 'Global'})
ro.product.model=${activeProfile.model}
ro.product.manufacturer=${activeProfile.manufacturer}
ro.product.brand=${activeProfile.brand}
ro.board.platform=${activeProfile.board}
ro.soc.manufacturer=Qualcomm
ro.vendor.display.default_fps=${settings.targetFps}
debug.sf.high_fps_late_app_phase_scale_factor=1
debug.sf.enable_gl_backpressure=0
debug.sf.hw=1
debug.egl.hw=1
persist.sys.app.fps=${settings.targetFps}
persist.vendor.qti.games.fps=${settings.targetFps}
persist.garena.codm.fps=${settings.targetFps}
vendor.display.enable_default_color_mode=1
debug.renderengine.backend=${settings.renderBackend === 'vulkan_passthrough' ? 'skiagl' : 'gles'}`;

  const generatedMagiskScript = `#!/system/bin/sh
# Magisk Virtual Zygisk 120FPS Lock Service for CODM Garena
MODDIR=\${0%/*}

# 1. Lock CPU Prime Cortex-X Core Governor
echo "performance" > /sys/devices/system/cpu/cpu7/cpufreq/scaling_governor
echo 3300000 > /sys/devices/system/cpu/cpu7/cpufreq/scaling_min_freq

# 2. Lock GPU Clocks to Max frequency for stable 120 FPS
echo 0 > /sys/class/kgsl/kgsl-3d0/throttling
echo performance > /sys/class/kgsl/kgsl-3d0/devfreq/governor

# 3. Pin Call of Duty: Mobile (${isGarena ? 'Garena' : 'Global'}) render thread
CODM_PID=\$(pidof ${targetPkg})
if [ -z "\$CODM_PID" ]; then
    CODM_PID=\$(pidof com.garena.game.codm)
fi
if [ -z "\$CODM_PID" ]; then
    CODM_PID=\$(pidof com.activision.callofduty.shooter)
fi

if [ ! -z "\$CODM_PID" ]; then
    taskset -p f0 \$CODM_PID
    echo "Pinned CODM PID \$CODM_PID to Prime Core"
fi
`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                120FPS VIRTUAL ENGINE ARCHITECT & TUNER
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Direct Vulkan Passthrough • V-Sync Pipeline • Kernel Thread Affinity
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs font-mono px-2 py-1 rounded-lg hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {/* Tab Strip */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-5 text-xs font-mono overflow-x-auto">
          <button
            onClick={() => setActiveTab('garena')}
            className={`py-3 px-4 border-b-2 font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'garena'
                ? 'border-red-500 text-red-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>CODM Garena & Server</span>
          </button>
          <button
            onClick={() => setActiveTab('graphics')}
            className={`py-3 px-4 border-b-2 font-medium transition-colors shrink-0 ${
              activeTab === 'graphics'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Display & Graphics Pipeline
          </button>
          <button
            onClick={() => setActiveTab('cpu')}
            className={`py-3 px-4 border-b-2 font-medium transition-colors shrink-0 ${
              activeTab === 'cpu'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            CPU & Kernel Affinity
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`py-3 px-4 border-b-2 font-medium transition-colors shrink-0 ${
              activeTab === 'export'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Export Shell & build.prop
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs font-mono">
          {activeTab === 'garena' && (
            <div className="space-y-4">
              {/* Game Edition Selector */}
              <div>
                <label className="text-slate-300 font-semibold block mb-1.5">
                  Target CODM Edition
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ ...settings, codmEdition: 'garena' })}
                    className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                      settings.codmEdition === 'garena'
                        ? 'bg-red-500/10 border-red-500 text-red-300 shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">Call of Duty: Mobile (Garena)</span>
                      {settings.codmEdition === 'garena' && <Check className="w-4 h-4 text-red-400" />}
                    </div>
                    <code className="text-[10px] text-red-400 font-mono">com.garena.game.codm</code>
                    <span className="text-[10px] text-slate-400">SEA, Philippines, Indonesia, Thailand, Taiwan</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ ...settings, codmEdition: 'global' })}
                    className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                      settings.codmEdition === 'global'
                        ? 'bg-sky-500/10 border-sky-500 text-sky-300 shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">Call of Duty: Mobile (Global)</span>
                      {settings.codmEdition === 'global' && <Check className="w-4 h-4 text-sky-400" />}
                    </div>
                    <code className="text-[10px] text-sky-400 font-mono">com.activision.callofduty.shooter</code>
                    <span className="text-[10px] text-slate-400">Activision Global cluster</span>
                  </button>
                </div>
              </div>

              {/* Garena Regional Server selection */}
              <div>
                <label className="text-slate-300 font-semibold block mb-1.5 flex items-center justify-between">
                  <span>Garena Regional Server Gateway</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Ultra-low Ping Route</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: 'philippines', name: 'Philippines (PH)', flag: '🇵🇭', gateway: 'ph-login.codm.garena.com', ping: '22ms' },
                    { id: 'sea_singapore', name: 'Southeast Asia (SG/MY)', flag: '🇸🇬', gateway: 'sg-login.codm.garena.com', ping: '18ms' },
                    { id: 'indonesia', name: 'Indonesia (ID)', flag: '🇮🇩', gateway: 'id-login.codm.garena.com', ping: '25ms' },
                    { id: 'thailand', name: 'Thailand (TH)', flag: '🇹🇭', gateway: 'th-login.codm.garena.com', ping: '28ms' },
                    { id: 'taiwan', name: 'Taiwan / HK (TW)', flag: '🇹🇼', gateway: 'tw-login.codm.garena.com', ping: '34ms' },
                  ].map((srv) => (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={() => onUpdateSettings({ ...settings, garenaServer: srv.id as GarenaServerRegion })}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                        settings.garenaServer === srv.id
                          ? 'bg-red-500/15 border-red-500/60 text-slate-100'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{srv.flag}</span>
                        <div>
                          <div className="text-xs font-semibold text-slate-200">{srv.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{srv.gateway}</div>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-400">{srv.ping}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Garena ACE Anti-Cheat Stealth */}
              <div className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
                <div>
                  <div className="text-slate-200 font-semibold flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Garena Anti-Cheat Expert (ACE) Stealth Mask</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Intercepts Garena ACE memory inspections and masks root mounts specifically for <code className="text-red-400">com.garena.game.codm</code>.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.garenaAceBypass}
                  onChange={(e) => onUpdateSettings({ ...settings, garenaAceBypass: e.target.checked })}
                  className="w-4 h-4 accent-emerald-500"
                />
              </div>

              {/* Garena Fast Login Token Bridge */}
              <div className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
                <div>
                  <div className="text-slate-200 font-semibold flex items-center gap-2">
                    <Zap className="w-4 h-4 text-sky-400" />
                    <span>Garena & Facebook Account Fast-Bridge</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Isolates SSO auth credentials and Garena ID tokens in sandboxed Keystore to eliminate session kickouts.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.garenaFastLoginHook}
                  onChange={(e) => onUpdateSettings({ ...settings, garenaFastLoginHook: e.target.checked })}
                  className="w-4 h-4 accent-sky-500"
                />
              </div>
            </div>
          )}
          {activeTab === 'graphics' && (
            <>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Virtual Render Backend
                </label>
                <select
                  value={settings.renderBackend}
                  onChange={(e) =>
                    onUpdateSettings({ ...settings, renderBackend: e.target.value as any })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500"
                >
                  <option value="vulkan_passthrough">
                    Vulkan Direct Hardware Passthrough (Zero-Copy AHardwareBuffer) — Recommended
                  </option>
                  <option value="opengles_direct">
                    OpenGL ES 3.2 Direct Surface (Standard GL)
                  </option>
                  <option value="software_surface">
                    Software Compositor Emulation (High Overhead)
                  </option>
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Zero-copy buffers share the GPU surface directly between host and guest virtual space, cutting rendering latency by 45%.
                </p>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Frame Pacing Buffer Mode
                </label>
                <select
                  value={settings.framePacingMode}
                  onChange={(e) =>
                    onUpdateSettings({ ...settings, framePacingMode: e.target.value as any })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500"
                >
                  <option value="ultra_low_latency">
                    Ultra-Low Latency (Target 8.33ms Frame Time - 120 FPS Lock)
                  </option>
                  <option value="mailbox_triple_buffer">
                    Mailbox Triple Buffering (Smoother, +2ms input latency)
                  </option>
                  <option value="adaptive_vsync">Adaptive V-Sync</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    Touch Sampling Rate
                  </label>
                  <select
                    value={settings.touchSamplingRate}
                    onChange={(e) =>
                      onUpdateSettings({ ...settings, touchSamplingRate: Number(e.target.value) as any })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500"
                  >
                    <option value={120}>120 Hz (Standard)</option>
                    <option value={240}>240 Hz (Competitive)</option>
                    <option value={480}>480 Hz (Ultra Esports)</option>
                    <option value={720}>720 Hz (Hyper Response)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    Resolution Scale
                  </label>
                  <select
                    value={settings.resolutionScale}
                    onChange={(e) =>
                      onUpdateSettings({ ...settings, resolutionScale: Number(e.target.value) as any })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500"
                  >
                    <option value={1.0}>100% Native (1080p)</option>
                    <option value={0.9}>90% Upscale (Zero drops in smoke/explosions)</option>
                    <option value={0.8}>80% Esports Performance</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <div>
                  <div className="text-slate-200 font-semibold">Shader State Pre-compilation</div>
                  <div className="text-[11px] text-slate-500">Compiles GLSL/SPIR-V shaders during boot to eliminate in-match micro-stutters.</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.shaderPreload}
                  onChange={(e) => onUpdateSettings({ ...settings, shaderPreload: e.target.checked })}
                  className="w-4 h-4 accent-sky-500"
                />
              </div>
            </>
          )}

          {activeTab === 'cpu' && (
            <>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  CPU Thread Affinity (Core Pinning)
                </label>
                <select
                  value={settings.affinityCores}
                  onChange={(e) =>
                    onUpdateSettings({ ...settings, affinityCores: e.target.value as any })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500"
                >
                  <option value="prime_cortex_x">
                    Lock CODM to Prime Cortex-X Core (3.30 GHz Extreme)
                  </option>
                  <option value="big_cores_only">
                    Big Gold Cores Only (Balanced 3.15 GHz)
                  </option>
                  <option value="all">Dynamic OS Governor (All 8 Cores)</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <div>
                  <div className="text-slate-200 font-semibold">Thermal Throttling Trip Point Override</div>
                  <div className="text-[11px] text-slate-500">Prevents the kernel from downclocking GPU below 600MHz when phone warms up.</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.thermalThrottlingBypass}
                  onChange={(e) => onUpdateSettings({ ...settings, thermalThrottlingBypass: e.target.checked })}
                  className="w-4 h-4 accent-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Virtual zRAM Compression Swap
                </label>
                <select
                  value={settings.zramAllocationGb}
                  onChange={(e) =>
                    onUpdateSettings({ ...settings, zramAllocationGb: Number(e.target.value) })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500"
                >
                  <option value={2}>2 GB zRAM LZ4</option>
                  <option value={4}>4 GB zRAM LZ4 (Optimal for CODM 120 FPS)</option>
                  <option value={8}>8 GB zRAM LZ4 (Heavy Multi-App)</option>
                </select>
              </div>
            </>
          )}

          {activeTab === 'export' && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-sky-400" />
                    Android build.prop Whitelist Injection
                  </span>
                  <button
                    onClick={() => handleCopyConfig(generatedBuildProp)}
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-[11px] text-slate-300 overflow-x-auto leading-relaxed">
                  {generatedBuildProp}
                </pre>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                    <Code className="w-4 h-4 text-emerald-400" />
                    Magisk / KernelSU service.sh Tuning Script
                  </span>
                  <button
                    onClick={() => handleCopyConfig(generatedMagiskScript)}
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-[11px] text-emerald-300/90 overflow-x-auto leading-relaxed">
                  {generatedMagiskScript}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-5 py-3 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-400">
            Current Profile: <strong className="text-white">{activeProfile.name}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs font-mono transition-colors shadow-lg shadow-sky-500/20"
          >
            Apply & Return to Sandbox
          </button>
        </div>
      </div>
    </div>
  );
};
