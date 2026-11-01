import { useState, useEffect } from 'react';
import { Salad, Dumbbell, Moon, Stethoscope, Sparkles } from 'lucide-react';

const SECTIONS = [
  {
    key: 'diet',
    label: 'Diet & Nutrition',
    icon: Salad,
    accent: 'emerald',
    selectedBg: 'bg-emerald-600',
    selectedText: 'text-white',
    selectedBorder: 'border-emerald-600',
    unselectedBorder: 'border-slate-200/90',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    panelAccent: 'border-emerald-200/90',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    badgeBorder: 'border-emerald-200',
    numBg: 'bg-emerald-50',
    numText: 'text-emerald-700',
    numBorder: 'border-emerald-200',
  },
  {
    key: 'activity',
    label: 'Physical Activity & Movement',
    icon: Dumbbell,
    accent: 'blue',
    selectedBg: 'bg-blue-600',
    selectedText: 'text-white',
    selectedBorder: 'border-blue-600',
    unselectedBorder: 'border-slate-200/90',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    panelAccent: 'border-blue-200/90',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
    badgeBorder: 'border-blue-200',
    numBg: 'bg-blue-50',
    numText: 'text-blue-700',
    numBorder: 'border-blue-200',
  },
  {
    key: 'sleep',
    label: 'Sleep & Daily Routine',
    icon: Moon,
    accent: 'purple',
    selectedBg: 'bg-purple-600',
    selectedText: 'text-white',
    selectedBorder: 'border-purple-600',
    unselectedBorder: 'border-slate-200/90',
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
    panelAccent: 'border-purple-200/90',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-700',
    badgeBorder: 'border-purple-200',
    numBg: 'bg-purple-50',
    numText: 'text-purple-700',
    numBorder: 'border-purple-200',
  },
  {
    key: 'followUp',
    label: 'Follow-up, Retesting & Doctor Questions',
    icon: Stethoscope,
    accent: 'teal',
    selectedBg: 'bg-teal-600',
    selectedText: 'text-white',
    selectedBorder: 'border-teal-600',
    unselectedBorder: 'border-slate-200/90',
    iconBg: 'bg-teal-50',
    iconColor: 'text-teal-600',
    panelAccent: 'border-teal-200/90',
    badgeBg: 'bg-teal-50',
    badgeText: 'text-teal-700',
    badgeBorder: 'border-teal-200',
    numBg: 'bg-teal-50',
    numText: 'text-teal-700',
    numBorder: 'border-teal-200',
  },
];

/**
 * Parses markdown bold syntax (**text**) into <strong> tags for rich typography.
 */
