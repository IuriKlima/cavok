import './globals.css';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import WhatsAppButton from '@/components/WhatsAppButton/WhatsAppButton';
import { SiteProvider } from '@/context/SiteContext';

export const metadata = {
  title: 'Cavok Avionics | Venda de Aviônicos e Aeronaves',
  description: 'A Cavok Avionics é sua parceira completa em aviação, oferecendo aviônicos e aeronaves novas e seminovas, além de serviços de instalação, manutenção e modernização.',
  keywords: 'aviônicos, aeronaves, garmin, gps, transponder, piloto automático, PFD, EFIS, aviação',
  openGraph: {
    title: 'Cavok Avionics | Venda de Aviônicos e Aeronaves',
    description: 'Sua parceira completa em aviação. Aviônicos e aeronaves novas e seminovas.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Cavok Avionics',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <SiteProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <WhatsAppButton />
        </SiteProvider>
      </body>
    </html>
  );
}
