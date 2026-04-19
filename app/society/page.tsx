import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewspaperLayout from '@/components/NewspaperLayout';

export default function SocietyPage() {
  return (
    <main>
      <Header />
      <NewspaperLayout title="사회 뉴스" type="category" value="사회" />
      <Footer />
    </main>
  );
}
