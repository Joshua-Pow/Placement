import React from 'react';

type Props = { request: string };

const Status = (props: Props) => {
  {
    switch (props.request) {
      case 'ACTIVE':
        return (
          <div className="bg-green-100 dark:bg-gray-700 p-4 rounded-lg shadow-md flex items-center gap-4 border border-green-300 dark:border-green-600">
            <span className="h-6 w-6 rounded-full bg-green-500 animate-pulse" />
            <p className="text-lg font-semibold text-green-500 dark:text-green-200">
              Server Active
            </p>
          </div>
        );
      case 'INACTIVE':
        return (
          <div className="bg-red-100 dark:bg-gray-700 p-4 rounded-lg shadow-md flex items-center gap-4 mt-4 border border-red-300 dark:border-red-600">
            <span className="h-6 w-6 rounded-full bg-red-500 animate-pulse" />
            <p className="text-lg font-semibold text-red-500 dark:text-red-200">
              Server Failed
            </p>
          </div>
        );
      default:
        return (
          <div className="bg-blue-100 dark:bg-gray-700 p-4 rounded-lg shadow-md flex items-center gap-4 border   border-blue-300 dark:border-blue-600">
            <span className="h-6 w-6 rounded-full bg-blue-500 animate-pulse" />
            <p className="text-lg font-semibold text-blue-500 dark:text-blue-200">
              Polling In Progress
            </p>
          </div>
        );
    }
  }
};

export default Status;
