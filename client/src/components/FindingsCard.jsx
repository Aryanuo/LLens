import StatusBadge from './StatusBadge';
import { AlertTriangle, ArrowRight, TrendingUp, TrendingDown, HelpCircle, Activity } from 'lucide-react';

export default function FindingsCard({ finding }) {
  const isCritical = finding.status === 'potentially_critical';
  const isHigh = finding.status === 'high';
  const isLow = finding.status === 'low';

  const cardConfig = isCritical
    ? {
        border: 'border-red-200/90',
        bg: 'bg-gradient-to-br from-red-50/70 via-white to-red-50/30',
        icon: AlertTriangle,
        iconBg: 'bg-red-100 text-red-700',
        accentBg: 'bg-red-50 border-red-200/70 text-red-900',
        arrowColor: 'text-red-600',
      }
    : isHigh
    ? {
        border: 'border-amber-200/90',
        bg: 'bg-gradient-to-br from-amber-50/60 via-white to-amber-50/20',
        icon: TrendingUp,
        iconBg: 'bg-amber-100 text-amber-800',
        accentBg: 'bg-amber-50 border-amber-200/70 text-amber-900',
        arrowColor: 'text-amber-600',
      }
    : isLow
    ? {
        border: 'border-sky-200/90',
        bg: 'bg-gradient-to-br from-sky-50/60 via-white to-sky-50/20',
        icon: TrendingDown,
        iconBg: 'bg-sky-100 text-sky-800',
        accentBg: 'bg-sky-50 border-sky-200/70 text-sky-900',
        arrowColor: 'text-sky-600',
      }
    : {
        border: 'border-slate-200',
        bg: 'bg-white',
        icon: HelpCircle,
        iconBg: 'bg-slate-100 text-slate-700',
        accentBg: 'bg-slate-50 border-slate-200 text-slate-800',
        arrowColor: 'text-slate-500',
      };

  const Icon = cardConfig.icon;

  return (
    <div
      className={`rounded-2xl border ${cardConfig.border} ${cardConfig.bg} p-5 sm:p-6 shadow-soft shadow-card-hover flex flex-col justify-between`}
    >
      <div>
        {/* Header with Title and Value Badge */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg ${cardConfig.iconBg} flex items-center justify-center flex-shrink-0 shadow-2xs`}>
              <Icon className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base leading-snug">{finding.name}</h4>
              <span className="text-xs text-slate-500 font-medium">Abnormal Lab Finding</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <span className="text-sm sm:text-base font-extrabold text-slate-900 bg-white/90 px-2.5 py-0.5 rounded-lg border border-slate-200/60 shadow-2xs">
              {finding.value}
            </span>
            <StatusBadge status={finding.status} size="sm" />
          </div>
        </div>

        {/* Plain language explanation */}
        <div className="bg-white/80 rounded-xl p-3.5 border border-white/80 shadow-2xs mb-3.5">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-teal-600" />
            Plain-Language Explanation
          </p>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {finding.plainExplanation}
          </p>
        </div>

        {/* Why it matters */}
        {finding.whyItMatters && (
          <div className="mb-4 px-1">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Why this finding matters
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {finding.whyItMatters}
            </p>
          </div>
        )}
      </div>

      {/* Recommended Action Box */}
      {finding.recommendedAction && (
        <div className={`mt-2 flex items-start gap-2.5 p-3.5 rounded-xl border ${cardConfig.accentBg}`}>
          <ArrowRight className={`w-4 h-4 mt-0.5 flex-shrink-0 ${cardConfig.arrowColor}`} />
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider block opacity-75 mb-0.5">
              Recommended Discussion Point
            </span>
            <p className="text-xs sm:text-sm font-semibold leading-relaxed">
              {finding.recommendedAction}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
