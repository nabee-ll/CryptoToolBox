import React from 'react';
import { validatePasswordStrength } from '../utils/security';

interface PasswordStrengthProps {
  password: string;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  if (!password) return null;

  const { score, feedback } = validatePasswordStrength(password);

  const getStrengthColor = (score: number): string => {
    if (score <= 2) return 'bg-red-500';
    if (score <= 4) return 'bg-yellow-500';
    if (score <= 5) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthText = (score: number): string => {
    if (score <= 2) return 'Weak';
    if (score <= 4) return 'Fair';
    if (score <= 5) return 'Good';
    return 'Strong';
  };

  const strengthColor = getStrengthColor(score);
  const strengthText = getStrengthText(score);
  const widthPercentage = (score / 7) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-600 dark:text-gray-400">Password Strength:</span>
        <span className={`font-medium ${
          score <= 2 ? 'text-red-600 dark:text-red-400' :
          score <= 4 ? 'text-yellow-600 dark:text-yellow-400' :
          score <= 5 ? 'text-blue-600 dark:text-blue-400' :
          'text-green-600 dark:text-green-400'
        }`}>
          {strengthText}
        </span>
      </div>
      
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full ${strengthColor} transition-all duration-300`}
          style={{ width: `${widthPercentage}%` }}
        />
      </div>
      
      {feedback.length > 0 && (
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          {feedback.map((item, index) => (
            <li key={index} className="flex items-center gap-1">
              <span className="text-red-500">•</span>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
