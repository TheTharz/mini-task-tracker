import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    className = '',
    id,
    ...props
}) => {
    const inputId = id || label.replace(/\s+/g, '-').toLowerCase();

    return (
        <div className={`w-full ${className}`}>
            <label
                htmlFor={inputId}
                className="block text-sm font-medium text-gray-700 mb-1.5"
            >
                {label}
            </label>
            <div className="relative">
                <input
                    id={inputId}
                    className={`
            block w-full px-4 py-3 
            bg-gray-100 border border-transparent 
            text-uber-black placeholder-gray-500
            focus:bg-white focus:border-black focus:ring-0 focus:outline-none
            transition-colors duration-200
            ${error ? 'border-red-500 bg-red-50 focus:border-red-500' : ''}
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
                    {...props}
                />
            </div>
            {error && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                    {error}
                </p>
            )}
        </div>
    );
};
