import { useState } from 'react';
import { spells, getSchoolById, getSpellAlignment } from '../utils/dataLoader';
import SpellCard from './SpellCard';

function SpellList({ wizardSchool, selectedSpells, onSpellsChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const wizardSchoolData = getSchoolById(wizardSchool);

  // Statistiques de sélection (pour appliquer les contraintes)
  const selectionStats = (() => {
    const stats = {
      own: 0,
      alignedCounts: {},
      neutral: 0,
    };

    selectedSpells.forEach(spell => {
      const alignment = getSpellAlignment(spell.school, wizardSchool);
      if (alignment === 'own') {
        stats.own += 1;
      } else if (alignment === 'aligned') {
        stats.alignedCounts[spell.school] = (stats.alignedCounts[spell.school] || 0) + 1;
      } else if (alignment === 'neutral') {
        stats.neutral += 1;
      }
    });

    return stats;
  })();

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

    let alignment = null;

    // Vérifier si le sort est opposé
    if (wizardSchool) {
      alignment = getSpellAlignment(spell.school, wizardSchool);
      if (alignment === 'opposed') {
        return; // Ne pas permettre la sélection des sorts opposés
      }
    }

    const isSelected = selectedSpells.some(s => s.name === spellName);
    if (isSelected) {
      onSpellsChange(selectedSpells.filter(s => s.name !== spellName));
    } else {
      // Appliquer les contraintes de sélection
      if (alignment === 'own' && selectionStats.own >= 3) {
        return;
      }
      if (alignment === 'aligned' && (selectionStats.alignedCounts[spell.school] || 0) >= 1) {
        return;
      }
      if (alignment === 'neutral' && selectionStats.neutral >= 2) {
        return;
      }

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

  const alignedSchoolsSelected = Object.keys(selectionStats.alignedCounts).length;
  const maxAlignedSchools = wizardSchoolData?.aligned?.length || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between md:gap-4">
        <input
          type="text"
          placeholder="Rechercher un sort..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="text-xs text-gray-700 bg-purple-50 border border-purple-100 rounded p-3 space-y-1">
        <p className="font-semibold">Règles de sélection des sorts :</p>
        <p>- 3 sorts de votre école</p>
        <p>- 1 sort de chaque école alliée</p>
        <p>- 2 sorts des écoles neutres</p>
        <p className="mt-1 text-[11px] text-gray-600">
          Actuellement : {selectionStats.own}/3 propres, {alignedSchoolsSelected}/{maxAlignedSchools} écoles alliées, {selectionStats.neutral}/2 neutres.
        </p>
      </div>

      {/* Sorts sélectionnés */}
      {selectedSpells.length > 0 && (
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Sorts sélectionnés ({selectedSpells.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedSpells.map(spell => (
              <SpellCard
                key={spell.name}
                spell={spell}
                wizardSchool={wizardSchool}
                variant="selected"
                isSelected
                onRemove={() => toggleSpell(spell.name)}
              />
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
            const schoolIdNum = parseInt(schoolId);
            const schoolData = getSchoolById(schoolIdNum);
            const filteredSchoolSpells = schoolSpells.filter(spell =>
              spell.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              spell.description.toLowerCase().includes(searchTerm.toLowerCase())
            );

            if (filteredSchoolSpells.length === 0) return null;

            const isWizardSchool = wizardSchool && schoolIdNum === wizardSchool;

            // Déterminer si l'école est désactivée à cause des contraintes
            const schoolAlignment = wizardSchool ? getSpellAlignment(schoolIdNum, wizardSchool) : null;
            const alignedCountForSchool = selectionStats.alignedCounts[schoolIdNum] || 0;
            const schoolDisabled =
              schoolAlignment === 'opposed' ||
              (schoolAlignment === 'own' && selectionStats.own >= 3) ||
              (schoolAlignment === 'aligned' && alignedCountForSchool >= 1) ||
              (schoolAlignment === 'neutral' && selectionStats.neutral >= 2);

            return (
              <div
                key={schoolId}
                className={`border rounded-lg p-4 ${
                  schoolDisabled
                    ? 'border-gray-200 bg-gray-100 opacity-60'
                    : isWizardSchool
                    ? 'border-purple-300 bg-purple-50'
                    : 'border-gray-200'
                }`}
              >
                <h4
                  className={`font-semibold mb-1 ${
                    schoolDisabled ? 'text-gray-500' : isWizardSchool ? 'text-purple-700' : 'text-gray-700'
                  }`}
                >
                  {schoolData?.name || `École ${schoolId}`}
                  {isWizardSchool && <span className="ml-2 text-xs text-purple-600">(Votre école)</span>}
                </h4>
                {schoolDisabled && (
                  <p className="text-[11px] text-gray-500 mb-2">
                    Limite atteinte pour cette école — aucun sort supplémentaire ne peut être sélectionné.
                  </p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredSchoolSpells.map(spell => {
                    const isSelected = selectedSpells.some(s => s.name === spell.name);
                    return (
                      <SpellCard
                        key={spell.name}
                        spell={spell}
                        wizardSchool={wizardSchool}
                        variant="available"
                        isSelected={isSelected}
                        disabled={schoolDisabled}
                        onClick={() => toggleSpell(spell.name)}
                      />
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

