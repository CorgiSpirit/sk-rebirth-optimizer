import { useHeroStore } from './store/useHeroStore'

function App() {
  // We extract exactly what we need from the Master Ledger
  const selectedHero = useHeroStore((state) => state.selectedHero)
  const selectHero = useHeroStore((state) => state.selectHero)

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center font-sans text-white">
      
      <div className="text-center p-8 border border-slate-700 rounded-lg bg-slate-800 shadow-xl mb-6">
        <h1 className="text-4xl font-bold text-blue-400 mb-4">SK Rebirth Optimizer</h1>
        
        {/* Here we display the memory */}
        <p className="text-xl mt-4">
          Current Target: <span className="text-yellow-400 font-bold">{selectedHero}</span>
        </p>
      </div>

      {/* These buttons issue commands to change the memory */}
      <div className="flex gap-4">
        <button 
          onClick={() => selectHero("Eileene")}
          className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded font-bold cursor-pointer transition-colors"
        >
          Select Eileene
        </button>
        
        <button 
          onClick={() => selectHero("Rachel")}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-500 rounded font-bold cursor-pointer transition-colors"
        >
          Select Rachel
        </button>
      </div>

    </div>
  )
}

export default App