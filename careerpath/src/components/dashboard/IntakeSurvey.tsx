import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { Check } from 'lucide-react';

export default function IntakeSurvey({ pathId, onComplete }: { pathId: string, onComplete: () => void }) {
  const { t } = useTranslation();
  const { completeSurvey } = useAuth();

  const [q1, setQ1] = useState<string>('');
  const [q2, setQ2] = useState<string[]>([]);
  const [q3, setQ3] = useState<string>('');
  const [q4, setQ4] = useState<string>('');

  const handleQ2Toggle = (val: string) => {
    setQ2(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
  };

  const handleSubmit = () => {
    if (q1 && q2.length > 0 && q3 && q4) {
      completeSurvey(pathId);
      onComplete();
    } else {
      alert("Please answer all questions before submitting.");
    }
  };

  const likertOptions = ['1', '2', '3', '4', '5'];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-primary mb-2">{t('survey.title')}</h1>
      <p className="text-gray-600 mb-8">{t('survey.subtitle')}</p>

      <div className="space-y-6">
        {/* Q1: Radio */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">{t('survey.q1.title')}</h2>
          <div className="space-y-3">
            {['google', 'facebook', 'instagram', 'tiktok', 'whatsapp', 'friend', 'fixam', 'other'].map(opt => (
              <label key={opt} onClick={() => setQ1(opt)} className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${q1 === opt ? 'border-primary' : 'border-gray-300 group-hover:border-primary'}`}>
                  {q1 === opt && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                </div>
                <span className="text-gray-700">{t(`survey.q1.options.${opt}`)}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Q2: Checkbox */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">{t('survey.q2.title')}</h2>
          <p className="text-sm text-gray-500 mb-4">{t('survey.q2.helper')}</p>
          <div className="space-y-3">
            {['unsure', 'home', 'income', 'certification'].map(opt => (
              <label key={opt} onClick={() => handleQ2Toggle(opt)} className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${q2.includes(opt) ? 'bg-primary border-primary' : 'border-gray-300 group-hover:border-primary'}`}>
                  {q2.includes(opt) && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                </div>
                <span className="text-gray-700">{t(`survey.q2.options.${opt}`)}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Q3: Likert */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">{t('survey.q3.title')}</h2>
          <p className="text-sm text-gray-500 mb-6">{t('survey.q3.helper')}</p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between">
            {likertOptions.map((opt) => (
              <label key={opt} onClick={() => setQ3(opt)} className="flex sm:flex-col items-center gap-3 sm:gap-2 cursor-pointer group">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${q3 === opt ? 'border-primary' : 'border-gray-300 group-hover:border-primary'}`}>
                  {q3 === opt && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                </div>
                <span className="text-sm text-gray-600 text-center max-w-[80px]">{t(`survey.likert.${opt}`)}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Q4: Likert */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">{t('survey.q4.title')}</h2>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between">
            {likertOptions.map((opt) => (
              <label key={opt} onClick={() => setQ4(opt)} className="flex sm:flex-col items-center gap-3 sm:gap-2 cursor-pointer group">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${q4 === opt ? 'border-primary' : 'border-gray-300 group-hover:border-primary'}`}>
                  {q4 === opt && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                </div>
                <span className="text-sm text-gray-600 text-center max-w-[80px]">{t(`survey.likert.${opt}`)}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-gray-500">
          {t('survey.footer.privacy').split(t('survey.footer.clickHere')).map((part, i, arr) => (
            <span key={i}>
              {part}
              {i < arr.length - 1 && <a href="#" className="text-primary hover:underline">{t('survey.footer.clickHere')}</a>}
            </span>
          ))}
        </p>
        <button
          onClick={handleSubmit}
          className="w-full sm:w-auto px-8 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-full transition-colors"
        >
          {t('survey.footer.submit')}
        </button>
      </div>
    </div>
  );
}
