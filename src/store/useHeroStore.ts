import { create } from 'zustand'

// 1. The Blueprint (TypeScript strictly defines what the ledger looks like)
interface HeroState {
  selectedHero: string | null;            // Memory: Stores a name (or nothing)
  selectHero: (heroName: string) => void; // Action: A command to change the memory
}

// 2. The Actual Ledger
export const useHeroStore = create<HeroState>((set) => ({
  selectedHero: "None", // Default state
  
  // The function that updates the state
  selectHero: (heroName) => set({ selectedHero: heroName }),
}))