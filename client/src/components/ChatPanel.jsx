import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Loader2, User, Bot, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';
import { sendChatMessage } from '../api/client';

const SUGGESTED_QUESTIONS = [
  'What foods should I eat and avoid based on my report?',
  'Give me a daily meal plan for these results.',
  'What exercises are safest for my current numbers?',
  'Explain my report in simple language.',
  'What should I discuss with my doctor?',
];

const SUGGESTED_QUESTIONS_HI = [
  'मुझे कौन से खाद्य पदार्थ खाने और किनसे बचना चाहिए?',
  'इन नतीजों के आधार पर डाइट प्लान बताएं।',
  'मेरी रिपोर्ट को सरल भाषा में समझाएं।',
  'मुझे डॉक्टर से क्या पूछना चाहिए?',
];

/**
 * Parses markdown bold and simple lists for attractive chat rendering.
 */
function renderChatMessageContent(content) {
  if (!content) return null;
  const lines = content.split('\n');

  return (
    <div className="space-y-2 text-sm leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1.5" />;

        // Header check ### or ##
        if (trimmed.startsWith('### ')) {
          return (
            <h5 key={idx} className="font-bold text-slate-900 text-sm mt-3 mb-1">
              {trimmed.replace('### ', '')}
            </h5>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h4 key={idx} className="font-bold text-slate-900 text-base mt-3 mb-1 border-b border-slate-200 pb-1">
              {trimmed.replace('## ', '')}
            </h4>
          );
        }

        // Bullet point
        if (trimmed.startsWith('• ') || trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
          const text = trimmed.slice(2);
          return (
            <div key={idx} className="flex items-start gap-2 pl-2">
              <span className="text-teal-600 font-black text-xs mt-0.5">•</span>
              <span className="flex-1">{formatInline(text)}</span>
            </div>
          );
        }

        // Numbered list
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-2">
              <span className="text-teal-700 font-bold text-xs mt-0.5">{numMatch[1]}.</span>
              <span className="flex-1">{formatInline(numMatch[2])}</span>
            </div>
          );
        }

        return <p key={idx}>{formatInline(trimmed)}</p>;
      })}
    </div>
  );
}

function formatInline(text) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-bold text-slate-950">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

