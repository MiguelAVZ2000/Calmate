import { Header } from '@/components/layout/header';
import { ContactForm } from '@/components/contact/contact-form';
import { Footer } from '@/components/layout/footer';

export default function ContactPage() {
  return (
    <div className='min-h-screen bg-background'>
      <Header />
      <main>
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}
