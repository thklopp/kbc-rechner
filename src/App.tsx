import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { MetricsBar } from './components/MetricsBar';
import { ScheduleView } from './components/ScheduleView';
import { GroupOverview } from './components/GroupOverview';
import { SundayBracketView } from './components/SundayBracketView';
import { TeamScheduleView } from './components/TeamScheduleView';
import { TeamManagement } from './components/TeamManagement';
import { SettingsModal } from './components/SettingsModal';
import { ExportModal } from './components/ExportModal';
import { ConfigModal } from './components/ConfigModal';
import { PrintScheduleView } from './components/PrintScheduleView';
import { MobileBottomNav } from './components/MobileBottomNav';
import { DEFAULT_SETTINGS, DEFAULT_TEAMS, DEFAULT_CONFIG } from './utils/defaultData';
import { generateFullSchedule } from './utils/scheduler';
import { TournamentSettings, Team, Category, MatchOverride, TournamentConfigFile } from './types';

const SETTINGS_STORAGE_KEY = 'hockey_tournament_settings_v1';
const TEAMS_STORAGE_KEY = 'hockey_tournament_teams_v1';
const OVERRIDES_STORAGE_KEY = 'hockey_tournament_overrides_v1';
const THEME_STORAGE_KEY = 'hockey_tournament_theme_v1';

