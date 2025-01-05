import React from "react";

interface ProgressBarProps {
  progress?: number; // Optional progress percentage (0 to 100), default is indeterminate
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const isIndeterminate = progress === undefined;

  return (
    <div className="relative w-full h-2 bg-gray-300 rounded">
      {isIndeterminate ? (
        <div className="absolute h-full w-full bg-blue-500 animate-pulse rounded" />
      ) : (
        <div
          className="absolute h-full bg-blue-500 rounded transition-all"
          style={{ width: `${progress}%` }}
        />
      )}
    </div>
  );
};

export default ProgressBar;
