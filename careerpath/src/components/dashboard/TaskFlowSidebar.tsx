import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import React from 'react';

export type TaskDefinition = {
  num: number;
  titleKey: string;
  descKey: string;
  duration: string;
  difficultyKey: string;
  steps: StepDefinition[];
};

export type StepDefinition = {
  type: 'overview' | 'background' | 'instructions' | 'upload' | 'video';
  // Mock fields for now, real implementation would have specific data per step type
};

export default function TaskFlowSidebar({ 
  categoryTitle, 
  Icon, 
  tasks, 
  activeTaskIndex,
  completedTaskIndexes,
  onSelectTask 
}: { 
  categoryTitle: string, 
  Icon: React.ElementType, 
  tasks: TaskDefinition[],
  activeTaskIndex: number,
  completedTaskIndexes: number[],
  onSelectTask: (index: number) => void 
}) {
  const { t } = useTranslation();

  return (
    <div className="w-full md:w-80 flex-shrink-0 border-r border-gray-200 bg-white h-full overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex items-center gap-3">
        <div className="w-10 h-10 rounded bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        <h2 className="font-bold text-gray-900 text-lg leading-tight">{categoryTitle}</h2>
      </div>

      {/* Task List */}
      <div className="py-2">
        {tasks.map((task, idx) => {
          const isActive = idx === activeTaskIndex;
          const isCompleted = completedTaskIndexes.includes(idx);
          const isLocked = !isCompleted && idx > 0 && !completedTaskIndexes.includes(idx - 1); // Sequential locking

          return (
            <button
              key={task.num}
              onClick={() => !isLocked && onSelectTask(idx)}
              disabled={isLocked}
              className={`w-full text-left p-4 flex gap-4 transition-colors ${
                isActive ? 'bg-primary/5' : isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
              }`}
            >
              {/* Number/Status Indicator */}
              <div className="mt-0.5 flex-shrink-0">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  isCompleted ? 'bg-primary text-white' :
                  isActive ? 'bg-primary text-white' :
                  'border border-gray-400 text-gray-500'
                }`}>
                  {isCompleted ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : task.num}
                </div>
              </div>

              {/* Task Info */}
              <div className="flex-1 min-w-0">
                <h3 className={`font-bold text-sm mb-1 ${isActive ? 'text-primary' : 'text-gray-900'}`}>
                  {t(task.titleKey)}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-2">
                  {t(task.descKey)}
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
                  <span className="flex items-center gap-1">
                    <span className="w-1 h-3 bg-gray-300 rounded-full overflow-hidden flex items-end">
                      <span className={`w-full bg-gray-600 ${t(task.difficultyKey) === 'Beginner' ? 'h-1/3' : 'h-2/3'}`} />
                    </span>
                    {t(task.difficultyKey)}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 border border-gray-400 rounded-full flex items-center justify-center">
                      <span className="w-1 h-1 bg-gray-400 rounded-full" />
                    </span>
                    {task.duration}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
