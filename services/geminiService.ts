
import { GoogleGenAI, Type } from "@google/genai";
import { Product, Friend, Flight } from "../types";
import { USER_PROFILE } from "../constants";

const API_KEY = process.env.API_KEY;

// NOTE: A new GoogleGenAI instance is created before each call in the production flow
// to ensure it uses the latest key from the selection dialog.
// This `ai` constant is primarily for the API_KEY check and mock data flow.
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

if (!API_KEY) {
  console.warn("API_KEY is not set. Using mock data.");
}

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

export const generateProductImage = async (productName: string, category: string): Promise<string> => {
    const localAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
    if (!process.env.API_KEY) {
        return `https://placehold.co/400x400/1F2937/FFFFFF?text=${encodeURIComponent(productName)}`;
    }
    try {
        const prompt = `A professional, clean product shot of ${productName}, a ${category} item. Centered, on a neutral, minimalist background.`;
        const response = await localAi.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: prompt }] },
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
        throw new Error("No image data found in API response.");
    } catch (error) {
        if (error instanceof Error && error.message.includes("Requested entity was not found.")) {
             throw new Error("API_KEY_INVALID");
        }
        console.error(`Error generating image for "${productName}":`, error);
        return `https://placehold.co/400x400/9333EA/FFFFFF?text=Image+Error`;
    }
};

export const generatePromotionImage = async (title: string, shop: string): Promise<string> => {
    const localAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
    if (!process.env.API_KEY) {
        return `https://placehold.co/300x200/9333EA/FFFFFF?text=${encodeURIComponent(title)}`;
    }
    try {
        const prompt = `A vibrant, eye-catching advertisement banner for a promotion at an airport duty-free shop. The promotion is "${title}" at the "${shop}" store. The image should look professional, luxurious, and enticing for travelers. Avoid text in the image.`;
        const response = await localAi.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: prompt }] },
             config: {
                imageConfig: {
                    aspectRatio: "16:9"
                },
            },
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
        throw new Error("No image data found in API response.");
    } catch (error) {
        if (error instanceof Error && error.message.includes("Requested entity was not found.")) {
             throw new Error("API_KEY_INVALID");
        }
        console.error(`Error generating image for promotion "${title}":`, error);
        return `https://placehold.co/300x200/9333EA/FFFFFF?text=Image+Error`;
    }
};

const flightSchema = {
    type: Type.OBJECT,
    properties: {
        flightNumber: { type: Type.STRING },
        destination: { type: Type.STRING },
        destinationCode: { type: Type.STRING },
        departureTime: { type: Type.STRING },
        boardingTime: { type: Type.STRING },
        gate: { type: Type.STRING },
        status: { type: Type.STRING, enum: ['On Time', 'Delayed', 'Boarding'] },
    },
    required: ['flightNumber', 'destination', 'destinationCode', 'departureTime', 'boardingTime', 'gate', 'status']
};

export const getDynamicFlightInfo = async (latitude: number, longitude: number): Promise<Flight | null> => {
    const localAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
    if (!process.env.API_KEY) return null;

    try {
        // Step 1: Get Airport from Co-ordinates
        const locationPrompt = `What is the 3-letter IATA code and city name for the major international airport closest to latitude ${latitude} and longitude ${longitude}? Respond in JSON format with keys "iataCode" and "city".`;
        const locationResponse = await localAi.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: locationPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        iataCode: { type: Type.STRING },
                        city: { type: Type.STRING },
                    },
                    required: ["iataCode", "city"]
                }
            }
        });

        const locationText = locationResponse.text;
        if (!locationText) throw new Error("Failed to get location from coordinates.");
        const { iataCode, city } = JSON.parse(locationText);

        // Step 2: Generate Flight from Airport
        const flightPrompt = `Find the next available international flight departing from ${city} (${iataCode}) that leaves between 1 hour and 2 hours from now. Provide realistic details for a major airline, including the flight number, destination city and IATA code, the exact departure time (in HH:mm format), a boarding time (typically 45 minutes before departure, in HH:mm format), a gate number, and the flight status (likely 'On Time'). Respond in JSON format.`;
        const flightResponse = await localAi.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: flightPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: flightSchema
            }
        });
        
        const flightText = flightResponse.text;
        if (!flightText) throw new Error("Failed to generate flight details.");
        const flightDetails = JSON.parse(flightText);

        return {
            ...flightDetails,
            origin: city,
            originCode: iataCode,
        };

    } catch (error) {
        if (error instanceof Error && error.message.includes("Requested entity was not found.")) {
             throw new Error("API_KEY_INVALID");
        }
        console.error("Error fetching dynamic flight info:", error);
        return null;
    }
};

