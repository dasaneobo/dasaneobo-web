import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewspaperLayout from '@/components/NewspaperLayout';
export const metadata = { title: '고흥 뉴스 | 다산어보' };

export default function GoheungPage() {
  return (
    <main>
      <Header />
      <NewspaperLayout title="고흥 뉴스" type="region" value="고흥" />
      <Footer />
    </main>
  );
}
