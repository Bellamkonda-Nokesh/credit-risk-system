import { type Express } from "express";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import fs from "fs";
import path from "path";
import { nanoid } from "nanoid";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const viteLogger = createLogger();

export async function setupVite(server: Server, app: Express) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server, path: "/vite-hmr" },
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: viteLogger,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);

  app.get(/^(?!\/api).*$/, async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(__dirname, "..", "client", "index.html");
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      
      // Update with a unique version to break browser favicon/template cache
      const version = nanoid();
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${version}"`
      );
      
      // Add a hidden script tag to the body that updates the favicon via JS
      // This is a more aggressive way to force browsers to update the icon
      const faviconFix = `
      <script>
        (function() {
          var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
          link.type = 'image/svg+xml';
          link.rel = 'shortcut icon';
          link.href = 'https://raw.githubusercontent.com/lucide-react/lucide/main/icons/shield-check.svg?v=${version}';
          document.getElementsByTagName('head')[0].appendChild(link);
        })();
      </script>
      `;
      template = template.replace('</body>', `${faviconFix}</body>`);
      
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ 
        "Content-Type": "text/html",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
        "Surrogate-Control": "no-store"
      }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export default setupVite;
