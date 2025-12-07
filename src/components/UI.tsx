import React from 'react';
import { Loader2 } from 'lucide-react';

export const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white dark:bg-darkcard rounded-xl shadow-sm border border-gray-200 dark:border-darkborder p-6 ${className}`}>
    {children}
  </div>
);

export const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  isLoading = false,
  disabled = false,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { 
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'; 
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  };

  const variants = {
    primary: "bg-primary-600 hover:bg-primary-700 text-white shadow-md shadow-primary-500/30 focus:ring-primary-500",
    secondary: "bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-700 dark:hover:bg-slate-600",
    outline: "border border-gray-300 dark:border-darkborder text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800",
    ghost: "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800",
  };

  return (
    <button
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

export const Input = ({ label, error, className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    {label && <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
    <input
      className={`px-3 py-2 bg-gray-50 dark:bg-darkbg border ${error ? 'border-red-500' : 'border-gray-200 dark:border-darkborder'} rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-gray-100 placeholder-gray-400`}
      {...props}
    />
    {error && <span className="text-xs text-red-500">{error}</span>}
  </div>
);

export const TextArea = ({ label, className = '', ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    {label && <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
    <textarea
      className="px-3 py-2 bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-darkborder rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-gray-100 placeholder-gray-400 min-h-[120px]"
      {...props}
    />
  </div>
);

export const Select = ({ label, options, value, onChange }: { label?: string; options: { value: string; label: string }[]; value: string; onChange: (val: string) => void }) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-darkborder rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-gray-100"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);