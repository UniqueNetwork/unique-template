'use client';

import React from 'react';

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
  onBack?: () => void;
  showBackButton?: boolean;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  title,
  onClose,
  onBack,
  showBackButton,
}) => {
  return (
    <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3">
        {showBackButton && onBack && (
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h2>
      </div>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
      >
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};
