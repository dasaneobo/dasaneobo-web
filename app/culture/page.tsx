import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewspaperLayout from '@/components/NewspaperLayout';

export default function CulturePage() {
  return (
    <main>
      <Header />
      <NewspaperLayout title="문화 뉴스" type="category" value="문화" />
      <Footer />
    </main>
  );
}
