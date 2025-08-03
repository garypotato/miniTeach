import React, { forwardRef } from "react";

interface Option {
  value: string;
  label: string;
}

interface FormFieldProps {
  label: string;
  name: string;
  type: "text" | "email" | "password" | "number" | "textarea" | "select";
  placeholder?: string;
  value: string;
  onChange: (name: string, value: string) => void;
  error?: string;
  required?: boolean;
  rows?: number;
  options?: Option[];
  disabled?: boolean;
}

const FormField = forwardRef<HTMLDivElement, FormFieldProps>(({
  label,
  name,
  type,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  rows = 4,
  options = [],
  disabled = false,
}, ref) => {
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    onChange(name, e.target.value);
  };

  const baseClasses =
    "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors";
  const errorClasses = error ? "border-red-300 bg-red-50" : "border-gray-300";
  const disabledClasses = disabled ? "bg-gray-100 cursor-not-allowed opacity-75" : "";

  return (
    <div ref={ref} className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {type === "textarea" ? (
        <textarea
          id={name}
          name={name}
          rows={rows}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={`${baseClasses} ${errorClasses} ${disabledClasses} resize-vertical`}
        />
      ) : type === "select" ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={`${baseClasses} ${errorClasses} ${disabledClasses} text-gray-900`}
        >
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              className="text-gray-900 bg-white py-2 px-4"
            >
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={`${baseClasses} ${errorClasses} ${disabledClasses}`}
        />
      )}

      {error && (
        <p className="text-sm text-red-600 flex items-center">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
});

FormField.displayName = 'FormField';

export default FormField;