const generateMockRecommendations = (): Product[] => [
    { name: 'Tom Ford Oud Wood', category: 'Fragrance', imageUrl: `https://placehold.co/400x400/1F2937/FFFFFF?text=Oud+Wood`, reason: 'A sophisticated scent that matches your interest in fine spirits.' },
    { name: 'Sony WH-1000XM5 Headphones', category: 'Electronics', imageUrl: `https://placehold.co/400x400/1F2937/FFFFFF?text=Headphones`, reason: 'Perfect for your travels and interest in technology.' },
    { name: 'Glenfiddich 18 Year Old', category: 'Spirits', imageUrl: `https://placehold.co/400x400/1F2937/FFFFFF?text=Whiskey`, reason: 'A classic single malt to add to your collection.' },
];

const generateMockGiftSuggestions = (friend: Friend): Product[] => {
    if (friend.name === 'David') {
        return [
            { name: 'Anker Power Bank', category: 'Electronics', imageUrl: `https://placehold.co/400x400/1F2937/FFFFFF?text=Power+Bank`, reason: 'A practical tech gadget for his collection.' },
            { name: 'Lagavulin 16 Year Old', category: 'Spirits', imageUrl: `https://placehold.co/400x400/1F2937/FFFFFF?text=Lagavulin`, reason: 'A smoky whiskey for a true connoisseur.' },
        ];
    }
    return [
        { name: 'La Mer Moisturizing Cream', category: 'Skincare', imageUrl: `https://placehold.co/400x400/1F2937/FFFFFF?text=La+Mer`, reason: 'A luxury skincare item she will love.' },
        { name: 'Godiva Chocolate Assortment', category: 'Confectionery', imageUrl: `https://placehold.co/400x400/1F2937/FFFFFF?text=Godiva`, reason: 'Artisan chocolates that align with her interests.' },
    ];
};

export const getPersonalizedRecommendations = async (): Promise<Product[]> => {
  const localAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
  if (!process.env.API_KEY) return generateMockRecommendations();
  try {
    const prompt = `You are a personal shopper for an airport duty-free store called Avolta. A user has the following profile: ${JSON.stringify(USER_PROFILE)}. Based on their profile, recommend 3 products. The product names should be realistic for a duty-free store.`;

    const response = await localAi.models.generateContent({
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
    return recommendations;

  } catch (error) {
     if (error instanceof Error && error.message.includes("Requested entity was not found.")) {
         throw new Error("API_KEY_INVALID");
    }
    console.error("Error fetching personalized recommendations:", error);
    return generateMockRecommendations();
  }
};

export const getGiftSuggestions = async (friend: Friend): Promise<Product[]> => {
    const localAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
    if (!process.env.API_KEY) return generateMockGiftSuggestions(friend);
    try {
        const prompt = `You are a gift-giving expert for an airport duty-free store. A user wants to buy a gift for their ${friend.relation}, ${friend.name}, who is a ${friend.age}-year-old ${friend.gender} interested in ${friend.interests.join(', ')}. The user's own shopping history includes ${USER_PROFILE.shoppingHistory.join(', ')}. Suggest 2 gift ideas. Product names should be realistic for a duty-free store.`;

        const response = await localAi.models.generateContent({
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
        return suggestions;
    } catch (error) {
        if (error instanceof Error && error.message.includes("Requested entity was not found.")) {
             throw new Error("API_KEY_INVALID");
        }
        console.error("Error fetching gift suggestions:", error);
        return generateMockGiftSuggestions(friend);
    }
};

export const getEventGiftSuggestions = async (event: {name: string, type: string}): Promise<Product[]> => {
    const localAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
    if (!process.env.API_KEY) return generateMockRecommendations().slice(0, 2);
    try {
        const prompt = `You are a gift-giving expert for an airport duty-free store. A user needs a gift for ${event.name}'s upcoming ${event.type}. Suggest 2 thoughtful gift ideas available at a duty-free shop.`;

        const response = await localAi.models.generateContent({
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
        return suggestions;
    } catch (error) {
        if (error instanceof Error && error.message.includes("Requested entity was not found.")) {
             throw new Error("API_KEY_INVALID");
        }
        console.error("Error fetching event gift suggestions:", error);
        return generateMockRecommendations().slice(0, 2);
    }
}
