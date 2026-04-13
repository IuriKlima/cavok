'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getAeronave, getAeronavesRelacionadas, enviarContato } from '@/lib/api';
import { Plane, CheckCircle, XCircle, MessageCircle, Mail, FileText, Search, Handshake, Send, X, User } from 'lucide-react';
import { useSiteData } from '@/context/SiteContext';
import styles from './page.module.css';

export default function AeronaveDetalhe() {
  const params = useParams();
  const slug = params.slug;
  const [aeronave, setAeronave] = useState(null);
  const [relacionadas, setRelacionadas] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const { config } = useSiteData();
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({ nome: '', email: '' });

  useEffect(() => {
    getAeronave(slug).then(data => {
      setAeronave(data);
      setLoading(false);
    });
    getAeronavesRelacionadas(slug).then(data => {
      if (data) setRelacionadas(data);
    });
  }, [slug]);

  if (loading) return <div style={{ padding: '100px', textAlign: 'center', color: '#888' }}>Carregando...</div>;
  if (!aeronave) return <div style={{ padding: '100px', textAlign: 'center' }}>Aeronave não encontrada.</div>;

  const handleSendToWhatsApp = async (e) => {
    e.preventDefault();
    if (!formData.nome || !formData.email) {
      alert('Por favor, preencha nome e email.');
      return;
    }

    const whatsappNumber = config?.aeronaves_whatsapp || config?.whatsapp || '5519983296170';
    let message = `Olá! Meu nome é *${formData.nome}* (${formData.email}) e tenho interesse na aeronave: *${aeronave.nome}*`;
    if (aeronave.preco) {
      message += ` anunciada por R$ ${Number(aeronave.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    }

    try {
      await enviarContato({
        nome: formData.nome,
        email: formData.email,
        mensagem: message,
        tipo: 'AERONAVE'
      });
    } catch (e) {
      console.error('Erro ao salvar contato:', e);
    }

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    setShowPopup(false);
    window.open(url, '_blank');
  };

  const allImages = [aeronave.imagemPrincipal, ...(aeronave.imagens || [])].filter(Boolean);

  return (
    <div className={styles.page}>
      <div className="container">
        <div className="breadcrumbs">
          <Link href="/">Início</Link>
          <span>/</span>
          <Link href="/aeronaves">Aeronaves</Link>
          <span>/</span>
          <strong>{aeronave.nome}</strong>
        </div>

        <div className={styles.layout}>
          <div className={styles.gallery}>
            <div className={styles.mainImage}>
              {allImages.length > 0 ? (
                <img src={allImages[activeImage]} alt={aeronave.nome} />
              ) : (
                <div className={styles.placeholder}><span><Plane size={48} color="rgba(0,0,0,0.2)"/></span><p>Imagem da aeronave</p></div>
              )}
            </div>
            {allImages.length > 1 && (
              <div className={styles.thumbs}>
                {allImages.map((img, i) => (
                  <button key={i} className={`${styles.thumb} ${i === activeImage ? styles.thumbActive : ''}`} onClick={() => setActiveImage(i)}>
                    <img src={img} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className={styles.info}>
            {aeronave.categoria && <span className={styles.category}>{aeronave.categoria.nome}</span>}
            <h1 className={styles.name}>{aeronave.nome}</h1>

            <span className={`${styles.statusBadge} ${aeronave.status === 'DISPONIVEL' ? styles.statusOk : styles.statusSold}`} style={{display: 'inline-flex', alignItems: 'center', gap: '6px'}}>
              {aeronave.status === 'DISPONIVEL' ? <><CheckCircle size={14}/> Disponível</> : aeronave.status === 'VENDIDA' ? <><XCircle size={14}/> Vendida</> : aeronave.status}
            </span>

            <div className={styles.specs}>
              {aeronave.anoFabricacao && <div className={styles.spec}><span className={styles.specLabel}>Ano Fabricação</span><span className={styles.specValue}>{aeronave.anoFabricacao}</span></div>}
              {aeronave.assentos && <div className={styles.spec}><span className={styles.specLabel}>Assentos</span><span className={styles.specValue}>{aeronave.assentos}</span></div>}
              {aeronave.horasCelula && <div className={styles.spec}><span className={styles.specLabel}>Horas Célula</span><span className={styles.specValue}>{aeronave.horasCelula}</span></div>}
            </div>

            {aeronave.preco && (
              <div className={styles.priceBox}>
                <span className={styles.price}>R$ {Number(aeronave.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            )}

            <div className={styles.actions}>
              <button onClick={() => setShowPopup(true)} className="btn btn-accent btn-lg" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <MessageCircle size={20}/> Tenho Interesse
              </button>
              <Link href="/contato" className="btn btn-outline btn-lg" style={{display: 'flex', alignItems: 'center', gap: '8px'}}><Mail size={20}/> Contato</Link>
            </div>

            <div className={styles.features}>
              <div className={styles.featureItem}><FileText size={18} color="var(--accent)"/> Documentação em dia</div>
              <div className={styles.featureItem}><Search size={18} color="var(--accent)"/> Inspeção disponível</div>
              <div className={styles.featureItem}><Handshake size={18} color="var(--accent)"/> Negociação facilitada</div>
            </div>
          </div>
        </div>

        {aeronave.descricao && (
          <div className={styles.descSection}>
            <h2 className={styles.descTitle}>Sobre esta Aeronave</h2>
            <div className={styles.descContent} dangerouslySetInnerHTML={{ __html: aeronave.descricao }} />
          </div>
        )}

        {aeronave.especificacoes && (
          <div className={styles.descSection}>
            <h2 className={styles.descTitle}>Especificações Técnicas</h2>
            <div className={styles.descContent} dangerouslySetInnerHTML={{ __html: aeronave.especificacoes }} />
          </div>
        )}

        {relacionadas.length > 0 && (
          <div className={styles.descSection}>
            <h2 className={styles.descTitle}>Aeronaves Relacionadas</h2>
            <div className="grid grid-2" style={{ gap: 20, marginTop: 20 }}>
              {relacionadas.map(a => (
                <Link key={a.id} href={`/aeronaves/${a.slug}`} className="card" style={{ overflow: 'hidden', textDecoration: 'none' }}>
                  <div style={{ height: 200, background: 'var(--bg-tertiary)' }}>
                    {a.imagemPrincipal ? <img src={a.imagemPrincipal} alt={a.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}><Plane size={48} color="rgba(255,255,255,0.2)"/></div>}
                  </div>
                  <div style={{ padding: 16 }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600 }}>{a.categoria?.nome || 'Aeronave'}</span>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginTop: 4 }}>{a.nome}</h3>
                    {a.anoFabricacao && <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Ano: {a.anoFabricacao}</span>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Modal/Popup para dados */}
        {showPopup && (
          <div className={styles.modalOverlay} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className={styles.modalContent} style={{ background: '#fff', padding: 24, borderRadius: 12, maxWidth: 400, width: '90%', position: 'relative' }}>
              <button onClick={() => setShowPopup(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
              <h3 style={{ fontSize: '1.2rem', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}><Send size={20} color="var(--accent)" /> Tenho Interesse</h3>
              <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: 20 }}>Por favor, informe seus dados para que nossa equipe te atenda rapidamente.</p>
              
              <form onSubmit={handleSendToWhatsApp}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 4 }}>Seu Nome *</label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: 12, top: 12, color: '#999' }} />
                    <input type="text" required style={{ width: '100%', padding: '10px 10px 10px 36px', border: '1px solid #ddd', borderRadius: 6 }} placeholder="Ex: João da Silva" value={formData.nome} onChange={e => setFormData(f => ({...f, nome: e.target.value}))} />
                  </div>
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 4 }}>Seu E-mail *</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: 12, top: 12, color: '#999' }} />
                    <input type="email" required style={{ width: '100%', padding: '10px 10px 10px 36px', border: '1px solid #ddd', borderRadius: 6 }} placeholder="Ex: joao@email.com" value={formData.email} onChange={e => setFormData(f => ({...f, email: e.target.value}))} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <button type="button" className="btn" style={{ flex: 1, background: '#f5f5f5', color: '#333' }} onClick={() => setShowPopup(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-accent" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><Send size={16} /> Enviar</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
