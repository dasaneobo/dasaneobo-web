import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewspaperLayout from '@/components/NewspaperLayout';

export default function GoheungPage() {
  return (
    <main>
      <Header />
      <NewspaperLayout title="고흥 뉴스" type="region" value="고흥" />
      <Footer />
    </main>
  );
}
