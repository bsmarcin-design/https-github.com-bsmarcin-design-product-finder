
import React, { useState, useEffect, useContext } from 'react';
import { ContactEvent, Product } from '../types';
import { getEventGiftSuggestions, generateProductImage } from '../services/geminiService';
import { ApiKeyContext } from '../contexts/ApiKeyProvider';

interface EventRemindersProps {
  events: ContactEvent[];
  onReserve: (product: Product) => void;
}

const EventGiftSuggestions: React.FC<{ event: ContactEvent, onReserve: (product: Product) => void }> = ({ event, onReserve }) => {
    const [suggestions, setSuggestions] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { reportApiKeyError } = useContext(ApiKeyContext);

    useEffect(() => {
        const fetchSuggestions = async () => {
            setLoading(true);
            try {
                const data = await getEventGiftSuggestions({ name: event.name, type: event.type });
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
    }, [event.name, event.type, reportApiKeyError]);

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

    if (loading) {
        return <div className="text-sm text-gray-400 italic mt-2">Finding perfect gifts...</div>;
    }

    return (
        <div className="mt-3 grid grid-cols-2 gap-3">
            {suggestions.map(product => (
                 <div key={product.name} className="bg-gray-700/50 rounded-lg p-3 text-left">
                    <p className="font-semibold text-sm text-white">{product.name}</p>
                    <p className="text-xs text-gray-300 mb-2">{product.category}</p>
                    <button 
                        onClick={() => onReserve(product)}
                        className="w-full bg-purple-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-purple-700 transition-colors">
                        Reserve
                    </button>
                 </div>
            ))}
        </div>
    );
}

const EventReminders: React.FC<EventRemindersProps> = ({ events, onReserve }) => {
  const [expandedEventId, setExpandedEventId] = useState<number | null>(null);
  
  const toggleExpand = (id: number) => {
    setExpandedEventId(expandedEventId === id ? null : id);
  };
  
  return (
    <section>
      <h2 className="text-2xl font-bold text-white mb-4">Upcoming Events</h2>
      <div className="space-y-3">
        {events.map((event) => (
          <div key={event.id} className="bg-gray-800 rounded-lg shadow-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-white">{event.name}'s {event.type}</p>
                <p className="text-sm text-gray-400">{event.date}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-purple-400">{event.daysUntil}</p>
                <p className="text-xs text-gray-400">days left</p>
              </div>
            </div>
            <button onClick={() => toggleExpand(event.id)} className="text-purple-400 text-sm mt-3 w-full text-left font-semibold">
                {expandedEventId === event.id ? 'Hide gift ideas' : 'Show gift ideas'}
            </button>
            {expandedEventId === event.id && <EventGiftSuggestions event={event} onReserve={onReserve} />}
          </div>
        ))}
      </div>
    </section>
  );
};

export default EventReminders;
