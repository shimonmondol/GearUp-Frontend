'use client';

import React from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const Error: React.FC<ErrorProps> = ({ error, reset }) => {
  return (
    <div className="max-w-md mx-auto my-20 p-8 bg-white border rounded-lg text-center shadow-sm">
      <h2 className="text-2xl font-bold text-red-600 mb-2">Something went wrong!</h2>
      <p className="text-sm text-gray-600 mb-6">
        {error.message || 'Failed to load gear data from the server.'}
      </p>
      <button
        onClick={() => reset()}
        className="bg-blue-600 text-white px-5 py-2 rounded text-sm font-semibold hover:bg-blue-700"
      >
        Try Again
      </button>
    </div>
  );
};

export default Error;