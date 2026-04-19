import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewspaperLayout from '@/components/NewspaperLayout';

export default function AdministrationPage() {
  return (
    <main>
      <Header />
      <NewspaperLayout title="행정 뉴스" type="category" value="행정" />
      <Footer />
    </main>
  );
}
