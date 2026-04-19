import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewspaperLayout from '@/components/NewspaperLayout';

export default function BoseongPage() {
  return (
    <main>
      <Header />
      <NewspaperLayout title="보성 뉴스" type="region" value="보성" />
      <Footer />
    </main>
  );
}
