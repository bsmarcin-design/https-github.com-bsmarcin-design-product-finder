
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import FlightInfoCard from './components/FlightInfoCard';
import PromotionsCarousel from './components/PromotionsCarousel';
import Recommendations from './components/Recommendations';
import GiftSuggestions from './components/GiftSuggestions';
import EventReminders from './components/EventReminders';
import ProductCatalogue from './components/ProductCatalogue';
import { ReservationModal } from './components/ReservationModal';
import ApiKeySelector from './components/ApiKeySelector';
import { ApiKeyContext } from './contexts/ApiKeyProvider';
import { Product, Flight } from './types';
import { MOCK_FLIGHT, MOCK_CONTACT_EVENTS, MOCK_FRIENDS } from './constants';
import { getDynamicFlightInfo } from './services/geminiService';

type View = 'home' | 'catalogue' | 'gifts' | 'profile';

// FIX: Removed conflicting global declaration for `window.aistudio`.
// The TypeScript error indicates that this type is already defined globally,
// so redeclaring it causes a conflict. The global type for `window.aistudio`
// is expected to be provided by the environment.

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [isKeyReady, setIsKeyReady] = useState(false);
  const [isCheckingKey, setIsCheckingKey] = useState(true);

  const [flight, setFlight] = useState<Flight>(MOCK_FLIGHT);
  const [isFlightLoading, setIsFlightLoading] = useState(true);

  const checkKey = async () => {
    try {
        if (window.aistudio && await window.aistudio.hasSelectedApiKey()) {
            setIsKeyReady(true);
        }
    } catch (e) {
        console.error("Error checking for API key:", e);
    } finally {
        setIsCheckingKey(false);
    }
  };

  useEffect(() => {
    checkKey();
  }, []);

  useEffect(() => {
    const loadFlightData = () => {
        if (!navigator.geolocation) {
            console.warn("Geolocation is not supported by this browser.");
            setIsFlightLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const dynamicFlight = await getDynamicFlightInfo(latitude, longitude);
                    if (dynamicFlight) {
                        setFlight(dynamicFlight);
                    }
                } catch (error) {
                    console.error("Failed to get dynamic flight info, using mock data.", error);
                    if (error instanceof Error && error.message === 'API_KEY_INVALID') {
                        handleApiKeyError();
                    }
                } finally {
                    setIsFlightLoading(false);
                }
            },
            (error) => {
                console.warn(`Geolocation error: ${error.message}. Using mock data.`);
                setIsFlightLoading(false);
            }
        );
    };

    if (isKeyReady) {
        loadFlightData();
    } else if (!isCheckingKey) {
        // If key is not ready and we're done checking, use mock data.
        setIsFlightLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isKeyReady, isCheckingKey]);

  const handleSelectKey = async () => {
    try {
        if (window.aistudio) {
            await window.aistudio.openSelectKey();
            // Assume success and proceed to the app, per guidelines
            setIsKeyReady(true);
            setIsCheckingKey(false);
        }
    } catch (e) {
        console.error("Error opening key selection:", e);
        setIsCheckingKey(false); // Stop checking even if it fails
    }
  };

  const handleApiKeyError = () => {
    // This function is called by child components via context if the API key is invalid
    setIsKeyReady(false);
    setIsCheckingKey(false);
  };

  const handleReserveClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'home':
        return (
          <div className="space-y-8">
            <FlightInfoCard flight={flight} isLoading={isFlightLoading} />
            <PromotionsCarousel />
            <Recommendations onReserve={handleReserveClick} />
          </div>
        );
      case 'catalogue':
        return <ProductCatalogue onReserve={handleReserveClick} />;
      case 'gifts':
        return (
          <div className="space-y-8">
            <GiftSuggestions friends={MOCK_FRIENDS} onReserve={handleReserveClick} />
            <EventReminders events={MOCK_CONTACT_EVENTS} onReserve={handleReserveClick} />
          </div>
        );
      case 'profile':
        return <div className="text-white text-center p-8">Profile page coming soon!</div>;
      default:
        return null;
    }
  };
  
  const renderApp = () => {
    if (isCheckingKey) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-white">Checking for API Key...</div>
            </div>
        )
    }
    if (!isKeyReady) {
        return <ApiKeySelector onSelectKey={handleSelectKey} />;
    }
    return (
        <ApiKeyContext.Provider value={{ reportApiKeyError: handleApiKeyError }}>
            <div className="max-w-md mx-auto bg-gray-900 pb-24">
                <Header />
                <main className="p-4">
                {renderContent()}
                </main>
            </div>
            <BottomNav activeView={activeView} setActiveView={setActiveView} />
            {selectedProduct && (
                <ReservationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={selectedProduct}
                />
            )}
        </ApiKeyContext.Provider>
    )
  }

  return (
    <div className="bg-gray-900 min-h-screen font-sans text-white">
      {renderApp()}
    </div>
  );
};

export default App;