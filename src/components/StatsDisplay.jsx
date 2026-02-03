function StatsDisplay({ stats, size = 'medium' }) {
  if (!stats) return null;

  const sizeClasses = {
    small: {
      container: 'w-7 h-7',
      text: 'text-xs',
      label: 'text-[10px]',
      gap: 'gap-1.5'
    },
    medium: {
      container: 'w-8 h-8',
      text: 'text-sm',
      label: 'text-xs',
      gap: 'gap-2'
    },
    large: {
      container: 'w-10 h-10',
      text: 'text-lg',
      label: 'text-xs',
      gap: 'gap-3'
    }
  };

  const classes = sizeClasses[size];

  return (
    <div className={`flex ${classes.gap} flex-wrap`}>
      <div className="flex flex-col items-center">
        <div className={`${classes.label} font-semibold text-gray-600 mb-0.5`}>M</div>
        <div className={`${classes.container} border-2 border-gray-400 rounded flex items-center justify-center ${classes.text} font-bold text-gray-800`}>
          {stats.move}
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className={`${classes.label} font-semibold text-gray-600 mb-0.5`}>C</div>
        <div className={`${classes.container} border-2 border-gray-400 rounded flex items-center justify-center ${classes.text} font-bold text-gray-800`}>
          {stats.fight}
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className={`${classes.label} font-semibold text-gray-600 mb-0.5`}>T</div>
        <div className={`${classes.container} border-2 border-gray-400 rounded flex items-center justify-center ${classes.text} font-bold text-gray-800`}>
          {stats.shoot}
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className={`${classes.label} font-semibold text-gray-600 mb-0.5`}>A</div>
        <div className={`${classes.container} border-2 border-gray-400 rounded flex items-center justify-center ${classes.text} font-bold text-gray-800`}>
          {stats.armour}
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className={`${classes.label} font-semibold text-gray-600 mb-0.5`}>V</div>
        <div className={`${classes.container} border-2 border-gray-400 rounded flex items-center justify-center ${classes.text} font-bold text-gray-800`}>
          {stats.will >= 0 ? '+' : ''}{stats.will}
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className={`${classes.label} font-semibold text-gray-600 mb-0.5`}>PV</div>
        <div className={`${classes.container} border-2 border-gray-400 rounded flex items-center justify-center ${classes.text} font-bold text-gray-800`}>
          {stats.health}
        </div>
      </div>
    </div>
  );
}

export default StatsDisplay;

