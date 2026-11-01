import { Check, ArrowUpRight, ArrowDownRight, AlertTriangle, HelpCircle } from 'lucide-react';

const STATUS_CONFIG = {
  normal: {
    label: 'Normal',
    bg: 'bg-emerald-50/80',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    icon: Check,
    iconColor: 'text-emerald-600',
  },
  high: {
    label: 'High',
    bg: 'bg-amber-50/80',
    text: 'text-amber-800',
    border: 'border-amber-200',
    icon: ArrowUpRight,
    iconColor: 'text-amber-600',
  },
  low: {
    label: 'Low',
    bg: 'bg-sky-50/80',
    text: 'text-sky-800',
    border: 'border-sky-200',
    icon: ArrowDownRight,
    iconColor: 'text-sky-600',
  },
  potentially_critical: {
    label: 'Critical',
    bg: 'bg-red-50/90',
    text: 'text-red-800',
    border: 'border-red-300',
    icon: AlertTriangle,
    iconColor: 'text-red-600',
  },
  uncertain: {
    label: 'Uncertain',
    bg: 'bg-slate-50',
    text: 'text-slate-600',
    border: 'border-slate-200',
    icon: HelpCircle,
    iconColor: 'text-slate-400',
  },
};

export default function StatusBadge({ status, size = 'sm' }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.uncertain;
  const Icon = cfg.icon;
  const sizeClass = size === 'lg' ? 'px-3 py-1.5 text-xs' : 'px-2 py-0.5 text-[11px]';
  const iconSize = size === 'lg' ? 'w-3.5 h-3.5' : 'w-3 h-3';

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${sizeClass} rounded-full font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border} shadow-2xs backdrop-blur-xs select-none`}
      role="status"
      aria-label={`Status: ${cfg.label}`}
    >
      <Icon className={`${iconSize} ${cfg.iconColor} stroke-[2.5] flex-shrink-0`} aria-hidden="true" />
      <span>{cfg.label}</span>
    </span>
  );
}
