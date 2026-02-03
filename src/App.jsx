import { useState, useEffect } from 'react';
import WarbandManager from './components/WarbandManager';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Gestionnaire de Warband Frostgrave</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <WarbandManager />
      </main>
    </div>
  );
}

export default App;

