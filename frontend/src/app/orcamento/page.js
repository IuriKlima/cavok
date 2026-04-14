'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useSiteData } from '@/context/SiteContext';
import { enviarContato } from '@/lib/api';
import { Trash2, ShoppingCart, Send, ArrowLeft, CheckCircle, Store, X, User, Mail, PhoneCall } from 'lucide-react';
import styles from './page.module.css';

export default function OrcamentoPage() {
  const { cartItems, removeFromCart, clearCart, loaded } = useCart();
  const { config } = useSiteData();
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({ nome: '', telefone: '' });

  const handleOpenPopup = () => {
    if (cartItems.length === 0) return;
    setShowPopup(true);
  };

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => item.preco ? acc + Number(item.preco) : acc, 0);
  };
  const sumAmount = calculateTotal();

  const handleSendToWhatsApp = async (e) => {
    e.preventDefault();
    if (!formData.nome || !formData.telefone) {
      alert('Por favor, preencha nome e telefone.');
      return;
    }

    const whatsappNumber = config.whatsapp || '5519983296170';
    let message = `Olá! Meu nome é *${formData.nome}* (Tel: ${formData.telefone}) e gostaria de um orçamento para os seguintes itens:\n\n`;

    cartItems.forEach((item, index) => {
      message += `${index + 1}. *${item.nome}*`;
      if (item.sku) message += ` (SKU: ${item.sku})`;
      message += '\n';
    });
    
    if (sumAmount > 0) {
      message += `\n*Valor de Referência Total:* R$ ${sumAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
      message += `\n_(Gostaria de negociar este valor)_`;
    }

    try {
      await enviarContato({
        nome: formData.nome,
        email: 'orcamento@whatsapp.cliente',
        telefone: formData.telefone,
        mensagem: message,
        tipo: 'ORCAMENTO'
      });
    } catch (e) {
      console.error('Erro ao salvar orçamento:', e);
    }

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    clearCart();
    setShowPopup(false);
    window.open(url, '_blank');
  };

  if (!loaded) return <div style={{ padding: '100px', textAlign: 'center', color: '#888' }}>Carregando...</div>;

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}><ShoppingCart size={28} /> Carrinho de Orçamento</h1>
            <p className={styles.subtitle}>Revise os itens e envie para nossa equipe</p>
          </div>
          <Link href="/avionicos" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <ArrowLeft size={16} /> Adicionar mais itens
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <div className={styles.emptyState}>
            <Store size={64} color="var(--gray-300)" />
            <h2>Seu carrinho de orçamento está vazio</h2>
            <p>Navegue pelos nossos produtos e adicione os itens que você deseja cotar.</p>
            <Link href="/avionicos" className="btn btn-primary btn-lg" style={{ marginTop: 16 }}>
              Ver Catálogo de Aviônicos
            </Link>
          </div>
        ) : (
          <div className={styles.layout}>
            {/* Lista de itens */}
            <div className={styles.itemsList}>
              {cartItems.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.itemImage}>
                    {item.imagemPrincipal ? (
                      <img src={item.imagemPrincipal} alt={item.nome} />
                    ) : (
                      <div className={styles.itemPlaceholder}>Sem Imagem</div>
                    )}
                  </div>
                  <div className={styles.itemInfo}>
                    {item.categoria?.nome && <span className={styles.itemCategory}>{item.categoria.nome}</span>}
                    <h3 className={styles.itemName}><Link href={`/avionicos/${item.slug}`}>{item.nome}</Link></h3>
                    {item.sku && <span className={styles.itemSku}>SKU: {item.sku}</span>}
                  </div>
                  <div className={styles.itemPrice}>
                    {item.preco ? `R$ ${Number(item.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'Sob Consulta'}
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className={styles.removeBtn} title="Remover item">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>

            {/* Resumo */}
            <div className={styles.summaryBox}>
              <h3 className={styles.summaryTitle}>Resumo do Orçamento</h3>
              
              <div className={styles.summaryLine}>
                <span>Quantidade de itens:</span>
                <strong>{cartItems.length}</strong>
              </div>
              
              {sumAmount > 0 && (
                <div className={styles.summaryLine}>
                  <span>Total estimado:</span>
                  <strong>R$ {sumAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                </div>
              )}

              <div className={styles.summaryNotice}>
                <CheckCircle size={16} /> O envio envia uma mensagem para nossa central de atendimento no WhatsApp para cotação e negociação.
              </div>

              <button onClick={handleOpenPopup} className="btn btn-accent btn-lg" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 24 }}>
                <Send size={18} /> Solicitar Orçamento
              </button>
            </div>
          </div>
        )}

        {/* Modal/Popup para dados */}
        {showPopup && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <button className={styles.closeModalBtn} onClick={() => setShowPopup(false)}>
                  <X size={20} />
                </button>
                <h3 className={styles.modalTitle}><Send size={24} color="var(--accent)" /> Finalizar Orçamento</h3>
                <p className={styles.modalDesc}>Por favor, informe seus dados rápidos para que nossa equipe direcione o atendimento no WhatsApp.</p>
              </div>
              
              <div className={styles.modalBody}>
                <form onSubmit={handleSendToWhatsApp}>
                  <div className="form-group">
                    <label className={styles.modalLabel}>Seu Nome *</label>
                    <div className={styles.modalInputWrapper}>
                      <User size={18} className={styles.modalInputIcon} />
                      <input
                        type="text"
                        required
                        className={styles.modalInput}
                        placeholder="Ex: João da Silva"
                        value={formData.nome}
                        onChange={e => setFormData(f => ({...f, nome: e.target.value}))}
                      />
                    </div>
                  </div>
                  <div className="form-group" style={{ marginTop: 24 }}>
                    <label className={styles.modalLabel}>Seu Telefone / WhatsApp *</label>
                    <div className={styles.modalInputWrapper}>
                      <PhoneCall size={18} className={styles.modalInputIcon} />
                      <input
                        type="tel"
                        required
                        className={styles.modalInput}
                        placeholder="Ex: (00) 00000-0000"
                        value={formData.telefone}
                        onChange={e => setFormData(f => ({...f, telefone: e.target.value}))}
                      />
                    </div>
                  </div>

                  <div className={styles.modalActions}>
                    <button type="button" className="btn btn-ghost" onClick={() => setShowPopup(false)}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-accent" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '12px 24px' }}>
                      <Send size={16} /> Enviar p/ WhatsApp
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
