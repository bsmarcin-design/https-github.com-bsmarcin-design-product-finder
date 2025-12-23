
import React from 'react';
import { Promotion } from '../types';

interface PromotionsCarouselProps {
  promotions: Promotion[];
}

const PromotionsCarousel: React.FC<PromotionsCarouselProps> = ({ promotions }) => {
  return (
    <section>
      <h2 className="text-xl font-bold text-white mb-4">Promotions Near You</h2>
      <div className="flex overflow-x-auto space-x-4 pb-4 -mx-4 px-4 scrollbar-hide">
        {promotions.map((promo) => (
          <div key={promo.id} className="flex-shrink-0 w-64 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <img src={promo.imageUrl} alt={promo.title} className="w-full h-32 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-white">{promo.title}</h3>
              <p className="text-sm text-gray-400">{promo.shop}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PromotionsCarousel;
