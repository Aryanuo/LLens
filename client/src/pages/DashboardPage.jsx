import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Upload, FileText, Clock, Trash2, AlertCircle,
  Sparkles, ArrowRight, ShieldCheck, Activity, BarChart2,
  Calendar, CheckCircle2
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { getReports, deleteReport } from '../api/client';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    try {
      const data = await getReports();
      setReports(data.reports || []);
    } catch (err) {
      setError('Could not load report history from the server. Ensure the backend service is running.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id, e) {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this report from your history?')) return;
    try {
      await deleteReport(id);
      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch {
      alert('Failed to delete report.');
    }
  }

  const getReportSummary = (report) => {
    const params = report.parameters || [];
    const abnormal = params.filter((p) =>
      ['high', 'low', 'potentially_critical'].includes(p.interpretation?.status)
    ).length;
    return { total: params.length, abnormal };
  };

  const totalAbnormalMarkers = reports.reduce((acc, r) => acc + getReportSummary(r).abnormal, 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-teal-100 selection:text-teal-900">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Patient Dashboard
              </h1>
              <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                Active Session
              </span>
            </div>
            <p className="text-sm text-slate-500">
              Overview of your analyzed medical lab records and biomarker trends.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              to="/upload"
              className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow-xs shadow-teal-600/20 transition-all flex-1 sm:flex-initial"
            >
              <Upload className="w-4 h-4" />
              <span>Upload New Report</span>
            </Link>
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl mb-8 animate-fade-in text-sm text-amber-900">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Overview Metric Cards */}
        {!loading && reports.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-soft">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Total Reports Analyzed
                </span>
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">{reports.length}</div>
              <p className="text-[11px] text-slate-400 mt-1">Stored securely in session memory</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-soft">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Out-of-Range Markers
                </span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-amber-700">{totalAbnormalMarkers}</div>
              <p className="text-[11px] text-slate-400 mt-1">Highlighted across all reports</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-soft">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Parameter Tracking
                </span>
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <BarChart2 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">
                <Link to="/history" className="text-teal-600 hover:text-teal-700 hover:underline text-lg font-bold">
                  View Trends →
                </Link>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Compare values across multiple dates</p>
            </div>
          </div>
        )}

        {/* Loading Skeletons */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="space-y-2.5">
                    <div className="h-5 w-44 bg-slate-200 rounded-md" />
                    <div className="h-3 w-64 bg-slate-100 rounded-md" />
                  </div>
                  <div className="h-9 w-24 bg-slate-100 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && reports.length === 0 && !error && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-10 sm:p-14 text-center shadow-soft">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-50 to-emerald-100 text-teal-700 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-teal-200 shadow-2xs">
              <FileText className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">No Reports Decoded Yet</h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-8 leading-relaxed">
              Upload your first medical lab report to get plain-language explanations, biomarker status indicators,
              and a personalized care plan.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-sm mx-auto">
              <Link
                to="/upload"
                className="w-full inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-xl text-sm shadow-xs transition-all"
              >
                <Upload className="w-4 h-4" />
                <span>Upload First Report</span>
              </Link>
              <Link
                to="/analysis/demo"
                className="w-full inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-semibold px-5 py-3 rounded-xl text-sm border border-slate-200 transition-all"
              >
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>Explore Demo</span>
              </Link>
            </div>
          </div>
        )}

        {/* Reports List */}
        {!loading && reports.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                Recent Lab Reports ({reports.length})
              </h3>
              <Link to="/history" className="text-xs font-semibold text-teal-700 hover:underline">
                Open full history →
              </Link>
            </div>

            <div className="space-y-3.5">
              {reports.map((report) => {
                const { total, abnormal } = getReportSummary(report);
                return (
                  <div
                    key={report.id}
                    onClick={() => navigate(`/analysis/${report.id}`, { state: { report } })}
                    className="bg-white rounded-2xl border border-slate-200/90 hover:border-teal-300 p-5 sm:p-6 cursor-pointer shadow-soft shadow-card-hover transition-all group"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      {/* Left: Info */}
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h4 className="font-bold text-slate-900 text-base group-hover:text-teal-700 transition-colors">
                              {report.fileName || 'Diagnostic Lab Report'}
                            </h4>
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                              {report.language === 'hi' ? 'हिन्दी' : 'English'}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              {report.reportDate || new Date(report.createdAt).toLocaleDateString()}
                            </span>
                            <span>•</span>
                            <span>{total} Parameters</span>
                            {abnormal > 0 ? (
                              <>
                                <span>•</span>
                                <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 font-semibold">
                                  {abnormal} outside range
                                </span>
                              </>
                            ) : (
                              <>
                                <span>•</span>
                                <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-semibold">
                                  All within range
                                </span>
                              </>
                            )}
                          </div>

                          {report.overallSummary && (
                            <p className="text-xs text-slate-600 mt-2.5 line-clamp-1 max-w-2xl font-normal leading-relaxed">
                              {report.overallSummary}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                        <button
                          onClick={(e) => handleDelete(report.id, e)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          title="Delete report"
                          aria-label="Delete report"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 bg-teal-50 px-3 py-2 rounded-xl border border-teal-200 group-hover:bg-teal-600 group-hover:text-white transition-all">
                          <span>View Analysis</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Demo Report Shortcut Card */}
        <div
          onClick={() => navigate('/analysis/demo')}
          className="mt-8 bg-gradient-to-r from-teal-50/70 via-emerald-50/60 to-white rounded-2xl border border-teal-200/90 p-5 sm:p-6 cursor-pointer hover:border-teal-300 shadow-soft shadow-card-hover transition-all group"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-teal-200/70 text-teal-900 px-2 py-0.2 rounded-md">
                    Sample Evaluation
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                    Explore Fictional Demo Report
                  </h4>
                </div>
                <p className="text-xs text-slate-600">
                  Inspect a pre-analyzed comprehensive metabolic & lipid panel with full findings and lifestyle plan.
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-teal-600 group-hover:translate-x-1 transition-transform flex-shrink-0" />
          </div>
        </div>
      </main>
    </div>
  );
}
