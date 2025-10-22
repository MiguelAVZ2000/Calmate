import { test, expect } from '@playwright/test';

test('should display hero section content and navigate to products page', async ({
  page,
}) => {
  // 1. Navegar a la página de inicio.
  await page.goto('/');

  // 2. Verificar el título de la página.
  await expect(page).toHaveTitle(/Calmaté/i);

  // 3. Verificar que el encabezado principal (h1) esté visible y tenga el texto correcto.
  const mainHeading = page.getByRole('heading', {
    name: /La Excelencia del Té Redefinida/i,
  });
  await expect(mainHeading).toBeVisible();

  // 4. Verificar que el párrafo de descripción esté visible.
  const description = page.getByText(
    /Descubre nuestra colección exclusiva de tés premium/i
  );
  await expect(description).toBeVisible();

  // 5. Verificar que el botón "Explorar Colección" esté visible.
  const exploreButton = page.getByRole('button', {
    name: /Explorar Colección/i,
  });
  await expect(exploreButton).toBeVisible();

  // 6. Hacer clic en el botón "Explorar Colección".
  await exploreButton.click();

  // 7. Verificar que la URL haya cambiado a la página de productos.
  await expect(page).toHaveURL(/.*\/productos/);
});
