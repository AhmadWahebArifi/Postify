import React from 'react';

interface SpinLoaderProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

const SpinLoader: React.FC<SpinLoaderProps> = ({ size = 'medium', text = 'Loading...' }) => {
  const pxSize = size === 'small' ? 18 : size === 'large' ? 44 : 28;
  const textSizeClass = size === 'small' ? 'text-sm' : size === 'large' ? 'text-lg' : 'text-base';

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <svg
        width={pxSize}
        height={pxSize}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="animate-spin"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="#3B82F6"
          strokeWidth="4"
          opacity="0.25"
        />
        <path
          d="M22 12a10 10 0 0 1-10 10"
          stroke="#3B82F6"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.9"
        />
      </svg>
      {text && <p className={`${textSizeClass} text-gray-600 font-medium animate-pulse`}>{text}</p>}
    </div>
  );
};

export default SpinLoader;
