import React from 'react';
import { Shuffle, RotateCcw, ArrowLeftRight, Sparkles } from 'lucide-react';
import { Team, Category } from '../types';
import { DEFAULT_TEAMS, NEUTRAL_TEAMS } from '../utils/defaultData';

interface TeamManagementProps {
  teams: Team[];
  onUpdateTeams: (updatedTeams: Team[]) => void;
}

export const TeamManagement: React.FC<TeamManagementProps> = ({
  teams,
  onUpdateTeams,
}) => {
  const [activeCategory, setActiveCategory] = React.useState<Category>('maedchen');

  const handleNameChange = (teamId: string, newName: string) => {
    onUpdateTeams(
      teams.map(t => (t.id === teamId ? { ...t, name: newName } : t))
    );
  };

  const handleSwitchGroup = (teamId: string) => {
    const currentTeam = teams.find(t => t.id === teamId);
    if (!currentTeam) return;

    const targetGroup = currentTeam.group === 'A' ? 'B' : 'A';
    const teamsInTarget = teams.filter(
      t => t.category === currentTeam.category && t.group === targetGroup
    );
    const teamToSwap = teamsInTarget.find(t => t.seed === currentTeam.seed) || teamsInTarget[0];

    if (teamToSwap) {
      onUpdateTeams(
        teams.map(t => {
          if (t.id === currentTeam.id) {
            return { ...t, group: targetGroup, seed: teamToSwap.seed };
          }
          if (t.id === teamToSwap.id) {
            return { ...t, group: currentTeam.group, seed: currentTeam.seed };
          }
          return t;
        })
      );
    }
  };

  const handleShuffle = () => {
    const catTeams = teams.filter(t => t.category === activeCategory);
    const shuffled = [...catTeams].sort(() => Math.random() - 0.5);

    const updatedCatTeams = shuffled.map((t, idx) => ({
      ...t,
      group: (idx < 4 ? 'A' : 'B') as 'A' | 'B',
      seed: ((idx % 4) + 1),
    }));

    const otherTeams = teams.filter(t => t.category !== activeCategory);
    onUpdateTeams([...otherTeams, ...updatedCatTeams]);
  };

  const handleLoadDefaults = () => {
    onUpdateTeams(DEFAULT_TEAMS);
  };

  const handleLoadNeutral = () => {
    onUpdateTeams(NEUTRAL_TEAMS);
  };

  const currentCategoryTeams = teams.filter(t => t.category === activeCategory);
  const groupA = currentCategoryTeams.filter(t => t.group === 'A').sort((a, b) => a.seed - b.seed);
  const groupB = currentCategoryTeams.filter(t => t.group === 'B').sort((a, b) => a.seed - b.seed);

  return (
    <div className="space-y-6">
      {/* Category selector & quick actions */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        {/* Category switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg max-w-fit">
          <button
            onClick={() => setActiveCategory('maedchen')}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-all ${
              activeCategory === 'maedchen'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            👧 wU14 (8 Teams · 2 Vierergruppen)
          </button>
          <button
            onClick={() => setActiveCategory('jungs')}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-all ${
              activeCategory === 'jungs'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            👦 mU14 (8 Teams · 2 Vierergruppen)
          </button>
        </div>

        {/* Quick actions buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleShuffle}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors shadow-xs"
            title="Teams zufällig in Gruppe A und B losen"
          >
            <Shuffle className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            Gruppen auslosen
          </button>
          <button
            onClick={handleLoadDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors shadow-xs"
            title="Reale Hockey-Vereine einsetzen"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Hockey-Vereine laden
          </button>
          <button
            onClick={handleLoadNeutral}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Auf Team 1 bis 8 zurücksetzen"
          >
            <RotateCcw className="w-3 h-3 text-slate-400" />
            Neutral (Team 1–8)
          </button>
        </div>
      </div>

      {/* Two columns for Group A and Group B */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gruppe A */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs transition-colors">
          <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-900 dark:bg-slate-100" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {activeCategory === 'maedchen' ? 'wU14' : 'mU14'} – Gruppe A
              </h3>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">4 Mannschaften</span>
          </div>

          <div className="p-4 divide-y divide-slate-100 dark:divide-slate-800">
            {groupA.map((team, idx) => (
              <div key={team.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center gap-3">
                <div className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  A{idx + 1}
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={team.name}
                    onChange={e => handleNameChange(team.id, e.target.value)}
                    placeholder={`Team A${idx + 1}`}
                    className="w-full px-3 py-2 text-base sm:text-sm font-medium border border-slate-200 dark:border-slate-700 rounded-lg hover:border-slate-300 dark:hover:border-slate-600 focus:outline-hidden focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 bg-white dark:bg-slate-800 text-slate-900 dark:text-white min-h-[44px]"
                  />
                </div>
                <button
                  onClick={() => handleSwitchGroup(team.id)}
                  className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="In Gruppe B verschieben"
                  aria-label={`Team ${team.name} in Gruppe B verschieben`}
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="px-5 py-3 bg-slate-50/50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            Trägt am Samstag 6 Gruppenspiele aus (jeder gegen jeden).
          </div>
        </div>

        {/* Gruppe B */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs transition-colors">
          <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {activeCategory === 'maedchen' ? 'wU14' : 'mU14'} – Gruppe B
              </h3>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">4 Mannschaften</span>
          </div>

          <div className="p-4 divide-y divide-slate-100 dark:divide-slate-800">
            {groupB.map((team, idx) => (
              <div key={team.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center gap-3">
                <div className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  B{idx + 1}
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={team.name}
                    onChange={e => handleNameChange(team.id, e.target.value)}
                    placeholder={`Team B${idx + 1}`}
                    className="w-full px-3 py-2 text-base sm:text-sm font-medium border border-slate-200 dark:border-slate-700 rounded-lg hover:border-slate-300 dark:hover:border-slate-600 focus:outline-hidden focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 bg-white dark:bg-slate-800 text-slate-900 dark:text-white min-h-[44px]"
                  />
                </div>
                <button
                  onClick={() => handleSwitchGroup(team.id)}
                  className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="In Gruppe A verschieben"
                  aria-label={`Team ${team.name} in Gruppe A verschieben`}
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="px-5 py-3 bg-slate-50/50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            Trägt am Samstag 6 Gruppenspiele aus (jeder gegen jeden).
          </div>
        </div>
      </div>

      {/* Explanatory note */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
        <p>
          💡 <strong>Hinweis zur Spielplan-Berechnung:</strong> Jede Namensänderung oder Gruppenzuweisung wird sofort im gesamten Spielplan (Samstag & Sonntag) sowie in allen Team-Fahrplänen und Druckdokumenten aktualisiert.
        </p>
      </div>
    </div>
  );
};
