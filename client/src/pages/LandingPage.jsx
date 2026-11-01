import { Link } from 'react-router-dom';
import {
  Upload, Brain, FileText, Globe, AlertTriangle,
  BarChart2, MessageSquare, ArrowRight, CheckCircle2, Shield,
  Sparkles, Lock, Clock, HeartPulse
} from 'lucide-react';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';

const FEATURES = [
  {
    icon: FileText,
    title: 'Report Decoder',
    desc: 'Translates laboratory abbreviations and medical jargon into plain, non-intimidating explanations.',
    badge: 'Core Engine',
  },
  {
    icon: Brain,
    title: 'Biomarker Reasoning',
    desc: 'Google Gemini interprets every result against your lab’s specific reference ranges, not arbitrary averages.',
    badge: 'AI Grounded',
  },
  {
    icon: Globe,
    title: 'English & हिन्दी Support',
    desc: 'Full bilingual analysis. Switch between fluent English and natural everyday Hindi anytime with one click.',
    badge: 'Bilingual',
  },
  {
    icon: AlertTriangle,
    title: 'Clinical Red-Flag Alerts',
    desc: 'Validated thresholds detect potentially critical values early and highlight when to consult your doctor.',
    badge: 'Patient Safety',
  },
  {
    icon: HeartPulse,
    title: 'Actionable Care Plan',
    desc: 'Specific nutrition, food items to enjoy or avoid, safe exercise duration, and sleep hygiene protocols.',
    badge: 'Lifestyle Protocol',
  },
  {
    icon: MessageSquare,
    title: 'Grounded Medical Chat',
    desc: 'Ask follow-up questions about foods, numbers, or next steps, answered strictly from your report data.',
    badge: 'Interactive AI',
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Upload Your Report',
    desc: 'Drag & drop any lab report (PDF, JPG, or PNG). Text and scanned documents are securely extracted in memory.',
    icon: Upload,
  },
  {
    step: '02',
    title: 'Multimodal Parsing',
    desc: 'Gemini AI maps every test name, numeric result, unit, and reference interval without fabricating missing data.',
    icon: Brain,
  },
  {
    step: '03',
    title: 'Clinical Context & Flags',
    desc: 'Abnormal findings are highlighted with clear explanations of why they matter and suggested questions for your doctor.',
    icon: FileText,
  },
  {
    step: '04',
    title: 'Personalised Lifestyle Protocol',
    desc: 'Receive tailored food recommendations, foods to avoid, exercise thresholds, and a clean downloadable PDF summary.',
    icon: CheckCircle2,
  },
];

