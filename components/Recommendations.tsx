
import React, { useEffect, useState, useContext } from 'react';
import { getPersonalizedRecommendations, generateProductImage } from '../services/geminiService';
import { Product } from '../types';
import { ApiKeyContext } from '../contexts/ApiKeyProvider';

const RecommendationsSkeleton: React.FC = () => (
    <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg flex animate-pulse">
                <div className="w-1/3 bg-gray-700"></div>
                <div className="p-4 flex-grow">
                    <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/2 mb-4"></div>
                    <div className="h-10 bg-gray-700 rounded w-1/3 ml-auto mt-4"></div>
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
  const { reportApiKeyError } = useContext(ApiKeyContext);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const data = await getPersonalizedRecommendations();
        setRecommendations(data);
      } catch (error) {
        if (error instanceof Error && error.message === 'API_KEY_INVALID') {
            reportApiKeyError();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [reportApiKeyError]);

  useEffect(() => {
    if (!loading && recommendations.length > 0) {
      recommendations.forEach((product, index) => {
        if (!product.imageUrl) {
          generateProductImage(product.name, product.category)
            .then(imageUrl => {
                setRecommendations(prev => {
                const newRecs = [...prev];
                if (newRecs[index]) {
                    newRecs[index] = { ...newRecs[index], imageUrl };
                }
                return newRecs;
                });
            })
            .catch(error => {
                if (error instanceof Error && error.message === 'API_KEY_INVALID') {
                    reportApiKeyError();
                }
            });
        }
      });
    }
  }, [loading, recommendations, reportApiKeyError]);

  return (
    <section>
      <h2 className="text-xl font-bold text-white mb-4">Just for You</h2>
      {loading ? (
        <RecommendationsSkeleton />
      ) : (
        <div className="grid grid-cols-1 gap-4">
            {recommendations.map((product) => (
                <div key={product.name} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg flex">
                    <div className="w-1/3 h-auto bg-gray-700">
                        {product.imageUrl ? (
                           <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full animate-pulse bg-gray-700" />
                        )}
                    </div>
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
