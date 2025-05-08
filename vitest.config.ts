import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      include: ['src/controllers/*.ts', 'src/app.ts', 'src/config/*.ts', 'src/routers/transaccionRouter.ts'],
      exclude: ['src/models/*.ts', 'src/routers/bienesRouter.ts', 'src/routers/bienesRouter.ts', 'src/routers/cazadorRouter.ts', 'src/routers/mercaderRouter.ts'],
    },
  },
});