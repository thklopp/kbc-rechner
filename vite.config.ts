import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, Plugin } from 'vite';

function configApiPlugin(): Plugin {
  return {
    name: 'config-api-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/api/config') {
          const dataDir = path.resolve(__dirname, 'data');
          const dataConfigPath = path.join(dataDir, 'tournament_config.json');
          const publicConfigPath = path.resolve(__dirname, 'public', 'tournament_config.json');

          if (req.method === 'GET') {
            try {
              const targetPath = fs.existsSync(dataConfigPath) ? dataConfigPath : publicConfigPath;
              if (fs.existsSync(targetPath)) {
                const content = fs.readFileSync(targetPath, 'utf-8');
                res.setHeader('Content-Type', 'application/json');
                res.end(content);
                return;
              }
              res.statusCode = 404;
              res.end(JSON.stringify({ error: 'Config not found' }));
              return;
            } catch (err: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
              return;
            }
          }

          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
              body += chunk;
            });
            req.on('end', () => {
              try {
                const parsed = JSON.parse(body);
                if (!fs.existsSync(dataDir)) {
                  fs.mkdirSync(dataDir, { recursive: true });
                }
                fs.writeFileSync(dataConfigPath, JSON.stringify(parsed, null, 2), 'utf-8');
                if (fs.existsSync(publicConfigPath)) {
                  fs.writeFileSync(publicConfigPath, JSON.stringify(parsed, null, 2), 'utf-8');
                }
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, message: 'Saved successfully in dev' }));
              } catch (err: any) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: err.message }));
              }
            });
            return;
          }
        }
        next();
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), configApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
  };
});
