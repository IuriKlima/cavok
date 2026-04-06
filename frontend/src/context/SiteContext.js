'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const SiteContext = createContext({});

export function SiteProvider({ children }) {
  const [data, setData] = useState({
    config: {},
    categoriasProduto: [],
    categoriasAeronave: [],
    categorias: [],
    loaded: false,
  });

  useEffect(() => {
    fetch('/api/site-data')
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d) setData({ ...d, loaded: true });
      })
      .catch(() => {});
  }, []);

  return (
    <SiteContext.Provider value={data}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSiteData() {
  return useContext(SiteContext);
}
