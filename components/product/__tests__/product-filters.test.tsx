import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductFilters } from '@/components/product/product-filters';
import '@testing-library/jest-dom';

// Mock de next/navigation
const mockRouter = {
  push: jest.fn(),
};
const mockUseSearchParams = jest.fn(() => new URLSearchParams());

jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: () => '/productos',
  useSearchParams: () => mockUseSearchParams(),
}));

// Mock del cliente de Supabase
const mockSupabase = {
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  order: jest.fn(),
};

jest.mock('@/lib/supabase/client', () => ({
  createClient: () => mockSupabase,
}));

const mockCategories = {
  data: [
    { id: 1, name: 'Té Negro', slug: 'te-negro' },
    { id: 2, name: 'Té Verde', slug: 'te-verde' },
  ],
  error: null,
};

describe('ProductFilters', () => {
  beforeEach(() => {
    // Limpiar mocks antes de cada test
    jest.clearAllMocks();
    // Configurar mock de supabase para devolver categorías por defecto
    (mockSupabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue(mockCategories),
    });
  });

  it('debe renderizar los filtros y cargar las categorías correctamente', async () => {
    render(<ProductFilters />);

    // Esperar a que la llamada a la API se complete
    await waitFor(() => {
      expect(mockSupabase.from).toHaveBeenCalledWith('categories');
    });

    // Verificar que los placeholders de los filtros están presentes
    expect(screen.getByText('Filtrar por categoría')).toBeInTheDocument();
    expect(screen.getByText('Ordenar por')).toBeInTheDocument();

    // Abrir el desplegable de categorías
    const categoryTrigger = screen.getByRole('button', {
      name: /filtrar por categoría/i,
    });
    await userEvent.click(categoryTrigger);

    // Verificar que las categorías se muestran
    expect(await screen.findByText('Té Negro')).toBeVisible();
    expect(await screen.findByText('Té Verde')).toBeVisible();
  });

  it('debe navegar a la URL correcta al seleccionar una categoría', async () => {
    render(<ProductFilters />);

    // Abrir el desplegable de categorías
    const categoryTrigger = screen.getByRole('button', {
      name: /filtrar por categoría/i,
    });
    await userEvent.click(categoryTrigger);

    // Seleccionar una categoría
    const categoryOption = await screen.findByText('Té Negro');
    await userEvent.click(categoryOption);

    // Verificar que se navega a la URL correcta
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith(
        '/productos?category=te-negro'
      );
    });
  });

  it('debe navegar a la URL correcta al seleccionar una opción de ordenamiento', async () => {
    render(<ProductFilters />);

    // Abrir el desplegable de ordenamiento
    const sortTrigger = screen.getByRole('button', { name: /ordenar por/i });
    await userEvent.click(sortTrigger);

    // Seleccionar una opción de ordenamiento
    const priceAscOption = await screen.findByText('Precio: Menor a mayor');
    await userEvent.click(priceAscOption);

    // Verificar que se navega a la URL correcta
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/productos?sort=price-asc');
    });
  });
});