const SAMPLE_PARAMETERS = [
  { name: 'LDL Cholesterol', value: '145 mg/dL', ref: '< 100 mg/dL', status: 'high' },
  { name: 'Fasting Blood Glucose', value: '104 mg/dL', ref: '70 - 99 mg/dL', status: 'high' },
  { name: 'Haemoglobin', value: '13.2 g/dL', ref: '13.5 - 17.5 g/dL', status: 'low' },
  { name: 'Serum Creatinine', value: '0.9 mg/dL', ref: '0.7 - 1.2 mg/dL', status: 'normal' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-teal-100 selection:text-teal-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-radial-gradient pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200/70">
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            {/* Pill Banner */}
            <div className="inline-flex items-center gap-2 bg-white/90 border border-teal-200/80 text-teal-800 text-xs font-semibold px-4 py-1.5 rounded-full shadow-2xs mb-6 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Next-Gen Medical Lab Report Decoder · Built for MLH Hack Day</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12] mb-6">
              Your Medical Lab Reports,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-teal-700 to-emerald-600">
                Finally Crystal Clear.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl mx-auto font-normal">
              9 in 10 adults struggle to understand laboratory terminology, numbers, and reference ranges.
              LabLens transforms complicated lab printouts into plain-language clarity, actionable nutritional guidance,
              and grounded answers — in English or हिन्दी.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 mb-10">
              <Link
                to="/upload"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-8 py-3.5 rounded-xl text-base shadow-sm shadow-teal-600/30 hover:shadow-md transition-all active:scale-[0.99]"
              >
                <Upload className="w-4 h-4" />
                <span>Decode My Report Now</span>
              </Link>
              <Link
                to="/analysis/demo"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-7 py-3.5 rounded-xl text-base border border-slate-300/80 shadow-2xs hover:border-slate-400 transition-all"
              >
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>Explore Interactive Demo</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-teal-600" /> In-Memory Session Privacy
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-teal-600" /> 15-Second Instant Analysis
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-teal-600" /> Non-Diagnostic Educational Tool
              </span>
            </div>
          </div>

          {/* Interactive Live Dashboard Mockup Preview */}
          <div className="mt-14 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-card border border-slate-200/90 overflow-hidden">
              {/* Window Title Bar */}
              <div className="bg-slate-900 px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/90" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400/90" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/90" />
                  <span className="ml-2 text-slate-400 text-xs font-mono">lablens.app/analysis/report-01</span>
                </div>
                <span className="text-[11px] font-semibold text-teal-400 bg-teal-950/80 px-2 py-0.5 rounded-md border border-teal-800/40">
                  Interactive Preview
                </span>
              </div>

              {/* Mockup Dashboard Content */}
              <div className="p-5 sm:p-7 bg-slate-50/50">
                {/* Stats Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                  {[
                    { label: 'Parameters Evaluated', val: '8 Tests', color: 'text-slate-800' },
                    { label: 'Normal Range', val: '3 Tests', color: 'text-emerald-600' },
                    { label: 'Abnormal Markers', val: '5 Markers', color: 'text-amber-600' },
                    { label: 'Urgent Red Flags', val: '0 Detected', color: 'text-teal-600' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
                      <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-0.5">
                        {stat.label}
                      </span>
                      <span className={`text-lg font-extrabold ${stat.color}`}>{stat.val}</span>
                    </div>
                  ))}
                </div>

                {/* Sample Rows */}
                <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs divide-y divide-slate-100 overflow-hidden">
                  {SAMPLE_PARAMETERS.map((row) => (
                    <div key={row.name} className="px-4 py-3 flex items-center justify-between gap-3 text-xs sm:text-sm">
                      <span className="font-semibold text-slate-800">{row.name}</span>
                      <div className="flex items-center gap-3 sm:gap-6">
                        <span className="font-bold text-slate-900">{row.value}</span>
                        <span className="text-slate-400 font-mono hidden sm:inline text-xs">{row.ref}</span>
                        <StatusBadge status={row.status} size="sm" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Callout Preview */}
                <div className="mt-4 p-3.5 bg-teal-50/70 border border-teal-200/80 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-teal-900 font-medium">
                    <HeartPulse className="w-4 h-4 text-teal-700 flex-shrink-0" />
                    <span>Personalised protocol generated: 4 diet items, 3 activity targets, 3 routine steps.</span>
                  </div>
                  <Link to="/analysis/demo" className="text-teal-700 font-bold hover:underline shrink-0 ml-2">
                    Open Full View →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Clear 4-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 mb-3 tracking-tight">
              How LabLens Decodes Your Report
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              From confusing medical PDF to clear, actionable health insights in under a minute.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map(({ step, title, desc, icon: Icon }) => (
              <div
                key={step}
                className="bg-slate-50/70 hover:bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs hover:shadow-card transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-2xl font-black font-mono text-teal-600">{step}</span>
                    <div className="w-10 h-10 bg-white rounded-xl border border-slate-200 flex items-center justify-center shadow-2xs">
                      <Icon className="w-5 h-5 text-teal-700" />
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-2">{title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="py-20 bg-slate-50 border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Clinical Health-Tech Suite
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 mb-3 tracking-tight">
              Designed For Patient Clarity & Doctor Dialogue
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Everything you need to confidently review your health indicators before your next appointment.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc, badge }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-soft hover:shadow-card hover:border-teal-200 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-700">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                      {badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-2">{title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prominent CTA Banner */}
      <section className="py-16 bg-gradient-to-br from-teal-700 via-teal-800 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-black mb-4 tracking-tight">
            Stop Guessing. Understand Your Numbers Today.
          </h2>
          <p className="text-teal-100 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
            Upload your latest blood report or diagnostic panel. Get clear, plain-language explanations
            and an evidence-based care plan in seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              to="/upload"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-teal-900 hover:bg-teal-50 font-bold px-8 py-3.5 rounded-xl text-sm shadow-md transition-all active:scale-[0.99]"
            >
              <Upload className="w-4 h-4 text-teal-700" />
              <span>Upload Your Lab Report</span>
            </Link>
            <Link
              to="/analysis/demo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-teal-900/60 hover:bg-teal-900/80 text-white font-semibold px-7 py-3.5 rounded-xl text-sm border border-teal-400/30 transition-all"
            >
              <span>Try With Sample Report</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Professional Medical Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Medical Disclaimer Banner */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 mb-8 flex items-start gap-3.5">
            <Shield className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed space-y-1">
              <strong className="text-slate-200 block text-xs uppercase tracking-wider font-bold">
                Medical & Regulatory Disclaimer
              </strong>
              <p>
                LabLens is an informational and educational document companion powered by Google Gemini AI.
                It is <strong>not</strong> a medical device, does not provide medical diagnoses, and cannot prescribe
                medications or treatments. Laboratory results must always be interpreted in the context of your complete
                medical history by a licensed healthcare professional. Never ignore or delay seeking professional medical
                advice because of information provided by this application.
              </p>
            </div>
          </div>

          {/* Links & Branding */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800/80 text-xs">
            <div className="flex items-center gap-2 text-slate-300 font-semibold">
              <span>LabLens Health AI</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400">MLH Hack Day @ DTU</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <Link to="/upload" className="hover:text-slate-200">Upload</Link>
              <Link to="/dashboard" className="hover:text-slate-200">Dashboard</Link>
              <Link to="/history" className="hover:text-slate-200">History</Link>
              <Link to="/analysis/demo" className="hover:text-slate-200">Demo</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
