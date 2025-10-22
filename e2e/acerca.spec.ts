import { test, expect } from '@playwright/test';

test.describe('About Page', () => {
  test('should display all content sections correctly', async ({ page }) => {
    // 1. Navegar a la página "Acerca de".
    await page.goto('/acerca');

    // 2. Verificar el encabezado principal de la página.
    const mainHeading = page.getByRole('heading', {
      name: /El Alma de la Patagonia en Cada Infusión/i,
    });
    await expect(mainHeading).toBeVisible();

    // 3. Verificar la sección "Nuestra Historia".
    const storyHeading = page.getByRole('heading', {
      name: 'Nuestra Historia',
      exact: true,
    });
    await expect(storyHeading).toBeVisible();

    // 4. Verificar la sección de pilares/valores.
    const valuesHeading = page.getByRole('heading', {
      name: 'Nuestros Pilares',
    });
    await expect(valuesHeading).toBeVisible();

    // 5. Verificar que una de las tarjetas de valores esté presente.
    const valueCardHeading = page.getByRole('heading', {
      name: 'Origen Sostenible',
    });
    await expect(valueCardHeading).toBeVisible();

    // 6. Verificar la sección final de llamada a la acción (CTA).
    const ctaHeading = page.getByRole('heading', {
      name: 'Únete a Nuestra Historia',
    });
    await expect(ctaHeading).toBeVisible();
  });
});
