// 1. The Basics
export type Grade = 'Legendary' | 'Rare';
export type HeroType = 'Attack' | 'Magic' | 'Defense' | 'Support' | 'Universal';

// 2. The Stats
export interface BaseStats {
  atk: number;
  def: number;
  hp: number;
  spd: number;
}

// 3. What a single Transcendence Level looks like
// We use '?' because these are optional (T1 might have atk_p, T3 might not)
export interface TranscendenceLevel {
  atk_p?: number;
  def_p?: number;
  hp_p?: number;
  atk?: number;
  def?: number;
  hp?: number;
  crit_rate?: number;
  dmg_red?: number;
  unlock?: string; // e.g., "passive_t2"
}

// 4. The Hero Structure (The "Big Boss" Type)
export interface Hero {
  id: string;
  name: string;
  group: string;
  grade: Grade;
  type: HeroType;
  titles: {
    4: string;
    5: string;
    6: string;
  };
  transcendence: {
    [key: string]: TranscendenceLevel; // This allows levels "1" through "12"
  };
}

export interface CalculatedStats {
  atk: number;
  def: number;
  hp: number;
  spd: number;
}