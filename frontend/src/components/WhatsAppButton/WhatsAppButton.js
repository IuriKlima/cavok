'use client';
import { usePathname } from 'next/navigation';
import { useSiteData } from '@/context/SiteContext';
import { MessageCircle } from 'lucide-react';
import styles from './WhatsAppButton.module.css';

export default function WhatsAppButton() {
  const { config = {} } = useSiteData();
  const pathname = usePathname();
  
  // Se o usuário estiver na seção de aeronaves, usa o whatsapp dedicado, se não usa o global
  const isAeronaves = pathname && pathname.startsWith('/aeronaves');
  const number = (isAeronaves ? config.aeronaves_whatsapp : config.whatsapp) || config.whatsapp || '5519983296170';
  
  return (
    <a
      href={`https://wa.me/${number}?text=Olá! Gostaria de mais informações.`}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.whatsapp}
      aria-label="Contato pelo WhatsApp"
    >
      <MessageCircle size={32} color="white" />
    </a>
  );
}
