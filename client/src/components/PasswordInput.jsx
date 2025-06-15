import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import zxcvbn from 'zxcvbn';

const PasswordInput = ({ name, placeholder, showStrength = false, isLoading = false }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, watch, formState: { errors } } = useFormContext();
  const password = watch(name);
  const error = errors[name];

  // Calculate password strength if showStrength is true
  const strength = showStrength ? zxcvbn(password || '') : null;
  const strengthColors = {
    0: 'bg-red-500',
    1: 'bg-red-500',
    2: 'bg-yellow-500',
    3: 'bg-blue-500',
    4: 'bg-green-500'
  };

  const strengthLabels = {
    0: 'Very Weak',
    1: 'Weak',
    2: 'Fair',
    3: 'Strong',
    4: 'Very Strong'
  };

  return (
    <div className="w-full">
      <label className={`input input-bordered flex items-center gap-2 w-full bg-gray-700 border-gray-600 text-white focus-within:border-[#D984BB] ${error ? 'border-red-500' : ''}`}>
        <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
            stroke="currentColor"
          >
            <path
              d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
            ></path>
            <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
          </g>
        </svg>
        <input 
          type={showPassword ? "text" : "password"}
          {...register(name)}
          placeholder={placeholder}
          className="grow"
          disabled={isLoading}
        />
        {!isLoading && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="btn btn-ghost btn-sm"
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            )}
          </button>
        )}
        {isLoading && (
          <div className="loading loading-spinner loading-sm"></div>
        )}
      </label>

      {error && (
        <span className="text-red-500 text-sm mt-1">{error.message}</span>
      )}

      {showStrength && password && (
        <div className="mt-2">
          <div className="flex gap-1 h-1">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className={`flex-1 rounded-full ${
                  index <= (strength?.score || 0) ? strengthColors[strength?.score || 0] : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-1 text-xs">
            <span className={`${
              strength?.score === 0 ? 'text-red-500' :
              strength?.score === 1 ? 'text-red-500' :
              strength?.score === 2 ? 'text-yellow-500' :
              strength?.score === 3 ? 'text-blue-500' :
              'text-green-500'
            }`}>
              {strengthLabels[strength?.score || 0]}
            </span>
            {strength?.feedback?.warning && (
              <span className="text-gray-400">{strength.feedback.warning}</span>
            )}
          </div>
          <div className="mt-2 text-xs text-gray-400">
            <ul className="list-disc list-inside">
              <li>At least 8 characters</li>
              <li>Include uppercase and lowercase letters</li>
              <li>Include numbers</li>
              <li>Include special characters</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordInput; 