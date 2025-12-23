
import { GoogleGenAI, Type } from "@google/genai";
import { Product, Friend } from "../types";
import { USER_PROFILE } from "../constants";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY is not set. Using mock data.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const productSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      name: {
        type: Type.STRING,
        description: "The full product name.",
      },
      category: {
        type: Type.STRING,
        description: "Product category, e.g., 'Fragrance', 'Spirits', 'Electronics'.",
      },
      reason: {
        type: Type.STRING,
        description: "A short, compelling reason why this product is recommended for the user.",
      },
    },
    required: ["name", "category", "reason"],
  },
};

const generateMockRecommendations = (): Product[] => [
    { name: 'Tom Ford Oud Wood', category: 'Fragrance', imageUrl: 'https://source.unsplash.com/400x400/?tom-ford,perfume', reason: 'A sophisticated scent that matches your interest in fine spirits.' },
    { name: 'Sony WH-1000XM5 Headphones', category: 'Electronics', imageUrl: 'https://source.unsplash.com/400x400/?sony,headphones', reason: 'Perfect for your travels and interest in technology.' },
    { name: 'Glenfiddich 18 Year Old', category: 'Spirits', imageUrl: 'https://source.unsplash.com/400x400/?glenfiddich,whiskey', reason: 'A classic single malt to add to your collection.' },
];

const generateMockGiftSuggestions = (friend: Friend): Product[] => {
    if (friend.name === 'David') {
        return [
            { name: 'Anker Power Bank', category: 'Electronics', imageUrl: 'https://source.unsplash.com/400x400/?anker,power-bank', reason: 'A practical tech gadget for his collection.' },
            { name: 'Lagavulin 16 Year Old', category: 'Spirits', imageUrl: 'https://source.unsplash.com/400x400/?lagavulin,whiskey', reason: 'A smoky whiskey for a true connoisseur.' },
        ];
    }
    return [
        { name: 'La Mer Moisturizing Cream', category: 'Skincare', imageUrl: 'https://source.unsplash.com/400x400/?la-mer,skincare', reason: 'A luxury skincare item she will love.' },
        { name: 'Godiva Chocolate Assortment', category: 'Confectionery', imageUrl: 'https://source.unsplash.com/400x400/?godiva,chocolate', reason: 'Artisan chocolates that align with her interests.' },
    ];
};

export const getPersonalizedRecommendations = async (): Promise<Product[]> => {
  if (!ai) return generateMockRecommendations();
  try {
    const prompt = `You are a personal shopper for an airport duty-free store called Avolta. A user has the following profile: ${JSON.stringify(USER_PROFILE)}. Based on their profile, recommend 3 products. The product names should be realistic for a duty-free store.`;

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: productSchema,
        },
    });
    
    const responseText = response.text;
    if (!responseText) {
        throw new Error("Empty response from API");
    }
    const recommendations = JSON.parse(responseText);
    return recommendations.map((rec: any) => ({ ...rec, imageUrl: `https://source.unsplash.com/400x400/?${rec.name.replace(/\s/g, ',')},${rec.category}` }));

  } catch (error) {
    console.error("Error fetching personalized recommendations:", error);
    return generateMockRecommendations();
  }
};

export const getGiftSuggestions = async (friend: Friend): Promise<Product[]> => {
    if (!ai) return generateMockGiftSuggestions(friend);
    try {
        const prompt = `You are a gift-giving expert for an airport duty-free store. A user wants to buy a gift for their ${friend.relation}, ${friend.name}, who is a ${friend.age}-year-old ${friend.gender} interested in ${friend.interests.join(', ')}. The user's own shopping history includes ${USER_PROFILE.shoppingHistory.join(', ')}. Suggest 2 gift ideas. Product names should be realistic for a duty-free store.`;

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: productSchema,
            },
        });

        const responseText = response.text;
        if (!responseText) {
            throw new Error("Empty response from API");
        }
        const suggestions = JSON.parse(responseText);
        return suggestions.map((rec: any) => ({ ...rec, imageUrl: `https://source.unsplash.com/400x400/?${rec.name.replace(/\s/g, ',')},${rec.category}` }));
    } catch (error) {
        console.error("Error fetching gift suggestions:", error);
        return generateMockGiftSuggestions(friend);
    }
};

export const getEventGiftSuggestions = async (event: {name: string, type: string}): Promise<Product[]> => {
    if (!ai) return generateMockRecommendations().slice(0, 2); // Return some mock data
    try {
        const prompt = `You are a gift-giving expert for an airport duty-free store. A user needs a gift for ${event.name}'s upcoming ${event.type}. Suggest 2 thoughtful gift ideas available at a duty-free shop.`;

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: productSchema,
            },
        });

        const responseText = response.text;
        if (!responseText) {
            throw new Error("Empty response from API");
        }
        const suggestions = JSON.parse(responseText);
        return suggestions.map((rec: any) => ({ ...rec, imageUrl: `https://source.unsplash.com/400x400/?${rec.name.replace(/\s/g, ',')},${rec.category}` }));
    } catch (error) {
        console.error("Error fetching event gift suggestions:", error);
        return generateMockRecommendations().slice(0, 2);
    }
}
