import React from 'react';
import { Calendar, LayoutGrid, Trophy, Clock, Users } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'schedule' | 'groups' | 'team_itinerary' | 'sunday_bracket' | 'teams_config';
  onSelectTab: (tab: 'schedule' | 'groups' | 'team_itinerary' | 'sunday_bracket' | 'teams_config') => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const tabs = [
    { id: 'schedule' as const, label: 'Spielplan', icon: Calendar },
    { id: 'groups' as const, label: 'Gruppen', icon: LayoutGrid },
    { id: 'sunday_bracket' as const, label: 'Finals', icon: Trophy },
    { id: 'team_itinerary' as const, label: 'Fahrplan', icon: Clock },
    { id: 'teams_config' as const, label: 'Teams', icon: Users },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pb-[env(safe-area-inset-bottom)] no-print transition-colors shadow-lg"
      aria-label="Mobile Navigation"
    >
      <div className="grid grid-cols-5 h-16 max-w-lg mx-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-all cursor-pointer ${
                isActive
                  ? 'text-slate-900 dark:text-white font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-medium'
              }`}
            >
              <div
                className={`p-1 rounded-md transition-colors ${
                  isActive
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                    : ''
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.3]' : 'stroke-[1.8]'}`} />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
