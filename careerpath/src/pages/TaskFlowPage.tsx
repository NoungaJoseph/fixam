import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { careerpathApi } from '../services/api';
import DashboardNav from '../components/dashboard/DashboardNav';
import IntakeSurvey from '../components/dashboard/IntakeSurvey';
import TaskFlowSidebar from '../components/dashboard/TaskFlowSidebar';
import type { TaskDefinition } from '../components/dashboard/TaskFlowSidebar';
import TaskFlowContent from '../components/dashboard/TaskFlowContent';
import { Zap, Droplets, Construction, GraduationCap } from 'lucide-react';

export default function TaskFlowPage() {
  const { categoryKey } = useParams<{ categoryKey: string }>();
  const navigate = useNavigate();
  const { isLoggedIn, user, updateActivePath } = useAuth();

  const [activeTaskIndex, setActiveTaskIndex] = useState(0);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [completedTaskIndexes, setCompletedTaskIndexes] = useState<number[]>([]);

  // Resume progress if applicable
  useEffect(() => {
    if (user?.activePath && user.activePath.categoryKey === categoryKey) {
      setActiveTaskIndex(user.activePath.taskIndex);
      setActiveStepIndex(user.activePath.stepIndex);
      
      // Auto-complete previous tasks
      const completed = [];
      for (let i = 0; i < user.activePath.taskIndex; i++) {
        completed.push(i);
      }
      setCompletedTaskIndexes(completed);
    }
  }, [user?.activePath, categoryKey]);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn || !user) return null;

  // Check if survey is needed
  const needsSurvey = !user.completedSurveys.includes(categoryKey || '');

  // Mock path definition for the flow
  const pathTitle = categoryKey === 'plumbing' ? 'Plumbing Services' : 
                    categoryKey === 'handyman' ? 'Handyman Services' : 
                    categoryKey === 'tutoring' ? 'Tutoring' : 'Electrical Services';
  
  const Icon = categoryKey === 'plumbing' ? Droplets :
               categoryKey === 'handyman' ? Construction :
               categoryKey === 'tutoring' ? GraduationCap : Zap;

  // Mock tasks with full step structures
  const tasks: TaskDefinition[] = [
    {
      num: 1,
      titleKey: 'dashboard.recommended.card1.title', // Reusing some keys or just hardcoding for mock
      descKey: 'detail.overview.whyBody',
      duration: '30-45 mins',
      difficultyKey: 'carousel.difficulty.beginner',
      steps: [
        { type: 'overview' },
        { type: 'video' },
        { type: 'background' },
        { type: 'instructions' },
        { type: 'upload' }
      ]
    },
    {
      num: 2,
      titleKey: 'trades.plumbing', // Mock title
      descKey: 'detail.overview.whyBody',
      duration: '45-60 mins',
      difficultyKey: 'carousel.difficulty.intermediate',
      steps: [
        { type: 'overview' },
        { type: 'background' },
        { type: 'instructions' },
        { type: 'upload' }
      ]
    },
    {
      num: 3,
      titleKey: 'trades.handyman', // Mock title
      descKey: 'detail.overview.whyBody',
      duration: '60-90 mins',
      difficultyKey: 'carousel.difficulty.intermediate',
      steps: [
        { type: 'overview' },
        { type: 'instructions' },
        { type: 'upload' }
      ]
    }
  ];

  const handleNext = async () => {
    if (activeTaskIndex >= tasks.length) return;
    
    const currentTask = tasks[activeTaskIndex];
    if (activeStepIndex < currentTask.steps.length - 1) {
      // Next step in current task
      setActiveStepIndex(prev => prev + 1);
      updateActivePath(categoryKey || 'electrical', activeTaskIndex, activeStepIndex + 1);
    } else {
      // Task completed
      try {
        // Random score between 50 and 100 to simulate an exam result
        const simulatedScore = Math.floor(Math.random() * 51) + 50; 
        
        await careerpathApi.completeModule({
          categoryKey: categoryKey || 'electrical',
          moduleId: `task-${activeTaskIndex + 1}`,
          examScore: simulatedScore
        });
      } catch (err: any) {
        console.error("Failed to mark module as complete", err);
        alert(err.response?.data?.message || "Exam failed! You must score at least 70% to unlock the next module. Please review the material and try again.");
        return; // Block progression
      }

      if (!completedTaskIndexes.includes(activeTaskIndex)) {
        setCompletedTaskIndexes(prev => [...prev, activeTaskIndex]);
      }
      
      // Move to next task or finish
      setActiveTaskIndex(prev => prev + 1);
      setActiveStepIndex(0);
      
      if (activeTaskIndex + 1 < tasks.length) {
        updateActivePath(categoryKey || 'electrical', activeTaskIndex + 1, 0);
      } else {
        // Flow finished, clear active path and generate certificate
        updateActivePath(null);
        try {
          await careerpathApi.generateCertificate({
            categoryKey: categoryKey || 'electrical'
          });
          alert("Congratulations! You have completed the course and earned a certificate. Check your dashboard.");
          navigate('/dashboard');
        } catch (err) {
          console.error("Failed to generate certificate", err);
          alert("Course completed, but there was an error generating your certificate. Please contact support.");
          navigate('/dashboard');
        }
      }
    }
  };

  const handleBack = () => {
    if (activeStepIndex > 0) {
      setActiveStepIndex(prev => prev - 1);
      updateActivePath(categoryKey || 'electrical', activeTaskIndex, activeStepIndex - 1);
    } else if (activeTaskIndex > 0) {
      // Go back to the last step of the previous task
      setActiveTaskIndex(prev => prev - 1);
      const prevStepIndex = tasks[activeTaskIndex - 1].steps.length - 1;
      setActiveStepIndex(prevStepIndex);
      updateActivePath(categoryKey || 'electrical', activeTaskIndex - 1, prevStepIndex);
    }
  };

  const handleSelectTask = (index: number) => {
    setActiveTaskIndex(index);
    setActiveStepIndex(0);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans antialiased">
      <DashboardNav />
      
      <main className="flex-1 flex overflow-hidden relative" style={{ height: 'calc(100vh - 56px)' }}>
        {needsSurvey ? (
          <div className="w-full h-full overflow-y-auto bg-gray-50">
            <IntakeSurvey pathId={categoryKey || ''} onComplete={() => {
              // Context update handles state, component will re-render
            }} />
          </div>
        ) : (
          <div className="w-full h-full flex flex-col md:flex-row">
            <TaskFlowSidebar
              categoryTitle={pathTitle}
              Icon={Icon}
              tasks={tasks}
              activeTaskIndex={activeTaskIndex}
              completedTaskIndexes={completedTaskIndexes}
              onSelectTask={handleSelectTask}
            />
            <div className="flex-1 h-full relative overflow-hidden">
              {activeTaskIndex >= tasks.length ? (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-gray-50/50">
                  <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Path Completed!</h2>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">
                    Congratulations! You have successfully completed all tasks in this career path. You are one step closer to becoming a Fixam verified professional.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                    >
                      Return to Dashboard
                    </button>
                    <button
                      onClick={() => navigate('/certificates')}
                      className="bg-white border border-gray-300 hover:border-primary hover:text-primary text-gray-700 px-8 py-3 rounded-lg font-semibold transition-colors"
                    >
                      View Certificate
                    </button>
                  </div>
                </div>
              ) : (
                <TaskFlowContent 
                  task={tasks[activeTaskIndex]}
                  activeStepIndex={activeStepIndex}
                  onNext={handleNext}
                  onBack={handleBack}
                  isLastStep={activeStepIndex === tasks[activeTaskIndex].steps.length - 1}
                  isLastTask={activeTaskIndex === tasks.length - 1}
                />
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
