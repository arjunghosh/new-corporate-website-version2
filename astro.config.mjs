import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  output: 'hybrid',
  adapter: vercel({
    webAnalytics: { enabled: false }
  }),
  site: 'https://flexilytics-corporate-v2.vercel.app',
  trailingSlash: 'never',
  publicDir: 'public',
});
