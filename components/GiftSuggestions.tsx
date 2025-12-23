
import React, { useEffect, useState, useContext } from 'react';
import { getGiftSuggestions, generateProductImage } from '../services/geminiService';
import { Friend, Product } from '../types';
import ProductCard from './ProductCard';
import { ApiKeyContext } from '../contexts/ApiKeyProvider';

const SuggestionSkeleton: React.FC = () => (
    <div className="grid grid-cols-2 gap-4">
        {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg animate-pulse">
                <div className="w-full h-40 bg-gray-700"></div>
                <div className="p-4">
                    <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                </div>
            </div>
        ))}
    </div>
);

const FriendGiftSection: React.FC<{ friend: Friend; onReserve: (product: Product) => void; }> = ({ friend, onReserve }) => {
    const [suggestions, setSuggestions] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { reportApiKeyError } = useContext(ApiKeyContext);

    useEffect(() => {
        const fetchSuggestions = async () => {
            setLoading(true);
            try {
                const data = await getGiftSuggestions(friend);
                setSuggestions(data);
            } catch (error) {
                if (error instanceof Error && error.message === 'API_KEY_INVALID') {
                    reportApiKeyError();
                }
            } finally {
                setLoading(false);
            }
        };
        fetchSuggestions();
    }, [friend, reportApiKeyError]);

    useEffect(() => {
        if (!loading && suggestions.length > 0) {
            suggestions.forEach((product, index) => {
                if (!product.imageUrl) {
                    generateProductImage(product.name, product.category)
                        .then(imageUrl => {
                            setSuggestions(prev => {
                                const newSuggestions = [...prev];
                                if (newSuggestions[index]) {
                                    newSuggestions[index] = { ...newSuggestions[index], imageUrl };
                                }
                                return newSuggestions;
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
    }, [loading, suggestions, reportApiKeyError]);

    return (
        <div>
            <h3 className="text-lg font-semibold text-purple-300 mb-3">For {friend.name} ({friend.relation})</h3>
            {loading ? (
                <SuggestionSkeleton />
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    {suggestions.map((product) => (
                        <ProductCard key={product.name} product={product} onReserve={onReserve} />
                    ))}
                </div>
            )}
        </div>
    );
};

interface GiftSuggestionsProps {
    friends: Friend[];
    onReserve: (product: Product) => void;
}

const GiftSuggestions: React.FC<GiftSuggestionsProps> = ({ friends, onReserve }) => {
  return (
    <section>
      <h2 className="text-2xl font-bold text-white mb-4">Gifts for Loved Ones</h2>
      <div className="space-y-8">
        {friends.map(friend => (
            <FriendGiftSection key={friend.id} friend={friend} onReserve={onReserve} />
        ))}
      </div>
    </section>
  );
};

export default GiftSuggestions;
