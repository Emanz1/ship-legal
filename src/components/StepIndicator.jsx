const STEP_LABELS = [
  'Product',
  'Data',
  'Services',
  'AI & LLM',
  'API',
  'Cookies',
  'Jurisdiction',
  'Contact',
];

export default function StepIndicator({ currentStep, totalSteps }) {
  return (
    <div className="w-full">
      {/* Mobile: simple text */}
      <div className="sm:hidden text-center mb-4">
        <span className="text-sm font-medium text-[#2563eb]">
          Step {currentStep + 1} of {totalSteps}
        </span>
        <span className="text-sm text-gray-500 ml-2">
          {STEP_LABELS[currentStep]}
        </span>
      </div>

      {/* Desktop: full step indicator */}
      <div className="hidden sm:flex items-center justify-between mb-8">
        {STEP_LABELS.map((label, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  aria-current={isCurrent ? 'step' : undefined}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    isCompleted
                      ? 'bg-[#059669] text-white'
                      : isCurrent
                        ? 'bg-[#2563eb] text-white'
                        : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={`text-xs mt-1.5 font-medium whitespace-nowrap ${
                    isCurrent ? 'text-[#2563eb]' : isCompleted ? 'text-[#059669]' : 'text-gray-400'
                  }`}
                >
                  {label}
                </span>
              </div>
              {index < STEP_LABELS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 mt-[-1rem] ${
                    isCompleted ? 'bg-[#059669]' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Progress bar (mobile) */}
      <div className="sm:hidden w-full bg-gray-200 rounded-full h-1.5 mb-6">
        <div
          className="bg-[#2563eb] h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
}
