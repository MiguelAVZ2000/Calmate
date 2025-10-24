import { defineConfig, devices } from '@playwright/test';

// La URL base para las pruebas, asumiendo que el servidor de desarrollo corre en el puerto 3000.
const baseURL = 'http://localhost:3000';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e', // Directorio donde estarán las pruebas E2E.
  globalSetup: require.resolve('./e2e/global-setup.ts'), // Polyfill para TransformStream
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: baseURL,
    trace: 'on-first-retry',
  },

  // Configura los proyectos para los navegadores principales.
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Descomenta las siguientes líneas si quieres probar en otros navegadores.
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  // El paso más importante: Iniciar el servidor de desarrollo antes de las pruebas.
  webServer: {
    command: 'npm run dev',
    url: baseURL,
    timeout: 120 * 1000, // 2 minutos de tiempo de espera para que el servidor inicie.
    reuseExistingServer: !process.env.CI,
  },
});
