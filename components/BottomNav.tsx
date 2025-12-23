
import React from 'react';
import { ICONS } from '../constants';

type View = 'home' | 'catalogue' | 'gifts' | 'profile';

interface BottomNavProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
  const activeClass = isActive ? 'text-purple-400' : 'text-gray-400';
  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center w-full transition-colors duration-200 hover:text-purple-300 ${activeClass}`}>
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-sm border-t border-purple-800/50 shadow-lg max-w-md mx-auto">
      <div className="flex justify-around items-center h-16">
        <NavItem icon={ICONS.home} label="Home" isActive={activeView === 'home'} onClick={() => setActiveView('home')} />
        <NavItem icon={ICONS.catalogue} label="Catalogue" isActive={activeView === 'catalogue'} onClick={() => setActiveView('catalogue')} />
        <NavItem icon={ICONS.gifts} label="Gifts" isActive={activeView === 'gifts'} onClick={() => setActiveView('gifts')} />
        <NavItem icon={ICONS.profile} label="Profile" isActive={activeView === 'profile'} onClick={() => setActiveView('profile')} />
      </div>
    </nav>
  );
};

export default BottomNav;
