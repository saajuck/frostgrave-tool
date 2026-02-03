import { getSchoolById, getSpellAlignment } from '../utils/dataLoader';
import StatsDisplay from './StatsDisplay';

const DEFAULT_WIZARD_STATS = {
  move: 6,
  fight: 2,
  shoot: 0,
  armour: 10,
  will: 4,
  health: 14
};

const DEFAULT_APPRENTICE_STATS = {
  move: 7,
  fight: 0,
  shoot: 0,
  armour: 10,
  will: 2,
  health: 12
};

function PrintView({ warband, onClose }) {
  const wizardSchool = getSchoolById(warband.wizard?.school);

  // Obtenir les stats avec valeurs par défaut
  const getWizardStats = (wiz) => {
    if (!wiz) return null;
    return {
      move: wiz.move ?? DEFAULT_WIZARD_STATS.move,
      fight: wiz.fight ?? DEFAULT_WIZARD_STATS.fight,
      shoot: wiz.shoot ?? DEFAULT_WIZARD_STATS.shoot,
      armour: wiz.armour ?? DEFAULT_WIZARD_STATS.armour,
      will: wiz.will ?? DEFAULT_WIZARD_STATS.will,
      health: wiz.health ?? DEFAULT_WIZARD_STATS.health
    };
  };

  const getApprenticeStats = (app) => {
    if (!app) return null;
    return {
      move: app.move ?? DEFAULT_APPRENTICE_STATS.move,
      fight: app.fight ?? DEFAULT_APPRENTICE_STATS.fight,
      shoot: app.shoot ?? DEFAULT_APPRENTICE_STATS.shoot,
      armour: app.armour ?? DEFAULT_APPRENTICE_STATS.armour,
      will: app.will ?? DEFAULT_APPRENTICE_STATS.will,
      health: app.health ?? DEFAULT_APPRENTICE_STATS.health
    };
  };

  const wizardStats = getWizardStats(warband.wizard);
  const apprenticeStats = getApprenticeStats(warband.apprentice);

  const getAlignmentBadge = (spellSchoolId) => {
    if (!warband.wizard) return null;
    
    const alignment = getSpellAlignment(spellSchoolId, warband.wizard.school);
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Vue imprimable</h2>
        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Imprimer
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
          >
            Fermer
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 print:p-4 print:shadow-none space-y-6 print:space-y-4">
        {/* En-tête */}
        <div className="text-center border-b pb-4 print:pb-2">
          <h1 className="text-3xl font-bold text-gray-800 print:text-2xl">
            {warband.name || 'Warband sans nom'}
          </h1>
          {wizardSchool && (
            <p className="text-lg text-gray-600 print:text-base mt-2">
              École: {wizardSchool.name}
            </p>
          )}
        </div>

        {/* Wizard & Apprentice */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:gap-2 avoid-break-section">
          {warband.wizard && wizardStats && (
            <div className="border border-gray-300 rounded p-4 print:p-2 avoid-break-inside">
              <h3 className="font-bold text-lg print:text-base mb-2">Wizard</h3>
              <p><strong>Nom:</strong> {warband.wizard.name || 'Sans nom'}</p>
              {wizardSchool && <p><strong>École:</strong> {wizardSchool.name}</p>}
              <div className="mt-2">
                <div className="text-sm font-semibold text-gray-700 mb-2 print:text-xs">Stats</div>
                <StatsDisplay stats={wizardStats} size="medium" />
              </div>
            </div>
          )}
          {warband.apprentice && apprenticeStats && (
            <div className="border border-gray-300 rounded p-4 print:p-2 avoid-break-inside">
              <h3 className="font-bold text-lg print:text-base mb-2">Apprenti</h3>
              <p><strong>Nom:</strong> {warband.apprentice.name || 'Sans nom'}</p>
              {wizardSchool && <p><strong>École:</strong> {wizardSchool.name}</p>}
              <div className="mt-2">
                <div className="text-sm font-semibold text-gray-700 mb-2 print:text-xs">Stats</div>
                <StatsDisplay stats={apprenticeStats} size="medium" />
              </div>
            </div>
          )}
        </div>

        {/* Soldats */}
        {warband.soldiers.length > 0 && (
          <div className="avoid-break-section">
            <h2 className="text-xl font-bold mb-3 print:text-lg print:mb-2 border-b pb-2 avoid-break-after">
              Soldats ({warband.soldiers.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 print:gap-2">
              {warband.soldiers.map((soldier, index) => (
                <div key={soldier.id || index} className="border border-gray-300 rounded p-3 print:p-2 avoid-break-inside">
                  <h3 className="font-bold print:text-sm">{soldier.customName || soldier.name}</h3>
                  {soldier.customName && (
                    <p className="text-xs text-gray-500 print:text-[10px] italic">{soldier.name} ({soldier.type})</p>
                  )}
                  {!soldier.customName && (
                    <p className="text-xs text-gray-500 print:text-[10px] italic">{soldier.type}</p>
                  )}
                  <div className="text-sm print:text-xs mt-1">
                    <div className="mt-1">
                      <StatsDisplay stats={soldier} size="small" />
                    </div>
                    <p><strong>Équipement:</strong> {soldier.gear}</p>
                    {soldier.notes && <p><strong>Notes:</strong> {soldier.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sorts */}
        {warband.spells.length > 0 && (
          <div className="avoid-break-section">
            <h2 className="text-xl font-bold mb-3 print:text-lg print:mb-2 border-b pb-2 avoid-break-after">
              Sorts ({warband.spells.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 print:gap-2">
              {warband.spells.map((spell, index) => (
                <div key={spell.name || index} className="border border-gray-300 rounded p-3 print:p-2 avoid-break-inside">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold print:text-sm">{spell.name}</h3>
                    {getAlignmentBadge(spell.school)}
                  </div>
                  <div className="text-sm print:text-xs mt-1">
                    <p><strong>TN:</strong> {spell.targetNumber} • <strong>Type:</strong> {spell.type}</p>
                    <p className="mt-1">{spell.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Résumé */}
        <div className="border-t pt-4 print:pt-2 mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:gap-2 text-center">
            <div>
              <div className="font-bold print:text-sm">Budget</div>
              <div className="text-sm print:text-xs">{warband.budget}</div>
            </div>
            <div>
              <div className="font-bold print:text-sm">Coût total</div>
              <div className="text-sm print:text-xs">
                {warband.soldiers.reduce((sum, s) => sum + (s.cost || 0), 0) + 
                 (warband.wizard ? 100 : 0) + 
                 (warband.apprentice ? 200 : 0)}
              </div>
            </div>
            <div>
              <div className="font-bold print:text-sm">Soldats</div>
              <div className="text-sm print:text-xs">{warband.soldiers.length}</div>
            </div>
            <div>
              <div className="font-bold print:text-sm">Sorts</div>
              <div className="text-sm print:text-xs">{warband.spells.length}</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .bg-white, .bg-white * {
            visibility: visible;
          }
          .bg-white {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          button {
            display: none !important;
          }
          /* Éviter les coupures de page */
          .avoid-break-section {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .avoid-break-inside {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .avoid-break-after {
            page-break-after: avoid;
            break-after: avoid;
          }
          /* Éviter les coupures dans les éléments */
          .avoid-break-inside h2,
          .avoid-break-inside h3 {
            page-break-after: avoid;
            break-after: avoid;
          }
          .avoid-break-inside p {
            orphans: 3;
            widows: 3;
          }
          /* Éviter les coupures dans les grilles */
          .avoid-break-section > div {
            page-break-inside: avoid;
            break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}

export default PrintView;

