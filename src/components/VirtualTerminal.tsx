import React, { useState, useRef, useEffect } from 'react';
import { DeviceProfile, EngineSettings, TerminalLog } from '../types';
import { Terminal as TerminalIcon, Send, Trash2, Shield, Play, HelpCircle, Check } from 'lucide-react';

interface VirtualTerminalProps {
  activeProfile: DeviceProfile;
  engineSettings: EngineSettings;
  isRootEnabled: boolean;
  onClose: () => void;
}

export const VirtualTerminal: React.FC<VirtualTerminalProps> = ({
  activeProfile,
  engineSettings,
  isRootEnabled,
  onClose
}) => {
  const [inputCmd, setInputCmd] = useState('');
  const [logs, setLogs] = useState<TerminalLog[]>([
    {
      id: 'log-1',
      timestamp: '00:00:01',
      type: 'system',
      text: 'VirtualSpace Linux kernel 6.1.43-android14-11-virtualized #1 SMP PREEMPT'
    },
    {
      id: 'log-2',
      timestamp: '00:00:02',
      type: 'system',
      text: `Virtual SU Daemon initialized at /system/xbin/su (PID: 1044). Zygote 64-bit isolated.`
    },
    {
      id: 'log-3',
      timestamp: '00:00:03',
      type: 'stdout',
      text: `root@virtual-space:/ # Type 'help' for available sandbox commands.`
    }
  ]);

  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputCmd.trim();
    if (!cmd) return;

    const timeStr = new Date().toTimeString().split(' ')[0];

    // Add stdin entry
    const newLogs: TerminalLog[] = [
      ...logs,
      {
        id: `log-in-${Date.now()}`,
        timestamp: timeStr,
        type: 'stdin',
        text: `root@virtual-space:/ # ${cmd}`
      }
    ];

    // Parse and respond
    const lower = cmd.toLowerCase();

    if (lower === 'clear') {
      setLogs([]);
      setInputCmd('');
      return;
    } else if (lower === 'help') {
      newLogs.push({
        id: `log-out-${Date.now()}`,
        timestamp: timeStr,
        type: 'stdout',
        text: `[VIRTUAL SPACE SU TERMINAL COMMANDS]:
  • su                                    - Check UID 0 root privileges
  • getprop ro.product.model              - Inspect spoofed device model
  • getprop ro.vendor.display.default_fps - Check target display refresh rate
  • dumpsys gfxinfo                       - CODM 120 FPS frame latency breakdown
  • setprop debug.sf.high_fps 1          - Force 120Hz V-Sync override
  • cat /proc/cpuinfo                     - Inspect simulated Snapdragon 8 Gen 3 cores
  • cat /proc/meminfo                     - Inspect sandbox zRAM & memory footprint
  • which su                              - Test anti-cheat stealth root detection
  • logcat                                - Stream SurfaceFlinger & CODM log output
  • clear                                 - Clear terminal screen`
      });
    } else if (lower === 'su' || lower.startsWith('su ')) {
      newLogs.push({
        id: `log-out-${Date.now()}`,
        timestamp: timeStr,
        type: 'stdout',
        text: isRootEnabled
          ? 'uid=0(root) gid=0(root) groups=0(root) context=u:r:magisk:s0 [Access Granted via Virtual Daemon]'
          : 'su: permission denied (Virtual root is disabled in Root Center)'
      });
    } else if (lower === 'getprop ro.product.model') {
      newLogs.push({
        id: `log-out-${Date.now()}`,
        timestamp: timeStr,
        type: 'stdout',
        text: activeProfile.model
      });
    } else if (lower === 'getprop ro.vendor.display.default_fps') {
      newLogs.push({
        id: `log-out-${Date.now()}`,
        timestamp: timeStr,
        type: 'stdout',
        text: `${engineSettings.targetFps}`
      });
    } else if (lower.startsWith('getprop')) {
      newLogs.push({
        id: `log-out-${Date.now()}`,
        timestamp: timeStr,
        type: 'stdout',
        text: `[ro.product.model]: [${activeProfile.model}]
[ro.product.manufacturer]: [${activeProfile.manufacturer}]
[ro.product.brand]: [${activeProfile.brand}]
[ro.soc.manufacturer]: [Qualcomm]
[ro.vendor.display.default_fps]: [${engineSettings.targetFps}]
[debug.sf.high_fps_late_app_phase_scale_factor]: [1]`
      });
    } else if (lower.includes('dumpsys gfxinfo')) {
      newLogs.push({
        id: `log-out-${Date.now()}`,
        timestamp: timeStr,
        type: 'stdout',
        text: `** Graphics info for pid 4092 [com.activision.callofduty.shooter] **
Stats since: 142093400ns
Total frames rendered: 14280
Janky frames: 2 (0.01%)
50th percentile: 8.1ms
90th percentile: 8.3ms
95th percentile: 8.4ms
99th percentile: 8.9ms
HISTOGRAM: 8ms=13980 9ms=290 10ms=8 16ms=2
Render Backend: Vulkan Direct Passthrough (Zero-Copy)
Target V-Sync: 120Hz locked (Choreographer compliant)`
      });
    } else if (lower.includes('setprop debug.sf.high_fps')) {
      newLogs.push({
        id: `log-out-${Date.now()}`,
        timestamp: timeStr,
        type: 'stdout',
        text: 'debug.sf.high_fps -> 1 [Property set successfully. SurfaceFlinger display refreshed to 120Hz]'
      });
    } else if (lower.includes('cat /proc/cpuinfo')) {
      newLogs.push({
        id: `log-out-${Date.now()}`,
        timestamp: timeStr,
        type: 'stdout',
        text: `Processor       : AArch64 Processor rev 2 (aarch64)
Hardware        : Qualcomm Technologies, Inc SM8650 (Snapdragon 8 Gen 3)
CPU 0-1 (Silver): Cortex-A520 @ 2.26GHz (Background Sandbox)
CPU 2-6 (Gold)  : Cortex-A720 @ 3.15GHz (Audio & Network IO)
CPU 7 (Prime)   : Cortex-X4   @ 3.30GHz [PINNED: CODM Render Pipeline]
Features        : fp asimd evtstrm aes pmull sha1 sha2 crc32 atomics fphp asimdhp cpuid asimdrdm jscvt fcma lrcpc dcpop sha3 sm3 sm4 asimddp sha512 sve sve2`
      });
    } else if (lower.includes('cat /proc/meminfo')) {
      newLogs.push({
        id: `log-out-${Date.now()}`,
        timestamp: timeStr,
        type: 'stdout',
        text: `MemTotal:       12248560 kB
MemFree:         4820120 kB
MemAvailable:    8194450 kB
Cached:          3140500 kB
SwapTotal:       4194304 kB (zRAM LZ4 compressed)
SwapFree:        3920100 kB
DirectVulkanMapped: 2480100 kB [Zero-Copy Graphic Buffers]`
      });
    } else if (lower === 'which su') {
      newLogs.push({
        id: `log-out-${Date.now()}`,
        timestamp: timeStr,
        type: 'stdout',
        text: `/system/xbin/su
NOTE: When CODM calls 'which su', Virtual Zygisk Shamiko intercepts stat() & access() and returns ENOENT (File Not Found), guaranteeing 0 ban risk.`
      });
    } else if (lower === 'logcat' || lower.startsWith('logcat')) {
      newLogs.push({
        id: `log-out-${Date.now()}`,
        timestamp: timeStr,
        type: 'stdout',
        text: `09-18 12:00:04.102  4092  4120 I CODM    : [RenderEngine] Surface created 2400x1080 @ 120Hz
09-18 12:00:04.115  4092  4120 I CODM    : [GraphicSettings] Detected tournament hardware whitelist (${activeProfile.model})
09-18 12:00:04.120  4092  4120 I CODM    : [Display] Setting target FPS: 120 (Frame Interval: 8.33ms)
09-18 12:00:04.135   680   820 I SurfaceFlinger: [VirtualSpace] Syncing frame pipeline to 120Hz Choreographer
09-18 12:00:04.200  4092  4150 I CODM    : [ShaderCache] 1,482 pipeline states pre-compiled. Ready.`
      });
    } else if (lower === 'uname -a') {
      newLogs.push({
        id: `log-out-${Date.now()}`,
        timestamp: timeStr,
        type: 'stdout',
        text: 'Linux virtual-space 6.1.43-android14-g8f9a2b #1 SMP PREEMPT aarch64 Android'
      });
    } else {
      newLogs.push({
        id: `log-out-${Date.now()}`,
        timestamp: timeStr,
        type: 'stdout',
        text: `/system/bin/sh: ${cmd}: inaccessible or not found. Type 'help' for command list.`
      });
    }

    setLogs(newLogs);
    setInputCmd('');
  };

  return (
    <div id="virtual-terminal-container" className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[520px]">
      {/* Terminal Titlebar */}
      <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-bold text-slate-200">
            root@virtual-space:~# (Virtual SU Console)
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            UID 0
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLogs([])}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg text-xs transition-colors"
            title="Clear Terminal Screen"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Terminal Output Area */}
      <div className="flex-1 p-4 overflow-y-auto font-mono text-xs text-slate-300 space-y-1.5 selection:bg-emerald-500/30">
        {logs.map((log) => (
          <div key={log.id} className="leading-relaxed whitespace-pre-wrap">
            {log.type === 'stdin' ? (
              <span className="text-sky-300 font-semibold">{log.text}</span>
            ) : log.type === 'system' ? (
              <span className="text-slate-500 italic">[{log.timestamp}] {log.text}</span>
            ) : log.type === 'stderr' ? (
              <span className="text-rose-400">{log.text}</span>
            ) : (
              <span className="text-emerald-300/90">{log.text}</span>
            )}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* Quick Suggestion Pills */}
      <div className="bg-slate-900/60 border-t border-slate-800/80 px-4 py-2 flex items-center gap-2 overflow-x-auto text-[11px] font-mono text-slate-400">
        <span className="text-slate-500 text-[10px] uppercase">Presets:</span>
        <button
          onClick={() => setInputCmd('dumpsys gfxinfo')}
          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors shrink-0"
        >
          dumpsys gfxinfo
        </button>
        <button
          onClick={() => setInputCmd('getprop ro.product.model')}
          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors shrink-0"
        >
          getprop model
        </button>
        <button
          onClick={() => setInputCmd('cat /proc/cpuinfo')}
          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors shrink-0"
        >
          cat /proc/cpuinfo
        </button>
        <button
          onClick={() => setInputCmd('which su')}
          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors shrink-0"
        >
          which su (stealth check)
        </button>
        <button
          onClick={() => setInputCmd('logcat')}
          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors shrink-0"
        >
          logcat
        </button>
      </div>

      {/* Command Input Bar */}
      <form onSubmit={handleCommandSubmit} className="bg-slate-900 p-3 border-t border-slate-800 flex items-center gap-2">
        <span className="text-emerald-400 font-mono text-xs font-bold pl-1">root#</span>
        <input
          id="terminal-cmd-input"
          type="text"
          value={inputCmd}
          onChange={(e) => setInputCmd(e.target.value)}
          placeholder="Enter shell command (e.g. dumpsys gfxinfo, getprop, su)..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
          autoFocus
        />
        <button
          type="submit"
          className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Exec</span>
        </button>
      </form>
    </div>
  );
};
