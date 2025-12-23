
import React from 'react';
import { Flight } from '../types';
import { ICONS } from '../constants';

interface FlightInfoCardProps {
  flight: Flight;
}

const FlightInfoCard: React.FC<FlightInfoCardProps> = ({ flight }) => {
  return (
    <div className="bg-gradient-to-br from-purple-700 to-indigo-800 rounded-2xl shadow-xl overflow-hidden p-5 text-white">
      <div className="flex justify-between items-center mb-4">
        <div className="text-left">
          <p className="text-sm text-purple-200">Flight</p>
          <p className="text-2xl font-bold tracking-wider">{flight.flightNumber}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-purple-200">Gate</p>
          <p className="text-2xl font-bold">{flight.gate}</p>
        </div>
      </div>

      <div className="flex items-center justify-between my-6">
        <div className="text-center">
            <p className="text-3xl font-light">{flight.destinationCode}</p>
            <p className="text-sm text-purple-200">{flight.destination}</p>
        </div>
        <div className="flex-grow flex items-center mx-4">
            <span className="w-2 h-2 bg-purple-300 rounded-full"></span>
            <div className="flex-grow border-b-2 border-dashed border-purple-300/50"></div>
            <div className="text-purple-300 -translate-y-2.5 rotate-90 scale-125">
                {ICONS.plane}
            </div>
            <div className="flex-grow border-b-2 border-dashed border-purple-300/50"></div>
            <span className="w-2 h-2 bg-purple-300 rounded-full"></span>
        </div>
        <div className="text-center">
            <p className="text-3xl font-light">{flight.departureTime}</p>
            <p className="text-sm text-purple-200">Departure</p>
        </div>
      </div>
      
      <div className="bg-white/10 rounded-lg p-3 text-center">
        <p className={`font-semibold ${flight.status === 'On Time' ? 'text-green-300' : 'text-yellow-300'}`}>
          {flight.status}
        </p>
      </div>
    </div>
  );
};

export default FlightInfoCard;
