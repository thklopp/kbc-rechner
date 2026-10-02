import React from 'react';
import { Printer, ArrowLeft } from 'lucide-react';
import { ScheduledMatch, Team, TournamentSettings } from '../types';
import { generateFullSchedule } from '../utils/scheduler';

interface PrintScheduleViewProps {
  teams: Team[];
  matches: ScheduledMatch[];
  settings: TournamentSettings;
  stats: ReturnType<typeof generateFullSchedule>['stats'];
  onClose: () => void;
}

export const PrintScheduleView: React.FC<PrintScheduleViewProps> = ({
  teams,
  matches,
  settings,
  stats,
  onClose,
}) => {
  const satMatches = matches.filter(m => m.dayNumber === 1);
  const sunMatches = matches.filter(m => m.dayNumber === 2);

  const getTeamsByCatAndGroup = (cat: 'maedchen' | 'jungs', grp: 'A' | 'B') => {
    return teams
      .filter(t => t.category === cat && t.group === grp)
      .sort((a, b) => a.seed - b.seed);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 p-4 sm:p-8">
      {/* Top Action Bar (Hidden in Print) */}
      <div className="no-print max-w-5xl mx-auto mb-6 flex items-center justify-between bg-slate-100 p-4 rounded-xl border border-slate-200">
        <button
          onClick={onClose}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zur App
        </button>

        <div className="text-xs text-slate-600 font-medium">
          Druckansicht für Aushang und Sprecherkabine
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
        >
          <Printer className="w-4 h-4" />
          Jetzt drucken / als PDF speichern
        </button>
      </div>

      {/* Printable Sheet */}
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">
              Offizieller Spielplan & Zeiteinteilung
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              {settings.tournamentName}
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Spielfeld: <strong>{settings.pitchName}</strong> (Einzelplatz) · Taktung: {settings.matchDurationMinutes} Min. Spielzeit, {settings.breakDurationMinutes} Min. Pause
            </p>
          </div>
          <div className="text-right text-xs font-mono">
            <div>Samstag: {stats.saturdayStartTime} – {stats.saturdayEndTime} Uhr</div>
            <div>Sonntag: {stats.sundayStartTime} – {stats.sundayEndTime} Uhr</div>
            <div className="font-bold text-slate-900">Siegerehrung: ca. {stats.ceremonyStartTime} Uhr</div>
          </div>
        </div>

        {/* Groups Summary Table */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border border-slate-200 rounded-lg p-3 bg-slate-50">
          <div>
            <span className="font-bold block text-slate-900 mb-1">wU14 – Gruppe A</span>
            <ul className="space-y-0.5 text-slate-600">
              {getTeamsByCatAndGroup('maedchen', 'A').map((t, i) => (
                <li key={t.id} className="truncate">A{i + 1}: {t.name}</li>
              ))}
            </ul>
          </div>
          <div>
            <span className="font-bold block text-slate-900 mb-1">wU14 – Gruppe B</span>
            <ul className="space-y-0.5 text-slate-600">
              {getTeamsByCatAndGroup('maedchen', 'B').map((t, i) => (
                <li key={t.id} className="truncate">B{i + 1}: {t.name}</li>
              ))}
            </ul>
          </div>
          <div>
            <span className="font-bold block text-slate-900 mb-1">mU14 – Gruppe A</span>
            <ul className="space-y-0.5 text-slate-600">
              {getTeamsByCatAndGroup('jungs', 'A').map((t, i) => (
                <li key={t.id} className="truncate">A{i + 1}: {t.name}</li>
              ))}
            </ul>
          </div>
          <div>
            <span className="font-bold block text-slate-900 mb-1">mU14 – Gruppe B</span>
            <ul className="space-y-0.5 text-slate-600">
              {getTeamsByCatAndGroup('jungs', 'B').map((t, i) => (
                <li key={t.id} className="truncate">B{i + 1}: {t.name}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Saturday Table */}
        <div className="space-y-2">
          <div className="flex items-center justify-between border-b border-slate-300 pb-1">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Samstag: Gruppenspiele ({satMatches.length} Spiele · 2er-Blöcke wU14/mU14)
            </h2>
            <span className="text-xs font-mono text-slate-500">
              Start: {stats.saturdayStartTime} Uhr
            </span>
          </div>

          <table className="w-full text-left text-xs border border-slate-300">
            <thead className="bg-slate-100 border-b border-slate-300 text-[10px] font-bold uppercase text-slate-600">
              <tr>
                <th className="py-1.5 px-2 text-center w-10">Nr</th>
                <th className="py-1.5 px-2 w-24">Uhrzeit</th>
                <th className="py-1.5 px-2 w-20">Kategorie</th>
                <th className="py-1.5 px-2 w-24">Gruppe</th>
                <th className="py-1.5 px-2">Begegnung</th>
                <th className="py-1.5 px-2 text-right w-16">Pause</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {satMatches.map(m => (
                <tr key={m.id} className={m.blockNumber % 2 === 1 ? 'bg-white' : 'bg-slate-50/50'}>
                  <td className="py-1 px-2 text-center font-mono font-bold">{m.matchNumber}</td>
                  <td className="py-1 px-2 font-mono whitespace-nowrap">{m.startTime} - {m.endTime}</td>
                  <td className="py-1 px-2 font-semibold">
                    {m.category === 'maedchen' ? 'wU14' : 'mU14'}
                  </td>
                  <td className="py-1 px-2">{m.roundLabel}</td>
                  <td className="py-1 px-2 font-medium">
                    {m.team1.name} <span className="text-slate-400 font-normal">vs.</span> {m.team2.name}
                  </td>
                  <td className="py-1 px-2 text-right font-mono text-[10px]">
                    {m.breakAfterMinutes}m
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Page Break for printing if needed */}
        <div className="print-break-inside-avoid space-y-2 pt-4">
          <div className="flex items-center justify-between border-b border-slate-300 pb-1">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Sonntag: Finalrunden & Platzierungsspiele ({sunMatches.length} Spiele)
            </h2>
            <span className="text-xs font-mono text-slate-500">
              Start: {stats.sundayStartTime} Uhr · Siegerehrung: {stats.ceremonyStartTime} Uhr
            </span>
          </div>

          <table className="w-full text-left text-xs border border-slate-300">
            <thead className="bg-slate-100 border-b border-slate-300 text-[10px] font-bold uppercase text-slate-600">
              <tr>
                <th className="py-1.5 px-2 text-center w-10">Nr</th>
                <th className="py-1.5 px-2 w-24">Uhrzeit</th>
                <th className="py-1.5 px-2 w-20">Kategorie</th>
                <th className="py-1.5 px-2 w-48">Runde</th>
                <th className="py-1.5 px-2">Ansetzung</th>
                <th className="py-1.5 px-2 text-right w-16">Pause</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {sunMatches.map(m => (
                <tr key={m.id} className={m.roundType === 'final' ? 'bg-amber-50/70 font-semibold' : ''}>
                  <td className="py-1 px-2 text-center font-mono font-bold">{m.matchNumber}</td>
                  <td className="py-1 px-2 font-mono whitespace-nowrap">{m.startTime} - {m.endTime}</td>
                  <td className="py-1 px-2 font-semibold">
                    {m.category === 'maedchen' ? 'wU14' : 'mU14'}
                  </td>
                  <td className="py-1 px-2">{m.roundLabel}</td>
                  <td className="py-1 px-2">
                    {m.team1.name} <span className="text-slate-400 font-normal">vs.</span> {m.team2.name}
                  </td>
                  <td className="py-1 px-2 text-right font-mono text-[10px]">
                    {m.breakAfterMinutes}m
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Note */}
        <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-500 flex justify-between">
          <span>Erstellt mit dem Hockey-Turnierrechner · Einzelplatz-Modus</span>
          <span>Stand: 2026</span>
        </div>
      </div>
    </div>
  );
};
