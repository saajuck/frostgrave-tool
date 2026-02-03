import { useState } from 'react';
import { spells, getSchoolById, getSpellAlignment } from '../utils/dataLoader';

function SpellList({ wizardSchool, selectedSpells, onSpellsChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const wizardSchoolData = getSchoolById(wizardSchool);

  // Obtenir tous les sorts uniques par école
  const spellsBySchool = {};
  spells.forEach(spell => {
    if (!spellsBySchool[spell.school]) {
      spellsBySchool[spell.school] = [];
    }
    spellsBySchool[spell.school].push(spell);
  });

  const filteredSpells = spells.filter(spell => {
    return spell.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           spell.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const toggleSpell = (spellName) => {
    const spell = spells.find(s => s.name === spellName);
    if (!spell) return;

    // Vérifier si le sort est opposé
    if (wizardSchool) {
      const alignment = getSpellAlignment(spell.school, wizardSchool);
      if (alignment === 'opposed') {
        return; // Ne pas permettre la sélection des sorts opposés
      }
    }

    const isSelected = selectedSpells.some(s => s.name === spellName);
    if (isSelected) {
      onSpellsChange(selectedSpells.filter(s => s.name !== spellName));
    } else {
      onSpellsChange([...selectedSpells, spell]);
    }
  };

  const isSpellOpposed = (spellSchoolId) => {
    if (!wizardSchool) return false;
    const alignment = getSpellAlignment(spellSchoolId, wizardSchool);
    return alignment === 'opposed';
  };

  const getAlignmentBadge = (spellSchoolId) => {
    if (!wizardSchoolData) return null;
    
    const alignment = getSpellAlignment(spellSchoolId, wizardSchool);
    const badges = {
      own: { text: 'Propre', color: 'bg-purple-600' },
      aligned: { text: 'Alliée', color: 'bg-green-600' },
      neutral: { text: 'Neutre', color: 'bg-yellow-600' },
      opposed: { text: 'Opposée', color: 'bg-red-600' }
    };

    const badge = badges[alignment];
    if (!badge) return null;

    return (
      <span className={`px-2 py-1 text-xs font-semibold text-white rounded ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <input
          type="text"
          placeholder="Rechercher un sort..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Sorts sélectionnés */}
      {selectedSpells.length > 0 && (
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Sorts sélectionnés ({selectedSpells.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedSpells.map(spell => (
              <div key={spell.name} className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">{spell.name}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      TN: {spell.targetNumber} • {spell.type}
                    </div>
                    {getAlignmentBadge(spell.school)}
                    <div className="text-xs text-gray-500 mt-2 line-clamp-2">
                      {spell.description}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleSpell(spell.name)}
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

      {/* Liste des sorts disponibles */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Sorts disponibles</h3>
        <div className="space-y-4">
          {Object.entries(spellsBySchool)
            .sort(([schoolIdA], [schoolIdB]) => {
              // Mettre l'école du wizard en premier
              if (wizardSchool) {
                if (parseInt(schoolIdA) === wizardSchool) return -1;
                if (parseInt(schoolIdB) === wizardSchool) return 1;
              }
              // Sinon, trier par ID
              return parseInt(schoolIdA) - parseInt(schoolIdB);
            })
            .map(([schoolId, schoolSpells]) => {
            const schoolData = getSchoolById(parseInt(schoolId));
            const filteredSchoolSpells = schoolSpells.filter(spell =>
              spell.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              spell.description.toLowerCase().includes(searchTerm.toLowerCase())
            );

            if (filteredSchoolSpells.length === 0) return null;

            const isWizardSchool = wizardSchool && parseInt(schoolId) === wizardSchool;

            return (
              <div key={schoolId} className={`border rounded-lg p-4 ${isWizardSchool ? 'border-purple-300 bg-purple-50' : 'border-gray-200'}`}>
                <h4 className={`font-semibold mb-2 ${isWizardSchool ? 'text-purple-700' : 'text-gray-700'}`}>
                  {schoolData?.name || `École ${schoolId}`}
                  {isWizardSchool && <span className="ml-2 text-xs text-purple-600">(Votre école)</span>}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredSchoolSpells.map(spell => {
                    const isSelected = selectedSpells.some(s => s.name === spell.name);
                    const isOpposed = isSpellOpposed(spell.school);
                    return (
                      <div
                        key={spell.name}
                        className={`border rounded-lg p-3 transition ${
                          isOpposed
                            ? 'border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed'
                            : isSelected
                            ? 'border-blue-400 bg-blue-50 cursor-pointer'
                            : 'border-gray-200 hover:border-blue-300 hover:shadow-sm cursor-pointer'
                        }`}
                        onClick={() => !isOpposed && toggleSpell(spell.name)}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <div className={`font-semibold ${isOpposed ? 'text-gray-500' : 'text-gray-800'}`}>
                            {spell.name}
                          </div>
                          {isSelected && !isOpposed && (
                            <span className="text-blue-600 font-bold">✓</span>
                          )}
                        </div>
                        <div className={`text-sm ${isOpposed ? 'text-gray-400' : 'text-gray-600'}`}>
                          TN: {spell.targetNumber} • {spell.type}
                        </div>
                        {getAlignmentBadge(spell.school)}
                        <div className={`text-xs mt-2 ${isOpposed ? 'text-gray-400' : 'text-gray-500'}`}>
                          {spell.description}
                        </div>
                        {isOpposed && (
                          <div className="text-xs text-red-600 font-semibold mt-2">
                            Sort opposé - Non sélectionnable
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SpellList;

