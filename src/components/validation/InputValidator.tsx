import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateInput = (value: any, rules: ValidationRule): ValidationResult => {
  const errors: string[] = [];

  if (rules.required && (!value || value.toString().trim() === '')) {
    errors.push('This field is required');
  }

  if (value && rules.minLength && value.toString().length < rules.minLength) {
    errors.push(`Minimum length is ${rules.minLength} characters`);
  }

  if (value && rules.maxLength && value.toString().length > rules.maxLength) {
    errors.push(`Maximum length is ${rules.maxLength} characters`);
  }

  if (value && rules.pattern && !rules.pattern.test(value.toString())) {
    errors.push('Invalid format');
  }

  if (value && rules.custom) {
    const customError = rules.custom(value);
    if (customError) {
      errors.push(customError);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateAssessmentResponse = (responseType: string, value: any): ValidationResult => {
  switch (responseType) {
    case 'text':
      return validateInput(value, {
        required: true,
        minLength: 1,
        maxLength: 1000
      });

    case 'date':
      return validateInput(value, {
        required: true,
        custom: (val) => {
          const date = new Date(val);
          const today = new Date();
          const daysDiff = Math.abs(today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
          
          if (isNaN(date.getTime())) {
            return 'Please enter a valid date';
          }
          
          if (daysDiff > 7) {
            return 'Date seems too far from today';
          }
          
          return null;
        }
      });

    case 'timed_text':
      return validateInput(value, {
        required: true,
        minLength: 1,
        custom: (val) => {
          const words = val.split(',').map((w: string) => w.trim()).filter((w: string) => w.length > 0);
          if (words.length < 3) {
            return 'Please provide at least 3 items';
          }
          return null;
        }
      });

    case 'radio':
      return validateInput(value, {
        required: true
      });

    case 'motion_sensor':
      return validateInput(value, {
        required: true,
        custom: (val) => {
          if (!val.motionData || val.motionData.length < 10) {
            return 'Insufficient motion data collected';
          }
          return null;
        }
      });

    case 'tap_test':
      return validateInput(value, {
        required: true,
        custom: (val) => {
          if (!val.tapData || val.tapData.length < 5) {
            return 'Insufficient tap data collected';
          }
          return null;
        }
      });

    case 'drawing':
      return validateInput(value, {
        required: true,
        custom: (val) => {
          if (!val.drawingData || val.drawingData.points.length < 10) {
            return 'Insufficient drawing data collected';
          }
          return null;
        }
      });

    case 'audio_recording':
      return validateInput(value, {
        required: true,
        custom: (val) => {
          if (!val.audioData || val.audioData.duration < 5) {
            return 'Recording too short';
          }
          return null;
        }
      });

    default:
      return { isValid: true, errors: [] };
  }
};

interface ValidationMessageProps {
  validation: ValidationResult;
  className?: string;
}

export const ValidationMessage: React.FC<ValidationMessageProps> = ({ 
  validation, 
  className = '' 
}) => {
  if (validation.isValid) {
    return (
      <div className={`flex items-center text-green-600 text-sm ${className}`}>
        <CheckCircle className="h-4 w-4 mr-1" />
        Valid
      </div>
    );
  }

  return (
    <div className={`space-y-1 ${className}`}>
      {validation.errors.map((error, index) => (
        <div key={index} className="flex items-center text-red-600 text-sm">
          <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
          {error}
        </div>
      ))}
    </div>
  );
};

export const useValidation = (initialValue: any = '') => {
  const [value, setValue] = React.useState(initialValue);
  const [validation, setValidation] = React.useState<ValidationResult>({ isValid: true, errors: [] });

  const validate = (rules: ValidationRule) => {
    const result = validateInput(value, rules);
    setValidation(result);
    return result;
  };

  const validateAssessment = (responseType: string) => {
    const result = validateAssessmentResponse(responseType, value);
    setValidation(result);
    return result;
  };

  return {
    value,
    setValue,
    validation,
    validate,
    validateAssessment
  };
};
