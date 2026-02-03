import schoolsData from '../../school.json';
import soldiersData from '../../soldier.json';
import spellsData from '../../spell.json';

export const schools = schoolsData;
export const soldiers = soldiersData;
export const spells = spellsData;

export const getSchoolById = (id) => {
  return schools.find(s => s.id === id);
};

export const getSpellsBySchool = (schoolId) => {
  return spells.filter(s => s.school === schoolId);
};

export const getSpellAlignment = (spellSchoolId, wizardSchoolId) => {
  const wizardSchool = getSchoolById(wizardSchoolId);
  if (!wizardSchool) return 'unknown';
  
  if (wizardSchool.id === spellSchoolId) return 'own';
  if (wizardSchool.aligned.includes(spellSchoolId)) return 'aligned';
  if (wizardSchool.neutral.includes(spellSchoolId)) return 'neutral';
  return 'opposed';
};

export const getSoldierByName = (name) => {
  return soldiers.find(s => s.name === name);
};

