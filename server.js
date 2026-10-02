import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Persistent data directory (Railway Volume mount path, e.g. /data or env DATA_DIR)
const DATA_DIR = process.env.DATA_DIR || (fs.existsSync('/data') ? '/data' : path.join(__dirname, 'data'));
const CONFIG_FILE_PATH = path.join(DATA_DIR, 'tournament_config.json');
const DEFAULT_CONFIG_PATH = path.join(__dirname, 'public', 'tournament_config.json');

// Ensure persistent directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Seed persistent volume with bundled default config if not yet present
function ensureConfigFile() {
  if (!fs.existsSync(CONFIG_FILE_PATH)) {
    if (fs.existsSync(DEFAULT_CONFIG_PATH)) {
      fs.copyFileSync(DEFAULT_CONFIG_PATH, CONFIG_FILE_PATH);
      console.log(`[CONFIG] Seeded default tournament_config.json to ${CONFIG_FILE_PATH}`);
    }
  }
}
ensureConfigFile();

app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    dataDir: DATA_DIR,
    configPath: CONFIG_FILE_PATH,
    configExists: fs.existsSync(CONFIG_FILE_PATH)
  });
});

// API endpoint: Get configuration
app.get('/api/config', (req, res) => {
  try {
    ensureConfigFile();
    if (fs.existsSync(CONFIG_FILE_PATH)) {
      const data = fs.readFileSync(CONFIG_FILE_PATH, 'utf-8');
      return res.json(JSON.parse(data));
    }
    if (fs.existsSync(DEFAULT_CONFIG_PATH)) {
      const data = fs.readFileSync(DEFAULT_CONFIG_PATH, 'utf-8');
      return res.json(JSON.parse(data));
    }
    return res.status(404).json({ error: 'Config file not found' });
  } catch (error) {
    console.error('[API] Error reading config:', error);
    res.status(500).json({ error: 'Failed to read configuration' });
  }
});

// Serve tournament_config.json directly from volume if accessed via static path
app.get('/tournament_config.json', (req, res) => {
  try {
    ensureConfigFile();
    if (fs.existsSync(CONFIG_FILE_PATH)) {
      return res.sendFile(CONFIG_FILE_PATH);
    }
    return res.sendFile(DEFAULT_CONFIG_PATH);
  } catch (err) {
    res.status(500).send('Error serving config');
  }
});

// API endpoint: Save configuration to volume
app.post('/api/config', (req, res) => {
  try {
    const configData = req.body;
    if (!configData || typeof configData !== 'object') {
      return res.status(400).json({ error: 'Invalid configuration payload' });
    }
    if (!configData.tournament || !configData.categories || !configData.teams) {
      return res.status(400).json({ error: 'Configuration must include tournament, categories and teams' });
    }

    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(configData, null, 2), 'utf-8');
    console.log(`[CONFIG] Saved updated tournament_config.json to ${CONFIG_FILE_PATH}`);
    return res.json({
      success: true,
      message: 'Konfiguration erfolgreich auf persistentem Volume gespeichert.',
      savedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('[API] Error saving config:', error);
    res.status(500).json({ error: 'Failed to save configuration: ' + (error?.message || String(error)) });
  }
});

// Serve production static assets from dist/
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Fallback for SPA navigation
app.get('{*splat}', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Application dist folder not built yet. Run `npm run build` first.');
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[SERVER] KBC Rechner running on http://0.0.0.0:${PORT}`);
  console.log(`[SERVER] Config volume path: ${CONFIG_FILE_PATH}`);
});
