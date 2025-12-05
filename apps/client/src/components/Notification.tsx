import React from 'react';
import { CheckCircleIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  const isSuccess = type === 'success';
  const bgColor = isSuccess ? 'bg-green-100' : 'bg-red-100';
  const textColor = isSuccess ? 'text-green-800' : 'text-red-800';
  const Icon = isSuccess ? CheckCircleIcon : XCircleIcon;

  return (
    <div className={`fixed top-5 right-5 w-full max-w-sm rounded-md shadow-lg pointer-events-auto z-50 ${bgColor}`}>
      <div className="rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Icon className={`h-5 w-5 ${textColor}`} aria-hidden="true" />
          </div>
          <div className="ml-3">
            <p className={`text-sm font-medium ${textColor}`}>{message}</p>
          </div>
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onClose}
                className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isSuccess
                    ? 'bg-green-100 text-green-500 hover:bg-green-200 focus:ring-offset-green-100 focus:ring-green-600'
                    : 'bg-red-100 text-red-500 hover:bg-red-200 focus:ring-offset-red-100 focus:ring-red-600'
                }`}
              >
                <span className="sr-only">Dismiss</span>
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
