import React from 'react';
import { Calendar, Clock, Layers, LayoutGrid, Coffee, AlertCircle, Edit3, Check, Save, FileCode } from 'lucide-react';
import { TournamentSettings, CategoryConfig, LabelsConfig } from '../types';
import { formatDurationGerman } from '../utils/scheduler';

interface MetricsBarProps {
  stats: {
    totalMatchesSaturday: number;
    totalMatchesSunday: number;
    totalMatchesOverall: number;
    saturdayStartTime: string;
    saturdayEndTime: string;
    sundayStartTime: string;
    sundayEndTime: string;
    ceremonyStartTime: string;
    totalDurationMinutesSat: number;
    totalDurationMinutesSun: number;
  };
  settings: TournamentSettings;
  categories?: { cat1: CategoryConfig; cat2: CategoryConfig };
  labels?: LabelsConfig;
  onOpenSettings: () => void;
  onOpenExport: () => void;
  onOpenConfig?: () => void;
  sourceStatus?: string;
}

export const MetricsBar: React.FC<MetricsBarProps> = ({
  stats,
  settings,
  categories,
  labels,
  onOpenSettings,
  onOpenExport,
  onOpenConfig,
  sourceStatus,
}) => {
  const cat1Code = categories?.cat1.code || 'wU14';
  const cat2Code = categories?.cat2.code || 'mU14';

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Tournament Title & Pitch */}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                {settings.tournamentName}
              </h1>
              <span className="text-[11px] sm:text-xs font-semibold px-2 py-0.5 rounded-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                1 Spielfeld
              </span>
              <button
                onClick={onOpenConfig}
                className="inline-flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 font-mono transition-colors cursor-pointer"
                title="JSON-Konfigurationsdatei ansehen & anpassen"
              >
                <FileCode className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>tournament_config.json</span>
              </button>
              <div className="inline-flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/80 font-medium">
                <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>Gespeichert</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {settings.pitchName} · 8 {cat1Code}- & 8 {cat2Code}-Teams
            </p>
          </div>

          {/* Metrics Cards: Responsive Grid on Mobile, Flex on Desktop */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3 text-xs">
            {/* Saturday Pill */}
            <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-md">
              <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-400 shrink-0" />
              <div className="truncate">
                <span className="font-semibold text-slate-900 dark:text-slate-100">{labels?.saturdayTitle || 'Sa'}: </span>
                <span className="font-mono tabular-nums text-slate-700 dark:text-slate-300">
                  {stats.saturdayStartTime}–{stats.saturdayEndTime}
                </span>
                <span className="text-slate-400 dark:text-slate-400 ml-1 text-[10px] hidden sm:inline">(24 Sp.)</span>
              </div>
            </div>

            {/* Sunday Pill */}
            <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-md">
              <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-400 shrink-0" />
              <div className="truncate">
                <span className="font-semibold text-slate-900 dark:text-slate-100">{labels?.sundayTitle || 'So'}: </span>
                <span className="font-mono tabular-nums text-slate-700 dark:text-slate-300">
                  {stats.sundayStartTime}–{stats.sundayEndTime}
                </span>
                <span className="text-slate-400 dark:text-slate-400 ml-1 text-[10px] hidden sm:inline">(16 Sp.)</span>
              </div>
            </div>

            {/* Timing Rules Pill */}
            <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-md">
              <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-400 shrink-0" />
              <div className="truncate">
                <span className="font-semibold text-slate-900 dark:text-slate-100">Taktung: </span>
                <span className="font-mono tabular-nums text-slate-700 dark:text-slate-300">
                  {settings.matchDurationMinutes}m+{settings.breakDurationMinutes}m
                </span>
              </div>
            </div>

            {/* Edit Button */}
            <button
              onClick={onOpenSettings}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg sm:rounded-md transition-colors border border-dashed border-slate-300 dark:border-slate-700 font-medium cursor-pointer min-h-[34px]"
            >
              <Edit3 className="w-3 h-3 text-slate-500 dark:text-slate-400" />
              <span>Zeiten</span>
            </button>
          </div>
        </div>

        {/* Info banner about 2er block alternation */}
        <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-1.5">
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 shrink-0" />
            <span>
              <strong className="text-slate-700 dark:text-slate-200 font-medium">
                {labels?.blockPacingNotice || '2er-Block-Wechsel'}:
              </strong>{' '}
              {labels?.blockRotationNotice || `2× ${cat1Code} → 2× ${cat2Code} im Wechsel`} ({labels?.restTimeNotice || 'mind. 75m Pause'})
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] sm:text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              {labels?.ceremony || 'Siegerehrung'}: <strong className="font-mono tabular-nums text-slate-700 dark:text-slate-200">{stats.ceremonyStartTime} Uhr</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
