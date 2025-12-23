
import React, { useState, useEffect } from 'react';
import { Flight } from '../types';
import { ICONS } from '../constants';

interface FlightInfoCardProps {
  flight: Flight;
  isLoading?: boolean;
}

const FlightInfoCardSkeleton: React.FC = () => (
    <div className="bg-gradient-to-br from-purple-700 to-indigo-800 rounded-2xl shadow-xl p-5 animate-pulse">
        <div className="h-14 bg-white/10 rounded-lg w-2/3 mx-auto mb-4"></div>
        <div className="flex justify-between items-center mb-4">
            <div className="h-12 bg-white/10 rounded-lg w-1/3"></div>
            <div className="h-12 bg-white/10 rounded-lg w-1/4"></div>
        </div>
        <div className="flex items-center justify-between my-6">
            <div className="h-12 bg-white/10 rounded-lg w-1/4"></div>
            <div className="flex-grow flex items-center mx-4">
                <div className="h-2 bg-white/10 rounded-full w-full"></div>
            </div>
            <div className="h-12 bg-white/10 rounded-lg w-1/4"></div>
        </div>
        <div className="bg-white/10 rounded-lg h-10 w-full"></div>
        <div className="flex justify-around items-center mt-5 pt-5 border-t border-white/10">
            <div className="text-center w-1/3">
                <div className="h-4 bg-white/10 rounded w-full mb-2"></div>
                <div className="h-6 bg-white/10 rounded w-1/2 mx-auto"></div>
            </div>
            <div className="text-center w-1/3">
                <div className="h-4 bg-white/10 rounded w-full mb-2"></div>
                <div className="h-6 bg-white/10 rounded w-1/2 mx-auto"></div>
            </div>
        </div>
    </div>
);


const FlightInfoCard: React.FC<FlightInfoCardProps> = ({ flight, isLoading }) => {
    const [timeToBoard, setTimeToBoard] = useState('');

    useEffect(() => {
        const calculateTimeToBoard = () => {
            if (!flight.boardingTime) {
                setTimeToBoard('--:--:--');
                return;
            }

            const [boardHours, boardMinutes] = flight.boardingTime.split(':').map(Number);
            const now = new Date();
            
            let boardingDateTime = new Date();
            boardingDateTime.setHours(boardHours, boardMinutes, 0, 0);

            // If the calculated boarding time is in the past for today, it must be for the next day.
            if (boardingDateTime < now) {
                boardingDateTime.setDate(boardingDateTime.getDate() + 1);
            }
            
            const diff = boardingDateTime.getTime() - now.getTime();

            if (diff <= 0) {
                setTimeToBoard('00:00:00');
                return;
            }

            const totalSeconds = Math.floor(diff / 1000);
            const h = Math.floor(totalSeconds / 3600);
            const m = Math.floor((totalSeconds % 3600) / 60);
            const s = totalSeconds % 60;

            const formattedTime = [
                String(h).padStart(2, '0'),
                String(m).padStart(2, '0'),
                String(s).padStart(2, '0')
            ].join(':');

            setTimeToBoard(formattedTime);
        };

        calculateTimeToBoard();
        const timerId = setInterval(calculateTimeToBoard, 1000);
        return () => clearInterval(timerId);
    }, [flight.boardingTime]);

    if (isLoading) {
        return <FlightInfoCardSkeleton />;
    }
    
  return (
    <div className="bg-gradient-to-br from-purple-700 to-indigo-800 rounded-2xl shadow-xl overflow-hidden p-5 text-white">
      <div className="text-center mb-4 pb-4 border-b border-white/10">
        <p className="text-sm text-purple-200">Time to Shop</p>
        <p className="text-3xl font-mono tracking-widest">{timeToBoard}</p>
      </div>
      
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
            <p className="text-3xl font-light">{flight.originCode}</p>
            <p className="text-sm text-purple-200">{flight.origin}</p>
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
            <p className="text-3xl font-light">{flight.destinationCode}</p>
            <p className="text-sm text-purple-200">{flight.destination}</p>
        </div>
      </div>
      
      <div className="bg-white/10 rounded-lg p-3 text-center">
        <p className={`font-semibold ${flight.status === 'On Time' ? 'text-green-300' : 'text-yellow-300'}`}>
          {flight.status}
        </p>
      </div>

      <div className="flex justify-around items-center mt-5 pt-5 border-t border-white/10">
        <div className="text-center">
            <p className="text-sm text-purple-200">Boarding</p>
            <p className="text-xl font-semibold">{flight.boardingTime}</p>
        </div>
        <div className="text-center">
            <p className="text-sm text-purple-200">Departure</p>
            <p className="text-xl font-semibold">{flight.departureTime}</p>
        </div>
      </div>
    </div>
  );
};

export default FlightInfoCard;
