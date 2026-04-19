import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewspaperLayout from '@/components/NewspaperLayout';

export default function AllRegionPage() {
  return (
    <main>
      <Header />
      <NewspaperLayout title="지역별 전체 뉴스" type="region" value="all" />
      <Footer />
    </main>
  );
}
