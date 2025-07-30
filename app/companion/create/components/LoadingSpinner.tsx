import React from "react";

interface LoadingSpinnerProps {
  className?: string;
}

export default function LoadingSpinner({
  className = "w-6 h-6",
}: LoadingSpinnerProps) {
  return (
    <div
      className={`animate-spin rounded-full border-2 border-transparent border-t-current ${className}`}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

