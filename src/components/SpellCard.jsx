import { getSchoolById, getSpellAlignment } from '../utils/dataLoader';

function SpellCard({
  spell,
  wizardSchool,
  variant = 'available', // 'available' | 'selected'
  isSelected = false,
  disabled = false,
  onClick,
  onRemove,
}) {
  const school = getSchoolById(spell.school);
  const schoolName = school?.name || `École ${spell.school}`;
  const alignment = wizardSchool ? getSpellAlignment(spell.school, wizardSchool) : null;

  const alignmentBadges = {
    own: { text: 'Propre', color: 'bg-purple-600' },
    aligned: { text: 'Alliée', color: 'bg-green-600' },
    neutral: { text: 'Neutre', color: 'bg-yellow-600' },
    opposed: { text: 'Opposée', color: 'bg-red-600' }
  };

  const badge = alignment ? alignmentBadges[alignment] : null;

  const isOpposed = alignment === 'opposed';
  const cardDisabled = disabled || isOpposed;

  // Classes du conteneur selon le contexte
  let containerClasses = 'border rounded-lg p-3 transition ';
  if (variant === 'selected') {
    containerClasses += 'border-blue-200 bg-blue-50';
  } else {
    if (cardDisabled) {
      containerClasses += 'border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed';
    } else if (isSelected) {
      containerClasses += 'border-blue-400 bg-blue-50 cursor-pointer';
    } else {
      containerClasses += 'border-gray-200 hover:border-blue-300 hover:shadow-sm cursor-pointer';
    }
  }

  const handleClick = () => {
    if (variant === 'available' && !cardDisabled && onClick) {
      onClick();
    }
  };

  return (
    <div className={containerClasses} onClick={handleClick}>
      <div className="flex justify-between items-start mb-1">
        <div className={`flex-1 ${cardDisabled ? 'text-gray-500' : 'text-gray-800'}`}>
          <div className="font-semibold">{spell.name}</div>
          <div className="text-[11px] text-gray-500">
            École : {schoolName}
          </div>
        </div>
        {variant === 'selected' && onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="ml-2 text-red-600 hover:text-red-800"
            title="Retirer"
          >
            ×
          </button>
        )}
        {variant === 'available' && isSelected && !cardDisabled && (
          <span className="text-blue-600 font-bold ml-2">✓</span>
        )}
      </div>
      <div className={`text-sm mt-1 ${cardDisabled ? 'text-gray-400' : 'text-gray-600'}`}>
        TN: {spell.targetNumber} • {spell.type}
      </div>
      {badge && (
        <div className="mt-1">
          <span className={`px-2 py-1 text-xs font-semibold text-white rounded ${badge.color}`}>
            {badge.text}
          </span>
        </div>
      )}
      <div className={`text-xs mt-2 ${cardDisabled ? 'text-gray-400' : 'text-gray-500'}`}>
        {spell.description}
      </div>
      {isOpposed && (
        <div className="text-xs text-red-600 font-semibold mt-2">
          Sort opposé - Non sélectionnable
        </div>
      )}
    </div>
  );
}

export default SpellCard;


