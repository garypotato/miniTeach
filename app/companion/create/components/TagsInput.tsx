"use client";

import React, { useState, KeyboardEvent, ChangeEvent, forwardRef } from "react";

interface TagsInputProps {
  label: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (name: string, value: string) => void;
  error?: string;
  required?: boolean;
}

const TagsInput = forwardRef<HTMLDivElement, TagsInputProps>(({
  label,
  name,
  placeholder,
  value,
  onChange,
  error,
  required = false,
}, ref) => {
  const [inputValue, setInputValue] = useState("");

  // Convert comma-separated string to array for display
  const tags = value ? value.split(",").map(tag => tag.trim()).filter(Boolean) : [];

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag) {
      const newTags = [...tags, trimmedTag];
      onChange(name, newTags.join(", "));
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    onChange(name, newTags.join(", "));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Check if user typed a comma
    if (newValue.includes(",")) {
      const parts = newValue.split(",");
      const lastPart = parts.pop() || ""; // Get the part after the last comma
      
      // Add all complete parts (before commas) as tags
      parts.forEach(part => {
        const trimmed = part.trim();
        if (trimmed) {
          addTag(trimmed);
        }
      });
      
      // Keep the part after the last comma as the current input
      setInputValue(lastPart);
    } else {
      setInputValue(newValue);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (inputValue.trim()) {
        addTag(inputValue);
      }
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      // Remove last tag if backspace on empty input
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div ref={ref} className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="min-h-[42px] border border-gray-300 rounded-lg p-2 flex flex-wrap gap-2 items-center focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500">
        {/* Display existing tags */}
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-blue-600 hover:text-blue-800 ml-1 text-lg leading-none"
              aria-label={`Remove ${tag}`}
            >
              ×
            </button>
          </span>
        ))}
        
        {/* Input field */}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] outline-none bg-transparent text-gray-900 placeholder-gray-600 text-sm"
        />
      </div>

      {/* Helper text */}
      <p className="text-xs text-gray-500">
        输入文字后加英文逗号(,)自动创建标签，或按 Enter 键添加。点击 × 移除标签。
      </p>

      {/* Error message */}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
});

TagsInput.displayName = 'TagsInput';

export default TagsInput;