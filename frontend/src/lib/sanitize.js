/**
 * sanitizeHtml — Remove scripts, event handlers e elementos perigosos de HTML
 * antes de renderizar com dangerouslySetInnerHTML.
 * 
 * Funciona tanto no servidor (SSR) quanto no cliente (CSR) sem dependências externas.
 */

// Tags que NUNCA devem aparecer no conteúdo renderizado
const FORBIDDEN_TAGS = /(<\s*\/?\s*(script|iframe|object|embed|form|input|button|textarea|select|link|style|meta|base|applet)[^>]*>)/gi;

// Atributos de eventos inline (onclick, onerror, onload, etc.)
const EVENT_HANDLERS = /\s+on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]*)/gi;

// javascript: e data: em href/src
const DANGEROUS_PROTOCOLS = /(href|src|action)\s*=\s*["']?\s*(javascript|data|vbscript)\s*:/gi;

export function sanitizeHtml(html) {
  if (!html || typeof html !== 'string') return '';
  
  let clean = html;
  
  // 1. Remover tags proibidas e seu conteúdo (para script/style)
  clean = clean.replace(/<script[\s\S]*?<\/script>/gi, '');
  clean = clean.replace(/<style[\s\S]*?<\/style>/gi, '');
  
  // 2. Remover tags perigosas restantes (iframe, object, embed, etc.)
  clean = clean.replace(FORBIDDEN_TAGS, '');
  
  // 3. Remover event handlers inline
  clean = clean.replace(EVENT_HANDLERS, '');
  
  // 4. Remover protocolos perigosos
  clean = clean.replace(DANGEROUS_PROTOCOLS, '$1=""');
  
  return clean;
}
