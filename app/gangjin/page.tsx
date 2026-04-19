import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewspaperLayout from '@/components/NewspaperLayout';

export default function GangjinPage() {
  return (
    <main>
      <Header />
      <NewspaperLayout title="강진 뉴스" type="region" value="강진" />
      <Footer />
    </main>
  );
}
