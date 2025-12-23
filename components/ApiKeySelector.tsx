
import React from 'react';

interface ApiKeySelectorProps {
  onSelectKey: () => void;
}

const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onSelectKey }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center text-white">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full border border-purple-800/50">
        <h2 className="text-2xl font-bold text-purple-300 mb-4">API Key Required</h2>
        <p className="text-gray-300 mb-6">
          To generate product images using the advanced Gemini model, please select an API key from a Google Cloud project with billing enabled.
        </p>
        <button
          onClick={onSelectKey}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75"
        >
          Select API Key
        </button>
        <a
          href="https://ai.google.dev/gemini-api/docs/billing"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-purple-400 mt-4 hover:underline inline-block"
        >
          Learn more about billing
        </a>
      </div>
    </div>
  );
};

export default ApiKeySelector;
