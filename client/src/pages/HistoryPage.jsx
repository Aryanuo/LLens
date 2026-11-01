import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText, Clock, Trash2, AlertCircle, BarChart2, Upload,
  ChevronRight, TrendingUp, TrendingDown, Minus, Activity,
  FlaskConical, History, ArrowUpRight
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { getReports, deleteReport } from '../api/client';

export default function HistoryPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [compareParam, setCompareParam] = useState('');

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    try {
      const data = await getReports();
      setReports(data.reports || []);
    } catch {
      setError('Could not load history. Is the server running?');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id, e) {
    e.stopPropagation();
    if (!confirm('Delete this report?')) return;
    try {
      await deleteReport(id);
      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch {
      alert('Failed to delete.');
    }
  }

  // Get all unique parameter names across all reports
  const allParamNames = [...new Set(
    reports.flatMap((r) => (r.parameters || []).map((p) => p.name))
  )].sort();

  const comparisonData = compareParam
    ? reports
        .map((r) => {
          const param = (r.parameters || []).find((p) =>
            p.name.toLowerCase() === compareParam.toLowerCase()
          );
          if (!param) return null;
          return {
            reportDate: r.reportDate || new Date(r.createdAt).toLocaleDateString(),
            value: param.value,
            unit: param.unit,
            status: param.interpretation?.status,
            reportId: r.id,
            report: r,
          };
        })
        .filter(Boolean)
        .reverse()
    : [];

  const totalParams = reports.reduce((acc, r) => acc + (r.parameters?.length || 0), 0);
  const totalAbnormal = reports.reduce(
    (acc, r) => acc + (r.parameters || []).filter((p) =>
      ['high', 'low', 'potentially_critical'].includes(p.interpretation?.status)
    ).length, 0
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Page Header */}
      <div className="border-b border-slate-200/80 bg-white/70 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <History className="w-5 h-5 text-teal-600" />
                <span className="text-xs font-semibold text-teal-600 uppercase tracking-widest">Health Timeline</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Report History
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                All your analysed lab reports in one place
              </p>
            </div>
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow-xs transition-all"
            >
              <Upload className="w-4 h-4" />
              New Report
            </Link>
          </div>

          {/* Summary Stats */}
          {!loading && reports.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-6">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2">
                <FileText className="w-4 h-4 text-teal-600" />
                <span className="text-sm font-bold text-slate-700">{reports.length}</span>
                <span className="text-xs text-slate-500">Reports</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2">
                <Activity className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-bold text-slate-700">{totalParams}</span>
                <span className="text-xs text-slate-500">Parameters Tracked</span>
              </div>
              {totalAbnormal > 0 && (
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-bold text-amber-700">{totalAbnormal}</span>
                  <span className="text-xs text-amber-600">Abnormal Values</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Error banner */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <p className="text-sm text-amber-800">{error}</p>
          </div>
        )}

        {/* Loading Skeletons */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200/90 p-5 animate-pulse">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex-shrink-0" />
                  <div className="flex-1">
                    <div className="h-4 w-48 bg-slate-200 rounded mb-2.5" />
                    <div className="h-3 w-72 bg-slate-100 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Trend Comparison Panel */}
        {!loading && reports.length >= 2 && (
          <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-teal-50/60 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                  <BarChart2 className="w-4 h-4 text-teal-600" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-800 text-sm">Parameter Trend Comparison</h2>
                  <p className="text-xs text-slate-500">Track how a biomarker changes across visits</p>
                </div>
              </div>
            </div>

            <div className="p-5">
              <select
                value={compareParam}
                onChange={(e) => setCompareParam(e.target.value)}
                className="w-full sm:w-80 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-400 bg-white text-slate-700 font-medium"
              >
                <option value="">Select a parameter to compare…</option>
                {allParamNames.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>

              {compareParam && comparisonData.length === 0 && (
                <p className="text-sm text-slate-500 mt-4 italic">
                  This parameter was not found in multiple reports.
                </p>
              )}

              {comparisonData.length > 0 && (
                <div className="mt-5">
                  <div className="overflow-x-auto rounded-xl border border-slate-200/80">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200/80">
                          <th className="text-left py-3 px-4 text-xs text-slate-500 font-semibold uppercase tracking-wide">Date</th>
                          <th className="text-left py-3 px-4 text-xs text-slate-500 font-semibold uppercase tracking-wide">Value</th>
                          <th className="text-left py-3 px-4 text-xs text-slate-500 font-semibold uppercase tracking-wide">Status</th>
                          <th className="text-left py-3 px-4 text-xs text-slate-500 font-semibold uppercase tracking-wide">Change</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {comparisonData.map((row, i) => {
                          const prev = comparisonData[i - 1];
                          const currVal = parseFloat(row.value);
                          const prevVal = prev ? parseFloat(prev.value) : null;
                          const diff = prevVal !== null && !isNaN(currVal) && !isNaN(prevVal)
                            ? (currVal - prevVal).toFixed(2)
                            : null;
                          const unitsMatch = !prev || row.unit === prev.unit;
                          const diffNum = parseFloat(diff);

                          return (
                            <tr
                              key={i}
                              onClick={() => navigate(`/analysis/${row.reportId}`, { state: { report: row.report } })}
                              className="hover:bg-teal-50/40 cursor-pointer transition-colors group"
                            >
                              <td className="py-3 px-4 font-medium text-slate-700 group-hover:text-teal-700">
                                {row.reportDate}
                              </td>
                              <td className="py-3 px-4 font-bold text-slate-800">
                                {row.value}{' '}
                                <span className="text-slate-400 text-xs font-normal">{row.unit}</span>
                              </td>
                              <td className="py-3 px-4">
                                {row.status && (
                                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                                    row.status === 'normal' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                    row.status === 'high' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                    row.status === 'low' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                    row.status === 'potentially_critical' ? 'bg-red-50 text-red-700 border-red-100' :
                                    'bg-slate-100 text-slate-500 border-slate-200'
                                  }`}>
                                    {row.status === 'potentially_critical' ? 'Critical' : row.status}
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-xs">
                                {diff !== null && unitsMatch ? (
                                  <span className={`inline-flex items-center gap-1 font-semibold ${
                                    diffNum > 0 ? 'text-amber-600' : diffNum < 0 ? 'text-blue-600' : 'text-slate-500'
                                  }`}>
                                    {diffNum > 0 ? <TrendingUp className="w-3.5 h-3.5" /> :
                                     diffNum < 0 ? <TrendingDown className="w-3.5 h-3.5" /> :
                                     <Minus className="w-3.5 h-3.5" />}
                                    {diffNum > 0 ? '+' : ''}{diff} {row.unit}
                                  </span>
                                ) : i === 0 ? (
                                  <span className="text-slate-400 font-medium">Baseline</span>
                                ) : (
                                  <span className="text-slate-400 italic">Units differ</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-slate-400 mt-3">
                    Changes shown are numerical differences only — not a clinical interpretation of improvement or deterioration.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Upload More Prompt (1 report) */}
        {!loading && reports.length === 1 && (
          <div className="p-4 bg-blue-50 border border-blue-200/80 rounded-2xl flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-blue-500 flex-shrink-0" />
            <p className="text-sm text-blue-700">
              <span className="font-semibold">Upload a second report</span> to unlock parameter trend comparison across visits.
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && reports.length === 0 && !error && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-10 sm:p-14 text-center">
            <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <FlaskConical className="w-8 h-8 text-teal-400" />
            </div>
            <h2 className="text-xl font-black text-slate-800 mb-2">No Reports Yet</h2>
            <p className="text-slate-500 text-sm mb-7 max-w-xs mx-auto">
              Upload your first lab report and LabLens will decode it instantly into clear, personalised insights.
            </p>
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-xl text-sm shadow-xs transition-all"
            >
              <Upload className="w-4 h-4" />
              Upload First Report
            </Link>
          </div>
        )}

        {/* Reports List */}
        {!loading && reports.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                All Reports
              </h2>
              <span className="text-xs text-slate-400">{reports.length} total</span>
            </div>
            <div className="space-y-3">
              {reports.map((report) => {
                const params = report.parameters || [];
                const abnormal = params.filter((p) =>
                  ['high', 'low', 'potentially_critical'].includes(p.interpretation?.status)
                ).length;
                const normal = params.length - abnormal;

                return (
                  <div
                    key={report.id}
                    onClick={() => navigate(`/analysis/${report.id}`, { state: { report } })}
                    className="bg-white rounded-2xl border border-slate-200/90 hover:border-teal-300 hover:shadow-md p-5 cursor-pointer transition-all group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-teal-100 transition-colors">
                          <FileText className="w-5 h-5 text-teal-600" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 group-hover:text-teal-700 transition-colors leading-snug">
                            {report.fileName || 'Lab Report'}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-1.5">
                            <span className="flex items-center gap-1 text-xs text-slate-400">
                              <Clock className="w-3 h-3" />
                              {report.reportDate || new Date(report.createdAt).toLocaleDateString()}
                            </span>
                            <span className="text-slate-300 text-xs">·</span>
                            <span className="text-xs text-slate-500 font-medium">{params.length} parameters</span>
                            {normal > 0 && (
                              <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                {normal} normal
                              </span>
                            )}
                            {abnormal > 0 && (
                              <span className="text-xs text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                                {abnormal} abnormal
                              </span>
                            )}
                            {report.language === 'hi' && (
                              <span className="text-xs text-violet-600 font-medium bg-violet-50 px-2 py-0.5 rounded-full border border-violet-100">
                                हिन्दी
                              </span>
                            )}
                            {report.metadata?.laboratory && (
                              <span className="text-xs text-slate-400">{report.metadata.laboratory}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          onClick={(e) => handleDelete(report.id, e)}
                          className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                          title="Delete report"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-50 group-hover:bg-teal-50 transition-colors">
                          <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-teal-500 transition-colors" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

