
import React, { useEffect, useState } from 'react';
import { getPersonalizedRecommendations } from '../services/geminiService';
import { Product } from '../types';
import ProductCard from './ProductCard';

const RecommendationsSkeleton: React.FC = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg animate-pulse">
                <div className="w-full h-40 bg-gray-700"></div>
                <div className="p-4">
                    <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/2 mb-4"></div>
                    <div className="h-10 bg-gray-700 rounded w-1/3 ml-auto"></div>
                </div>
            </div>
        ))}
    </div>
);


interface RecommendationsProps {
    onReserve: (product: Product) => void;
}

const Recommendations: React.FC<RecommendationsProps> = ({ onReserve }) => {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      const data = await getPersonalizedRecommendations();
      setRecommendations(data);
      setLoading(false);
    };

    fetchRecommendations();
  }, []);

  return (
    <section>
      <h2 className="text-xl font-bold text-white mb-4">Just for You</h2>
      {loading ? (
        <RecommendationsSkeleton />
      ) : (
        <div className="grid grid-cols-1 gap-4">
            {recommendations.map((product) => (
                <div key={product.name} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg flex">
                    <img src={product.imageUrl} alt={product.name} className="w-1/3 h-auto object-cover" />
                    <div className="p-4 flex flex-col flex-grow">
                        <h3 className="font-bold text-white text-md flex-grow">{product.name}</h3>
                        <p className="text-sm text-gray-400 mb-2">{product.category}</p>
                        {product.reason && <p className="text-sm text-purple-300 mb-3 italic">"{product.reason}"</p>}
                        <div className="flex justify-end items-center mt-auto">
                            <button 
                                onClick={() => onReserve(product)}
                                className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors">
                                Reserve
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      )}
    </section>
  );
};

export default Recommendations;
