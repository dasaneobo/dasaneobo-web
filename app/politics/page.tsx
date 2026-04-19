import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewspaperLayout from '@/components/NewspaperLayout';

export default function PoliticsPage() {
  return (
    <main>
      <Header />
      <NewspaperLayout title="정치 뉴스" type="category" value="정치" />
      <Footer />
    </main>
  );
}
