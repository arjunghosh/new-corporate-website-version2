import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/lib/**', 'src/pages/api/**'],
      exclude: ['src/lib/db.ts'], // requires live DB — integration only
    },
  },
  define: {
    'import.meta.env.RESEND_API_KEY': JSON.stringify('test_resend_key'),
    'import.meta.env.RESEND_SENDER_EMAIL': JSON.stringify('noreply@test.flexilytics.ai'),
    'import.meta.env.LEAD_NOTIFY_EMAIL': JSON.stringify('admin@test.flexilytics.ai'),
    'import.meta.env.ADMIN_CC_EMAILS': JSON.stringify('cc@test.flexilytics.ai'),
    'import.meta.env.BEEHIIV_API_KEY': JSON.stringify(''),
    'import.meta.env.BEEHIIV_PUBLICATION_ID': JSON.stringify('test-pub-id'),
    'import.meta.env.IP_HASH_SALT': JSON.stringify('test-salt'),
  },
});
