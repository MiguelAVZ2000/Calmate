import { Header } from '@/components/header';
import { HeroSection } from '@/components/hero-section';
import { FeaturedProducts } from '@/components/product/featured-products';
import { OurStory } from '@/components/our-story';
import { Footer } from '@/components/footer';

export default function HomePage() {
  return (
    <div className='min-h-screen bg-background'>
      <Header />
      <main>
        <HeroSection />
        <FeaturedProducts />
        <OurStory />
      </main>
      <Footer />
    </div>
  );
}
