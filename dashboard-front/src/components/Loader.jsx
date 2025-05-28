// src/components/Loader.jsx
import { FaSpinner } from 'react-icons/fa';

const Loader = ({ message = "جاري التحميل..." }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl text-center">
        <FaSpinner className="animate-spin text-3xl text-blue-500 mx-auto mb-3" />
        <p className="text-gray-700">{message}</p>
      </div>
    </div>
  );
};

export default Loader;