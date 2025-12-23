
import React from 'react';
import { Product } from '../types';
import { ICONS } from '../constants';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({ isOpen, onClose, product }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm text-white relative animate-fade-in-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          {ICONS.close}
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-purple-300 mb-4 text-center">Item Reserved!</h2>
          
          <div className="bg-gray-900 rounded-lg p-4 my-4 flex items-center space-x-4">
            <div className="w-20 h-20 rounded-lg bg-gray-700 flex-shrink-0">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover rounded-lg" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-400">{product.category}</p>
              {product.price && <p className="text-lg font-bold text-purple-400 mt-1">${product.price}</p>}
            </div>
          </div>
          
          <div className="text-center space-y-2 text-gray-300">
            <p>Your item has been reserved for collection.</p>
            <p className="font-semibold">Collection Point: <span className="text-white">Avolta Store, After Security</span></p>
            <p className="text-sm">Please show this confirmation at the counter.</p>
          </div>
          
          <button
            onClick={onClose}
            className="mt-6 w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};