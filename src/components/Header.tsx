import React from 'react';
import { Printer, Download, Share2, Settings, Shield, Sun, Moon, FileCode } from 'lucide-react';
import { UiTextsConfig } from '../types';

interface HeaderProps {
  title?: string;
  uiTexts?: UiTextsConfig;
  activeTab: 'schedule' | 'groups' | 'team_itinerary' | 'sunday_bracket' | 'teams_config';
  onSelectTab: (tab: 'schedule' | 'groups' | 'team_itinerary' | 'sunday_bracket' | 'teams_config') => void;
  onOpenSettings: () => void;
  onOpenExport: () => void;
  onOpenConfig: () => void;
  onPrint: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'KBC-Rechner',
  uiTexts,
  activeTab,
  onSelectTab,
  onOpenSettings,
  onOpenExport,
  onOpenConfig,
  onPrint,
  isDark,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center font-bold text-xs tracking-wider shadow-sm transition-colors">
              KBC
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                {title}
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links / Segmented Tabs */}
          <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors">
            <button
              onClick={() => onSelectTab('schedule')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                activeTab === 'schedule'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {uiTexts?.tabSchedule || 'Spielansetzungen'}
            </button>
            <button
              onClick={() => onSelectTab('groups')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                activeTab === 'groups'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {uiTexts?.tabGroups || 'Gruppen-Übersicht'}
            </button>
            <button
              onClick={() => onSelectTab('sunday_bracket')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                activeTab === 'sunday_bracket'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {uiTexts?.tabSundayBracket || 'Sonntags-Finalrunden'}
            </button>
            <button
              onClick={() => onSelectTab('team_itinerary')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                activeTab === 'team_itinerary'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {uiTexts?.tabTeamSchedule || 'Team-Fahrpläne'}
            </button>
            <button
              onClick={() => onSelectTab('teams_config')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                activeTab === 'teams_config'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {uiTexts?.tabTeams || 'Teams & Gruppen'}
            </button>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              className="p-2 min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title={isDark ? 'Zum hellen Modus wechseln' : 'Dunkelmodus aktivieren (für Abendlicht & Flutlicht)'}
              aria-label={isDark ? 'Hellen Modus aktivieren' : 'Dunklen Modus aktivieren'}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              )}
            </button>

            <button
              onClick={onOpenConfig}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-lg transition-colors whitespace-nowrap shadow-xs cursor-pointer min-h-[40px]"
              title="JSON-Konfigurationsdatei (tournament_config.json) ansehen & bearbeiten"
            >
              <FileCode className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">JSON-Config</span>
            </button>

            <button
              onClick={onOpenSettings}
              className="p-2 min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Zeiten & Parameter anpassen"
              aria-label="Zeiten und Parameter anpassen"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenExport}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap shadow-xs cursor-pointer min-h-[40px]"
              title="Spielplan teilen oder als CSV exportieren"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span className="hidden sm:inline">Teilen / Export</span>
            </button>
            <button
              onClick={onPrint}
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-950 rounded-lg transition-colors whitespace-nowrap shadow-xs cursor-pointer min-h-[40px]"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Drucken</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
