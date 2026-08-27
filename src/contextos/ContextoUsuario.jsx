import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { autenticar, encerrarSessao, lerSessao } from '@/src/servicos';

const ContextoUsuario = createContext(null);

export function ProvedorUsuario({ children }) {
  const [sessao, definirSessao] = useState(lerSessao);
  const [carregando, definirCarregando] = useState(false);

  const entrar = useCallback(async (dados) => {
    definirCarregando(true);
    try {
      definirSessao(await autenticar(dados));
    } finally {
      definirCarregando(false);
    }
  }, []);

  const sair = useCallback(() => {
    encerrarSessao();
    definirSessao(null);
  }, []);

  const valor = useMemo(
    () => ({
      usuario: sessao?.usuario ?? null,
      token: sessao?.token ?? null,
      autenticado: sessao !== null,
      carregando,
      entrar,
      sair,
    }),
    [sessao, carregando, entrar, sair],
  );

  return <ContextoUsuario.Provider value={valor}>{children}</ContextoUsuario.Provider>;
}

export function useUsuario() {
  return useContext(ContextoUsuario);
}
