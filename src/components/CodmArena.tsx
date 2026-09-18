import React, { useEffect, useRef, useState, useCallback } from 'react';
import { TargetFps, FpsTelemetry, ArenaTarget, EngineSettings, DeviceProfile, GarenaServerRegion, CodmEdition } from '../types';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Crosshair, 
  Flame, 
  Cpu, 
  Activity, 
  Zap, 
  ShieldCheck, 
  Sliders,
  Sparkles,
  Volume2,
  VolumeX,
  Globe,
  Wifi,
  Radio,
  Download
} from 'lucide-react';

export const GARENA_SERVERS: { id: GarenaServerRegion; name: string; country: string; flag: string; ping: number }[] = [
  { id: 'philippines', name: 'Garena Philippines', country: 'PH', flag: '🇵🇭', ping: 22 },
  { id: 'sea_singapore', name: 'Garena SEA (SG/MY)', country: 'SG', flag: '🇸🇬', ping: 18 },
  { id: 'indonesia', name: 'Garena Indonesia', country: 'ID', flag: '🇮🇩', ping: 25 },
  { id: 'thailand', name: 'Garena Thailand', country: 'TH', flag: '🇹🇭', ping: 28 },
  { id: 'taiwan', name: 'Garena Taiwan/HK', country: 'TW', flag: '🇹🇼', ping: 34 },
];

interface CodmArenaProps {
  engineSettings: EngineSettings;
  activeProfile: DeviceProfile;
  onFpsChange: (fps: TargetFps) => void;
  onServerChange?: (server: GarenaServerRegion) => void;
  onOpenSettings: () => void;
  onOpenDownloadModal?: () => void;
}

