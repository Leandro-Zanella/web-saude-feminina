const CHAVE = 'flor.sessao';

export function guardarSessao(sessao) {
  localStorage.setItem(CHAVE, JSON.stringify(sessao));
}

export function lerSessao() {
  const bruto = localStorage.getItem(CHAVE);
  return bruto ? JSON.parse(bruto) : null;
}

export function limparSessao() {
  localStorage.removeItem(CHAVE);
}

export function obterToken() {
  return lerSessao()?.token ?? null;
}