export default function ChatPanel({ report, language }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        language === 'hi'
          ? 'नमस्ते! मैं LabLens AI हूं। आप अपनी लैब रिपोर्ट, परीक्षण परिणामों या व्यक्तिगत आहार/जीवनशैली के बारे में कोई भी सवाल पूछ सकते हैं।'
          : "Hello! I'm LabLens, your clinical report assistant. Ask me anything about your test results, what your numbers mean, or specific foods and lifestyle habits tailored to your report.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const suggestions = language === 'hi' ? SUGGESTED_QUESTIONS_HI : SUGGESTED_QUESTIONS;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (question) => {
    const q = question || input.trim();
    if (!q || loading) return;

    setMessages((prev) => [...prev, { role: 'user', content: q }]);
    setInput('');
    setLoading(true);

    try {
      let answer;
      if (report?.isDemo) {
        await new Promise((r) => setTimeout(r, 700));
        answer = getDemoAnswer(q, language);
      } else {
        const data = await sendChatMessage(report.id, q, language, report);
        answer = data.answer;
      }
      setMessages((prev) => [...prev, { role: 'assistant', content: answer }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I could not retrieve an answer right now. Please try again in a moment.',
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-slate-200/80 bg-slate-50/90 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-teal-600 rounded-xl flex items-center justify-center shadow-2xs shadow-teal-600/30">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <span>Ask LabLens</span>
              <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
                AI Active
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">Grounded exclusively in this lab report</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-white px-2.5 py-1 rounded-lg border border-slate-200/60 shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          <span className="hidden sm:inline">Non-Diagnostic Support</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 min-h-0 bg-slate-50/30">
        {messages.map((msg, i) => {
          const isUser = msg.role === 'user';
          return (
            <div key={i} className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''} animate-fade-in`}>
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 shadow-2xs ${
                  isUser
                    ? 'bg-slate-900 text-white'
                    : msg.isError
                    ? 'bg-red-100 text-red-600'
                    : 'bg-teal-600 text-white'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 text-sm shadow-soft ${
                  isUser
                    ? 'bg-slate-900 text-white rounded-tr-xs'
                    : msg.isError
                    ? 'bg-red-50 text-red-800 border border-red-200 rounded-tl-xs'
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs'
                }`}
              >
                {isUser ? (
                  <p className="whitespace-pre-wrap leading-relaxed font-medium">{msg.content}</p>
                ) : (
                  renderChatMessageContent(msg.content)
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Bubble */}
        {loading && (
          <div className="flex gap-3 animate-fade-in">
            <div className="w-7 h-7 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-2xs">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200/80 rounded-2xl rounded-tl-xs p-4 shadow-soft flex items-center gap-2.5">
              <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
              <span className="text-xs font-semibold text-slate-600">Consulting report data & medical nutrition...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggested Questions Strip */}
      <div className="px-4 py-2.5 border-t border-slate-100 bg-white/90">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-teal-600" />
          Suggested Questions
        </p>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {suggestions.map((q, i) => (
            <button
              key={i}
              onClick={() => sendMessage(q)}
              disabled={loading}
              className="text-xs font-medium px-3 py-1.5 rounded-full border border-teal-200/90 text-teal-800 bg-teal-50/60 hover:bg-teal-100 hover:border-teal-300 transition-all whitespace-nowrap shadow-2xs disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Bar */}
      <div className="p-3 sm:p-4 border-t border-slate-200 bg-slate-50/90">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder={language === 'hi' ? 'अपनी रिपोर्ट के बारे में पूछें...' : 'Ask about your test values, diet, or care plan...'}
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200/90 text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 bg-white shadow-2xs placeholder:text-slate-400"
            disabled={loading}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="w-11 h-11 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white rounded-xl flex items-center justify-center transition-all shadow-xs shadow-teal-600/20 flex-shrink-0"
            title="Send question (Enter)"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[11px] text-slate-400 mt-2 text-center">
          LabLens answers are grounded in your uploaded lab data. Always discuss findings with a healthcare provider.
        </p>
      </div>
    </div>
  );
}

function getDemoAnswer(question, language) {
  if (language === 'hi') {
    return `यह एक डेमो रिपोर्ट है। इस रिपोर्ट में LDL कोलेस्ट्रॉल (145 mg/dL) और Vitamin D (18 ng/mL) सामान्य सीमा से बाहर हैं। HbA1c और फास्टिंग ग्लूकोज भी थोड़ा ऊपर हैं।\n\n🥗 अनुशंसित आहार:\n• घुलनशील फाइबर (ओट्स, सेब, चिया सीड्स) का सेवन बढ़ाएं।\n• तले हुए खाद्य पदार्थ और अतिरिक्त चीनी से पूरी तरह बचें।\n• पर्याप्त मात्रा में पानी पिएं और रोजाना 30 मिनट तेज चलें।`;
  }
  if (
    question.toLowerCase().includes('food') ||
    question.toLowerCase().includes('eat') ||
    question.toLowerCase().includes('diet') ||
    question.toLowerCase().includes('meal') ||
    question.toLowerCase().includes('avoid')
  ) {
    return `Here is a targeted nutritional roadmap based on the findings in this report (elevated LDL & fasting glucose, low HDL, low Vitamin D):\n\n🥗 Foods to Actively Include:\n• Viscous Soluble Fiber: Steel-cut oats, barley, chia seeds, and kidney beans. Soluble fiber binds to LDL cholesterol in your digestive tract and carries it out of the body.\n• Cardioprotective Fats: Raw walnuts, almonds, and extra-virgin olive oil in moderation to support HDL levels.\n• Low-Glycemic Complex Carbs: Quinoa, millets (foxtail, jowar), and lentils instead of white rice or refined flour to stabilize post-meal glucose.\n• Vitamin D Food Sources: Egg yolks, fortified low-fat dairy or plant milk, and mushrooms exposed to sunlight.\n\n🚫 Foods to Strictly Avoid or Minimize:\n• Trans Fats & Vanaspati: Deep-fried snacks, samosas, commercial bakery items, and hydrogenated vegetable oils.\n• Saturated Fat Heavy Items: Butter, high-fat ghee, processed fatty meats, and full-fat cheeses.\n• Liquid Sugars & Refined Carbs: Sodas, sweetened fruit juices, packaged pastries, and candy that rapidly spike triglycerides and blood sugar.\n\n⏰ Practical Daily Habit:\nEat non-starchy vegetables (spinach, cucumber, salad) FIRST before your carbs and proteins to significantly blunt blood sugar spikes!`;
  }
  if (question.toLowerCase().includes('outside') || question.toLowerCase().includes('range') || question.toLowerCase().includes('abnormal')) {
    return `In this demonstration report, the following values are outside the lab's reference ranges:\n\n• LDL Cholesterol: 145 mg/dL (reference: < 100 mg/dL) — High\n• HDL Cholesterol: 38 mg/dL (reference: > 40 mg/dL) — Low\n• Fasting Blood Glucose: 104 mg/dL (reference: 70–99 mg/dL) — High\n• HbA1c: 5.8% (reference: < 5.7%) — High\n• Haemoglobin: 13.2 g/dL (reference: 13.5–17.5 g/dL) — Low\n• Vitamin D: 18 ng/mL (reference: 30–100 ng/mL) — Low\n\nThis is fictional demonstration data. Always review your own results with a healthcare professional.`;
  }
  if (question.toLowerCase().includes('ldl') || question.toLowerCase().includes('cholesterol')) {
    return `In this demonstration report, the LDL Cholesterol is 145 mg/dL, which is above the lab's reference range of < 100 mg/dL. LDL is often called "bad" cholesterol because excess amounts can build up in artery walls over time.\n\nThis demonstration result is fictional. For a real report, your doctor would consider your full risk profile — including blood pressure, family history, and lifestyle — before recommending any action.`;
  }
  if (question.toLowerCase().includes('doctor') || question.toLowerCase().includes('discuss')) {
    return `Based on this demonstration report, the key topics to discuss with your doctor would include:\n\n1. Cholesterol management — both elevated LDL and low HDL\n2. Blood sugar — the slightly elevated fasting glucose and HbA1c together\n3. Vitamin D deficiency — appropriate supplementation dose\n4. Mild haemoglobin reduction — possible further testing\n\nThis is fictional demonstration data. In a real scenario, bring your actual lab report to your appointment.`;
  }
  return `Based on this demonstration report, there are several findings worth noting: elevated LDL cholesterol, low HDL cholesterol, borderline blood glucose and HbA1c, mild anaemia, and Vitamin D deficiency. Other parameters like creatinine and TSH are within reference ranges.\n\nRemember — this is fictional demonstration data for the LabLens demo. It does not represent any real person's health status. In a real scenario, always discuss your actual results with a qualified healthcare professional.`;
}
