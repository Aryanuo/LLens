import { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Upload, FileText, X, AlertCircle, Globe, Calendar,
  Loader2, CheckCircle2, ShieldCheck, Sparkles, ArrowRight,
  FileCheck, FileSpreadsheet
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { analyzeReport } from '../api/client';

const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
const MAX_SIZE_MB = 10;

export default function UploadPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [language, setLanguage] = useState('en');
  const [reportDate, setReportDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState(0);

  const STAGES = [
    { title: 'Reading Document Data', desc: 'Securely scanning text and digital values in memory' },
    { title: 'Extracting Biomarkers', desc: 'Locating test names, units, and laboratory reference ranges' },
    { title: 'Clinical Reasoning', desc: 'Contextualizing results against standard clinical metrics' },
    { title: 'Synthesizing Protocol', desc: 'Assembling personalized nutrition and lifestyle recommendations' },
  ];

  const validateFile = (f) => {
    if (!ACCEPTED_TYPES.includes(f.type)) {
      return `Unsupported file format (${f.type || 'unknown'}). Please upload a PDF, JPG, or PNG document.`;
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      return `File size exceeds ${(f.size / 1024 / 1024).toFixed(1)} MB. Maximum allowed size is ${MAX_SIZE_MB} MB.`;
    }
    return null;
  };

  const handleFile = (f) => {
    const err = validateFile(f);
    if (err) {
      setError(err);
      setFile(null);
    } else {
      setError('');
      setFile(f);
    }
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, []);

  const onDragOver = (e) => { e.preventDefault(); setDragActive(true); };
  const onDragLeave = () => setDragActive(false);

  const onFileInput = (e) => {
    const f = e.target.files[0];
    if (f) handleFile(f);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setStage(0);

    const stageTimer = setInterval(() => {
      setStage((prev) => {
        if (prev < STAGES.length - 1) return prev + 1;
        return prev;
      });
    }, 4500);

    try {
      const data = await analyzeReport(file, language, reportDate);
      clearInterval(stageTimer);
      navigate(`/analysis/${data.report.id}`, { state: { report: data.report } });
    } catch (err) {
      clearInterval(stageTimer);
      setLoading(false);
      setStage(0);

      const msg = err.response?.data?.error || err.message || 'Analysis failed. Please try again.';
      if (msg.includes('GEMINI_API_KEY') || err.response?.status === 503) {
        setError('The Gemini AI engine is currently busy or reconfiguring. You can retry in a moment or explore the Demo Report.');
      } else if (err.response?.status === 422) {
        setError('The uploaded document does not appear to contain readable medical lab parameters. Please upload a clear diagnostic lab report.');
      } else if (err.code === 'ECONNABORTED' || msg.includes('timeout')) {
        setError('The analysis timed out. Please try uploading a cleaner digital PDF or higher-resolution scan.');
      } else {
        setError(msg);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-teal-100 selection:text-teal-900">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-10 sm:py-14 w-full">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 bg-teal-50 border border-teal-200/80 px-3 py-1 rounded-full text-xs font-semibold text-teal-800 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>AI-Powered Medical Ingestion</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
            Upload Your Lab Report
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto">
            Upload any medical lab printout, blood test, or metabolic panel to receive plain-language clarity and a personalised care plan.
          </p>
        </div>

        {/* Loading Screen Overlay / Card */}
        {loading && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card p-8 sm:p-12 text-center animate-fade-in">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md shadow-teal-600/20">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>

            <h2 className="text-2xl font-black text-slate-900 mb-2">
              Decoding Your Report
            </h2>
            <p className="text-sm text-slate-500 mb-8 max-w-md mx-auto">
              Our clinical AI pipeline is reading each biomarker and contextualizing your findings...
            </p>

            {/* Stages Checklist */}
            <div className="max-w-md mx-auto space-y-3 text-left mb-8">
              {STAGES.map((stg, i) => {
                const isCurrent = i === stage;
                const isDone = i < stage;

                return (
                  <div
                    key={i}
                    className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                      isCurrent
                        ? 'bg-teal-50/80 border-teal-300 shadow-2xs'
                        : isDone
                        ? 'bg-white border-slate-200/80'
                        : 'bg-slate-50/50 border-slate-100 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : isCurrent ? (
                          <Loader2 className="w-4 h-4 text-teal-600 animate-spin" />
                        ) : (
                          <span className="text-slate-400">{i + 1}</span>
                        )}
                      </div>
                      <div>
                        <p className={`text-xs font-bold ${isCurrent ? 'text-teal-900' : 'text-slate-800'}`}>
                          {stg.title}
                        </p>
                        <p className="text-[11px] text-slate-500">{stg.desc}</p>
                      </div>
                    </div>

                    {isDone && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        Done
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-slate-400">
              Processing typically finishes within 15–25 seconds. Please keep this window open.
            </p>
          </div>
        )}

        {/* Upload Form Card */}
        {!loading && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft p-6 sm:p-10">
            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl mb-6 animate-fade-in">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-sm">
                  <p className="font-semibold text-red-900">{error}</p>
                  <p className="text-xs text-red-700 mt-1">
                    You can try uploading again, or test the application with sample data:{' '}
                    <Link to="/analysis/demo" className="font-bold underline text-red-800 hover:text-red-950">
                      Open Demo Report →
                    </Link>
                  </p>
                </div>
              </div>
            )}

            {/* Drop Zone */}
            <div
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onClick={() => !file && document.getElementById('file-upload-input').click()}
              className={`relative rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all cursor-pointer ${
                dragActive
                  ? 'border-teal-500 bg-teal-50/70 scale-[1.01]'
                  : file
                  ? 'border-emerald-300 bg-emerald-50/40'
                  : 'border-slate-300 hover:border-teal-400 bg-slate-50/60 hover:bg-teal-50/20'
              }`}
            >
              <input
                id="file-upload-input"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={onFileInput}
              />

              {file ? (
                <div className="animate-fade-in">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-2xs">
                    <FileCheck className="w-7 h-7" />
                  </div>
                  <p className="font-bold text-slate-900 text-base">{file.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    {(file.size / 1024 / 1024).toFixed(2)} MB · {file.type || 'Document'}
                  </p>
                  <div className="inline-flex items-center gap-1.5 mt-2 bg-emerald-100/80 text-emerald-800 px-3 py-1 rounded-full text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>File validated & ready for analysis</span>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                        setError('');
                      }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-red-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs transition-colors"
                    >
                      <X className="w-3.5 h-3.5" /> Remove file
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-teal-100 shadow-2xs group-hover:scale-105 transition-transform">
                    <Upload className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-base mb-1">
                    Drag and drop your lab report here
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mb-4">
                    or click anywhere in this box to browse from your device
                  </p>
                  <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-400">
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200">PDF</span>
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200">JPG</span>
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200">PNG</span>
                    <span>· Up to 10 MB</span>
                  </div>
                </div>
              )}
            </div>

            {/* Ingestion Settings (Language & Date) */}
            <div className="grid sm:grid-cols-2 gap-4 mt-6">
              {/* Output Language Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-teal-600" />
                  <span>Output Language</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'en', label: 'English', flag: '🇬🇧' },
                    { value: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
                  ].map((opt) => {
                    const isSel = language === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setLanguage(opt.value)}
                        className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-semibold border transition-all ${
                          isSel
                            ? 'bg-teal-600 border-teal-600 text-white shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <span>{opt.flag}</span>
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Report Date (Optional) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-teal-600" />
                  <span>Report Date (Optional)</span>
                </label>
                <input
                  type="date"
                  value={reportDate}
                  onChange={(e) => setReportDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 bg-white"
                />
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={handleSubmit}
              disabled={!file}
              className="w-full mt-6 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl text-base shadow-sm shadow-teal-600/20 hover:shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Decode & Generate Care Plan</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Demo Link Card */}
            <div className="mt-5 p-3.5 bg-slate-50 border border-slate-200/70 rounded-xl flex items-center justify-between text-xs">
              <span className="text-slate-600">Want to test without a lab report?</span>
              <Link
                to="/analysis/demo"
                className="font-bold text-teal-700 hover:text-teal-800 hover:underline flex items-center gap-1"
              >
                <span>Try Demo Report</span>
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              </Link>
            </div>

            {/* Privacy Guarantee */}
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 text-center mt-5">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Processed in memory. Documents are never permanently stored or shared.</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