export default function App() {
  // Config state loaded from tournament_config.json
  const [config, setConfig] = useState<TournamentConfigFile>(DEFAULT_CONFIG);
  const [sourceStatus, setSourceStatus] = useState<string>('/tournament_config.json');
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  // Theme state with system preference & storage fallback
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved) return saved === 'dark';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // Apply dark class to document element
  useEffect(() => {
    try {
      if (isDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem(THEME_STORAGE_KEY, 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem(THEME_STORAGE_KEY, 'light');
      }
    } catch (e) {
      console.error(e);
    }
  }, [isDark]);

  // Load initial settings with fallback
  const [settings, setSettings] = useState<TournamentSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.tournamentName === 'Hockey-Jugendturnier') {
          parsed.tournamentName = 'KBC-Rechner';
        }
        if (parsed.pitchName === 'Hauptfeld (Kunstrasen)') {
          parsed.pitchName = 'Halle';
        }
        return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_SETTINGS;
  });

  // Load initial teams with fallback
  const [teams, setTeams] = useState<Team[]>(() => {
    try {
      const saved = localStorage.getItem(TEAMS_STORAGE_KEY);
      if (saved) {
        const parsed: Team[] = JSON.parse(saved);
        return parsed.map(t => {
          let name = t.name;
          if (name.startsWith('Mädchen Team ')) {
            name = name.replace('Mädchen Team ', 'wU14 Team ');
          }
          if (name.startsWith('Jungs Team ')) {
            name = name.replace('Jungs Team ', 'mU14 Team ');
          }
          return { ...t, name };
        });
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_TEAMS;
  });

  // Load optional overrides
  const [matchOverrides, setMatchOverrides] = useState<Record<number, MatchOverride>>(() => {
    try {
      const saved = localStorage.getItem(OVERRIDES_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {};
  });

  // Load config on startup (tries /api/config from volume first, then fallback to /tournament_config.json)
  useEffect(() => {
    let isMounted = true;
    async function fetchStartupConfig() {
      try {
        let response = await fetch('/api/config', { cache: 'no-cache' });
        if (!response.ok) {
          response = await fetch('/tournament_config.json', { cache: 'no-cache' });
        }
        if (response.ok) {
          const jsonConfig: TournamentConfigFile = await response.json();
          if (isMounted) {
            setConfig(jsonConfig);
            setSourceStatus('Volume (aktiv)');

            // Adopt values from tournament_config.json on startup
            if (jsonConfig.tournament) {
              setSettings(jsonConfig.tournament);
            }
            if (jsonConfig.teams) {
              setTeams(jsonConfig.teams);
            }
          }
        }
      } catch (err) {
        console.info('Startup: using bundled tournament_config.json fallback', err);
        if (isMounted) {
          setSourceStatus('tournament_config.json (Bundled)');
        }
      }
    }
    fetchStartupConfig();
    return () => {
      isMounted = false;
    };
  }, []);

  // Reload pristine configuration directly from server volume / file
  const handleReloadFromFile = async (): Promise<boolean> => {
    try {
      let response = await fetch('/api/config', { cache: 'no-cache' });
      if (!response.ok) {
        response = await fetch('/tournament_config.json', { cache: 'no-cache' });
      }
      if (response.ok) {
        const jsonConfig: TournamentConfigFile = await response.json();
        setConfig(jsonConfig);
        if (jsonConfig.tournament) setSettings(jsonConfig.tournament);
        if (jsonConfig.teams) setTeams(jsonConfig.teams);
        setMatchOverrides({});
        setSourceStatus('Volume (neu geladen)');
        return true;
      }
    } catch (err) {
      console.error('Failed to reload from file/volume', err);
    }
    return false;
  };

  // Save full configuration to Railway persistent volume
  const handleSaveToServer = async (newConfig?: TournamentConfigFile): Promise<{ success: boolean; message: string }> => {
    try {
      const toSave = newConfig || activeFullConfig;
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toSave),
      });
      if (response.ok) {
        if (newConfig) {
          setConfig(newConfig);
          if (newConfig.tournament) setSettings(newConfig.tournament);
          if (newConfig.teams) setTeams(newConfig.teams);
        }
        setSourceStatus('Volume (gespeichert)');
        return { success: true, message: 'Erfolgreich auf persistentem Volume gespeichert.' };
      } else {
        const errData = await response.json().catch(() => ({}));
        return { success: false, message: errData.error || 'Serverfehler beim Speichern.' };
      }
    } catch (err: any) {
      console.error('Failed to save to server', err);
      return { success: false, message: err?.message || 'Verbindung zum Server fehlgeschlagen.' };
    }
  };

  // Apply JSON config directly from editor
  const handleApplyConfig = (newConfig: TournamentConfigFile) => {
    setConfig(newConfig);
    if (newConfig.tournament) setSettings(newConfig.tournament);
    if (newConfig.teams) setTeams(newConfig.teams);
    setSourceStatus('Manuell übernommen');
  };

  // Keep full active config object updated
  const activeFullConfig = useMemo<TournamentConfigFile>(() => {
    return {
      ...config,
      tournament: settings,
      teams: teams,
      meta: {
        ...config.meta,
        title: settings.tournamentName,
        updatedAt: new Date().toISOString(),
      },
    };
  }, [config, settings, teams]);

  // Persist settings
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  // Persist teams
  useEffect(() => {
    try {
      localStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify(teams));
    } catch (e) {
      console.error(e);
    }
  }, [teams]);

  // Persist match overrides
  useEffect(() => {
    try {
      localStorage.setItem(OVERRIDES_STORAGE_KEY, JSON.stringify(matchOverrides));
    } catch (e) {
      console.error(e);
    }
  }, [matchOverrides]);

  // UI States
  const [activeTab, setActiveTab] = useState<'schedule' | 'groups' | 'team_itinerary' | 'sunday_bracket' | 'teams_config'>('schedule');
  const [selectedDay, setSelectedDay] = useState<'all' | 1 | 2>(1); // Default to Saturday as requested
  const [selectedCategory, setSelectedCategory] = useState<'all' | Category>('all');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isPrintView, setIsPrintView] = useState(false);

  // Compute tournament schedule with dynamic labels and categories from config
  const { saturdayMatches, sundayMatches, allMatches, stats } = useMemo(() => {
    return generateFullSchedule(teams, settings, matchOverrides, config.labels, config.categories);
  }, [teams, settings, matchOverrides, config.labels, config.categories]);

  const handlePrint = () => {
    setIsPrintView(true);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  if (isPrintView) {
    return (
      <PrintScheduleView
        teams={teams}
        matches={allMatches}
        settings={settings}
        stats={stats}
        onClose={() => setIsPrintView(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Bar following Top Bar Contract with Theme Toggle */}
      <Header
        uiTexts={config.uiTexts}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenConfig={() => setIsConfigOpen(true)}
        onPrint={handlePrint}
        isDark={isDark}
        onToggleTheme={() => setIsDark(prev => !prev)}
      />

      {/* Metrics Bar with timing overview & auto-save badge */}
      <MetricsBar
        stats={stats}
        settings={settings}
        categories={config.categories}
        labels={config.labels}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenConfig={() => setIsConfigOpen(true)}
        sourceStatus={sourceStatus}
      />

      {/* Main Content Area with bottom safe padding for mobile nav bar */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 pb-28 md:pb-8">
        {activeTab === 'schedule' && (
          <ScheduleView
            matches={allMatches}
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        )}

        {activeTab === 'groups' && (
          <GroupOverview
            teams={teams}
            saturdayMatches={saturdayMatches}
          />
        )}

        {activeTab === 'sunday_bracket' && (
          <SundayBracketView
            sundayMatches={sundayMatches}
          />
        )}

        {activeTab === 'team_itinerary' && (
          <TeamScheduleView
            teams={teams}
            saturdayMatches={saturdayMatches}
            sundayMatches={sundayMatches}
          />
        )}

        {activeTab === 'teams_config' && (
          <TeamManagement
            teams={teams}
            onUpdateTeams={setTeams}
          />
        )}
      </main>

      {/* Footer (hidden on mobile to make room for bottom nav) */}
      <footer className="hidden md:block bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-4 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            {settings.tournamentName} · 1 Spielfeld ({settings.pitchName})
          </span>
          <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
            {config.labels?.blockPacingNotice || '2er-Block-Taktung'}: {config.labels?.blockRotationNotice || `2× ${config.categories?.cat1.code || 'wU14'} ↔ 2× ${config.categories?.cat2.code || 'mU14'} im Wechsel`}
          </span>
        </div>
      </footer>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={setSettings}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        matches={allMatches}
        stats={stats}
        settings={settings}
        teams={teams}
        onPrint={handlePrint}
      />

      {/* JSON Configuration Modal */}
      <ConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        currentConfig={activeFullConfig}
        onApplyConfig={handleApplyConfig}
        onReloadFromFile={handleReloadFromFile}
        onSaveToServer={handleSaveToServer}
        sourceStatus={sourceStatus}
      />
    </div>
  );
}
