import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      include: ['src/controllers/*.ts', 'src/app.ts', 'src/config/*.ts'],
      exclude: ['src/models/*.ts', 'src/routers/*.ts'],
    },
  },
});