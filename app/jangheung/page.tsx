import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewspaperLayout from '@/components/NewspaperLayout';
export const metadata = { title: '장흥 뉴스 | 다산어보' };

export default function JangheungPage() {
  return (
    <main>
      <Header />
      <NewspaperLayout title="장흥 뉴스" type="region" value="장흥" />
      <Footer />
    </main>
  );
}
