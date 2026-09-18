export type TargetFps = 60 | 90 | 120;

export type CodmEdition = 'garena' | 'global';

export type GarenaServerRegion = 'sea_singapore' | 'philippines' | 'indonesia' | 'thailand' | 'taiwan';

export interface VirtualApp {
  id: string;
  name: string;
  packageName: string;
  category: 'Game' | 'Root Utility' | 'Optimizer' | 'System';
  icon: string;
  version: string;
  sizeMb: number;
  ramUsageMb: number;
  status: 'running' | 'idle' | 'suspended';
  targetFps: TargetFps;
  deviceProfileId: string;
  is64Bit: boolean;
  rootAccess: 'denied' | 'granted' | 'stealth_hidden';
  dataSizeMb: number;
  cacheSizeMb: number;
  lastLaunched?: string;
  customFlags: string[];
}

export interface DeviceProfile {
  id: string;
  name: string;
  model: string;
  manufacturer: string;
  brand: string;
  board: string;
  soc: string;
  glRenderer: string;
  glVendor: string;
  glVersion: string;
  codmUnlockLevel: 'Ultra (120 FPS)' | 'Ultra (90 FPS)' | 'Max (60 FPS)';
  supportedRefreshRates: number[];
  officialTournamentPhone?: boolean;
  description: string;
}

export interface VirtualRootSettings {
  isRootEnabled: boolean;
  rootMode: 'magisk_zygisk' | 'supersu_standard' | 'kernel_su_virtual';
  stealthMode: boolean; // Hide root from CODM and banking apps
  selinuxStatus: 'Enforcing' | 'Permissive';
  suBinaryPath: string;
  zygiskModules: {
    id: string;
    name: string;
    description: string;
    enabled: boolean;
    version: string;
  }[];
  activeSuSessions: number;
  antiCheatBypassGrade: 'A+ (Zero Detection)' | 'B (Basic Isolation)' | 'Exposed (High Ban Risk)';
}

export interface EngineSettings {
  targetFps: TargetFps;
  codmEdition: CodmEdition;
  garenaServer: GarenaServerRegion;
  garenaAceBypass: boolean;
  garenaFastLoginHook: boolean;
  renderBackend: 'vulkan_passthrough' | 'opengles_direct' | 'software_surface';
  framePacingMode: 'ultra_low_latency' | 'mailbox_triple_buffer' | 'adaptive_vsync';
  shaderPreload: boolean;
  cpuGovernor: 'performance_turbo' | 'gaming_scheduler' | 'balanced';
  zramAllocationGb: number;
  touchSamplingRate: 120 | 240 | 480 | 720;
  thermalThrottlingBypass: boolean;
  refreshRateForce: 90 | 120;
  antiBanStealthMode: boolean;
  memoryAutoPurge: boolean;
  resolutionScale: 0.8 | 0.9 | 1.0;
  affinityCores: 'all' | 'big_cores_only' | 'prime_cortex_x';
  zeroCopyBuffers: boolean;
}

export interface FpsTelemetry {
  currentFps: number;
  avgFps: number;
  onePercentLow: number;
  zeroPointOnePercentLow: number;
  frameTimeMs: number;
  droppedFrames: number;
  gpuLoadPct: number;
  cpuTempC: number;
  ramUsageGb: number;
  totalRamGb: number;
  touchLatencyMs: number;
  serverPingMs?: number;
}

export interface ArenaTarget {
  id: number;
  x: number;
  y: number;
  z: number;
  hp: number;
  maxHp: number;
  isHit: boolean;
  lastHitTime: number;
  type: 'dummy' | 'drone';
  speed: number;
  direction: number;
}

export interface TerminalLog {
  id: string;
  timestamp: string;
  type: 'stdout' | 'stderr' | 'stdin' | 'system';
  text: string;
}
