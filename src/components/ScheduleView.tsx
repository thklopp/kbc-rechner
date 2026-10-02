import React, { useState } from 'react';
import { Search, Filter, Calendar, Coffee, AlertCircle, Clock, LayoutList, Table as TableIcon, X } from 'lucide-react';
import { ScheduledMatch, Category } from '../types';

interface ScheduleViewProps {
  matches: ScheduledMatch[];
  selectedDay: 'all' | 1 | 2;
  onSelectDay: (day: 'all' | 1 | 2) => void;
  selectedCategory: 'all' | Category;
  onSelectCategory: (cat: 'all' | Category) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  matches,
  selectedDay,
  onSelectDay,
  selectedCategory,
  onSelectCategory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  // Responsive view mode: default 'cards' on mobile, 'table' on desktop
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const filteredMatches = matches.filter(match => {
    // Day filter
    if (selectedDay !== 'all' && match.dayNumber !== selectedDay) {
      return false;
    }
    // Category filter
    if (selectedCategory !== 'all' && match.category !== selectedCategory) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchInTeams =
        match.team1.name.toLowerCase().includes(q) ||
        match.team2.name.toLowerCase().includes(q) ||
        match.roundLabel.toLowerCase().includes(q) ||
        match.matchNumber.toString().includes(q);
      if (!matchInTeams) return false;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Controls Bar: Filters & Search */}
      <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 sm:space-y-4 transition-colors shadow-xs">
        {/* Day Selector (Touch-friendly 44px min height) */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <button
            onClick={() => onSelectDay(1)}
            className={`py-2 px-2 text-xs font-semibold rounded-md transition-all text-center min-h-[40px] flex items-center justify-center cursor-pointer ${
              selectedDay === 1
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="truncate">Samstag (24)</span>
          </button>
          <button
            onClick={() => onSelectDay(2)}
            className={`py-2 px-2 text-xs font-semibold rounded-md transition-all text-center min-h-[40px] flex items-center justify-center cursor-pointer ${
              selectedDay === 2
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="truncate">Sonntag (16)</span>
          </button>
          <button
            onClick={() => onSelectDay('all')}
            className={`py-2 px-2 text-xs font-semibold rounded-md transition-all text-center min-h-[40px] flex items-center justify-center cursor-pointer ${
              selectedDay === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="truncate">Gesamt (40)</span>
          </button>
        </div>

        {/* Secondary Filters: Category, Search & View Toggle */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Category Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              onClick={() => onSelectCategory('all')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-medium rounded-md transition-all text-center min-h-[36px] flex items-center justify-center cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Alle
            </button>
            <button
              onClick={() => onSelectCategory('maedchen')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-medium rounded-md transition-all text-center min-h-[36px] flex items-center justify-center cursor-pointer ${
                selectedCategory === 'maedchen'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              👧 wU14
            </button>
            <button
              onClick={() => onSelectCategory('jungs')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-medium rounded-md transition-all text-center min-h-[36px] flex items-center justify-center cursor-pointer ${
                selectedCategory === 'jungs'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              👦 mU14
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Search box with clear button */}
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Team oder Spiel-Nr..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-8 py-2 text-xs sm:text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* View Mode Toggle: Cards vs Table */}
            <div className="flex items-center gap-0.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
                title="Kartenansicht (optimal für Smartphone)"
                aria-label="Kartenansicht"
              >
                <LayoutList className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
                title="Tabellenansicht"
                aria-label="Tabellenansicht"
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2er-Block Legend Banner */}
      <div className="px-3.5 py-2 bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-lg text-xs text-slate-600 dark:text-slate-400 flex flex-wrap items-center justify-between gap-1.5 transition-colors">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-700 dark:text-slate-300">2er-Blöcke:</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
            <span className="text-slate-700 dark:text-slate-300">2× wU14</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
            <span className="text-slate-700 dark:text-slate-300">2× mU14</span>
          </span>
        </div>
        <div className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
          {filteredMatches.length} Spiele
        </div>
      </div>

      {/* ======================================================== */}
      {/* MOBILE CARD VIEW (Optimized for 1-hand thumb phone usage) */}
      {/* ======================================================== */}
      {viewMode === 'cards' && (
        <div className="space-y-3">
          {filteredMatches.map((match, index) => {
            const isMaedchen = match.category === 'maedchen';
            const isFirstOfBlock =
              index === 0 ||
              filteredMatches[index - 1].blockNumber !== match.blockNumber ||
              filteredMatches[index - 1].dayNumber !== match.dayNumber;

            return (
              <React.Fragment key={match.id}>
                {/* Block Divider on Mobile */}
                {isFirstOfBlock && (
                  <div className="pt-2 pb-1 flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          isMaedchen ? 'bg-rose-500' : 'bg-blue-600'
                        }`}
                      />
                      <span>
                        {match.dayName} · Block {match.blockNumber}: {isMaedchen ? 'wU14' : 'mU14'} (2 Spiele)
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                      {match.pitch}
                    </span>
                  </div>
                )}

                {/* Match Card */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 shadow-xs transition-colors space-y-2.5">
                  {/* Top Bar of Card */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-6 rounded-md bg-slate-100 dark:bg-slate-800 font-mono font-bold text-slate-900 dark:text-white flex items-center justify-center text-xs">
                        #{match.matchNumber}
                      </span>
                      <div className="flex items-center gap-1 font-mono font-bold text-slate-900 dark:text-white text-xs tabular-nums">
                        <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                        <span>{match.startTime} – {match.endTime}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                          isMaedchen
                            ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60'
                            : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60'
                        }`}
                      >
                        {isMaedchen ? 'wU14' : 'mU14'}
                      </span>
                      <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                        {match.roundLabel}
                      </span>
                    </div>
                  </div>

                  {/* Teams Matchup Box */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-100 dark:border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-sm font-bold truncate ${
                          match.team1.isPlaceholder
                            ? 'text-slate-500 dark:text-slate-400 italic'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {match.team1.name}
                      </span>
                    </div>

                    <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 pl-1">
                      gegen
                    </div>

                    <div className="flex items-center justify-between">
                      <span
                        className={`text-sm font-bold truncate ${
                          match.team2.isPlaceholder
                            ? 'text-slate-500 dark:text-slate-400 italic'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {match.team2.name}
                      </span>
                    </div>
                  </div>

                  {/* Card Footer: Pitch & Break */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                    <span>{match.pitch}</span>
                    <div>
                      {match.isLunchBreakAfter ? (
                        <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400 font-semibold bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-900/60">
                          <Coffee className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                          {match.breakAfterMinutes}m Pause (inkl. Mittag)
                        </span>
                      ) : (
                        <span>{match.breakAfterMinutes} Min. Folgepause</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Lunch Break Notice Banner */}
                {match.isLunchBreakAfter && (
                  <div className="p-3 bg-amber-50/80 dark:bg-amber-950/50 rounded-xl border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-center gap-2">
                    <Coffee className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
                    <span>
                      <strong>Mittagspause ({match.lunchDurationMinutes} Min.):</strong> Nächstes Spiel beginnt um{' '}
                      <span className="font-mono tabular-nums font-bold">
                        {matches[match.matchNumber]?.startTime || 'folgt'} Uhr
                      </span>
                    </span>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* ======================================================== */}
      {/* DESKTOP / TABLE VIEW (Clean tabular display) */}
      {/* ======================================================== */}
      {viewMode === 'table' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-3 px-3 text-center w-14">Spiel</th>
                  <th className="py-3 px-4 w-32">Uhrzeit</th>
                  <th className="py-3 px-3 w-28">Kategorie</th>
                  <th className="py-3 px-4 w-36">Runde / Gruppe</th>
                  <th className="py-3 px-4">Begegnung (Team 1 vs. Team 2)</th>
                  <th className="py-3 px-3 text-right w-28">Folgepause</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {filteredMatches.map((match, index) => {
                  const isMaedchen = match.category === 'maedchen';
                  const isFirstOfBlock =
                    index === 0 ||
                    filteredMatches[index - 1].blockNumber !== match.blockNumber ||
                    filteredMatches[index - 1].dayNumber !== match.dayNumber;

                  return (
                    <React.Fragment key={match.id}>
                      {/* Block separator header if 2er-block changes */}
                      {isFirstOfBlock && (
                        <tr className="bg-slate-100/60 dark:bg-slate-800/60 border-t border-b border-slate-200/60 dark:border-slate-700/60 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                          <td colSpan={6} className="py-1.5 px-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`w-2 h-2 rounded-full ${
                                    isMaedchen ? 'bg-rose-500' : 'bg-blue-600'
                                  }`}
                                />
                                <span>
                                  {match.dayName} · Block {match.blockNumber}: {isMaedchen ? 'wU14' : 'mU14'} (2 Spiele)
                                </span>
                              </div>
                              <span className="font-mono text-slate-400 dark:text-slate-500 font-normal text-[10px]">
                                {match.pitch}
                              </span>
                            </div>
                          </td>
                        </tr>
                      )}

                      <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                        {/* Match Number */}
                        <td className="py-3 px-3 text-center font-mono font-bold text-slate-900 dark:text-white">
                          #{match.matchNumber}
                        </td>

                        {/* Time */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 font-mono text-slate-900 dark:text-white font-semibold text-xs tabular-nums">
                            <span>{match.startTime}</span>
                            <span className="text-slate-400 dark:text-slate-500 font-normal">–</span>
                            <span>{match.endTime}</span>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 font-medium text-xs ${
                              isMaedchen ? 'text-rose-700 dark:text-rose-400' : 'text-blue-700 dark:text-blue-400'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isMaedchen ? 'bg-rose-500' : 'bg-blue-600'
                              }`}
                            />
                            {isMaedchen ? 'wU14' : 'mU14'}
                          </span>
                        </td>

                        {/* Round / Group */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="text-slate-700 dark:text-slate-300 font-medium">
                            {match.roundLabel}
                          </span>
                        </td>

                        {/* Matchup */}
                        <td className="py-3 px-4">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <span
                              className={`font-semibold ${
                                match.team1.isPlaceholder
                                  ? 'text-slate-500 dark:text-slate-400 italic'
                                  : 'text-slate-900 dark:text-white'
                              }`}
                            >
                              {match.team1.name}
                            </span>
                            <span className="text-slate-400 dark:text-slate-500 text-xs font-normal">vs.</span>
                            <span
                              className={`font-semibold ${
                                match.team2.isPlaceholder
                                  ? 'text-slate-500 dark:text-slate-400 italic'
                                  : 'text-slate-900 dark:text-white'
                              }`}
                            >
                              {match.team2.name}
                            </span>
                          </div>
                        </td>

                        {/* Break after match */}
                        <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-500 dark:text-slate-400 whitespace-nowrap">
                          {match.isLunchBreakAfter ? (
                            <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400 font-semibold bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-900/60">
                              <Coffee className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                              {match.breakAfterMinutes}m Pause
                            </span>
                          ) : (
                            <span>{match.breakAfterMinutes} Min.</span>
                          )}
                        </td>
                      </tr>

                      {/* Lunch Break Banner Row if configured */}
                      {match.isLunchBreakAfter && (
                        <tr className="bg-amber-50/70 dark:bg-amber-950/40 border-t border-b border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200">
                          <td colSpan={6} className="py-2 px-4 text-center">
                            <div className="inline-flex items-center gap-2 font-medium">
                              <Coffee className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                              <span>
                                <strong>Mittagspause ({match.lunchDurationMinutes} Min.):</strong> Nächstes Spiel beginnt um{' '}
                                <span className="font-mono tabular-nums font-bold">
                                  {matches[match.matchNumber]?.startTime || 'folgt'} Uhr
                                </span>
                              </span>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredMatches.length === 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 py-12 text-center text-slate-500 dark:text-slate-400 text-sm">
          Keine Spiele gefunden für die ausgewählten Filter.
        </div>
      )}
    </div>
  );
};
