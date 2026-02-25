import { useState, useMemo } from 'react';
import { calculateBaseStats } from './logic/statCalculator';
import heroList from './data/heroes.json';
import type { Hero } from './data/types';

function App() {
  // 1. STATE: These are the selections from your "Hero Step" flow
  const [heroId, setHeroId] = useState<string>(heroList[0]?.id || 'shane');
  const [rank, setRank] = useState<number>(6);
  const [enhance, setEnhance] = useState<number>(5);
  const [transcend, setTranscend] = useState<number>(0);
  const [pots, setPots] = useState({ atk: 0, def: 0, hp: 0 });

  // 2. LOGIC: Find current hero data
  const currentHero = (heroList as Hero[]).find(h => h.id === heroId);

  // 3. LOGIC GATES: Potential is capped by Transcendence (T2 -> 10, T4 -> 20, T6 -> 30)
  const potLimit = transcend < 2 ? 10 : transcend < 4 ? 20 : 30;

  // 4. CALCULATION: Run the math engine
  // useMemo ensures the math only runs when a slider moves
  const whiteStats = useMemo(() => {
    return calculateBaseStats(heroId, rank, enhance, transcend, pots);
  }, [heroId, rank, enhance, transcend, pots]);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <header className="mb-8 border-b border-slate-700 pb-4">
          <h1 className="text-3xl font-black text-cyan-400 tracking-tighter uppercase italic">
            7K Rebirth <span className="text-white">Sandbox</span>
          </h1>
          <p className="text-slate-400 text-sm">Experimental Gear & Stat Optimizer</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: CONTROLS (Step 1 & 2) */}
          <div className="lg:col-span-7 space-y-6">
            
            <section className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-xl">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Step 1: Identity</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Select Hero</label>
                  <select 
                    className="w-full bg-slate-900 border border-slate-600 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                    value={heroId} 
                    onChange={(e) => setHeroId(e.target.value)}
                  >
                    {heroList.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                  </select>
                </div>
              </div>
            </section>

            <section className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-xl">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Step 2: Progression</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Star Rank ({rank}★)</label>
                  <div className="flex gap-2">
                    {[4, 5, 6].map(r => (
                      <button 
                        key={r}
                        onClick={() => setRank(r)}
                        className={`flex-1 py-2 rounded-md font-bold transition-all ${rank === r ? 'bg-cyan-500 text-slate-900' : 'bg-slate-700 hover:bg-slate-600'}`}
                      >
                        {r}★
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Enhance (+{enhance})</label>
                  <input type="range" min="0" max="5" value={enhance} onChange={(e) => setEnhance(Number(e.target.value))} className="w-full accent-cyan-400" />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-medium text-slate-400 mb-2">Transcendence (T{transcend})</label>
                <input type="range" min="0" max="12" value={transcend} onChange={(e) => setTranscend(Number(e.target.value))} className="w-full accent-cyan-400" />
              </div>

              <div className="space-y-4 border-t border-slate-700 pt-4">
                <label className="block text-xs font-medium text-slate-400">Potential (Tier {transcend < 2 ? '1' : transcend < 4 ? '2' : '3'})</label>
                <PotentialSlider label="ATK" val={pots.atk} max={potLimit} onChange={(v) => setPots({...pots, atk: v})} />
                <PotentialSlider label="DEF" val={pots.def} max={potLimit} onChange={(v) => setPots({...pots, def: v})} />
                <PotentialSlider label="HP"  val={pots.hp}  max={potLimit} onChange={(v) => setPots({...pots, hp: v})} />
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: STAT SHEET (Step 3) */}
          <div className="lg:col-span-5">
            <div className="sticky top-8 bg-linear-to-br from-slate-800 to-slate-900 p-8 rounded-3xl border border-cyan-500/30 shadow-2xl">
              <div className="text-center mb-8">
                <p className="text-cyan-400 font-bold text-xs tracking-[0.2em] uppercase mb-1">Current Build</p>
                <h2 className="text-2xl font-black text-white leading-tight">
                   {/* @ts-ignore */}
                  {currentHero?.titles[rank.toString()] || currentHero?.name}
                </h2>
                <div className="flex justify-center gap-2 mt-2">
                  <span className="bg-slate-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase">{currentHero?.grade}</span>
                  <span className="bg-cyan-900/50 text-cyan-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase">{currentHero?.type}</span>
                </div>
              </div>

              <div className="space-y-4">
                <StatRow label="Magic/Phys Attack" value={whiteStats.atk} color="text-white" />
                <StatRow label="Defense" value={whiteStats.def} color="text-white" />
                <StatRow label="Health Points" value={whiteStats.hp} color="text-white" />
                <StatRow label="Speed" value={whiteStats.spd} color="text-white" />
              </div>

              <div className="mt-8 p-4 bg-slate-900/50 rounded-xl border border-slate-700">
                <p className="text-[10px] text-slate-500 uppercase font-bold text-center">Note: Gear Stats (+Green) Coming Soon</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function StatRow({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="flex justify-between items-end border-b border-slate-700/50 pb-2">
      <span className="text-slate-400 text-sm font-medium">{label}</span>
      <span className={`text-2xl font-black font-mono ${color}`}>{value.toLocaleString()}</span>
    </div>
  );
}

function PotentialSlider({ label, val, max, onChange }: { label: string, val: number, max: number, onChange: (v: number) => void }) {
  // Fix value if it exceeds current limit
  const currentVal = val > max ? max : val;
  return (
    <div className="flex items-center gap-4">
      <span className="w-8 text-[10px] font-bold text-slate-500">{label}</span>
      <input type="range" min="0" max={max} value={currentVal} onChange={(e) => onChange(Number(e.target.value))} className="flex-1 accent-emerald-500 h-1" />
      <span className="w-8 text-right font-mono text-sm text-emerald-400">{currentVal}</span>
    </div>
  );
}

export default App;