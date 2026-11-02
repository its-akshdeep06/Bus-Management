'use client';

import React from 'react';
import { Search, Bus, Armchair, UserCheck, CheckCircle } from 'lucide-react';

interface JourneyStepperProps {
  currentStep: number; // 1 to 5
}

const STEPS = [
  { id: 1, label: 'Search Route', icon: Search },
  { id: 2, label: 'Select Bus', icon: Bus },
  { id: 3, label: 'Select Seats', icon: Armchair },
  { id: 4, label: 'Passenger Info', icon: UserCheck },
  { id: 5, label: 'Confirmed', icon: CheckCircle },
];

export const JourneyStepper: React.FC<JourneyStepperProps> = ({ currentStep }) => {
  return (
    <div className="journey-stepper">
      {STEPS.map((step, idx) => {
        const Icon = step.icon;
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;

        return (
          <React.Fragment key={step.id}>
            <div
              className={`step-item ${isActive ? 'active' : ''} ${
                isCompleted ? 'completed' : ''
              }`}
            >
              <div className="step-number">
                {isCompleted ? <CheckCircle size={14} /> : <Icon size={13} />}
              </div>
              <span>{step.label}</span>
            </div>
            {idx < STEPS.length - 1 && <div className="step-divider" />}
          </React.Fragment>
        );
      })}
    </div>
  );
};

