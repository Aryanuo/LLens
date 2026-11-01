import { useState } from 'react';
import { ChevronDown, ChevronUp, Search, X, AlertCircle, Info, Stethoscope, Sparkles } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function ParameterTable({ parameters = [] }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);

  // Pre-calculate counts for filter tabs
  const counts = {
    all: parameters.length,
    abnormal: parameters.filter((p) =>
      ['high', 'low', 'potentially_critical'].includes(p.interpretation?.status)
    ).length,
    normal: parameters.filter((p) => p.interpretation?.status === 'normal').length,
    uncertain: parameters.filter(
      (p) => !p.interpretation || p.interpretation?.status === 'uncertain'
    ).length,
  };

  const filtered = parameters.filter((p) => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase());
    const status = p.interpretation?.status || 'uncertain';
    const matchFilter =
      filter === 'all' ||
      (filter === 'abnormal' && ['high', 'low', 'potentially_critical'].includes(status)) ||
      filter === status;
    return matchSearch && matchFilter;
  });

  const toggleExpand = (name) => setExpanded(expanded === name ? null : name);

  return (
    <div className="space-y-4">
      {/* Search Bar & Filter Tabs */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search test name (e.g. LDL, Glucose, Hemoglobin)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200/90 text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 bg-white placeholder:text-slate-400 shadow-2xs transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-md"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 border border-slate-200/70 rounded-xl overflow-x-auto">
          {[
            { id: 'all', label: 'All', count: counts.all },
            { id: 'abnormal', label: 'Abnormal', count: counts.abnormal, alert: counts.abnormal > 0 },
            { id: 'normal', label: 'Normal', count: counts.normal },
            { id: 'uncertain', label: 'Uncertain', count: counts.uncertain },
          ].map(({ id, label, count, alert }) => {
            const active = filter === id;
            return (
              <button
                key={id}
                onClick={() => setFilter(id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  active
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <span>{label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    active
                      ? alert ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                      : 'bg-slate-200/70 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Table Card Container */}
      <div className="rounded-2xl border border-slate-200/90 bg-white shadow-soft overflow-hidden">
        {/* Table Header (hidden on mobile, visible from sm) */}
        <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3.5 bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <div className="col-span-5">Test Parameter</div>
          <div className="col-span-2 text-right">Result</div>
          <div className="col-span-3 text-center">Reference Range</div>
          <div className="col-span-2 text-right">Status</div>
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
              <Search className="w-5 h-5" />
            </div>
            <p className="font-semibold text-slate-700 text-sm">No test parameters match your criteria</p>
            <p className="text-xs text-slate-500 mt-1">Try resetting your search query or status filter.</p>
            {(search || filter !== 'all') && (
              <button
                onClick={() => { setSearch(''); setFilter('all'); }}
                className="mt-3 text-xs font-semibold text-teal-600 hover:text-teal-700 underline"
              >
                Reset filters
              </button>
            )}
          </div>
        ) : (
          filtered.map((param, idx) => {
            const isExpanded = expanded === param.name;
            const interp = param.interpretation;
            const status = interp?.status || 'uncertain';

            const statusColors = {
              normal: 'border-l-emerald-500',
              high: 'border-l-amber-500',
              low: 'border-l-sky-500',
              potentially_critical: 'border-l-red-500',
              uncertain: 'border-l-slate-300',
            };

            return (
              <div
                key={param.name + idx}
                className={`border-b border-slate-100 last:border-0 transition-colors ${
                  isExpanded ? 'bg-slate-50/60' : 'hover:bg-slate-50/40'
                }`}
              >
                {/* Main clickable row */}
                <button
                  onClick={() => toggleExpand(param.name)}
                  className={`w-full text-left p-4 sm:px-6 sm:py-4 flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-4 items-stretch sm:items-center border-l-4 ${statusColors[status]} transition-all`}
                  aria-expanded={isExpanded}
                >
                  {/* Parameter Name */}
                  <div className="sm:col-span-5 flex items-center justify-between sm:justify-start gap-2">
                    <span className="font-semibold text-slate-800 text-sm">{param.name}</span>
                    <span className="sm:hidden">
                      <StatusBadge status={status} size="sm" />
                    </span>
                  </div>

                  {/* Value */}
                  <div className="sm:col-span-2 flex sm:justify-end items-baseline gap-1">
                    <span className="text-xs text-slate-400 sm:hidden">Value: </span>
                    <span className="text-base sm:text-sm font-bold text-slate-900">{param.value}</span>
                    {param.unit && (
                      <span className="text-xs text-slate-500 font-medium">{param.unit}</span>
                    )}
                  </div>

                  {/* Reference Range */}
                  <div className="sm:col-span-3 flex sm:justify-center items-center gap-1.5 text-xs text-slate-500">
                    <span className="sm:hidden text-slate-400">Ref: </span>
                    <span className="font-medium bg-slate-100/70 px-2 py-0.5 rounded-md border border-slate-200/50">
                      {param.referenceRange || 'Not provided'}
                    </span>
                  </div>

                  {/* Status & Accordion Toggle */}
                  <div className="sm:col-span-2 hidden sm:flex items-center justify-end gap-2.5">
                    <StatusBadge status={status} size="sm" />
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform ${
                        isExpanded ? 'rotate-180 bg-teal-100/70 text-teal-700' : 'text-slate-400 hover:bg-slate-100'
                      }`}
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </button>

                {/* Expanded Details Panel */}
                {isExpanded && interp && (
                  <div className="px-5 sm:px-8 py-5 bg-gradient-to-b from-slate-50/90 to-white border-t border-slate-100 text-left animate-fade-in">
                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* What it measures */}
                      <div className="bg-white p-4 rounded-xl border border-slate-200/70 shadow-2xs">
                        <div className="flex items-center gap-1.5 mb-1.5 text-slate-600 text-xs font-bold uppercase tracking-wider">
                          <Info className="w-3.5 h-3.5 text-teal-600" />
                          <span>What this test measures</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                          {interp.simpleExplanation}
                        </p>
                      </div>

                      {/* Result meaning */}
                      <div className="bg-white p-4 rounded-xl border border-slate-200/70 shadow-2xs">
                        <div className="flex items-center gap-1.5 mb-1.5 text-slate-600 text-xs font-bold uppercase tracking-wider">
                          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                          <span>What your result indicates</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                          {interp.resultMeaning}
                        </p>
                      </div>

                      {/* Limitations */}
                      {interp.limitations && (
                        <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200/60 shadow-2xs">
                          <div className="flex items-center gap-1.5 mb-1.5 text-amber-800 text-xs font-bold uppercase tracking-wider">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                            <span>Important Clinical Limitations</span>
                          </div>
                          <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed">
                            {interp.limitations}
                          </p>
                        </div>
                      )}

                      {/* Next Step */}
                      {interp.nextStep && (
                        <div className="bg-teal-50/50 p-4 rounded-xl border border-teal-200/60 shadow-2xs">
                          <div className="flex items-center gap-1.5 mb-1.5 text-teal-800 text-xs font-bold uppercase tracking-wider">
                            <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                            <span>Suggested Next Step</span>
                          </div>
                          <p className="text-xs sm:text-sm text-teal-900 font-medium leading-relaxed">
                            {interp.nextStep}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong>{filtered.length}</strong> of <strong>{parameters.length}</strong> parameters
        </span>
        <span className="hidden sm:inline-block text-slate-400">
          Click any row to reveal clinical purpose, meaning & limitations
        </span>
      </div>
    </div>
  );
}
