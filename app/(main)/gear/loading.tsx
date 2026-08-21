import React from 'react';

const Loading = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-6"></div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 h-96 bg-gray-200 rounded-lg animate-pulse"></div>

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="border rounded-lg p-4 bg-white space-y-4 animate-pulse">
              <div className="w-full h-48 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;