import React, { useState } from 'react';
import { DeviceProfile } from '../types';
import { 
  Smartphone, 
  Check, 
  Sliders, 
  Cpu, 
  Trophy, 
  Sparkles, 
  Plus, 
  ExternalLink,
  Code
} from 'lucide-react';

interface DeviceSpooferProps {
  profiles: DeviceProfile[];
  activeProfile: DeviceProfile;
  onSelectProfile: (profile: DeviceProfile) => void;
  onSaveCustomProfile: (profile: DeviceProfile) => void;
  onClose: () => void;
}

export const DeviceSpoofer: React.FC<DeviceSpooferProps> = ({
  profiles,
  activeProfile,
  onSelectProfile,
  onSaveCustomProfile,
  onClose
}) => {
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customModel, setCustomModel] = useState('');
  const [customManufacturer, setCustomManufacturer] = useState('');
  const [customSoc, setCustomSoc] = useState('');
  const [customRenderer, setCustomRenderer] = useState('');

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customModel.trim()) return;

    const newProf: DeviceProfile = {
      id: `custom-${Date.now()}`,
      name: `${customManufacturer || 'Custom'} ${customModel}`,
      model: customModel.trim(),
      manufacturer: customManufacturer.trim() || 'Custom',
      brand: customManufacturer.trim() || 'Custom',
      board: 'universal_8gen3',
      soc: customSoc.trim() || 'Qualcomm Snapdragon 8 Gen 3',
      glRenderer: customRenderer.trim() || 'Adreno (TM) 750',
      glVendor: 'Qualcomm',
      glVersion: 'OpenGL ES 3.2',
      codmUnlockLevel: 'Ultra (120 FPS)',
      supportedRefreshRates: [60, 90, 120],
      description: 'Custom userland build.prop spoof for Call of Duty: Mobile.'
    };

    onSaveCustomProfile(newProf);
    setIsCustomMode(false);
  };

  return (
    <div id="device-spoofer-container" className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
      {/* Header */}
      <div className="bg-slate-950/90 border-b border-slate-800/80 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-white font-semibold text-sm">
                CODM 120FPS DEVICE WHITELIST SPOOFER
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-sky-500/20 text-sky-300 border border-sky-500/30">
                BUILD.PROP HOOK
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Call of Duty: Mobile queries system props to unlock Ultra Frame Rate (90/120 FPS)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCustomMode(!isCustomMode)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-slate-300 flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isCustomMode ? 'Show Presets' : 'Custom Model'}</span>
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-slate-300 transition-colors"
          >
            Back to Arena
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Device Presets List */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
            Certified 120FPS Hardware Presets
          </span>

          <div className="space-y-3">
            {profiles.map((profile) => {
              const isActive = activeProfile.id === profile.id;
              return (
                <div
                  key={profile.id}
                  id={`profile-card-${profile.id}`}
                  onClick={() => onSelectProfile(profile)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                    isActive
                      ? 'bg-slate-800/90 border-sky-500 shadow-lg shadow-sky-500/10 ring-1 ring-sky-500/50'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isActive ? 'bg-sky-500 text-slate-950' : 'bg-slate-900 text-slate-400'
                      }`}>
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white flex items-center gap-2">
                          {profile.name}
                          {profile.officialTournamentPhone && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                              <Trophy className="w-3 h-3" /> OFFICIAL TOURNAMENT
                            </span>
                          )}
                        </h4>
                        <span className="text-[11px] font-mono text-slate-400">
                          Model: {profile.model} | Manufacturer: {profile.manufacturer}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        {profile.codmUnlockLevel}
                      </span>
                      {isActive && (
                        <div className="w-5 h-5 rounded-full bg-sky-500 text-slate-950 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-snug">
                    {profile.description}
                  </p>

                  <div className="flex items-center gap-3 pt-2 border-t border-slate-800/60 text-[10px] font-mono text-slate-400">
                    <span>SoC: {profile.soc}</span>
                    <span>•</span>
                    <span>GPU: {profile.glRenderer}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Spoof Inspector & Prop Registry */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-300 font-semibold flex items-center gap-1.5">
                <Code className="w-4 h-4 text-sky-400" />
                Active Virtual build.prop Table
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                INJECTED
              </span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              These properties are returned whenever Call of Duty: Mobile invokes <code className="text-sky-300 font-mono">__system_property_get()</code> inside the virtual sandbox.
            </p>

            {/* Simulated prop inspector */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 font-mono text-[11px] text-slate-300 space-y-1.5 overflow-x-auto">
              <div><span className="text-sky-400">ro.product.model</span> = <span className="text-amber-300">"{activeProfile.model}"</span></div>
              <div><span className="text-sky-400">ro.product.manufacturer</span> = <span className="text-amber-300">"{activeProfile.manufacturer}"</span></div>
              <div><span className="text-sky-400">ro.product.brand</span> = <span className="text-amber-300">"{activeProfile.brand}"</span></div>
              <div><span className="text-sky-400">ro.board.platform</span> = <span className="text-amber-300">"{activeProfile.board}"</span></div>
              <div><span className="text-sky-400">ro.soc.manufacturer</span> = <span className="text-amber-300">"Qualcomm"</span></div>
              <div><span className="text-sky-400">ro.vendor.display.default_fps</span> = <span className="text-emerald-400">120</span></div>
              <div><span className="text-sky-400">debug.sf.high_fps_late_app_phase_scale_factor</span> = <span className="text-emerald-400">1</span></div>
              <div><span className="text-sky-400">persist.sys.app.fps</span> = <span className="text-emerald-400">120</span></div>
            </div>
          </div>

          {/* In-Game Settings Impact Preview */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
            <span className="text-xs font-mono text-slate-300 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              CODM In-Game Graphic Settings Status
            </span>

            <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Graphic Quality:</span>
                <span className="text-slate-200 font-semibold">Low / Medium (Optimal for 120 FPS)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Frame Rate Option:</span>
                <span className="text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                  ULTRA (120 FPS) UNLOCKED
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Shader Preload:</span>
                <span className="text-sky-400">Completed (No in-match stutter)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
