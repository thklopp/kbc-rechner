# KBC Rechner (Turnierplaner)

Interaktiver Spielplan- und Turnier-Rechner für den Kieselbronn Cup (KBC) mit automatischer Pausen- und Zeitberechnung, Schiedsrichter-Einteilung, Gruppentabellen und Exportfunktionen.

---

## 🚀 Lokal ausführen

**Voraussetzung:** Node.js (v18+)

```bash
# 1. Abhängigkeiten installieren
npm install

# 2. Entwicklungsserver starten
npm run dev
```

App im Browser öffnen: `http://localhost:3000`

---

## 🚂 Deployment auf Railway mit persistentem Volume

Die Konfiguration (`tournament_config.json`) wird auf einem persistenten Volume gespeichert, sodass alle Änderungen im laufenden Betrieb über Redepolys und Neustarts hinweg erhalten bleiben.

### 1. Repository auf GitHub verbinden
Verbinde dieses Repository (`thklopp/kbc-rechner`) in Railway als neues Projekt.

### 2. Persistentes Volume einrichten
1. Klicke im Railway Dashboard auf deinen Service.
2. Gehe auf **Volumes** -> **+ Add Volume**.
3. Setze den **Mount Path** auf:
   ```text
   /data
   ```
4. Der Server erkennt das Volume automatisch unter `/data` (oder über die Umgebungsvariable `DATA_DIR=/data`).

### 3. Umgebungsvariablen (Optional)
* `PORT`: Standardmäßig `3000` (wird von Railway automatisch gesetzt).
* `DATA_DIR`: Standardmäßig `/data` (falls Volume unter `/data` gemountet ist).

### 4. Funktionsweise
* Beim ersten Start kopiert der Server automatisch die vorkonfigurierte `tournament_config.json` auf das persistente Volume `/data/tournament_config.json`.
* Änderungen über die Web-Oberfläche ("Auf Server (Volume) speichern") werden direkt in diese Datei auf das Volume geschrieben.
* Beim erneuten Aufrufen oder Neuladen wird stets die Version aus dem persistenten Speicher geladen.
