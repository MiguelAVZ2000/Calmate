import { Header } from '@/components/layout/header';
import { HeroSection } from '@/components/marketing/hero-section';
import { FeaturedProducts } from '@/components/product/featured-products';
import { OurStory } from '@/components/marketing/our-story';
import { Footer } from '@/components/layout/footer';

export default function HomePage() {
  return (
    <div className='min-h-screen bg-background'>
      <Header />
      <main>
        <HeroSection />
        <div className='section-alt'>
          <FeaturedProducts />
        </div>
        <OurStory />
      </main>
      <Footer />
    </div>
  );
}
