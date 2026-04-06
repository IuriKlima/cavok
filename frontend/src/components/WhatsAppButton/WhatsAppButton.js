'use client';
import { MessageCircle } from 'lucide-react';
import styles from './WhatsAppButton.module.css';

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/5519983296170?text=Olá! Gostaria de mais informações."
      target="_blank"
      rel="noopener noreferrer"
      className={styles.whatsapp}
      aria-label="Contato pelo WhatsApp"
    >
      <MessageCircle size={32} color="white" />
    </a>
  );
}
