import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewspaperLayout from '@/components/NewspaperLayout';

export default function ColumnPage() {
  return (
    <main>
      <Header />
      <NewspaperLayout title="칼럼" type="category" value="칼럼" />
      <Footer />
    </main>
  );
}
