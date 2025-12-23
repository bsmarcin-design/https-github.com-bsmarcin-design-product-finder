
import React, { useState } from 'react';
import { Product } from '../types';
import { MOCK_PRODUCTS } from '../constants';
import ProductCard from './ProductCard';

interface ProductCatalogueProps {
    onReserve: (product: Product) => void;
}

const ProductCatalogue: React.FC<ProductCatalogueProps> = ({ onReserve }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(MOCK_PRODUCTS.map(p => p.category)))];

  const filteredProducts = MOCK_PRODUCTS.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Product Catalogue</h2>
      
      <div>
        <input
          type="text"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
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
      
      <div className="grid grid-cols-2 gap-4">
        {filteredProducts.map(product => (
          <ProductCard key={product.name} product={product} onReserve={onReserve} />
        ))}
      </div>
    </div>
  );
};

export default ProductCatalogue;
