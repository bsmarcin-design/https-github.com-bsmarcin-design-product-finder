
import React, { createContext } from 'react';

interface ApiKeyContextType {
  reportApiKeyError: () => void;
}

export const ApiKeyContext = createContext<ApiKeyContextType>({
  reportApiKeyError: () => {
    console.warn('reportApiKeyError called outside of ApiKeyContext.Provider');
  },
});
