import { useState } from 'react';
import WizardForm from './WizardForm';
import SoldierList from './SoldierList';
import SpellList from './SpellList';
import PrintView from './PrintView';
import { soldiers } from '../utils/dataLoader';

const MAX_WARBAND_SIZE = 8;
const MAX_SPECIALISTS = 4;
const STARTING_BUDGET = 400;

function WarbandManager() {
  const [warband, setWarband] = useState({
    name: '',
    wizard: null,
    apprentice: null,
    soldiers: [],
    spells: [],
    budget: STARTING_BUDGET
  });
  const [showPrintView, setShowPrintView] = useState(false);
  const [activeTab, setActiveTab] = useState('soldiers'); // 'soldiers' ou 'spells'

  // Calculer le coût total
  const calculateTotalCost = () => {
    let total = 0;
    if (warband.apprentice) total += 200; // Apprentice coûte 200
    warband.soldiers.forEach(soldier => {
      total += soldier.cost || 0;
    });
    return total;
  };

  const totalCost = calculateTotalCost();
  const remainingBudget = warband.budget - totalCost;
  const soldierCount = warband.soldiers.length;
  const specialistCount = warband.soldiers.filter(s => s.type === 'Specialist').length;
  const standardCount = warband.soldiers.filter(s => s.type === 'Standard').length;

  // Vérifier les limites
  const canAddSoldier = (soldier) => {
    if (soldierCount >= MAX_WARBAND_SIZE) return false;
    if (soldier.type === 'Specialist' && specialistCount >= MAX_SPECIALISTS) return false;
    if (remainingBudget < (soldier.cost || 0)) return false;
    return true;
  };

  const addSoldier = (soldierName) => {
    const soldier = soldiers.find(s => s.name === soldierName);
    if (!soldier || !canAddSoldier(soldier)) return;
    
    setWarband(prev => ({
      ...prev,
      soldiers: [...prev.soldiers, { ...soldier, id: Date.now() }]
    }));
  };

  const removeSoldier = (id) => {
    setWarband(prev => ({
      ...prev,
      soldiers: prev.soldiers.filter(s => s.id !== id)
    }));
  };

  const updateSoldier = (id, updates) => {
    setWarband(prev => ({
      ...prev,
      soldiers: prev.soldiers.map(s => 
        s.id === id ? { ...s, ...updates } : s
      )
    }));
  };

  const updateWizard = (wizardData) => {
    setWarband(prev => ({
      ...prev,
      wizard: wizardData
    }));
  };

  const updateApprentice = (apprenticeData) => {
    setWarband(prev => ({
      ...prev,
      apprentice: apprenticeData
    }));
  };

  const updateSpells = (spellsList) => {
    setWarband(prev => ({
      ...prev,
      spells: spellsList
    }));
  };

  const updateBudget = (newBudget) => {
    setWarband(prev => ({
      ...prev,
      budget: parseInt(newBudget) || STARTING_BUDGET
    }));
  };

  const exportWarband = () => {
    const dataStr = JSON.stringify(warband, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `warband-${warband.name || 'sans-nom'}-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importWarband = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        setWarband(imported);
      } catch (error) {
        alert('Erreur lors de l\'import du fichier JSON');
      }
    };
    reader.readAsText(file);
  };

  const resetWarband = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser la warband ?')) {
      setWarband({
        name: '',
        wizard: null,
        apprentice: null,
        soldiers: [],
        spells: [],
        budget: STARTING_BUDGET
      });
    }
  };

  if (showPrintView) {
    return <PrintView warband={warband} onClose={() => setShowPrintView(false)} />;
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de la warband
            </label>
            <input
              type="text"
              value={warband.name}
              onChange={(e) => setWarband(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nom de votre warband"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={exportWarband}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              Exporter JSON
            </button>
            <label className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition cursor-pointer">
              Importer JSON
              <input
                type="file"
                accept=".json"
                onChange={importWarband}
                className="hidden"
              />
            </label>
            <button
              onClick={() => setShowPrintView(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
            >
              Vue imprimable
            </button>
            <button
              onClick={resetWarband}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      {/* Budget */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget total
            </label>
            <input
              type="number"
              value={warband.budget}
              onChange={(e) => updateBudget(e.target.value)}
              className="w-full md:w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Coût total: <span className="font-semibold">{totalCost}</span></div>
            <div className={`text-lg font-bold ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              Reste: {remainingBudget}
            </div>
          </div>
        </div>
      </div>

      {/* Résumé */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Résumé</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="text-sm font-medium text-gray-600 mb-1">Sorts sélectionnés</div>
            <div className="text-3xl font-bold text-blue-600">{warband.spells.length}</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="text-sm font-medium text-gray-600 mb-1">Soldats</div>
            <div className="text-3xl font-bold text-green-600">{soldierCount}</div>
            <div className="text-xs text-gray-500 mt-1">
              {standardCount} Standard • {specialistCount} Spécialiste
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="text-sm font-medium text-gray-600 mb-1">Budget consommé</div>
            <div className="text-3xl font-bold text-purple-600">{totalCost}</div>
            <div className={`text-xs mt-1 ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              Reste: {remainingBudget} / {warband.budget}
            </div>
          </div>
        </div>
      </div>

      {/* Wizard */}
      <WizardForm
        wizard={warband.wizard}
        apprentice={warband.apprentice}
        onWizardChange={updateWizard}
        onApprenticeChange={updateApprentice}
      />

      {/* Onglets Sorts / Soldats */}
      <div className="bg-white rounded-lg shadow">
        {/* Navigation des onglets */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('soldiers')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition ${
                activeTab === 'soldiers'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Soldats ({soldierCount})
            </button>
            <button
              onClick={() => setActiveTab('spells')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition ${
                activeTab === 'spells'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Sorts ({warband.spells.length})
            </button>
          </nav>
        </div>

        {/* Contenu des onglets */}
        <div className="p-6">
          {activeTab === 'soldiers' && (
            <SoldierList
              soldiers={warband.soldiers}
              onAdd={addSoldier}
              onRemove={removeSoldier}
              onUpdate={updateSoldier}
              canAddSoldier={canAddSoldier}
              remainingBudget={remainingBudget}
            />
          )}
          {activeTab === 'spells' && warband.wizard && (
            <SpellList
              wizardSchool={warband.wizard.school}
              selectedSpells={warband.spells}
              onSpellsChange={updateSpells}
            />
          )}
          {activeTab === 'spells' && !warband.wizard && (
            <div className="text-center py-8 text-gray-500">
              Veuillez d'abord sélectionner un wizard pour voir les sorts.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WarbandManager;

