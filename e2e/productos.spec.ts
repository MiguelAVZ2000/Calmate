import { test, expect } from '@playwright/test';

test.describe('Products Page', () => {
  test('should display products and allow filtering', async ({ page }) => {
    // 1. Navegar a la página de productos.
    await page.goto('/productos');

    // 2. Verificar que el encabezado principal esté visible.
    const mainHeading = page.getByRole('heading', {
      name: /Todos los Productos/i,
    });
    await expect(mainHeading).toBeVisible();

    // 3. Verificar que los filtros sean visibles.
    const sortSelect = page.getByText('Ordenar por');
    await expect(sortSelect).toBeVisible();

    const categorySelect = page.getByText('Filtrar por categoría');
    await expect(categorySelect).toBeVisible();

    // 4. Verificar que se muestre al menos un producto.
    // Esto asume que la base de datos de desarrollo tiene al menos un producto.
    const productGrid = page.locator('div.grid');
    const productCards = productGrid.locator('a[href^="/productos/"]');
    await expect(productCards.first()).toBeVisible({ timeout: 10000 }); // Esperar a que los productos carguen
    const count = await productCards.count();
    expect(count).toBeGreaterThan(0);

    // 5. Verificar el contenido de la primera tarjeta de producto.
    const firstProduct = productCards.first();
    const productName = firstProduct.getByRole('heading'); // El nombre del producto es un h3
    await expect(productName).toBeVisible();
  });
});
