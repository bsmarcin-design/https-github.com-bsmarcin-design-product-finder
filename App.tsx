
import React, { useState } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import FlightInfoCard from './components/FlightInfoCard';
import PromotionsCarousel from './components/PromotionsCarousel';
import Recommendations from './components/Recommendations';
import GiftSuggestions from './components/GiftSuggestions';
import EventReminders from './components/EventReminders';
import ProductCatalogue from './components/ProductCatalogue';
import { ReservationModal } from './components/ReservationModal';
import { Product } from './types';
import { MOCK_FLIGHT, MOCK_PROMOTIONS, MOCK_CONTACT_EVENTS, MOCK_FRIENDS } from './constants';

type View = 'home' | 'catalogue' | 'gifts' | 'profile';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleReserveClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'home':
        return (
          <div className="space-y-8">
            <FlightInfoCard flight={MOCK_FLIGHT} />
            <PromotionsCarousel promotions={MOCK_PROMOTIONS} />
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

  return (
    <div className="bg-gray-900 min-h-screen font-sans text-white">
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
    </div>
  );
};

export default App;
