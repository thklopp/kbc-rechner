import React from 'react';
import { Clock, Shield, ArrowRight } from 'lucide-react';
import { Team, ScheduledMatch, Category } from '../types';

interface GroupOverviewProps {
  teams: Team[];
  saturdayMatches: ScheduledMatch[];
}

export const GroupOverview: React.FC<GroupOverviewProps> = ({
  teams,
  saturdayMatches,
}) => {
  const [selectedCat, setSelectedCat] = React.useState<Category>('maedchen');

  const renderGroupCard = (cat: Category, groupLetter: 'A' | 'B') => {
    const groupTeams = teams
      .filter(t => t.category === cat && t.group === groupLetter)
      .sort((a, b) => a.seed - b.seed);

    const groupMatches = saturdayMatches.filter(
      m => m.category === cat && m.group === groupLetter
    );

    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs flex flex-col transition-colors">
        {/* Card Header */}
        <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                cat === 'maedchen' ? 'bg-rose-500' : 'bg-blue-600'
              }`}
            />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {cat === 'maedchen' ? 'wU14' : 'mU14'} – Gruppe {groupLetter}
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">6 Spiele</span>
        </div>

        {/* Teams List */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Teilnehmende Mannschaften
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {groupTeams.map((t, idx) => (
              <div key={t.id} className="flex items-center gap-2 p-1.5 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                <span className="font-mono text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                  {groupLetter}{idx + 1}
                </span>
                <span className="font-medium text-slate-900 dark:text-white truncate">{t.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 6 Matches of this Group */}
        <div className="p-4 flex-1">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
            Gruppenspiele (Samstag)
          </h4>
          <div className="space-y-2">
            {groupMatches.map(m => (
              <div
                key={m.id}
                className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-slate-50/60 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-colors text-xs flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono font-bold text-slate-500 dark:text-slate-400 text-[11px] w-7">
                    #{m.matchNumber}
                  </span>
                  <div className="flex items-center gap-1 font-mono font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{m.startTime}</span>
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-center gap-1.5 font-medium text-slate-900 dark:text-slate-100 px-1 truncate">
                  <span className="truncate">{m.team1.name}</span>
                  <span className="text-slate-400 dark:text-slate-500 text-[10px] shrink-0">vs.</span>
                  <span className="truncate">{m.team2.name}</span>
                </div>

                <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 shrink-0">
                  Blk {m.blockNumber}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Category selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-full sm:w-auto">
          <button
            onClick={() => setSelectedCat('maedchen')}
            className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 text-xs font-semibold rounded-md transition-all text-center min-h-[40px] flex items-center justify-center cursor-pointer ${
              selectedCat === 'maedchen'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            👧 wU14 (Gr. A & B)
          </button>
          <button
            onClick={() => setSelectedCat('jungs')}
            className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 text-xs font-semibold rounded-md transition-all text-center min-h-[40px] flex items-center justify-center cursor-pointer ${
              selectedCat === 'jungs'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            👦 mU14 (Gr. A & B)
          </button>
        </div>
      </div>

      {/* 2 Group Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderGroupCard(selectedCat, 'A')}
        {renderGroupCard(selectedCat, 'B')}
      </div>

      <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
        📌 <strong>Reglement:</strong> Die beiden Erstplatzierten jeder Gruppe qualifizieren sich für die Halbfinals um die Plätze 1–4 am Sonntag. Die Dritt- und Viertplatzierten spielen in der Platzierungsrunde um die Plätze 5–8.
      </div>
    </div>
  );
};
