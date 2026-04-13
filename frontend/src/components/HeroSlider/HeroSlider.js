'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './HeroSlider.module.css';

export default function HeroSlider({ slides = [], config = {} }) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback((index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(index);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning]);

  const next = useCallback(() => {
    if (slides.length <= 1) return;
    goTo((current + 1) % slides.length);
  }, [current, slides.length, goTo]);

  const prev = useCallback(() => {
    if (slides.length <= 1) return;
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, slides.length, goTo]);

  // Autoplay
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  // Fallback when no slides
  if (!slides.length) {
    return (
      <section className={styles.hero}>
        <div className={styles.slide} style={{ background: 'linear-gradient(135deg, #0a1628 0%, #1a2d50 50%, #0d1f3c 100%)' }}>
          <div className={styles.overlay} />
          <div className={`container ${styles.content}`}>
            <h1 className={styles.title}>{config.hero_titulo || 'Aviônicos e Aeronaves com Qualidade e Procedência'}</h1>
            <p className={styles.subtitle}>{config.hero_subtitulo || 'Venda de aviônicos novos e usados, aeronaves selecionadas.'}</p>
            <div className={styles.actions}>
              <Link href="/avionicos" className="btn btn-accent btn-lg">Ver Aviônicos</Link>
              <Link href="/aeronaves" className="btn btn-outline btn-lg">Ver Aeronaves</Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.hero}>
      {slides.map((slide, i) => (
        <div key={slide.id || i} className={`${styles.slide} ${i === current ? styles.slideActive : ''}`}
          style={{ backgroundImage: (slide.imagem_url || slide.imagemUrl) ? `url(${slide.imagem_url || slide.imagemUrl})` : undefined }}>
          <div className={styles.overlay} />
          <div className={`container ${styles.content}`}>
            {slide.titulo && <h1 className={styles.title}>{slide.titulo}</h1>}
            {slide.subtitulo && <p className={styles.subtitle}>{slide.subtitulo}</p>}
            {slide.link && (
              <div className={styles.actions}>
                <Link href={slide.link} className="btn btn-accent btn-lg">{slide.texto_botao || slide.textoBotao || 'Ver Mais'}</Link>
              </div>
            )}
          </div>
        </div>
      ))}

      {slides.length > 1 && (
        <>
          <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={prev} aria-label="Anterior"><ChevronLeft size={28} /></button>
          <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={next} aria-label="Próximo"><ChevronRight size={28} /></button>
          <div className={styles.dots}>
            {slides.map((_, i) => (
              <button key={i} className={`${styles.dot} ${i === current ? styles.dotActive : ''}`} onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
