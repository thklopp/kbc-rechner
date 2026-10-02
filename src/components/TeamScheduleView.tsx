import React from 'react';
import { UserCheck, Clock, Calendar, Shield, Coffee, Info } from 'lucide-react';
import { Team, ScheduledMatch, Category } from '../types';
import { getTeamSchedule, formatDurationGerman } from '../utils/scheduler';

interface TeamScheduleViewProps {
  teams: Team[];
  saturdayMatches: ScheduledMatch[];
  sundayMatches: ScheduledMatch[];
}

export const TeamScheduleView: React.FC<TeamScheduleViewProps> = ({
  teams,
  saturdayMatches,
  sundayMatches,
}) => {
  const [selectedTeamId, setSelectedTeamId] = React.useState<string>(teams[0]?.id || '');
  const [activeCategoryFilter, setActiveCategoryFilter] = React.useState<Category>('maedchen');

  const categoryTeams = teams.filter(t => t.category === activeCategoryFilter);

  React.useEffect(() => {
    if (!categoryTeams.some(t => t.id === selectedTeamId) && categoryTeams.length > 0) {
      setSelectedTeamId(categoryTeams[0].id);
    }
  }, [activeCategoryFilter, categoryTeams, selectedTeamId]);

  const selectedTeam = teams.find(t => t.id === selectedTeamId) || teams[0];
  const teamSaturdayMatches = selectedTeam ? getTeamSchedule(selectedTeam.id, saturdayMatches) : [];

  return (
    <div className="space-y-6">
      {/* Selector Card */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Team-Fahrplan & Pausenzeiten
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Wähle ein Team aus, um die genauen Anstoßzeiten, Spielpausen und den Ablaufplan zu sehen.
            </p>
          </div>

          {/* Category Toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg max-w-fit">
            <button
              onClick={() => setActiveCategoryFilter('maedchen')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeCategoryFilter === 'maedchen'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              wU14
            </button>
            <button
              onClick={() => setActiveCategoryFilter('jungs')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeCategoryFilter === 'jungs'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              mU14
            </button>
          </div>
        </div>

        {/* Team Chips for Selection */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          {categoryTeams.map(team => {
            const isSelected = team.id === selectedTeamId;
            return (
              <button
                key={team.id}
                onClick={() => setSelectedTeamId(team.id)}
                className={`p-2.5 rounded-lg text-left transition-all border text-xs cursor-pointer min-h-[44px] flex items-center justify-between ${
                  isSelected
                    ? 'border-slate-900 bg-slate-900 text-white dark:bg-white dark:text-slate-900 dark:border-white shadow-xs font-semibold'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="truncate">{team.name}</span>
                  <span
                    className={`font-mono text-[10px] ml-1 shrink-0 px-1 rounded ${
                      isSelected
                        ? 'bg-slate-800 dark:bg-slate-200 text-slate-300 dark:text-slate-800'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Gr. {team.group}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedTeam && (
        <div className="space-y-6">
          {/* Header of selected team */}
          <div className="bg-slate-900 dark:bg-slate-800 text-white p-5 rounded-xl border border-transparent dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <span>{selectedTeam.category === 'maedchen' ? 'wU14' : 'mU14'}</span>
                <span>·</span>
                <span>Gruppe {selectedTeam.group}</span>
                <span>·</span>
                <span>Setzplatz {selectedTeam.seed}</span>
              </div>
              <h3 className="text-xl font-bold tracking-tight">
                {selectedTeam.name}
              </h3>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="bg-slate-800/80 dark:bg-slate-900/80 px-3 py-2 rounded-lg border border-slate-700">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Erster Anstoß Samstag</span>
                <span className="font-mono tabular-nums text-white font-bold text-sm">
                  {teamSaturdayMatches[0]?.startTime || '–'} Uhr
                </span>
              </div>
              <div className="bg-slate-800/80 dark:bg-slate-900/80 px-3 py-2 rounded-lg border border-slate-700">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Samstag-Spiele</span>
                <span className="font-mono text-white font-bold text-sm">
                  3 Gruppenspiele
                </span>
              </div>
            </div>
          </div>

          {/* Saturday Itinerary Timeline */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs transition-colors">
            <div className="px-5 py-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Samstag – Gruppenspiele ({teamSaturdayMatches.length} Spiele)
                </h4>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                1 Spielfeld · Einzelplatz-Modus
              </span>
            </div>

            <div className="p-5 space-y-6">
              {teamSaturdayMatches.map((item, idx) => (
                <div key={item.matchNumber} className="relative pl-6 pb-6 last:pb-0">
                  {/* Vertical connector line */}
                  {idx < teamSaturdayMatches.length - 1 && (
                    <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />
                  )}

                  {/* Dot */}
                  <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 font-mono text-xs font-bold flex items-center justify-center shadow-xs">
                    {idx + 1}
                  </div>

                  {/* Match Card */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                          Spiel #{item.matchNumber}
                        </span>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {item.roundLabel}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                        <Clock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                        <span>{item.startTime} – {item.endTime} Uhr</span>
                      </div>
                    </div>

                    <div className="text-sm font-semibold text-slate-900 dark:text-white">
                      Gegner: <span className="underline decoration-slate-300 dark:decoration-slate-600 underline-offset-4">{item.opponentName}</span>
                    </div>

                    {/* Rest time to next game banner */}
                    {item.restTimeAfterMinutes !== undefined && (
                      <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300">
                        <Coffee className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>
                          <strong>{formatDurationGerman(item.restTimeAfterMinutes)}</strong> Erholungspause bis zum nächsten Spiel
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sunday Outlook */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs transition-colors">
            <div className="px-5 py-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Sonntag – Final- & Platzierungsspiele
                </h4>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                2 K.O.-/Platzierungsspiele garantiert
              </span>
            </div>

            <div className="p-5 text-xs text-slate-600 dark:text-slate-300 space-y-3">
              <p>
                Am Sonntag spielen alle 8 Teams je nach Platzierung in der Vorrunde weiter:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-900 dark:text-white block mb-1">
                    Bei Platz 1 oder 2 in Gruppe {selectedTeam.group}:
                  </span>
                  <p className="text-slate-600 dark:text-slate-400">
                    Einzug ins <strong>Halbfinale</strong> um die Plätze 1–4. Startzeit zwischen{' '}
                    <span className="font-mono font-semibold text-slate-900 dark:text-white">10:40 Uhr</span> und{' '}
                    <span className="font-mono font-semibold text-slate-900 dark:text-white">12:20 Uhr</span>. Danach Spiel um Platz 3 oder das große Finale.
                  </p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-900 dark:text-white block mb-1">
                    Bei Platz 3 oder 4 in Gruppe {selectedTeam.group}:
                  </span>
                  <p className="text-slate-600 dark:text-slate-400">
                    Halbfinale in der Trostrunde um die Plätze 5–8. Startzeit zwischen{' '}
                    <span className="font-mono font-semibold text-slate-900 dark:text-white">09:00 Uhr</span> und{' '}
                    <span className="font-mono font-semibold text-slate-900 dark:text-white">10:40 Uhr</span>. Danach Platzierungsspiel um Platz 5 oder 7.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
