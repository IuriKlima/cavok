'use client';
import { useState } from 'react';
import { useSiteData } from '@/context/SiteContext';
import { enviarContato } from '@/lib/api';
import { CheckCircle, Phone, Mail, MessageCircle } from 'lucide-react';
import styles from './page.module.css';

export default function ContatoPage() {
  const { config = {} } = useSiteData();
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', mensagem: '', tipo: 'CONTATO' });
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await enviarContato(form);
    setLoading(false);
    if (result) setEnviado(true);
  };

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.heroTitle}>{config.contato_titulo || 'Entre em Contato'}</h1>
          <p className={styles.heroDesc}>{config.contato_texto || 'Estamos prontos para atender você'}</p>
        </div>
      </section>
      <div className={`container ${styles.layout}`}>
        <div className={styles.formSection}>
          <h2 className={styles.formTitle}>Envie uma mensagem</h2>
          {enviado ? (
            <div className={styles.successMsg}><span><CheckCircle size={32} color="var(--success, green)"/></span><h3>Mensagem enviada!</h3><p>Entraremos em contato em breve.</p></div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}><label>Nome *</label><input className={styles.input} type="text" required value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} placeholder="Seu nome" /></div>
                <div className={styles.formGroup}><label>Email *</label><input className={styles.input} type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="seu@email.com" /></div>
              </div>
              <div className={styles.formGroup}><label>Telefone</label><input className={styles.input} type="tel" value={form.telefone} onChange={e => setForm({...form, telefone: e.target.value})} placeholder="(00) 00000-0000" /></div>
              <div className={styles.formGroup}><label>Mensagem *</label><textarea className={`${styles.input} ${styles.textarea}`} required value={form.mensagem} onChange={e => setForm({...form, mensagem: e.target.value})} placeholder="Como podemos ajudá-lo?" /></div>
              <button type="submit" className="btn btn-accent btn-lg" disabled={loading}>{loading ? 'Enviando...' : 'Enviar Mensagem'}</button>
            </form>
          )}
        </div>
        <aside className={styles.contactInfo}>
          <div className={styles.infoCard}><h3 style={{display: 'flex', alignItems: 'center', gap: '8px'}}><Phone size={20}/> Telefone</h3><a href={`tel:+55${config.whatsapp || '19983296170'}`}>{config.telefone || '(19) 98329-6170'}</a></div>
          <div className={styles.infoCard}><h3 style={{display: 'flex', alignItems: 'center', gap: '8px'}}><Mail size={20}/> Email</h3><a href={`mailto:${config.email || 'orcamento@cavokavionics.com.br'}`}>{config.email || 'orcamento@cavokavionics.com.br'}</a></div>
          <div className={styles.infoCard}><h3 style={{display: 'flex', alignItems: 'center', gap: '8px'}}><MessageCircle size={20}/> WhatsApp</h3><a href={`https://wa.me/${config.whatsapp || '5519983296170'}`} target="_blank" rel="noopener">Converse conosco</a></div>
        </aside>
      </div>
    </div>
  );
}
