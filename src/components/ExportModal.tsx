import React, { useRef } from 'react';
import { X, Copy, Check, FileSpreadsheet, Calendar, Share2, Printer, Save, Upload, AlertCircle } from 'lucide-react';
import { ScheduledMatch, TournamentSettings, Team, TournamentProject, MatchOverride } from '../types';
import { exportToCSV, exportToShareText, generateFullSchedule } from '../utils/scheduler';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  matches: ScheduledMatch[];
  stats: ReturnType<typeof generateFullSchedule>['stats'];
  settings: TournamentSettings;
  teams: Team[];
  matchOverrides?: Record<number, MatchOverride>;
  onImportProject: (project: TournamentProject) => void;
  onPrint: () => void;
  onOpenConfig?: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  matches,
  stats,
  settings,
  teams,
  matchOverrides,
  onImportProject,
  onPrint,
  onOpenConfig,
}) => {
  const [copied, setCopied] = React.useState(false);
  const [importError, setImportError] = React.useState<string | null>(null);
  const [importSuccess, setImportSuccess] = React.useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const shareText = exportToShareText(matches, stats, settings);

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownloadCSV = () => {
    const csvContent = exportToCSV(matches, settings.tournamentName);
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${settings.tournamentName.toLowerCase().replace(/\s+/g, '_')}_spielplan.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadICS = () => {
    const icsLines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Hockey Tournament Scheduler//DE',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
    ];

    const year = new Date().getFullYear();

    for (const m of matches) {
      const cat = m.category === 'maedchen' ? 'wU14' : 'mU14';
      const summary = `Spiel #${m.matchNumber}: [${cat}] ${m.team1.name} vs. ${m.team2.name}`;
      const description = `${m.roundLabel} auf ${m.pitch}`;

      icsLines.push('BEGIN:VEVENT');
      icsLines.push(`UID:match-${m.id}-${year}@hockey-turnier.de`);
      icsLines.push(`SUMMARY:${summary}`);
      icsLines.push(`DESCRIPTION:${description}`);
      icsLines.push(`LOCATION:${m.pitch}`);
      icsLines.push('END:VEVENT');
    }

    icsLines.push('END:VCALENDAR');
    const icsContent = icsLines.join('\r\n');
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${settings.tournamentName.toLowerCase().replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    const project: TournamentProject = {
      version: 1,
      exportedAt: new Date().toISOString(),
      settings,
      teams,
      matchOverrides,
    };
    const jsonString = JSON.stringify(project, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${settings.tournamentName.toLowerCase().replace(/\s+/g, '_')}_projekt.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!parsed.settings || !Array.isArray(parsed.teams)) {
          throw new Error('Ungültiges Format: Es fehlen die Einstellungen oder Teamdaten.');
        }
        onImportProject(parsed);
        setImportSuccess(true);
        setTimeout(() => {
          setImportSuccess(false);
          onClose();
        }, 1500);
      } catch (err: any) {
        setImportError(err.message || 'Die Datei konnte nicht gelesen werden.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white dark:bg-slate-900 rounded-t-2xl sm:rounded-xl shadow-xl max-w-lg w-full border border-slate-200 dark:border-slate-800 overflow-hidden animate-in slide-in-from-bottom sm:fade-in sm:zoom-in-95 duration-150 transition-colors">
        {/* Mobile handle indicator */}
        <div className="sm:hidden w-10 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mt-2" />

        <div className="px-5 sm:px-6 py-3.5 sm:py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/80">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Speichern, Teilen & Exportieren
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Automatisch im Browser gespeichert – oder als Datei sichern.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Storage notification */}
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 rounded-lg border border-emerald-200 dark:border-emerald-800/80 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong>Automatische Speicherung aktiv:</strong> Jede Änderung an Mannschaften, Gruppen, Startzeiten und Spielminuten wird sofort im Browser-Speicher deines Geräts gesichert.
            </div>
          </div>

          {/* Section: Project Backup & Restore */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-3.5 bg-slate-50/50 dark:bg-slate-800/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Save className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Turnier-Projektdatei (.json)
                </span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Backup & Gerätewechsel</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              Speichere deinen kompletten Spielplan als Datei auf deinem Computer oder lade eine zuvor gespeicherte Turnierdatei.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={handleExportJSON}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-md transition-colors shadow-xs cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                Datei auf Computer speichern
              </button>

              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md transition-colors shadow-xs cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                Datei laden
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {importSuccess && (
              <div className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                Turnierdaten erfolgreich geladen!
              </div>
            )}

            {importError && (
              <div className="text-xs text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                {importError}
              </div>
            )}
          </div>

          {/* Action 1: Print */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center">
                <Printer className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">Druckansicht (DIN A4 / PDF)</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Für den Aushang am Hockeyplatz oder Turniertisch</span>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                onPrint();
              }}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
            >
              Öffnen
            </button>
          </div>

          {/* Action 2: CSV Export */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">Excel / CSV herunterladen</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Tabellenkalkulation mit allen Zeiten und Paarungen</span>
              </div>
            </div>
            <button
              onClick={handleDownloadCSV}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors shadow-xs cursor-pointer"
            >
              Download
            </button>
          </div>

          {/* Action 3: Calendar Export */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">Kalender-Datei (.ics)</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Für Google Kalender, Outlook und Apple Kalender</span>
              </div>
            </div>
            <button
              onClick={handleDownloadICS}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors shadow-xs cursor-pointer"
            >
              Download
            </button>
          </div>

          {/* Action 4: WhatsApp / Messenger Text */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-3 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 dark:text-white">
                Text für WhatsApp / E-Mail an Vereine
              </label>
              <button
                onClick={handleCopyText}
                className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Kopiert!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Text kopieren
                  </>
                )}
              </button>
            </div>
            <textarea
              readOnly
              value={shareText}
              rows={4}
              className="w-full p-2.5 text-[11px] font-mono border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-hidden resize-none"
            />
          </div>
        </div>

        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};
