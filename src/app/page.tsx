import { Metadata } from 'next';
import LandingPage from './LandingPage';

export const metadata: Metadata = {
  title: 'UTES - Platform Pembelajaran Interaktif Berbasis AI',
  description: 'Evaluasi pemahaman materi dengan cerdas melalui soal pilihan ganda dan essay mendalam dengan analisis AI yang akurat.',
  openGraph: {
    title: 'UTES - Platform Pembelajaran Interaktif Berbasis AI',
    description: 'Evaluasi pemahaman materi dengan cerdas melalui soal pilihan ganda dan essay mendalam dengan analisis AI yang akurat.',
    type: 'website',
  },
};

export default function Home() {
  return <LandingPage />;
}