function renderFormattedText(text) {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-semibold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

export default function CarePlan({ carePlan }) {
  const [activeKey, setActiveKey] = useState(() => {
    const firstWithItems = SECTIONS.find((s) => (carePlan?.[s.key] || []).length > 0);
    return firstWithItems ? firstWithItems.key : 'diet';
  });

  // Ensure active category is valid if carePlan updates
  useEffect(() => {
    if (carePlan && (!carePlan[activeKey] || carePlan[activeKey].length === 0)) {
      const firstWithItems = SECTIONS.find((s) => (carePlan[s.key] || []).length > 0);
      if (firstWithItems) {
        setActiveKey(firstWithItems.key);
      }
    }
  }, [carePlan, activeKey]);

  if (!carePlan) return null;

  // Find the active section config
  const activeSection = SECTIONS.find((s) => s.key === activeKey) || SECTIONS[0];
  const activeItems = carePlan[activeSection.key] || [];

  return (
    <div className="space-y-6">
      {/* Introduction highlight */}
      <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200/80 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-2xs">
        <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4 text-teal-600" />
        </div>
        <div>
          <h4 className="text-sm sm:text-base font-bold text-teal-950 mb-1">
            Personalised Clinical Nutrition &amp; Lifestyle Protocol
          </h4>
          <p className="text-xs sm:text-sm text-teal-900/80 leading-relaxed">
            These targeted recommendations are synthesized from the specific biomarkers detected in your lab report.
            They highlight beneficial whole foods, culinary swaps, exercise thresholds, and routine adjustments designed
            to support your physiological recovery.
          </p>
        </div>
      </div>

      {/* Category Selector:
          - Desktop (lg): 4 compact category cards in 1 row
          - Tablet (sm-md): 2x2 grid
          - Mobile (<sm): horizontally scrollable row */}
      <div className="overflow-x-auto pb-1.5 -mx-1 px-1 scrollbar-thin">
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 min-w-max sm:min-w-0">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            const items = carePlan[section.key] || [];
            const isActive = activeKey === section.key;
            const hasItems = items.length > 0;

            return (
              <button
                key={section.key}
                type="button"
                onClick={() => hasItems && setActiveKey(section.key)}
                disabled={!hasItems}
                className={[
                  'flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer',
                  'min-w-[210px] sm:min-w-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2',
                  isActive
                    ? `${section.selectedBg} ${section.selectedText} ${section.selectedBorder} shadow-sm`
                    : hasItems
                    ? `bg-white ${section.unselectedBorder} hover:border-slate-300 hover:bg-slate-50/80 text-slate-800 shadow-2xs`
                    : 'bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed opacity-60',
                ].join(' ')}
              >
                {/* Category Icon */}
                <div
                  className={[
                    'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors',
                    isActive ? 'bg-white/20 text-white' : `${section.iconBg} ${section.iconColor}`,
                  ].join(' ')}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Category Title & Recommendation Count */}
                <div className="min-w-0 flex-1">
                  <p
                    className={[
                      'text-xs sm:text-sm font-bold leading-snug truncate sm:whitespace-normal sm:line-clamp-2',
                      isActive ? 'text-white' : 'text-slate-800',
                    ].join(' ')}
                    title={section.label}
                  >
                    {section.label}
                  </p>
                  <p
                    className={[
                      'text-xs mt-1 font-medium',
                      isActive ? 'text-white/85' : 'text-slate-500',
                    ].join(' ')}
                  >
                    {items.length} recommendation{items.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Single Unified Recommendation Panel */}
      {activeSection && (
        <div
          key={activeSection.key}
          className={`bg-white rounded-2xl border ${activeSection.panelAccent} shadow-2xs overflow-hidden transition-all duration-200`}
        >
          {/* Panel Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b border-slate-100 bg-slate-50/70">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl ${activeSection.iconBg} flex items-center justify-center`}>
                <activeSection.icon className={`w-5 h-5 ${activeSection.iconColor}`} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                  {activeSection.label}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {activeItems.length} tailored recommendation{activeItems.length !== 1 ? 's' : ''} based on your lab values
                </p>
              </div>
            </div>
            <span
              className={`text-xs px-3 py-1 rounded-full font-semibold border ${activeSection.badgeBg} ${activeSection.badgeText} ${activeSection.badgeBorder}`}
            >
              Active Protocol
            </span>
          </div>

          {/* Recommendations List */}
          {activeItems.length === 0 ? (
            <div className="px-6 py-12 text-center text-slate-400 text-sm">
              No recommendations available in this category for this report.
            </div>
          ) : (
            <ol className="divide-y divide-slate-100/90">
              {activeItems.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-4 px-5 sm:px-6 py-4 sm:py-5 hover:bg-slate-50/50 transition-colors"
                >
                  {/* Clearly visible sequence number */}
                  <span
                    className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 shadow-2xs ${activeSection.numBg} ${activeSection.numText} ${activeSection.numBorder}`}
                  >
                    {i + 1}
                  </span>

                  {/* Recommendation Content with markdown bolding */}
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed flex-1 break-words">
                    {renderFormattedText(item)}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}

      {/* Safety Notice */}
      <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5">
        <p className="text-xs sm:text-sm text-slate-500 text-center leading-relaxed">
          <strong className="font-semibold text-slate-700">Important Clinical Reminder:</strong> This personalised care protocol provides nutritional and lifestyle education.
          It does not replace medical treatment, pharmacological prescriptions, or clinical consultations. Always discuss dietary modifications,
          new exercise routines, or supplements with your physician or registered dietitian before implementing significant changes.
        </p>
      </div>
    </div>
  );
}


