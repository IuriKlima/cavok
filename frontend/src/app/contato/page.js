'use client';
import { useState } from 'react';
import { useSiteData } from '@/context/SiteContext';
import { enviarContato } from '@/lib/api';
import { CheckCircle, Phone, Mail, MessageCircle, MapPin, Clock, Send, User, AtSign, PhoneCall, Pencil } from 'lucide-react';
import styles from './page.module.css';

export default function ContatoPage() {
  const { config = {} } = useSiteData();
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', mensagem: '', tipo: 'CONTATO' });
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await enviarContato(form);
      if (result) setEnviado(true);
    } catch (err) {
      setError(err.message || 'Erro ao enviar mensagem. Tente novamente.');
    }
    setLoading(false);
  };

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={`container ${styles.heroContent}`}>
          <span className={styles.heroBadge}><Mail size={14} /> Fale Conosco</span>
          <h1 className={styles.heroTitle}>{config.contato_titulo || 'Entre em Contato'}</h1>
          <p className={styles.heroDesc}>{config.contato_texto || 'Estamos prontos para atender você com agilidade e dedicação'}</p>
        </div>
      </section>

      {/* Info Cards */}
      <div className={`container ${styles.infoBar}`}>
        <div className={styles.infoItem}>
          <div className={styles.infoIcon}><Phone size={22} /></div>
          <div>
            <h3>Telefone</h3>
            <a href={`tel:+55${config.whatsapp || '19983296170'}`}>{config.telefone || '(19) 98329-6170'}</a>
          </div>
        </div>
        <div className={styles.infoItem}>
          <div className={styles.infoIcon}><Mail size={22} /></div>
          <div>
            <h3>Email</h3>
            <a href={`mailto:${config.email || 'orcamento@cavokavionics.com.br'}`}>{config.email || 'orcamento@cavokavionics.com.br'}</a>
          </div>
        </div>
        <div className={styles.infoItem}>
          <div className={styles.infoIcon}><MessageCircle size={22} /></div>
          <div>
            <h3>WhatsApp</h3>
            <a href={`https://wa.me/${config.whatsapp || '5519983296170'}`} target="_blank" rel="noopener">Converse com nossa equipe</a>
          </div>
        </div>
        <div className={styles.infoItem}>
          <div className={styles.infoIcon}><Clock size={22} /></div>
          <div>
            <h3>Horário</h3>
            <p>Seg - Sex: 8h às 18h</p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className={`container ${styles.layout}`}>
        <div className={styles.formSection}>
          <div className={styles.formCard}>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}><Send size={22} /> Envie uma Mensagem</h2>
              <p className={styles.formSubtitle}>Preencha o formulário abaixo e nossa equipe retornará em até 24 horas.</p>
            </div>

            {enviado ? (
              <div className={styles.successMsg}>
                <div className={styles.successIcon}><CheckCircle size={48} /></div>
                <h3>Mensagem enviada com sucesso!</h3>
                <p>Nossa equipe receberá sua mensagem e entrará em contato o mais breve possível.</p>
                <button className="btn btn-primary" onClick={() => { setEnviado(false); setForm({ nome: '', email: '', telefone: '', mensagem: '', tipo: 'CONTATO' }); }}>
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                {error && <div className={styles.errorMsg}>{error}</div>}
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label><User size={14} /> Nome *</label>
                    <input className={styles.input} type="text" required value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} placeholder="Seu nome completo" />
                  </div>
                  <div className={styles.formGroup}>
                    <label><AtSign size={14} /> Email *</label>
                    <input className={styles.input} type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="seu@email.com" />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label><PhoneCall size={14} /> Telefone</label>
                  <input className={styles.input} type="tel" value={form.telefone} onChange={e => setForm({...form, telefone: e.target.value})} placeholder="(00) 00000-0000" />
                </div>
                <div className={styles.formGroup}>
                  <label><Pencil size={14} /> Mensagem *</label>
                  <textarea className={`${styles.input} ${styles.textarea}`} required value={form.mensagem} onChange={e => setForm({...form, mensagem: e.target.value})} placeholder="Descreva como podemos ajudá-lo..." />
                </div>
                <button type="submit" className={`btn btn-accent btn-lg ${styles.submitBtn}`} disabled={loading}>
                  <Send size={18} /> {loading ? 'Enviando...' : 'Enviar Mensagem'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Side */}
        <aside className={styles.sideSection}>
          <div className={styles.sideCard}>
            <div className={styles.sideCardIcon}><MessageCircle size={28} /></div>
            <h3>Atendimento Rápido</h3>
            <p>Para respostas imediatas, fale diretamente com nossa equipe pelo WhatsApp.</p>
            <a href={`https://wa.me/${config.whatsapp || '5519983296170'}`} target="_blank" rel="noopener" className="btn btn-accent" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: 8 }}>
              <MessageCircle size={18} /> Abrir WhatsApp
            </a>
          </div>

          <div className={styles.sideCard}>
            <div className={styles.sideCardIcon}><MapPin size={28} /></div>
            <h3>Localização</h3>
            <p>{config.endereco || 'Campinas - SP, Brasil'}</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)', marginTop: 8 }}>Atendimento em todo o território nacional</p>
          </div>

          <div className={styles.trustBadges}>
            <div className={styles.trustItem}><CheckCircle size={16} /> Resposta em até 24h</div>
            <div className={styles.trustItem}><CheckCircle size={16} /> Equipe especializada</div>
            <div className={styles.trustItem}><CheckCircle size={16} /> Atendimento personalizado</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
