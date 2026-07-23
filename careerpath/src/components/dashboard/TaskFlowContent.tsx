import { useTranslation } from 'react-i18next';
import { BookOpen, PenTool, ExternalLink, UploadCloud, Play } from 'lucide-react';
import type { TaskDefinition } from './TaskFlowSidebar';

export default function TaskFlowContent({
  task,
  activeStepIndex,
  onNext,
  onBack,
  isLastStep,
  isLastTask
}: {
  task: TaskDefinition;
  activeStepIndex: number;
  onNext: () => void;
  onBack: () => void;
  isLastStep: boolean;
  isLastTask: boolean;
}) {
  const { t } = useTranslation();
  const step = task.steps[activeStepIndex];

  // Placeholder data for rendering steps since we don't have full DB structures yet
  const mockLearn = ["How to wear PPE correctly", "Recognizing live wire hazards", "Securing a household circuit breaker panel"];
  const mockDo = ["Assess residential safety risks with a supervisor", "Complete a virtual safety checklist", "Position safety cones and warning indicators"];
  const mockInstructions = [
    "Review the safety diagram provided in the resources.",
    "Identify the three missing pieces of protective equipment.",
    "Write a short paragraph explaining why each piece is necessary for this specific scenario.",
    "Upload your written response as a PDF."
  ];

  const renderStepContent = () => {
    switch (step.type) {
      case 'overview':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">{t('detail.taskFlow.overview')}</h1>
            <p className="text-gray-600">{t('detail.taskFlow.intro')}</p>
            
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-gray-900">{t('detail.tasksSection.learnTitle')}</h3>
                </div>
                <ul className="space-y-2">
                  {mockLearn.map((item, i) => (
                    <li key={i} className="text-sm text-gray-600 flex gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <PenTool className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-gray-900">{t('detail.tasksSection.doTitle')}</h3>
                </div>
                <ul className="space-y-2">
                  {mockDo.map((item, i) => (
                    <li key={i} className="text-sm text-gray-600 flex gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-6 pt-6 border-t border-gray-100">{t('detail.taskFlow.videoIntro')}</p>
          </div>
        );

      case 'background':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">{t('detail.taskFlow.backgroundTitle')}</h1>
            <div className="prose prose-sm max-w-none text-gray-600 space-y-4">
              <p>You've just started your certification in this trade. Today, you will be assisting a senior Fixam provider on a residential call.</p>
              <p>The client has reported a recurring issue that requires careful diagnosis. Before you touch any tools, you must secure the area and ensure all safety protocols are followed to the letter.</p>
              <p>Review the provided scenario details carefully, as your decisions in the next step will be based entirely on this context.</p>
            </div>
          </div>
        );

      case 'instructions':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">{t('detail.taskFlow.instructionsTitle')}</h1>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <ol className="list-decimal list-outside ml-4 space-y-4 text-gray-700">
                {mockInstructions.map((inst, i) => (
                  <li key={i} className="pl-2 leading-relaxed">{inst}</li>
                ))}
              </ol>
            </div>
            <p className="text-sm text-gray-500">{t('detail.taskFlow.submitHint')}</p>
          </div>
        );

      case 'upload':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">{t('detail.taskFlow.resourcesTitle')}</h2>
              <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-primary transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-gray-900 group-hover:text-primary transition-colors">Safety Protocol Guidelines</span>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary" />
              </a>
              <p className="text-xs text-gray-400 mt-2">{t('detail.taskFlow.linkNote')}</p>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-2">{t('detail.taskFlow.uploadTitle')}</h2>
              <p className="text-sm text-gray-600 mb-4">{t('detail.taskFlow.uploadInstruction')}</p>
              
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                <UploadCloud className="w-8 h-8 text-gray-400 mb-3" />
                <p className="text-sm font-medium text-gray-700 mb-1">{t('detail.taskFlow.dragDrop')}</p>
                <p className="text-xs text-gray-500 mb-4">{t('detail.taskFlow.allowedTypes')}</p>
                <button className="text-sm font-bold text-primary px-4 py-2 bg-primary/10 rounded-full hover:bg-primary/20 transition-colors">
                  {t('detail.taskFlow.uploadBtn')}
                </button>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button className="px-6 py-2.5 bg-gray-200 text-gray-500 font-bold rounded-full cursor-not-allowed">
                  {t('detail.taskFlow.submitFile')}
                </button>
              </div>
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Video Walkthrough</h1>
            <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden group cursor-pointer border border-gray-200 shadow-sm">
              <img src="/images/electrical.jpg" alt="Video thumbnail" className="w-full h-full object-cover opacity-50 group-hover:opacity-40 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                </div>
              </div>
              {/* Mock Player Controls Bar */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center gap-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Play className="w-5 h-5" fill="currentColor" />
                <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                  <div className="w-1/3 h-full bg-primary" />
                </div>
                <span className="text-xs font-medium">02:14 / 06:30</span>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Unknown step type</div>;
    }
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-white flex flex-col relative">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-100 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">{t(task.titleKey)}</span>
        
        {/* Step Indicators */}
        <div className="flex items-center gap-1">
          {task.steps.map((_, i) => (
            <div 
              key={i} 
              className={`w-8 h-8 rounded flex items-center justify-center text-sm font-bold transition-colors ${
                i === activeStepIndex ? 'bg-primary text-white' : 
                i < activeStepIndex ? 'bg-primary/10 text-primary' : 
                'bg-gray-100 text-gray-400'
              }`}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 md:p-10 max-w-4xl mx-auto w-full">
        {renderStepContent()}
      </div>

      {/* Bottom Navigation Bar */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex items-center justify-between mt-auto">
        <button 
          onClick={onBack}
          disabled={activeStepIndex === 0 && !onBack} // Would normally handle task-level back too
          className={`font-bold transition-colors ${activeStepIndex === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-gray-900'}`}
        >
          {t('detail.taskFlow.back')}
        </button>
        <button 
          onClick={onNext}
          className="px-8 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-full transition-colors"
        >
          {isLastStep ? (isLastTask ? t('detail.taskFlow.finish') : t('detail.taskFlow.next')) : t('detail.taskFlow.next')}
        </button>
      </div>
    </div>
  );
}
