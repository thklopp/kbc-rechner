import React from 'react';
import { Trophy, Medal, Award, Clock, ArrowRight } from 'lucide-react';
import { ScheduledMatch, Category } from '../types';

interface SundayBracketViewProps {
  sundayMatches: ScheduledMatch[];
}

export const SundayBracketView: React.FC<SundayBracketViewProps> = ({
  sundayMatches,
}) => {
  const [selectedCat, setSelectedCat] = React.useState<Category>('maedchen');

  const catMatches = sundayMatches.filter(m => m.category === selectedCat);

  // Group by phase
  const semiPlacements = catMatches.filter(m => m.roundType === 'semi_placement');
  const semiChampionships = catMatches.filter(m => m.roundType === 'semi_championship');
  const placement7 = catMatches.find(m => m.roundLabel.includes('Platz 7'));
  const placement5 = catMatches.find(m => m.roundLabel.includes('Platz 5'));
  const placement3 = catMatches.find(m => m.roundLabel.includes('Platz 3'));
  const grandFinal = catMatches.find(m => m.roundType === 'final');

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
            <span className="sm:hidden">👧 wU14</span>
            <span className="hidden sm:inline">👧 wU14 – Finalrunden & Platzierungen</span>
          </button>
          <button
            onClick={() => setSelectedCat('jungs')}
            className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 text-xs font-semibold rounded-md transition-all text-center min-h-[40px] flex items-center justify-center cursor-pointer ${
              selectedCat === 'jungs'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="sm:hidden">👦 mU14</span>
            <span className="hidden sm:inline">👦 mU14 – Finalrunden & Platzierungen</span>
          </button>
        </div>

        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono hidden sm:inline-block">
          Sonntag · 1 Spielfeld
        </span>
      </div>

      {/* Main Bracket Layout */}
      <div className="space-y-8">
        {/* Section 1: Championship Path (Plätze 1–4) */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs transition-colors">
          <div className="px-5 py-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Endrunde um den Turniersieg (Plätze 1–4)
              </h3>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">1. & 2. Plätze aus den Gruppen A & B</span>
          </div>

          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Halbfinals */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Halbfinale (Vormittag)
              </h4>

              {semiChampionships.map(m => (
                <div key={m.id} className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{m.roundLabel}</span>
                    <span className="font-mono tabular-nums font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                      Spiel #{m.matchNumber} · {m.startTime} Uhr
                    </span>
                  </div>
                  <div className="text-xs font-medium text-slate-900 dark:text-white space-y-1">
                    <div className="p-1.5 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                      {m.team1.name}
                    </div>
                    <div className="p-1.5 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                      {m.team2.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Medaillenspiele */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Medaillenspiele (Nachmittag)
              </h4>

              {/* Spiel um Platz 3 */}
              {placement3 && (
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Medal className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      Spiel um Platz 3 (Kleines Finale)
                    </span>
                    <span className="font-mono tabular-nums font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                      Spiel #{placement3.matchNumber} · {placement3.startTime} Uhr
                    </span>
                  </div>
                  <div className="text-xs font-medium text-slate-900 dark:text-white space-y-1">
                    <div className="p-1.5 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                      {placement3.team1.name}
                    </div>
                    <div className="p-1.5 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                      {placement3.team2.name}
                    </div>
                  </div>
                </div>
              )}

              {/* Großes Finale */}
              {grandFinal && (
                <div className="p-3.5 bg-amber-50/60 dark:bg-amber-950/40 rounded-lg border border-amber-200 dark:border-amber-900/60 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      Großes Finale (Platz 1)
                    </span>
                    <span className="font-mono tabular-nums font-bold text-amber-900 dark:text-amber-300 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-800">
                      Spiel #{grandFinal.matchNumber} · {grandFinal.startTime} Uhr
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white space-y-1">
                    <div className="p-1.5 bg-white dark:bg-slate-800 rounded border border-amber-200 dark:border-amber-900/60">
                      {grandFinal.team1.name}
                    </div>
                    <div className="p-1.5 bg-white dark:bg-slate-800 rounded border border-amber-200 dark:border-amber-900/60">
                      {grandFinal.team2.name}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Placement Path (Plätze 5–8) */}
        {semiPlacements.length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs transition-colors">
            <div className="px-5 py-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Platzierungsrunde (Plätze 5–8)
                </h3>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">3. & 4. Plätze aus den Gruppen A & B</span>
            </div>

            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Halbfinale 5-8 */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Qualifikationsspiele (Vormittag)
                </h4>

                {semiPlacements.map(m => (
                  <div key={m.id} className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{m.roundLabel}</span>
                      <span className="font-mono tabular-nums font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                        Spiel #{m.matchNumber} · {m.startTime} Uhr
                      </span>
                    </div>
                    <div className="text-xs font-medium text-slate-900 dark:text-white space-y-1">
                      <div className="p-1.5 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                        {m.team1.name}
                      </div>
                      <div className="p-1.5 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                        {m.team2.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Platzierungs-Endspiele 7 und 5 */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Platzierungsspiele (Mittag)
                </h4>

                {placement7 && (
                  <div key={placement7.id} className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Spiel um Platz 7</span>
                      <span className="font-mono tabular-nums font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                        Spiel #{placement7.matchNumber} · {placement7.startTime} Uhr
                      </span>
                    </div>
                    <div className="text-xs font-medium text-slate-900 dark:text-white space-y-1">
                      <div className="p-1.5 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                        {placement7.team1.name}
                      </div>
                      <div className="p-1.5 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                        {placement7.team2.name}
                      </div>
                    </div>
                  </div>
                )}

                {placement5 && (
                  <div key={placement5.id} className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Spiel um Platz 5</span>
                      <span className="font-mono tabular-nums font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                        Spiel #{placement5.matchNumber} · {placement5.startTime} Uhr
                      </span>
                    </div>
                    <div className="text-xs font-medium text-slate-900 dark:text-white space-y-1">
                      <div className="p-1.5 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                        {placement5.team1.name}
                      </div>
                      <div className="p-1.5 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                        {placement5.team2.name}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
