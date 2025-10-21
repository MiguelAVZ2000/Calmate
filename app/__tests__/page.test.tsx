import { render, screen } from '@testing-library/react';
import HomePage from '../page';

// Mock child components to isolate the HomePage component test
jest.mock('@/components/header', () => ({
  Header: () => <header>Mocked Header</header>,
}));
jest.mock('@/components/hero-section', () => ({
  HeroSection: () => <div>Mocked Hero Section</div>,
}));
jest.mock('@/components/product/featured-products', () => ({
  FeaturedProducts: () => <div>Mocked Featured Products</div>,
}));
jest.mock('@/components/our-story', () => ({
  OurStory: () => <div>Mocked Our Story</div>,
}));
jest.mock('@/components/footer', () => ({
  Footer: () => <footer>Mocked Footer</footer>,
}));

describe('HomePage', () => {
  it('should render all the main sections by mocking them', () => {
    render(<HomePage />);

    // Check that the main landmark is present
    expect(screen.getByRole('main')).toBeInTheDocument();

    // Check that all mocked components are rendered
    expect(screen.getByText('Mocked Header')).toBeInTheDocument();
    expect(screen.getByText('Mocked Hero Section')).toBeInTheDocument();
    expect(screen.getByText('Mocked Featured Products')).toBeInTheDocument();
    expect(screen.getByText('Mocked Our Story')).toBeInTheDocument();
    expect(screen.getByText('Mocked Footer')).toBeInTheDocument();
  });
});
