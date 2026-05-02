'use client';
import { useSiteData } from '@/context/SiteContext';
import { Target, Eye, Gem, Phone, MessageCircle, Shield, Award, Users, Wrench, Clock, MapPin } from 'lucide-react';
import styles from './page.module.css';

export default function SobrePage() {
  const { config = {} } = useSiteData();

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={`container ${styles.heroContent}`}>
          <span className={styles.heroBadge}>Desde 2010 no mercado</span>
          <h1 className={styles.heroTitle}>{config.sobre_titulo || 'Sobre a Cavok Avionics'}</h1>
          <p className={styles.heroDesc}>Excelência, confiança e paixão pela aviação em cada operação</p>
        </div>
      </section>

      <div className={`container ${styles.content}`}>
        {/* Intro */}
        <section className={styles.intro}>
          <div className={styles.introText}>
            <h2 className={styles.sectionTitle}>Quem Somos</h2>
            <p className={styles.introP}>
              {config.sobre_texto || 'A Cavok Avionics é uma empresa especializada no mercado de aviação, atuando na venda de aviônicos de alta performance e aeronaves novas e seminovas. Com anos de experiência no setor aeronáutico, oferecemos soluções completas para pilotos, operadores e empresas de aviação em todo o Brasil.'}
            </p>
            <p className={styles.introP}>
              Nosso compromisso é entregar excelência em cada transação, com produtos devidamente homologados, procedência garantida e suporte técnico especializado.
            </p>
          </div>
          <div className={styles.introStats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>500+</span>
              <span className={styles.statLabel}>Produtos Aviônicos</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>100%</span>
              <span className={styles.statLabel}>Homologados</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>15+</span>
              <span className={styles.statLabel}>Anos de Experiência</span>
            </div>
          </div>
        </section>

        {/* Diferenciais */}
        <section className={styles.differentials}>
          <h2 className={styles.sectionTitle} style={{ textAlign: 'center', marginBottom: 40 }}>Por que escolher a Cavok?</h2>
          <div className={styles.diffGrid}>
            <div className={styles.diffCard}>
              <div className={styles.diffIcon}><Shield size={28} /></div>
              <h3>Procedência Garantida</h3>
              <p>Todos os nossos produtos possuem rastreabilidade completa e documentação em dia.</p>
            </div>
            <div className={styles.diffCard}>
              <div className={styles.diffIcon}><Award size={28} /></div>
              <h3>Produtos Homologados</h3>
              <p>Trabalhamos apenas com equipamentos certificados e de acordo com as normas da ANAC.</p>
            </div>
            <div className={styles.diffCard}>
              <div className={styles.diffIcon}><Users size={28} /></div>
              <h3>Atendimento Personalizado</h3>
              <p>Equipe especializada pronta para oferecer a melhor consultoria para sua operação.</p>
            </div>
            <div className={styles.diffCard}>
              <div className={styles.diffIcon}><Wrench size={28} /></div>
              <h3>Suporte Técnico</h3>
              <p>Assistência pós-venda especializada para garantir a máxima performance dos seus equipamentos.</p>
            </div>
            <div className={styles.diffCard}>
              <div className={styles.diffIcon}><Clock size={28} /></div>
              <h3>Agilidade na Entrega</h3>
              <p>Logística otimizada para envio seguro e rápido para todo o território nacional.</p>
            </div>
            <div className={styles.diffCard}>
              <div className={styles.diffIcon}><MapPin size={28} /></div>
              <h3>Cobertura Nacional</h3>
              <p>Atendemos clientes em todo o Brasil, com consultoria remota e presencial.</p>
            </div>
          </div>
        </section>

        {/* Missão, Visão, Valores */}
        <section className={styles.mvv}>
          <div className={styles.mvvCard}>
            <div className={styles.mvvIcon}><Target size={44} /></div>
            <h3>Missão</h3>
            <p>Oferecer aviônicos e aeronaves com qualidade, transparência e o melhor atendimento do mercado, contribuindo para a segurança e eficiência da aviação brasileira.</p>
          </div>
          <div className={styles.mvvCard}>
            <div className={styles.mvvIcon}><Eye size={44} /></div>
            <h3>Visão</h3>
            <p>Ser referência nacional na comercialização de aviônicos e aeronaves, reconhecida pela confiabilidade, inovação e relacionamento duradouro com nossos clientes.</p>
          </div>
          <div className={styles.mvvCard}>
            <div className={styles.mvvIcon}><Gem size={44} /></div>
            <h3>Valores</h3>
            <p>Transparência absoluta, compromisso inabalável com a qualidade, foco no cliente e paixão genuína pela aviação em todas as nossas operações.</p>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.cta}>
          <div className={styles.ctaContent}>
            <h2>Pronto para decolar?</h2>
            <p>Entre em contato com nossa equipe e descubra como podemos ajudar na sua próxima operação.</p>
            <div className={styles.ctaButtons}>
              <a href={`tel:+55${config.whatsapp || '19983296170'}`} className="btn btn-outline btn-lg" style={{display: 'flex', alignItems: 'center', gap: '8px', borderColor: '#fff', color: '#fff'}}>
                <Phone size={18}/> +55 {config.telefone || '(19) 98329-6170'}
              </a>
              <a href={`https://wa.me/${config.whatsapp || '5519983296170'}`} target="_blank" rel="noopener" className="btn btn-accent btn-lg" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <MessageCircle size={18}/> Fale via WhatsApp
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
