import { useState } from 'react';
import { schools } from '../utils/dataLoader';
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

function WizardForm({ wizard, apprentice, onWizardChange, onApprenticeChange }) {
  const [wizardName, setWizardName] = useState(wizard?.name || '');
  const [wizardSchool, setWizardSchool] = useState(wizard?.school || '');
  const [apprenticeName, setApprenticeName] = useState(apprentice?.name || '');
  const [hasApprentice, setHasApprentice] = useState(!!apprentice);

  // Obtenir les stats du wizard avec valeurs par défaut
  const getWizardWithStats = (wiz) => {
    if (!wiz) return null;
    return {
      ...wiz,
      move: wiz.move ?? DEFAULT_WIZARD_STATS.move,
      fight: wiz.fight ?? DEFAULT_WIZARD_STATS.fight,
      shoot: wiz.shoot ?? DEFAULT_WIZARD_STATS.shoot,
      armour: wiz.armour ?? DEFAULT_WIZARD_STATS.armour,
      will: wiz.will ?? DEFAULT_WIZARD_STATS.will,
      health: wiz.health ?? DEFAULT_WIZARD_STATS.health
    };
  };

  // Obtenir les stats de l'apprentice avec valeurs par défaut
  const getApprenticeWithStats = (app) => {
    if (!app) return null;
    return {
      ...app,
      move: app.move ?? DEFAULT_APPRENTICE_STATS.move,
      fight: app.fight ?? DEFAULT_APPRENTICE_STATS.fight,
      shoot: app.shoot ?? DEFAULT_APPRENTICE_STATS.shoot,
      armour: app.armour ?? DEFAULT_APPRENTICE_STATS.armour,
      will: app.will ?? DEFAULT_APPRENTICE_STATS.will,
      health: app.health ?? DEFAULT_APPRENTICE_STATS.health
    };
  };

  const wizardWithStats = getWizardWithStats(wizard);
  const apprenticeWithStats = getApprenticeWithStats(apprentice);

  const handleWizardChange = (field, value) => {
    const currentWizard = wizard || {};
    const stats = {
      move: currentWizard.move ?? DEFAULT_WIZARD_STATS.move,
      fight: currentWizard.fight ?? DEFAULT_WIZARD_STATS.fight,
      shoot: currentWizard.shoot ?? DEFAULT_WIZARD_STATS.shoot,
      armour: currentWizard.armour ?? DEFAULT_WIZARD_STATS.armour,
      will: currentWizard.will ?? DEFAULT_WIZARD_STATS.will,
      health: currentWizard.health ?? DEFAULT_WIZARD_STATS.health
    };

    if (field === 'name') {
      setWizardName(value);
      onWizardChange({ 
        ...currentWizard, 
        name: value, 
        school: wizardSchool,
        ...stats
      });
    } else if (field === 'school') {
      setWizardSchool(value);
      onWizardChange({ 
        ...currentWizard, 
        name: wizardName, 
        school: parseInt(value),
        ...stats
      });
    }
  };

  const handleApprenticeChange = (field, value) => {
    const currentApprentice = apprentice || {};
    const stats = {
      move: currentApprentice.move ?? DEFAULT_APPRENTICE_STATS.move,
      fight: currentApprentice.fight ?? DEFAULT_APPRENTICE_STATS.fight,
      shoot: currentApprentice.shoot ?? DEFAULT_APPRENTICE_STATS.shoot,
      armour: currentApprentice.armour ?? DEFAULT_APPRENTICE_STATS.armour,
      will: currentApprentice.will ?? DEFAULT_APPRENTICE_STATS.will,
      health: currentApprentice.health ?? DEFAULT_APPRENTICE_STATS.health
    };

    if (field === 'name') {
      setApprenticeName(value);
      onApprenticeChange({ 
        ...currentApprentice, 
        name: value,
        ...stats
      });
    }
  };

  const toggleApprentice = (checked) => {
    setHasApprentice(checked);
    if (!checked) {
      onApprenticeChange(null);
      setApprenticeName('');
    } else {
      onApprenticeChange({ 
        name: '', 
        school: wizardSchool,
        ...DEFAULT_APPRENTICE_STATS
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Wizard & Apprenti</h2>
      
      {/* Wizard */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-700">Wizard</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du Wizard
            </label>
            <input
              type="text"
              value={wizardName}
              onChange={(e) => handleWizardChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nom du wizard"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              École de magie
            </label>
            <select
              value={wizardSchool}
              onChange={(e) => handleWizardChange('school', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner une école</option>
              {schools.map(school => (
                <option key={school.id} value={school.id}>
                  {school.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        {wizardWithStats && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <div className="text-sm font-semibold text-gray-700 mb-3">Stats</div>
            <StatsDisplay stats={wizardWithStats} size="large" />
          </div>
        )}
      </div>

      {/* Apprentice */}
      <div className="space-y-4 border-t pt-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="hasApprentice"
            checked={hasApprentice}
            onChange={(e) => toggleApprentice(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="hasApprentice" className="text-lg font-semibold text-gray-700">
            Avoir un Apprenti (+200 gold)
          </label>
        </div>
        {hasApprentice && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de l'Apprenti
            </label>
            <input
              type="text"
              value={apprenticeName}
              onChange={(e) => handleApprenticeChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nom de l'apprenti"
            />
            <p className="mt-2 text-sm text-gray-500">
              L'apprenti utilise la même école de magie que le wizard.
            </p>
            {apprenticeWithStats && (
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <div className="text-sm font-semibold text-gray-700 mb-3">Stats</div>
                <StatsDisplay stats={apprenticeWithStats} size="large" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default WizardForm;

