// pin-web-shim.js — substitui o backend do Electron no navegador

// Hash SHA-256 com Web Crypto
async function sha256(text) {
  const enc = new TextEncoder().encode(String(text));
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Armazena o PIN com hash no localStorage
const PIN_KEY = 'iml_web_pin_hash';

const backendWeb = {
  // Logs → só console (ou salve em IndexedDB se quiser)
  log: (msg) => console.log('[IML-Web]', msg),

  // PIN
  isPinSet: async () => ({ set: !!localStorage.getItem(PIN_KEY) }),
  setPin: async (pin) => {
    if (!/^\d{4,12}$/.test(String(pin || ''))) return { ok: false, message: 'PIN inválido' };
    const hash = await sha256(pin);
    localStorage.setItem(PIN_KEY, hash);
    return { ok: true };
  },
  checkPin: async (pin) => {
    const saved = localStorage.getItem(PIN_KEY);
    if (!saved) return { ok: true }; // sem PIN → libera
    const hash = await sha256(pin || '');
    return { ok: saved === hash };
  }
};

// Expõe como window.backend SÓ se ainda não houver (ex.: Electron)
if (!window.backend) {
  window.backend = backendWeb;
}
