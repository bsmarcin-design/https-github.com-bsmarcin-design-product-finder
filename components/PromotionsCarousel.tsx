
import React, { useState, useEffect, useContext } from 'react';
import { Promotion } from '../types';
import { generatePromotionImage } from '../services/geminiService';
import { ApiKeyContext } from '../contexts/ApiKeyProvider';
import { MOCK_PROMOTIONS } from '../constants';

const PromotionSkeleton: React.FC = () => (
    <div className="flex-shrink-0 w-64 bg-gray-800 rounded-lg shadow-lg overflow-hidden animate-pulse">
        <div className="w-full h-32 bg-gray-700"></div>
        <div className="p-4">
            <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-700 rounded w-1/2"></div>
        </div>
    </div>
);

const PromotionsCarousel: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>(MOCK_PROMOTIONS.map(p => ({...p})));
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { reportApiKeyError } = useContext(ApiKeyContext);

  useEffect(() => {
    setLoading(true);
    const imagePromises = MOCK_PROMOTIONS.map(promo =>
      generatePromotionImage(promo.title, promo.shop).catch(error => {
        console.error(`Failed to generate image for promotion: ${promo.title}`, error);
        if (error instanceof Error && error.message === 'API_KEY_INVALID') {
          reportApiKeyError();
        }
        return `https://placehold.co/300x200/9333EA/FFFFFF?text=Error`;
      }),
    );

    Promise.all(imagePromises).then(imageUrls => {
      setPromotions(currentPromos =>
        currentPromos.map((promo, index) => ({
          ...promo,
          imageUrl: imageUrls[index],
        })),
      );
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportApiKeyError]);
  
  const categories = ['All', ...Array.from(new Set(MOCK_PROMOTIONS.map(p => p.category).filter(Boolean))) as string[]];

  const filteredPromotions = promotions.filter(promo => {
    const matchesCategory = selectedCategory === 'All' || promo.category === selectedCategory;
    const matchesSearch = searchTerm === '' ||
                          promo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          promo.shop.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section>
      <h2 className="text-xl font-bold text-white mb-4">Promotions on your way to the gate</h2>
      
      <div className="space-y-4 mb-4">
        <input
          type="text"
          placeholder="Search promotions by title or shop..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-hide">
            {categories.map(category => (
                <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 text-sm font-semibold rounded-full flex-shrink-0 transition-colors ${selectedCategory === category ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300'}`}
                >
                    {category}
                </button>
            ))}
        </div>
      </div>

      <div className="flex overflow-x-auto space-x-4 pb-4 -mx-4 px-4 scrollbar-hide min-h-[160px]">
        {loading ? (
            [...Array(3)].map((_, i) => <PromotionSkeleton key={i} />)
        ) : filteredPromotions.length > 0 ? (
            filteredPromotions.map((promo) => (
              <div key={promo.id} className="flex-shrink-0 w-64 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <div className="w-full h-32 bg-gray-700">
                    {promo.imageUrl && (
                        <img src={promo.imageUrl} alt={promo.title} className="w-full h-full object-cover" />
                    )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-white">{promo.title}</h3>
                  <p className="text-sm text-gray-400">{promo.shop}</p>
                </div>
              </div>
            ))
        ) : (
          <div className="w-full flex items-center justify-center">
            <p className="text-gray-400">No promotions found.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PromotionsCarousel;