import { test, expect } from '@playwright/test';

test('should navigate to the home page and display the main content', async ({
  page,
}) => {
  // Inicia la navegación a la raíz del sitio.
  await page.goto('/');

  // Espera a que el elemento <main> sea visible.
  const mainElement = page.locator('main');
  await expect(mainElement).toBeVisible();

  // Opcional: Verificar el título de la página.
  // La expresión regular /Calmate/i hace que la búsqueda no distinga mayúsculas de minúsculas.
  await expect(page).toHaveTitle(/Calmate/i);
});
