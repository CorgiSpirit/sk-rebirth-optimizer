import statTemplates from '../data/base-stat-templates.json';
import potentialData from '../data/potentials.json';
import heroes from '../data/heroes.json';
import type { Hero, CalculatedStats, TranscendenceLevel } from '../data/types';

/**
 * The Brain of the Sandbox:
 * Calculates the "White Number" (Hero Base + Progression)
 */
export function calculateBaseStats(
  heroId: string,
  rank: number,      // 4, 5, or 6
  enhance: number,   // 0 to 5
  transcend: number, // 0 to 12
  potentials: { atk: number; def: number; hp: number }
): CalculatedStats {
  
  // 1. Find the Hero in your database
  const hero = (heroes as Hero[]).find(h => h.id === heroId);
  if (!hero) return { atk: 0, def: 0, hp: 0, spd: 0 };

  // 2. Get the "Chassis" (Template Stats for Rank and Enhance)
  // We use [rank.toString()] because JSON keys are always strings
  const template: any = (statTemplates as any)[hero.grade][hero.type][rank.toString()][enhance];
  
  // 3. Potential Math (Tiered Logic: 1-10, 11-20, 21-30)
  const potRules = (potentialData as any)[hero.grade];
  
  const getPotBonus = (level: number, tierData: any) => {
    let bonus = 0;
    if (level <= 10) {
      bonus = level * tierData.tier1;
    } else if (level <= 20) {
      bonus = (10 * tierData.tier1) + ((level - 10) * tierData.tier2);
    } else {
      bonus = (10 * tierData.tier1) + (10 * tierData.tier2) + ((level - 20) * tierData.tier3);
    }
    return bonus;
  };

  const pAtk = getPotBonus(potentials.atk, potRules.Attack);
  const pDef = getPotBonus(potentials.def, potRules.Defense);
  const pHP = getPotBonus(potentials.hp, potRules.HP);

  // 4. Transcendence Math (T1 - T12)
  let tAtkP = 0, tDefP = 0, tHPP = 0; // Percentages
  let tAtkF = 0, tDefF = 0, tHPF = 0; // Flat additions

  for (let i = 1; i <= transcend; i++) {
    const levelData = hero.transcendence[i.toString()] as TranscendenceLevel;
    
    if (levelData) {
      // Percentage bonuses
      if (levelData.atk_p) tAtkP += levelData.atk_p;
      if (levelData.def_p) tDefP += levelData.def_p;
      if (levelData.hp_p) tHPP += levelData.hp_p;
      
      // Flat bonuses (if any exist)
      if (levelData.atk) tAtkF += levelData.atk;
      if (levelData.def) tDefF += levelData.def;
      if (levelData.hp) tHPF += levelData.hp;
    }
  }

  // 5. Final Assembly (The White Number)
  // Rule: (Base + Potential) + (Base * Transcend%) + TranscendFlat
  return {
    atk: template.atk + pAtk + Math.floor(template.atk * (tAtkP / 100)) + tAtkF,
    def: template.def + pDef + Math.floor(template.def * (tDefP / 100)) + tDefF,
    hp: template.hp + pHP + Math.floor(template.hp * (tHPP / 100)) + tHPF,
    spd: template.spd // Speed only changes with Rank (handled in template)
  };
}