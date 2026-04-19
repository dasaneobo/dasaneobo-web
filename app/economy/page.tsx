import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewspaperLayout from '@/components/NewspaperLayout';

export default function EconomyPage() {
  return (
    <main>
      <Header />
      <NewspaperLayout title="경제 뉴스" type="category" value="경제" />
      <Footer />
    </main>
  );
}
