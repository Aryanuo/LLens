import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import {
  AlertTriangle, Calendar, FlaskConical, TrendingUp, TrendingDown,
  CheckCircle2, HelpCircle, Globe, Download, MessageSquare, ArrowLeft,
  Shield, FileText, Info, Sparkles, User, Loader2, HeartPulse, ListChecks
} from 'lucide-react';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import ParameterTable from '../components/ParameterTable';
import FindingsCard from '../components/FindingsCard';
import CarePlan from '../components/CarePlan';
import ChatPanel from '../components/ChatPanel';
import { DEMO_REPORT } from '../data/demoReport';
import { getReport } from '../api/client';

const TABS = [
  { id: 'Overview', label: 'Executive Overview', icon: FileText },
  { id: 'All Parameters', label: 'All Parameters', icon: ListChecks },
  { id: 'Care Plan', label: 'Personalised Protocol', icon: HeartPulse },
  { id: 'Ask LabLens', label: 'Ask LabLens AI', icon: MessageSquare },
];

export default function AnalysisPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('Overview');
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    async function loadReport() {
      if (id === 'demo') {
        const demo = { ...DEMO_REPORT };
        demo.language = language;
        setReport(demo);
        setLoading(false);
        return;
      }

      if (location.state?.report) {
        setReport(location.state.report);
        setLanguage(location.state.report.language || 'en');
        setLoading(false);
        return;
      }

      try {
        const data = await getReport(id);
        setReport(data.report);
        setLanguage(data.report.language || 'en');
      } catch (err) {
        if (err.response?.status === 404) {
          setError('Report not found in active session. You can re-upload your document or explore the interactive demo.');
        } else {
          setError('Failed to retrieve report data. Please check your network and retry.');
        }
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, [id, location.state]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const { default: jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      let y = 20;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.text('LabLens — Clinical Report Summary', 15, y);
      y += 8;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(150);
      doc.text('AI-GENERATED INFORMATIONAL SUMMARY — NOT A MEDICAL DIAGNOSIS', 15, y);
      y += 6;
      doc.text(
        `Report Date: ${report.reportDate || 'Unknown'} | Generated: ${new Date().toLocaleDateString()}`,
        15,
        y
      );
      y += 10;

      doc.setTextColor(0);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('Overall Clinical Summary', 15, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const summaryLines = doc.splitTextToSize(report.overallSummary || '', 180);
      doc.text(summaryLines, 15, y);
      y += summaryLines.length * 5 + 8;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('Biomarker Parameters Evaluated', 15, y);
      y += 6;

      (report.parameters || []).forEach((param) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text(`${param.name}: ${param.value} ${param.unit || ''}`, 15, y);
        y += 5;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(100);
        doc.text(
          `Reference: ${param.referenceRange || 'Not provided'} | Status: ${param.interpretation?.status || 'Unknown'}`,
          20,
          y
        );
        y += 4;
        if (param.interpretation?.resultMeaning) {
          const lines = doc.splitTextToSize(param.interpretation.resultMeaning, 175);
          doc.text(lines, 20, y);
          y += lines.length * 4 + 3;
        }
        doc.setTextColor(0);
      });

      doc.addPage();
      y = 20;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(0);
      doc.text('Personalised Care & Lifestyle Protocol', 15, y);
      y += 8;

      const { diet = [], activity = [], sleep = [], followUp = [] } = report.carePlan || {};
      const sections = [
        { label: 'Diet & Clinical Nutrition', items: diet },
        { label: 'Physical Activity & Movement', items: activity },
        { label: 'Sleep Hygiene & Daily Routine', items: sleep },
        { label: 'Follow-up, Retesting & Doctor Questions', items: followUp },
      ];
      sections.forEach(({ label, items }) => {
        if (items.length === 0) return;
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text(label, 15, y);
        y += 5;
        items.forEach((item, i) => {
          // Strip markdown ** before generating text for PDF
          const cleanItem = item.replace(/\*\*/g, '');
          const lines = doc.splitTextToSize(`${i + 1}. ${cleanItem}`, 175);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.text(lines, 18, y);
          y += lines.length * 4 + 2;
        });
        y += 4;
      });

      if (y > 240) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(8);
      doc.setTextColor(120);
      doc.text('MEDICAL DISCLAIMER: This summary was generated by LabLens AI for educational purposes only.', 15, y);
      y += 4;
      doc.text('It does not constitute medical advice, diagnosis, or treatment.', 15, y);
      y += 4;
      doc.text('Always consult a licensed physician or specialist regarding medical laboratory results.', 15, y);

      doc.save(`lablens-report-${report.id || 'summary'}.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
      alert('Could not generate PDF. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-32">
          <div className="text-center bg-white p-8 rounded-3xl border border-slate-200/90 shadow-soft max-w-sm">
            <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-6 h-6 text-teal-600 animate-spin" />
            </div>
            <h3 className="font-bold text-slate-800 text-base mb-1">Loading Report Analysis</h3>
            <p className="text-xs text-slate-500">Retrieving biomarker interpretations and care plan...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="max-w-lg mx-auto px-4 py-20 text-center flex-1">
          <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-100 shadow-2xs">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Report Not Found</h2>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/upload" className="bg-teal-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow-xs">
              Upload New Report
            </Link>
            <Link to="/analysis/demo" className="bg-white border border-slate-300 text-slate-700 font-semibold px-5 py-2.5 rounded-xl text-sm">
              Explore Demo Mode
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const parameters = report.parameters || [];
  const counts = {
    total: parameters.length,
    normal: parameters.filter((p) => p.interpretation?.status === 'normal').length,
    high: parameters.filter((p) => p.interpretation?.status === 'high').length,
    low: parameters.filter((p) => p.interpretation?.status === 'low').length,
    critical: parameters.filter((p) => p.interpretation?.status === 'potentially_critical').length,
    uncertain: parameters.filter((p) => !p.interpretation || p.interpretation?.status === 'uncertain').length,
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-teal-100 selection:text-teal-900">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Demo Mode Notice Banner */}
        {report.isDemo && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/90 rounded-2xl px-5 py-3.5 mb-6 flex items-start gap-3 shadow-2xs animate-fade-in">
            <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-xs sm:text-sm text-amber-900">
              <strong className="font-bold">Evaluation Demo Mode:</strong> This analysis features fictional laboratory
              data for patient <em>Rahul Demo</em>. To analyze your actual medical records,{' '}
              <Link to="/upload" className="font-bold underline text-amber-950 hover:text-black">
                upload a report here
              </Link>.
            </div>
          </div>
        )}

        {/* Critical Safety Warning Banner */}
        {(report.safetyNotices || []).length > 0 && (
          <div className="bg-red-50 border-2 border-red-400 rounded-2xl p-5 sm:p-6 mb-6 shadow-soft animate-fade-in">
            <div className="flex items-start gap-3.5">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-black text-red-950 text-base mb-1.5 flex items-center gap-2">
                  <span>Urgent Clinical Safety Notification</span>
                  <span className="text-[10px] font-bold bg-red-200 text-red-900 px-2 py-0.5 rounded-full uppercase">
                    Review Required
                  </span>
                </h3>
                <div className="space-y-1">
                  {(report.safetyNotices || []).map((notice, i) => (
                    <p key={i} className="text-xs sm:text-sm text-red-900 font-medium leading-relaxed">
                      {notice}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 mb-6 shadow-soft">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            {/* Title & Metadata */}
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <button
                  onClick={() => navigate(-1)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  title="Go back"
                  aria-label="Back"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {report.isDemo ? 'Demo Lab Report Analysis' : report.fileName || 'Diagnostic Report Analysis'}
                </h1>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-600">
                {report.metadata?.patientName && (
                  <span className="inline-flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg font-semibold text-slate-700">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    {report.metadata.patientName}
                  </span>
                )}
                {report.reportDate && (
                  <span className="inline-flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg font-medium text-slate-700">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {report.reportDate}
                  </span>
                )}
                {report.metadata?.laboratory && (
                  <span className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-800 border border-teal-200/60 px-2.5 py-1 rounded-lg font-medium">
                    <FlaskConical className="w-3.5 h-3.5 text-teal-600" />
                    {report.metadata.laboratory}
                  </span>
                )}
              </div>
            </div>

            {/* Actions: Language & PDF Export */}
            <div className="flex items-center gap-2.5 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
              {/* Language Switcher */}
              <div className="inline-flex rounded-xl border border-slate-200 p-1 bg-slate-50/80">
                {[
                  { v: 'en', l: 'English' },
                  { v: 'hi', l: 'हिन्दी' },
                ].map(({ v, l }) => (
                  <button
                    key={v}
                    onClick={() => setLanguage(v)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      language === v
                        ? 'bg-white text-teal-800 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>

              {/* PDF Export Button */}
              <button
                onClick={handleExport}
                disabled={exporting}
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs sm:text-sm border border-slate-300/80 shadow-2xs hover:border-teal-300 transition-all active:scale-[0.99] disabled:opacity-50"
              >
                {exporting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
                    <span>Generating PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-teal-600" />
                    <span>Export PDF Summary</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Clinical KPI Metric Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {[
            { label: 'Total Biomarkers', val: counts.total, sub: 'Extracted', color: 'text-slate-900', bg: 'bg-white' },
            { label: 'Normal Range', val: counts.normal, sub: 'Healthy baseline', color: 'text-emerald-700', bg: 'bg-emerald-50/60' },
            { label: 'Elevated (High)', val: counts.high, sub: 'Above reference', color: 'text-amber-800', bg: 'bg-amber-50/60' },
            { label: 'Subnormal (Low)', val: counts.low, sub: 'Below reference', color: 'text-sky-800', bg: 'bg-sky-50/60' },
            { label: 'Critical Alerts', val: counts.critical, sub: 'Require triage', color: 'text-red-700', bg: 'bg-red-50/70' },
            { label: 'Uncertain Flags', val: counts.uncertain, sub: 'Missing ranges', color: 'text-slate-600', bg: 'bg-slate-100/70' },
          ].map((item, i) => (
            <div key={i} className={`${item.bg} p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between`}>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">{item.label}</span>
              <span className={`text-2xl font-black ${item.color}`}>{item.val}</span>
              <span className="text-[10px] text-slate-400 mt-1 font-medium">{item.sub}</span>
            </div>
          ))}
        </div>

        {/* Executive Overall Summary Box */}
        {report.overallSummary && (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 mb-6 shadow-soft">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-600" />
              <span>Overall Clinical Briefing</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
              {report.overallSummary}
            </p>

            {report.doctorConsultationNote && (
              <div className="mt-4 flex items-start gap-2.5 p-3.5 bg-teal-50/80 rounded-xl border border-teal-200/70 text-xs sm:text-sm text-teal-950 font-medium">
                <Shield className="w-4 h-4 text-teal-700 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Physician Dialogue Note:</strong> {report.doctorConsultationNote}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab Navigation Controls */}
        <div className="flex gap-1.5 p-1.5 bg-slate-200/70 rounded-2xl mb-6 overflow-x-auto shadow-2xs">
          {TABS.map(({ id: tabId, label, icon: TabIcon }) => {
            const active = activeTab === tabId;
            return (
              <button
                key={tabId}
                onClick={() => setActiveTab(tabId)}
                className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 whitespace-nowrap transition-all ${
                  active
                    ? 'bg-white text-teal-900 shadow-soft'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                }`}
              >
                <TabIcon className={`w-4 h-4 ${active ? 'text-teal-600' : 'text-slate-400'}`} />
                <span>{label}</span>
                {tabId === 'Ask LabLens' && (
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse ml-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        {activeTab === 'Overview' && (
          <div className="space-y-6 animate-fade-in">
            {(report.importantFindings || []).length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                    Biomarkers Requiring Clinical Attention ({(report.importantFindings || []).length})
                  </h2>
                  <span className="text-xs font-semibold text-slate-500">
                    Flagged from reference deviations
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {(report.importantFindings || []).map((finding, i) => (
                    <FindingsCard key={i} finding={finding} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center shadow-2xs">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  No Acute Clinical Deviations Identified
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                  All analyzed parameters appear to sit comfortably within their respective laboratory intervals.
                  Review the full parameters tab for individual measurements.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'All Parameters' && (
          <div className="animate-fade-in">
            <ParameterTable parameters={parameters} />
          </div>
        )}

        {activeTab === 'Care Plan' && (
          <div className="animate-fade-in">
            <CarePlan carePlan={report.carePlan} />
          </div>
        )}

        {activeTab === 'Ask LabLens' && (
          <div className="h-[620px] animate-fade-in">
            <ChatPanel report={report} language={language} />
          </div>
        )}

        {/* Bottom Safety Disclaimer */}
        <div className="mt-10 flex items-start gap-3 p-4 bg-slate-100/90 rounded-2xl border border-slate-200/80 text-xs text-slate-500">
          <Shield className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Medical Notice:</strong> This interpretation was synthesized by LabLens AI. It is strictly educational
            and should never supersede medical judgment by a registered physician. Always verify test interpretations with a healthcare provider.
          </p>
        </div>
      </main>
    </div>
  );
}