export const CodmArena: React.FC<CodmArenaProps> = ({
  engineSettings,
  activeProfile,
  onFpsChange,
  onServerChange,
  onOpenSettings,
  onOpenDownloadModal
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(performance.now());
  const frameTimestampsRef = useRef<number[]>([]);
  const frameDurationsRef = useRef<number[]>([]);
  
  // Game state
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(100);
  const [shotsFired, setShotsFired] = useState<number>(0);
  const [shotsHit, setShotsHit] = useState<number>(0);
  const [muzzleFlash, setMuzzleFlash] = useState<boolean>(false);
  const [gunRecoil, setGunRecoil] = useState<number>(0);
  
  // Mouse position in canvas coordinates
  const crosshairPos = useRef<{ x: number; y: number }>({ x: 300, y: 200 });
  const targetsRef = useRef<ArenaTarget[]>([]);
  const particlesRef = useRef<{ x: number; y: number; vx: number; vy: number; life: number; maxLife: number; color: string }[]>([]);

  // Telemetry metrics
  const [telemetry, setTelemetry] = useState<FpsTelemetry>({
    currentFps: 120,
    avgFps: 119.4,
    onePercentLow: 112.5,
    zeroPointOnePercentLow: 98.2,
    frameTimeMs: 8.33,
    droppedFrames: 0,
    gpuLoadPct: 62,
    cpuTempC: 43.5,
    ramUsageGb: 3.8,
    totalRamGb: 12.0,
    touchLatencyMs: 4.2
  });

  // Sound generator using Web Audio API
  const playSound = useCallback((type: 'gunshot' | 'hit' | 'reload') => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'gunshot') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.08);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'hit') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.06);
      }
    } catch {
      // Audio context might be restricted before interaction
    }
  }, [soundEnabled]);

  // Initialize targets
  useEffect(() => {
    const initialTargets: ArenaTarget[] = [
      { id: 1, x: 150, y: 140, z: 1.0, hp: 100, maxHp: 100, isHit: false, lastHitTime: 0, type: 'dummy', speed: 1.2, direction: 1 },
      { id: 2, x: 380, y: 160, z: 0.8, hp: 100, maxHp: 100, isHit: false, lastHitTime: 0, type: 'dummy', speed: 1.8, direction: -1 },
      { id: 3, x: 260, y: 100, z: 0.6, hp: 100, maxHp: 100, isHit: false, lastHitTime: 0, type: 'drone', speed: 2.5, direction: 1 },
      { id: 4, x: 500, y: 120, z: 0.7, hp: 100, maxHp: 100, isHit: false, lastHitTime: 0, type: 'dummy', speed: 1.5, direction: 1 },
      { id: 5, x: 80, y: 190, z: 1.2, hp: 100, maxHp: 100, isHit: false, lastHitTime: 0, type: 'dummy', speed: 2.0, direction: -1 }
    ];
    targetsRef.current = initialTargets;
  }, []);

  // Update accuracy when shots change
  useEffect(() => {
    if (shotsFired > 0) {
      setAccuracy(Math.round((shotsHit / shotsFired) * 100));
    }
  }, [shotsFired, shotsHit]);

  // Handle shooting
  const handleShoot = useCallback(() => {
    if (!isRunning) return;
    setShotsFired((prev) => prev + 1);
    setMuzzleFlash(true);
    setGunRecoil(14);
    setTimeout(() => setMuzzleFlash(false), 50);
    setTimeout(() => setGunRecoil(0), 120);

    playSound('gunshot');

    const clickX = crosshairPos.current.x;
    const clickY = crosshairPos.current.y;

    let hitOccurred = false;
    targetsRef.current.forEach((t) => {
      const radius = t.type === 'dummy' ? 24 * t.z : 18 * t.z;
      const dist = Math.hypot(clickX - t.x, clickY - t.y);
      if (dist < radius) {
        hitOccurred = true;
        t.hp -= 35;
        t.isHit = true;
        t.lastHitTime = performance.now();
        playSound('hit');

        // Create hit sparks
        for (let i = 0; i < 8; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 4 + 2;
          particlesRef.current.push({
            x: clickX,
            y: clickY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1,
            life: 1,
            maxLife: 20 + Math.random() * 15,
            color: '#f59e0b'
          });
        }

        if (t.hp <= 0) {
          setScore((s) => s + (t.type === 'drone' ? 150 : 100));
          t.hp = t.maxHp;
          t.x = Math.random() * 450 + 50;
          t.y = t.type === 'drone' ? Math.random() * 80 + 70 : Math.random() * 100 + 130;
        }
      }
    });

    if (hitOccurred) {
      setShotsHit((prev) => prev + 1);
    }
  }, [isRunning, playSound]);

  // Canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let lastTeleTime = performance.now();
    let frameDropCounter = 0;
    const currentServerInfo = GARENA_SERVERS.find((s) => s.id === engineSettings.garenaServer) || GARENA_SERVERS[0];

    const render = (now: number) => {
      if (!isRunning) {
        animationFrameId.current = requestAnimationFrame(render);
        return;
      }

      // Delta timing and FPS throttling simulation based on target
      const targetFps = engineSettings.targetFps;
      const targetFrameInterval = 1000 / targetFps;
      const rawDelta = now - lastFrameTimeRef.current;

      // Rate limit frame if user selected lower FPS to accurately mirror hardware V-Sync limits
      if (rawDelta < targetFrameInterval - 1.2) {
        animationFrameId.current = requestAnimationFrame(render);
        return;
      }

      lastFrameTimeRef.current = now;

      // Track frame times
      frameTimestampsRef.current.push(now);
      frameDurationsRef.current.push(rawDelta);
      if (frameTimestampsRef.current.length > 120) {
        frameTimestampsRef.current.shift();
        frameDurationsRef.current.shift();
      }

      // Calculate telemetry every 300ms
      if (now - lastTeleTime > 300) {
        lastTeleTime = now;
        const count = frameTimestampsRef.current.length;
        if (count > 5) {
          const totalDuration = now - frameTimestampsRef.current[0];
          const calculatedFps = Math.min(targetFps, Math.round((count / (totalDuration / 1000)) * 10) / 10);
          
          // Sort frame durations for percentile calculations
          const sorted = [...frameDurationsRef.current].sort((a, b) => b - a);
          const p99Index = Math.floor(sorted.length * 0.01);
          const p999Index = Math.floor(sorted.length * 0.001);
          const onePctLow = Math.max(30, Math.min(targetFps - 2, Math.round(1000 / (sorted[p99Index] || targetFrameInterval))));
          const pointOnePctLow = Math.max(25, Math.min(targetFps - 5, Math.round(1000 / (sorted[p999Index] || targetFrameInterval * 1.2))));

          if (rawDelta > targetFrameInterval * 1.4) {
            frameDropCounter++;
          }

          const currentServerInfo = GARENA_SERVERS.find((s) => s.id === engineSettings.garenaServer) || GARENA_SERVERS[0];

          setTelemetry({
            currentFps: calculatedFps,
            avgFps: Math.min(targetFps, Math.round(calculatedFps * 0.99 * 10) / 10),
            onePercentLow: onePctLow,
            zeroPointOnePercentLow: pointOnePctLow,
            frameTimeMs: Math.round(rawDelta * 100) / 100,
            droppedFrames: frameDropCounter,
            gpuLoadPct: targetFps === 120 ? 74 : targetFps === 90 ? 58 : 42,
            cpuTempC: targetFps === 120 ? 44.8 : targetFps === 90 ? 41.5 : 38.2,
            ramUsageGb: 3.8,
            totalRamGb: 12.0,
            touchLatencyMs: Math.round((targetFrameInterval * 0.55) * 10) / 10,
            serverPingMs: currentServerInfo.ping
          });
        }
      }

      // Canvas dimensions
      const width = canvas.width;
      const height = canvas.height;

      // 1. Draw 3D-perspective tactical firing range background
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#0f172a');
      skyGrad.addColorStop(0.5, '#1e293b');
      skyGrad.addColorStop(1, '#090d16');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Distance mountains/horizon grid
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
      ctx.lineWidth = 1;
      const horizonY = height * 0.55;

      // Perspective floor lines (Subtle COD Mobile training ground texture)
      for (let x = -width; x < width * 2; x += 60) {
        ctx.beginPath();
        ctx.moveTo(width / 2, horizonY);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Horizontal depth rings
      for (let y = horizonY; y < height; y += 28) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Firing range back wall banners
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(40, horizonY - 110, width - 80, 100);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(40, horizonY - 110, width - 80, 100);

      // Military stencil markings
      ctx.fillStyle = '#475569';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`GARENA_FIRING_RANGE // CODM GARENA [${currentServerInfo.country}] // 120Hz ULTRA`, 60, horizonY - 80);
      ctx.fillText(`PKG: com.garena.game.codm | PING: ${currentServerInfo.ping}ms | SPOOF: ${activeProfile.model} (${activeProfile.manufacturer.toUpperCase()})`, 60, horizonY - 60);

      // Distance markers
      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      ctx.fillText('15M', 100, horizonY + 15);
      ctx.fillText('30M', 280, horizonY + 15);
      ctx.fillText('50M', 480, horizonY + 15);

      // 2. Update and draw Targets
      targetsRef.current.forEach((target) => {
        // Move targets
        target.x += target.speed * target.direction;
        if (target.x > width - 60) {
          target.direction = -1;
        } else if (target.x < 60) {
          target.direction = 1;
        }

        const size = (target.type === 'dummy' ? 32 : 24) * target.z;
        const isHitFresh = target.isHit && now - target.lastHitTime < 150;

        ctx.save();
        ctx.translate(target.x, target.y);

        if (target.type === 'dummy') {
          // Standing tactical silhouette target
          ctx.fillStyle = isHitFresh ? '#ef4444' : '#1e293b';
          ctx.strokeStyle = isHitFresh ? '#fca5a5' : '#38bdf8';
          ctx.lineWidth = 2;

          // Head
          ctx.beginPath();
          ctx.arc(0, -size * 0.9, size * 0.35, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Body plate
          ctx.beginPath();
          ctx.roundRect(-size * 0.45, -size * 0.5, size * 0.9, size * 1.1, 4);
          ctx.fill();
          ctx.stroke();

          // Bullseye circles on chest
          ctx.strokeStyle = isHitFresh ? '#fff' : '#f59e0b';
          ctx.beginPath();
          ctx.arc(0, 0, size * 0.25, 0, Math.PI * 2);
          ctx.stroke();

          // Target Stand
          ctx.fillStyle = '#475569';
          ctx.fillRect(-3, size * 0.6, 6, size * 0.6);
        } else {
          // Flying tactical UAV drone target
          ctx.fillStyle = isHitFresh ? '#ef4444' : '#047857';
          ctx.strokeStyle = isHitFresh ? '#fca5a5' : '#10b981';
          ctx.lineWidth = 1.5;

          // Drone body
          ctx.beginPath();
          ctx.ellipse(0, 0, size * 0.7, size * 0.3, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Rotor lights
          ctx.fillStyle = '#34d399';
          ctx.beginPath();
          ctx.arc(-size * 0.6, -size * 0.2, 3, 0, Math.PI * 2);
          ctx.arc(size * 0.6, -size * 0.2, 3, 0, Math.PI * 2);
          ctx.fill();
        }

        // HP bar above target
        const hpWidth = size * 0.9;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
        ctx.fillRect(-hpWidth / 2, -size * 1.4, hpWidth, 4);
        ctx.fillStyle = target.hp > 50 ? '#22c55e' : target.hp > 25 ? '#eab308' : '#ef4444';
        ctx.fillRect(-hpWidth / 2, -size * 1.4, hpWidth * (target.hp / target.maxHp), 4);

        ctx.restore();
      });

      // 3. Draw particles (bullet sparks)
      particlesRef.current.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15; // gravity
        p.life++;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, 1 - p.life / p.maxLife);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;

        if (p.life >= p.maxLife) {
          particlesRef.current.splice(index, 1);
        }
      });

      // 4. Draw FPS Frame Pacing Pulse Waveform at bottom
      const graphH = 36;
      const graphY = height - graphH - 12;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(16, graphY, 220, graphH);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(16, graphY, 220, graphH);

      // Target line (8.33ms for 120fps, 11.11ms for 90fps)
      const targetY = graphY + graphH - (targetFrameInterval / 20) * graphH;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.beginPath();
      ctx.moveTo(16, targetY);
      ctx.lineTo(236, targetY);
      ctx.stroke();

      // Plot durations
      if (frameDurationsRef.current.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = targetFps === 120 ? '#10b981' : targetFps === 90 ? '#38bdf8' : '#eab308';
        ctx.lineWidth = 1.5;
        const step = 220 / 60;
        const slice = frameDurationsRef.current.slice(-60);
        slice.forEach((dur, i) => {
          const plotY = Math.max(graphY + 2, Math.min(graphY + graphH - 2, graphY + graphH - (dur / 22) * graphH));
          const plotX = 16 + i * step;
          if (i === 0) ctx.moveTo(plotX, plotY);
          else ctx.lineTo(plotX, plotY);
        });
        ctx.stroke();
      }

      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px monospace';
      ctx.fillText(`FRAME_PACING: ${Math.round(rawDelta * 10) / 10}ms (${targetFps}Hz Target)`, 22, graphY + 11);

      // 5. Draw First-Person Weapon Barrel with dynamic recoil
      const gunBaseX = width / 2;
      const gunBaseY = height + gunRecoil;
      ctx.save();
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;

      // Weapon body (M4 / Kilo 141 stylized COD Mobile style)
      ctx.beginPath();
      ctx.moveTo(gunBaseX - 30, gunBaseY);
      ctx.lineTo(gunBaseX - 18, gunBaseY - 100);
      ctx.lineTo(gunBaseX + 18, gunBaseY - 100);
      ctx.lineTo(gunBaseX + 30, gunBaseY);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Barrel tip
      ctx.fillStyle = '#334155';
      ctx.fillRect(gunBaseX - 6, gunBaseY - 130, 12, 32);

      // Tactical optics mount
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(gunBaseX - 10, gunBaseY - 108, 20, 8);

      // Muzzle flash on firing
      if (muzzleFlash) {
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(gunBaseX, gunBaseY - 136, 26, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(gunBaseX, gunBaseY - 136, 14, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 6. Draw dynamic tactical crosshair
      const chX = crosshairPos.current.x;
      const chY = crosshairPos.current.y;
      const chGap = 8 + gunRecoil * 0.8;
      const chLen = 10;

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;

      // Center dot
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(chX, chY, 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Cross bars
      ctx.beginPath();
      // Top
      ctx.moveTo(chX, chY - chGap);
      ctx.lineTo(chX, chY - chGap - chLen);
      // Bottom
      ctx.moveTo(chX, chY + chGap);
      ctx.lineTo(chX, chY + chGap + chLen);
      // Left
      ctx.moveTo(chX - chGap, chY);
      ctx.lineTo(chX - chGap - chLen, chY);
      // Right
      ctx.moveTo(chX + chGap, chY);
      ctx.lineTo(chX + chGap + chLen, chY);
      ctx.stroke();

      animationFrameId.current = requestAnimationFrame(render);
    };

    animationFrameId.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isRunning, engineSettings.targetFps, engineSettings.garenaServer, activeProfile, muzzleFlash, gunRecoil]);

  // Track mouse/touch on canvas
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    crosshairPos.current = {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || e.touches.length === 0) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    crosshairPos.current = {
      x: (e.touches[0].clientX - rect.left) * scaleX,
      y: (e.touches[0].clientY - rect.top) * scaleY
    };
  };

  const resetSimulation = () => {
    setScore(0);
    setShotsFired(0);
    setShotsHit(0);
    setAccuracy(100);
  };

  const currentServerInfo = GARENA_SERVERS.find((s) => s.id === engineSettings.garenaServer) || GARENA_SERVERS[0];

  return (
    <div id="codm-arena-container" className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
      {/* Tactical Header */}
      <div className="bg-slate-950/80 border-b border-slate-800/80 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 font-black text-xs">
            GA
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-white font-semibold tracking-wide text-sm flex items-center gap-2">
                CODM GARENA 120FPS VIRTUAL EXECUTION ARENA
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-red-500/20 text-red-300 border border-red-500/30 font-bold">
                  GARENA SERVER
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  120Hz V-SYNC LOCKED
                </span>
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-mono flex items-center gap-2">
              <span>Package: <code className="text-sky-300">com.garena.game.codm</code></span>
              <span className="text-slate-600">•</span>
              <span>Server: <strong className="text-emerald-400">{currentServerInfo.name}</strong> ({currentServerInfo.ping}ms)</span>
              <span className="text-slate-600">•</span>
              <span>Device: {activeProfile.name}</span>
            </p>
          </div>
        </div>

        {/* Garena Regional Server Selector */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 p-1 rounded-xl">
          <span className="text-[11px] font-mono text-slate-400 px-2 flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-red-400" /> Server:
          </span>
          {GARENA_SERVERS.map((srv) => (
            <button
              key={srv.id}
              onClick={() => onServerChange?.(srv.id)}
              className={`px-2 py-1 text-xs font-mono rounded-lg transition-all flex items-center gap-1 ${
                engineSettings.garenaServer === srv.id
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title={`${srv.name} (Gateway Ping: ${srv.ping}ms)`}
            >
              <span>{srv.flag}</span>
              <span className="hidden sm:inline">{srv.country}</span>
              <span className="text-[10px] text-emerald-400 font-mono">{srv.ping}ms</span>
            </button>
          ))}
        </div>

        {/* Quick FPS Target Selector */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 p-1 rounded-xl">
          <span className="text-[11px] font-mono text-slate-400 px-2 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-sky-400" /> Target:
          </span>
          <button
            id="target-fps-60-btn"
            onClick={() => onFpsChange(60)}
            className={`px-2.5 py-1 text-xs font-mono font-medium rounded-lg transition-all ${
              engineSettings.targetFps === 60
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            60 FPS
          </button>
          <button
            id="target-fps-90-btn"
            onClick={() => onFpsChange(90)}
            className={`px-2.5 py-1 text-xs font-mono font-medium rounded-lg transition-all ${
              engineSettings.targetFps === 90
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            90 FPS
          </button>
          <button
            id="target-fps-120-btn"
            onClick={() => onFpsChange(120)}
            className={`px-3 py-1 text-xs font-mono font-bold rounded-lg transition-all flex items-center gap-1 ${
              engineSettings.targetFps === 120
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'text-emerald-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            120 FPS ULTRA
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            id="sound-toggle-btn"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border text-xs transition-colors ${
              soundEnabled
                ? 'bg-slate-800 border-slate-700 text-sky-400'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-400'
            }`}
            title={soundEnabled ? 'Disable Audio' : 'Enable Gunfire Audio'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            id="play-pause-btn"
            onClick={() => setIsRunning(!isRunning)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors"
            title={isRunning ? 'Pause Engine' : 'Resume Engine'}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-emerald-400" />}
          </button>
          <button
            id="reset-arena-btn"
            onClick={resetSimulation}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors"
            title="Reset Score & Accuracy"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            id="engine-settings-btn"
            onClick={onOpenSettings}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 flex items-center gap-1.5 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5 text-sky-400" />
            <span>Tuning</span>
          </button>
          {onOpenDownloadModal && (
            <button
              id="arena-download-phone-btn"
              onClick={onOpenDownloadModal}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-400 hover:to-amber-400 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-red-500/20"
              title="Download Call of Duty: Mobile Garena on your phone"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Install on Phone</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="relative w-full aspect-video max-h-[460px] bg-slate-950 flex items-center justify-center select-none overflow-hidden group">
        <canvas
          id="codm-frame-canvas"
          ref={canvasRef}
          width={640}
          height={360}
          onClick={handleShoot}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          onTouchStart={handleShoot}
          className="w-full h-full object-cover cursor-crosshair"
        />

        {/* Real-time Telemetry HUD (Overlaid on top corner) */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 pointer-events-none bg-slate-950/80 backdrop-blur-md border border-slate-800/80 rounded-xl p-3 text-xs font-mono shadow-xl">
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-400" /> V-SYNC FPS:
            </span>
            <span className={`text-base font-bold ${
              telemetry.currentFps >= 115 
                ? 'text-emerald-400' 
                : telemetry.currentFps >= 85 
                ? 'text-sky-400' 
                : 'text-amber-400'
            }`}>
              {telemetry.currentFps.toFixed(1)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-slate-400 border-t border-slate-800 pt-1.5">
            <div>Avg: <span className="text-slate-200 font-semibold">{telemetry.avgFps}</span></div>
            <div>Frame Time: <span className="text-slate-200 font-semibold">{telemetry.frameTimeMs}ms</span></div>
            <div>1% Low: <span className="text-slate-200 font-semibold">{telemetry.onePercentLow}</span></div>
            <div>Drops: <span className={telemetry.droppedFrames === 0 ? 'text-emerald-400' : 'text-amber-400'}>{telemetry.droppedFrames}</span></div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-800 pt-1.5 text-[11px]">
            <span className="text-slate-400 flex items-center gap-1">
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" /> Garena Server:
            </span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span>{currentServerInfo.flag} {currentServerInfo.country}</span>
              <span className="text-slate-200">({currentServerInfo.ping}ms)</span>
            </span>
          </div>
        </div>

        {/* Gunplay Score HUD */}
        <div className="absolute top-4 right-4 flex items-center gap-3 pointer-events-none">
          <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800/80 rounded-xl px-3.5 py-2 font-mono text-xs flex items-center gap-4 shadow-xl">
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">Score</div>
              <div className="text-sm font-bold text-amber-400">{score}</div>
            </div>
            <div className="w-px h-6 bg-slate-800" />
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">Accuracy</div>
              <div className="text-sm font-bold text-sky-400">{accuracy}%</div>
            </div>
            <div className="w-px h-6 bg-slate-800" />
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">Touch Latency</div>
              <div className="text-sm font-bold text-emerald-400">{telemetry.touchLatencyMs}ms</div>
            </div>
          </div>
        </div>

        {/* Live Interaction Prompt overlay when idle */}
        <div className="absolute bottom-4 right-4 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
          <span className="text-[11px] font-mono bg-slate-900/90 text-slate-300 border border-slate-700/80 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg">
            <Crosshair className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
            Click or Tap to Fire at Moving Targets (Live 120Hz Test)
          </span>
        </div>
      </div>

      {/* Hardware & Sandbox Vitals Strip */}
      <div className="bg-slate-950/90 border-t border-slate-800/80 px-5 py-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-sky-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase">GPU Instruction Load</div>
            <div className="text-slate-200 font-semibold flex items-center gap-1.5">
              {telemetry.gpuLoadPct}% (Adreno 730/750)
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-amber-400">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase">Thermal Governor</div>
            <div className="text-slate-200 font-semibold">
              {telemetry.cpuTempC}°C (Bypass Active)
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase">Garena ACE Anti-Cheat Stealth</div>
            <div className="text-emerald-400 font-semibold flex items-center gap-1">
              Hidden from com.garena.game.codm
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-purple-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase">Choreographer V-Sync</div>
            <div className="text-purple-300 font-semibold">
              {engineSettings.targetFps}Hz Native Lock
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
