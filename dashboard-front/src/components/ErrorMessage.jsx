// src/components/ErrorMessage.jsx
import { FaExclamationCircle } from 'react-icons/fa';

const ErrorMessage = ({ message = "حدث خطأ!", onRetry }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl text-center max-w-md">
        <FaExclamationCircle className="text-3xl text-red-500 mx-auto mb-3" />
        <p className="text-gray-700 mb-4">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            حاول مرة أخرى
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;