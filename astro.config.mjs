import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  output: 'hybrid',
  adapter: vercel({
    webAnalytics: { enabled: false },
    nodeVersion: '20'
  }),
  site: 'https://www.flexilytics.ai',
  trailingSlash: 'never',
  publicDir: 'public',
});
