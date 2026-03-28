import React from 'react';
import Icon from '../icons/Icon';

export default function StepIndicator({ currentStep, totalSteps = 3 }) {
  return (
    <div className="flex items-center justify-center gap-0 py-4">
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1;
        const isCompleted = step < currentStep;
        const isActive = step === currentStep;
        const isFuture = step > currentStep;

        return (
          <React.Fragment key={step}>
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all
                ${isCompleted ? 'bg-green-500 text-white' : ''}
                ${isActive ? 'bg-primary text-white ring-4 ring-primary/20' : ''}
                ${isFuture ? 'bg-gray-200 text-t3' : ''}
              `.trim()}
            >
              {isCompleted ? (
                <Icon name="check" size={14} />
              ) : (
                step
              )}
            </div>
            {step < totalSteps && (
              <div
                className={`w-10 h-0.5 ${
                  step < currentStep ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
