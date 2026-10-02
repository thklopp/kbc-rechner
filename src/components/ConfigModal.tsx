import React, { useState, useEffect, useRef } from 'react';
import { X, Download, Upload, Check, AlertCircle, FileCode, Copy, RefreshCw, Save } from 'lucide-react';
import { TournamentConfigFile } from '../types';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentConfig: TournamentConfigFile;
  onApplyConfig: (newConfig: TournamentConfigFile) => void;
  onReloadFromFile: () => Promise<boolean>;
  onSaveToServer?: (newConfig: TournamentConfigFile) => Promise<{ success: boolean; message: string }>;
  sourceStatus: string;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({
  isOpen,
  onClose,
  currentConfig,
  onApplyConfig,
  onReloadFromFile,
  onSaveToServer,
  sourceStatus,
}) => {
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isReloading, setIsReloading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setJsonText(JSON.stringify(currentConfig, null, 2));
      setError(null);
      setSuccess(null);
    }
  }, [isOpen, currentConfig]);

  if (!isOpen) return null;

  const handleApply = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (!parsed.tournament || !parsed.categories || !parsed.teams) {
        throw new Error('Die JSON-Datei muss "tournament", "categories" und "teams" enthalten.');
      }
      onApplyConfig(parsed);
      setSuccess('Konfiguration lokal übernommen!');
      setTimeout(() => {
        setSuccess(null);
        onClose();
      }, 1200);
    } catch (err: any) {
      setError(`JSON-Syntaxfehler: ${err.message}`);
    }
  };

  const handleSaveToVolume = async () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (!parsed.tournament || !parsed.categories || !parsed.teams) {
        throw new Error('Die JSON-Datei muss "tournament", "categories" und "teams" enthalten.');
      }
      setIsSaving(true);
      setError(null);

      if (onSaveToServer) {
        const res = await onSaveToServer(parsed);
        if (res.success) {
          setSuccess(res.message || 'Auf persistentem Server-Volume gespeichert!');
          setTimeout(() => {
            setSuccess(null);
            onClose();
          }, 1500);
        } else {
          setError(res.message || 'Fehler beim Speichern auf dem Server.');
        }
      } else {
        onApplyConfig(parsed);
        setSuccess('Konfiguration übernommen.');
      }
    } catch (err: any) {
      setError(err.message || 'Fehler beim Verarbeiten.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonText], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'tournament_config.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonText);
      setSuccess('JSON in Zwischenablage kopiert!');
      setTimeout(() => setSuccess(null), 2000);
    } catch {
      setError('Kopieren fehlgeschlagen.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (!parsed.tournament || !parsed.categories || !parsed.teams) {
          throw new Error('Ungültige Konfigurationsdatei.');
        }
        setJsonText(JSON.stringify(parsed, null, 2));
        setSuccess(`Datei "${file.name}" geladen! Klicke auf "Auf Server speichern" oder "Übernehmen".`);
      } catch (err: any) {
        setError(err.message || 'Konnte Datei nicht verarbeiten.');
      }
    };
    reader.readAsText(file);
  };

  const handleReload = async () => {
    setIsReloading(true);
    setError(null);
    const ok = await onReloadFromFile();
    setIsReloading(false);
    if (ok) {
      setSuccess('Erfolgreich vom persistenten Server-Volume neu geladen!');
      setTimeout(() => setSuccess(null), 2500);
    } else {
      setError('Konnte Konfiguration vom Server nicht neu laden.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150 transition-colors">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  tournament_config.json
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-300 dark:border-emerald-800">
                  {sourceStatus}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Konfiguration & Teams auf dem persistenten Railway Volume
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-5 py-2.5 bg-slate-100/70 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={handleReload}
              disabled={isReloading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
              title="Neu vom Server Volume laden"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-500 dark:text-slate-400 ${isReloading ? 'animate-spin' : ''}`} />
              <span>Vom Volume laden</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-xs cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Datei importieren</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-xs cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Kopieren</span>
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Herunterladen</span>
            </button>
          </div>
        </div>

        {/* Status Banners */}
        {error && (
          <div className="mx-5 mt-3 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mx-5 mt-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{success}</span>
          </div>
        )}

        {/* Editor Area */}
        <div className="p-5 flex-1 overflow-hidden flex flex-col">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center justify-between">
            <span>JSON-Inhalt bearbeiten:</span>
            <span className="font-mono text-slate-400">tournament_config.json</span>
          </label>
          <textarea
            value={jsonText}
            onChange={(e) => {
              setJsonText(e.target.value);
              setError(null);
            }}
            spellCheck={false}
            className="flex-1 w-full p-3 font-mono text-xs leading-relaxed bg-slate-950 text-emerald-300 rounded-xl border border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 resize-none min-h-[340px]"
          />
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Wird auf dem persistenten Volume gespeichert und übersteht Neustarts/Redeploys.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Schließen
            </button>
            <button
              onClick={handleApply}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              Nur lokal anwenden
            </button>
            <button
              onClick={handleSaveToVolume}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-lg transition-colors shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Speichert...' : 'Auf Server (Volume) speichern'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
