
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onReserve: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onReserve }) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg flex flex-col">
      <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-cover" />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-white text-md flex-grow">{product.name}</h3>
        <p className="text-sm text-gray-400 mb-2">{product.category}</p>
        {product.reason && <p className="text-sm text-purple-300 mb-3 italic">"{product.reason}"</p>}
        <div className="flex justify-between items-center mt-auto">
          {product.price && <p className="text-lg font-semibold text-white">${product.price}</p>}
          <button 
            onClick={() => onReserve(product)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors">
            Reserve
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
