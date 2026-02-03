import { useState } from 'react';
import { soldiers } from '../utils/dataLoader';
import StatsDisplay from './StatsDisplay';

function SoldierList({ soldiers: warbandSoldiers, onAdd, onRemove, onUpdate, canAddSoldier, remainingBudget }) {
  const specialistCount = warbandSoldiers.filter(s => s.type === 'Specialist').length;
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSoldiers = soldiers.filter(soldier => {
    const matchesFilter = filter === 'all' || soldier.type === filter;
    const matchesSearch = soldier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         soldier.class.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const groupedSoldiers = {
    Standard: filteredSoldiers.filter(s => s.type === 'Standard'),
    Specialist: filteredSoldiers.filter(s => s.type === 'Specialist')
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous</option>
            <option value="Standard">Standard</option>
            <option value="Specialist">Spécialiste</option>
          </select>
        </div>
      </div>

      {/* Liste des soldats dans la warband */}
      {warbandSoldiers.length > 0 && (
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Soldats dans la warband</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {warbandSoldiers.map(soldier => (
              <div key={soldier.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="mb-2">
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Nom personnalisé
                      </label>
                      <input
                        type="text"
                        value={soldier.customName || ''}
                        onChange={(e) => onUpdate(soldier.id, { customName: e.target.value })}
                        placeholder={soldier.name}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="text-xs text-gray-500 italic mb-1">
                      {soldier.name} ({soldier.type}) • {soldier.cost} gold
                    </div>
                    <div className="mt-2">
                      <StatsDisplay stats={soldier} size="medium" />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{soldier.gear}</div>
                  </div>
                  <button
                    onClick={() => onRemove(soldier.id)}
                    className="ml-2 text-red-600 hover:text-red-800"
                    title="Retirer"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Liste disponible des soldats */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Soldats disponibles</h3>
        {Object.entries(groupedSoldiers).map(([type, typeSoldiers]) => (
          typeSoldiers.length > 0 && (
            <div key={type} className="mb-6">
              <h4 className="text-md font-semibold text-gray-600 mb-2">{type}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {typeSoldiers.map(soldier => {
                  const canAdd = canAddSoldier(soldier);
                  return (
                    <div
                      key={soldier.name}
                      className={`border rounded-lg p-3 ${
                        canAdd
                          ? 'border-gray-200 hover:border-blue-400 hover:shadow-md cursor-pointer'
                          : 'border-gray-100 bg-gray-50 opacity-50'
                      }`}
                      onClick={() => canAdd && onAdd(soldier.name)}
                    >
                      <div className="font-semibold text-gray-800">{soldier.name}</div>
                      <div className="text-sm text-gray-600">
                        {soldier.cost} gold
                      </div>
                      <div className="mt-2">
                        <StatsDisplay stats={soldier} size="medium" />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{soldier.gear}</div>
                      {!canAdd && (
                        <div className="text-xs text-red-600 mt-1">
                          {remainingBudget < soldier.cost 
                            ? 'Budget insuffisant' 
                            : soldier.type === 'Specialist' && specialistCount >= 4
                            ? 'Limite de 4 spécialistes atteinte'
                            : 'Limite de 8 soldats atteinte'}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
}

export default SoldierList;

