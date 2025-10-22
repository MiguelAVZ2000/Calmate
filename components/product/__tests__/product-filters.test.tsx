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
    jest.clearAllMocks();
    (mockSupabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue(mockCategories),
    });
  });

  it('debe renderizar, cargar categorías y permitir la selección', async () => {
    render(<ProductFilters />);
    const user = userEvent.setup();

    // Esperar a que la carga inicial de categorías termine
    await waitFor(() => {
      expect(mockSupabase.from).toHaveBeenCalledWith('categories');
    });

    // 1. Probar el filtro de categorías
    const categoryTrigger = screen
      .getByText(/filtrar por categoría/i)
      .closest('button');
    expect(categoryTrigger).toBeInTheDocument();
    await user.click(categoryTrigger!);

    const categoryOption = await screen.findByText('Té Negro');
    await user.click(categoryOption);

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith(
        '/productos?category=te-negro'
      );
    });
  });

  it('debe permitir ordenar los productos', async () => {
    render(<ProductFilters />);
    const user = userEvent.setup();

    // Esperar a que la carga inicial de categorías termine
    await waitFor(() => {
      expect(mockSupabase.from).toHaveBeenCalledWith('categories');
    });

    // 2. Probar el filtro de ordenamiento
    const sortTrigger = screen.getByText(/ordenar por/i).closest('button');
    expect(sortTrigger).toBeInTheDocument();
    await user.click(sortTrigger!);

    const sortOption = await screen.findByText('Precio: Menor a mayor');
    await user.click(sortOption);

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/productos?sort=price-asc');
    });
  });
});
