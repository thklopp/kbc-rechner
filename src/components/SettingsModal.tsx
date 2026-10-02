import React from 'react';
import { X, RotateCcw, Clock, Coffee, Shield, Check } from 'lucide-react';
import { TournamentSettings } from '../types';
import { DEFAULT_SETTINGS } from '../utils/defaultData';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: TournamentSettings;
  onSaveSettings: (settings: TournamentSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [localSettings, setLocalSettings] = React.useState<TournamentSettings>(settings);

  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveSettings(localSettings);
    onClose();
  };

  const handleReset = () => {
    setLocalSettings(DEFAULT_SETTINGS);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white dark:bg-slate-900 rounded-t-2xl sm:rounded-xl shadow-xl max-w-xl w-full border border-slate-200 dark:border-slate-800 overflow-hidden animate-in slide-in-from-bottom sm:fade-in sm:zoom-in-95 duration-150 transition-colors">
        {/* Mobile handle indicator */}
        <div className="sm:hidden w-10 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mt-2" />

        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-3.5 sm:py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/80">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Turnier- & Zeit-Parameter anpassen
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Alle Spielzeiten und Pausen werden sofort automatisch neu berechnet.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6 max-h-[75vh] overflow-y-auto text-slate-900 dark:text-slate-100">
          {/* General tournament info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Turniername
              </label>
              <input
                type="text"
                value={localSettings.tournamentName}
                onChange={e => setLocalSettings({ ...localSettings, tournamentName: e.target.value })}
                className="w-full px-3 py-2 text-base sm:text-sm min-h-[42px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Spielfeld-Bezeichnung (Einzelplatz)
              </label>
              <input
                type="text"
                value={localSettings.pitchName}
                onChange={e => setLocalSettings({ ...localSettings, pitchName: e.target.value })}
                className="w-full px-3 py-2 text-base sm:text-sm min-h-[42px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400"
              />
            </div>
          </div>

          {/* Start times */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              Startzeiten an beiden Tagen
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Startzeit Samstag (Gruppenspiele)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={localSettings.saturdayStartTime}
                    onChange={e => setLocalSettings({ ...localSettings, saturdayStartTime: e.target.value })}
                    className="w-full px-3 py-2 text-sm font-mono border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400"
                  />
                  <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">Uhr</span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">Standard: 10:00 Uhr (24 Gruppenspiele)</span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Startzeit Sonntag (Finalrunden)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={localSettings.sundayStartTime}
                    onChange={e => setLocalSettings({ ...localSettings, sundayStartTime: e.target.value })}
                    className="w-full px-3 py-2 text-sm font-mono border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400"
                  />
                  <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">Uhr</span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">Standard: 09:00 Uhr</span>
              </div>
            </div>
          </div>

          {/* Match & Break durations */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Spiel- und Pausendauern
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Spielzeit pro Begegnung (Minuten)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={10}
                    max={45}
                    value={localSettings.matchDurationMinutes}
                    onChange={e => setLocalSettings({ ...localSettings, matchDurationMinutes: Math.max(5, parseInt(e.target.value) || 20) })}
                    className="w-full px-3 py-2 text-sm font-mono border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400"
                  />
                  <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">Minuten</span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">Standard: 20 Min. (ohne Halbzeitwechsel)</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Pause zwischen jedem Spiel (Minuten)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={localSettings.breakDurationMinutes}
                    onChange={e => setLocalSettings({ ...localSettings, breakDurationMinutes: Math.max(1, parseInt(e.target.value) || 5) })}
                    className="w-full px-3 py-2 text-sm font-mono border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400"
                  />
                  <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">Minuten</span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">Standard: 5 Min. für Platzwechsel</span>
              </div>
            </div>

            <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between">
              <span>Gesamter Taktungs-Zyklus pro Spiel:</span>
              <strong className="font-mono text-slate-900 dark:text-white font-semibold">
                {localSettings.matchDurationMinutes + localSettings.breakDurationMinutes} Minuten pro Anstoß
              </strong>
            </div>
          </div>

          {/* Optional Lunch Breaks */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
              <Coffee className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              Optionale Mittagspausen
            </h3>

            {/* Saturday Lunch Break */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 mb-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-900 dark:text-white block">Mittagspause am Samstag</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Zusätzliche Pause z.B. nach der Hälfte der Gruppenspiele</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSettings.saturdayLunchEnabled}
                    onChange={e => setLocalSettings({ ...localSettings, saturdayLunchEnabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 dark:bg-slate-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900 dark:peer-checked:bg-white"></div>
                </label>
              </div>

              {localSettings.saturdayLunchEnabled && (
                <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Nach Spiel-Nr.
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={23}
                      value={localSettings.saturdayLunchAfterMatch}
                      onChange={e => setLocalSettings({ ...localSettings, saturdayLunchAfterMatch: parseInt(e.target.value) || 12 })}
                      className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Dauer der Mittagspause
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min={10}
                        max={90}
                        value={localSettings.saturdayLunchDurationMinutes}
                        onChange={e => setLocalSettings({ ...localSettings, saturdayLunchDurationMinutes: parseInt(e.target.value) || 30 })}
                        className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                      <span className="text-xs text-slate-500 dark:text-slate-400">Min.</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sunday Lunch Break */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-900 dark:text-white block">Mittagspause am Sonntag</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Zusätzliche Pause vor den finalen Platzierungsspielen</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSettings.sundayLunchEnabled}
                    onChange={e => setLocalSettings({ ...localSettings, sundayLunchEnabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 dark:bg-slate-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900 dark:peer-checked:bg-white"></div>
                </label>
              </div>

              {localSettings.sundayLunchEnabled && (
                <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Nach Sonntag-Spiel-Nr.
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={15}
                      value={localSettings.sundayLunchAfterMatch}
                      onChange={e => setLocalSettings({ ...localSettings, sundayLunchAfterMatch: parseInt(e.target.value) || 8 })}
                      className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Dauer der Mittagspause
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min={10}
                        max={90}
                        value={localSettings.sundayLunchDurationMinutes}
                        onChange={e => setLocalSettings({ ...localSettings, sundayLunchDurationMinutes: parseInt(e.target.value) || 30 })}
                        className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                      <span className="text-xs text-slate-500 dark:text-slate-400">Min.</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sunday Modus */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Sonntag Spielsystem / Finalrunden
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                onClick={() => setLocalSettings({ ...localSettings, sundayFormat: 'full_16' })}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  localSettings.sundayFormat === 'full_16'
                    ? 'border-slate-900 dark:border-white bg-slate-900/5 dark:bg-white/10 ring-1 ring-slate-900 dark:ring-white'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Vollständige Platzierung 1–8</span>
                  {localSettings.sundayFormat === 'full_16' && <Check className="w-3.5 h-3.5 text-slate-900 dark:text-white" />}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  16 Spiele: Halbfinals (1–4 & 5–8) sowie Spiele um Platz 7, 5, 3 und Finale. Jedes der 16 Teams hat am Sonntag 2 Spiele.
                </p>
              </label>

              <label
                onClick={() => setLocalSettings({ ...localSettings, sundayFormat: 'top4_8' })}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  localSettings.sundayFormat === 'top4_8'
                    ? 'border-slate-900 dark:border-white bg-slate-900/5 dark:bg-white/10 ring-1 ring-slate-900 dark:ring-white'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Kompakt (Nur Top 4)</span>
                  {localSettings.sundayFormat === 'top4_8' && <Check className="w-3.5 h-3.5 text-slate-900 dark:text-white" />}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  8 Spiele: Nur Halbfinals 1–4, Spiel um Platz 3 und Finale. Kürzere Sonntagsspielzeit.
                </p>
              </label>
            </div>
          </div>

          {/* JSON Config Hint Banner */}
          <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-lg border border-emerald-200/80 dark:border-emerald-900/60 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2">
            <span className="font-bold">📄 JSON-Datei:</span>
            <span>
              Alle Einstellungen, Zeiten, Texte und Teams sind in <strong>tournament_config.json</strong> gespeichert und werden beim Start geladen.
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700 rounded-md transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Auf Standard zurücksetzen
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Abbrechen
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              Änderungen übernehmen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
