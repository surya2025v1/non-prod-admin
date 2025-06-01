import { FiUser, FiGlobe, FiDollarSign, FiCheckCircle } from 'react-icons/fi';
import type { Website } from '../utils/api';

interface SetupProgressProps {
  websites: Website[];
}

interface SetupStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
  icon: React.ComponentType<any>;
}

export default function SetupProgress({ websites }: SetupProgressProps) {
  // Only show if there are draft websites
  const hasDraftWebsite = websites.some(website => website.status === 'draft');
  
  if (!hasDraftWebsite) {
    return null; // Hide component if no draft websites
  }

  // Get the first draft website for progress calculation
  const draftWebsite = websites.find(website => website.status === 'draft');
  
  // Calculate setup steps
  const calculateSteps = (): SetupStep[] => {
    const steps: SetupStep[] = [];

    // 1. Account Setup - Orange when page_no is 1, Green when page_no is 8
    let accountStatus: 'completed' | 'in-progress' | 'pending' = 'pending';
    if (draftWebsite?.page_no === 8) {
      accountStatus = 'completed';
    } else if (draftWebsite?.page_no === 1) {
      accountStatus = 'in-progress';
    }

    steps.push({
      id: 'account_setup',
      title: 'Account Setup',
      description: 'Complete your website creation process',
      status: accountStatus,
      icon: FiUser
    });

    // 2. First Website - Green when any website has status 'published'
    const hasPublishedWebsite = websites.some(website => website.status === 'published');
    steps.push({
      id: 'first_website',
      title: 'First Website',
      description: 'Publish your first website',
      status: hasPublishedWebsite ? 'completed' : 'pending',
      icon: FiGlobe
    });

    // 3. Payment Setup - Green when paid_till is blank/null
    const hasPayment = websites.some(website => 
      website.paid_till === null || 
      website.paid_till === '' || 
      website.paid_till === undefined
    );
    steps.push({
      id: 'payment_setup',
      title: 'Payment Setup',
      description: 'Configure your billing information',
      status: hasPayment ? 'completed' : 'pending',
      icon: FiDollarSign
    });

    return steps;
  };

  const steps = calculateSteps();
  
  // Calculate progress percentage
  const completedSteps = steps.filter(step => step.status === 'completed').length;
  const inProgressSteps = steps.filter(step => step.status === 'in-progress').length;
  const totalSteps = steps.length;
  const progressPercentage = Math.round(((completedSteps + (inProgressSteps * 0.5)) / totalSteps) * 100);

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          bg: 'bg-green-50 border-green-200',
          icon: 'bg-green-500 text-white',
          text: 'text-green-800',
          desc: 'text-green-600'
        };
      case 'in-progress':
        return {
          bg: 'bg-orange-50 border-orange-200',
          icon: 'bg-orange-500 text-white',
          text: 'text-orange-800',
          desc: 'text-orange-600'
        };
      default:
        return {
          bg: 'bg-gray-50 border-gray-200',
          icon: 'bg-gray-300 text-gray-600',
          text: 'text-gray-800',
          desc: 'text-gray-600'
        };
    }
  };

  const getProgressBarColor = () => {
    if (progressPercentage >= 67) return 'from-green-500 to-green-600';
    if (progressPercentage >= 34) return 'from-orange-500 to-orange-600';
    return 'from-blue-500 to-blue-600';
  };

  const nextStep = steps.find(step => step.status !== 'completed');

  return (
    <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-lg md:text-xl font-bold text-gray-900">Setup Progress</h2>
        <span className="text-xl md:text-2xl font-bold text-blue-600">
          {progressPercentage}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-4 md:mb-6">
        <div className="flex justify-between text-xs md:text-sm text-gray-600 mb-2">
          <span>{completedSteps} of {totalSteps} completed</span>
          {nextStep && (
            <span className="hidden sm:inline">Next: {nextStep.title}</span>
          )}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 md:h-3">
          <div 
            className={`bg-gradient-to-r ${getProgressBarColor()} h-2 md:h-3 rounded-full transition-all duration-500`}
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Setup Steps */}
      <div className="space-y-3 md:space-y-4">
        {steps.map((step) => {
          const colors = getStepColor(step.status);
          const IconComponent = step.icon;
          
          return (
            <div 
              key={step.id} 
              className={`flex items-center gap-3 p-3 md:p-4 rounded-lg md:rounded-xl transition-all border ${colors.bg}`}
            >
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${colors.icon}`}>
                {step.status === 'completed' ? (
                  <FiCheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                ) : (
                  <IconComponent className="w-4 h-4 md:w-5 md:h-5" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold text-sm md:text-base ${colors.text}`}>
                  {step.title}
                </h3>
                <p className={`text-xs md:text-sm ${colors.desc} line-clamp-2`}>
                  {step.description}
                </p>
              </div>

              <div className="flex-shrink-0">
                {step.status === 'completed' && (
                  <div className="text-green-500">
                    <FiCheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                )}
                
                {step.status === 'in-progress' && (
                  <div className="text-orange-500">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Info */}
      <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs md:text-sm text-gray-600 space-y-1 sm:space-y-0">
          <span>Current page: {draftWebsite?.page_no || 1}</span>
          <span className="text-blue-600 font-medium">
            {progressPercentage === 100 ? 'Setup Complete!' : 'In Progress...'}
          </span>
        </div>
      </div>
    </div>
  );
} 