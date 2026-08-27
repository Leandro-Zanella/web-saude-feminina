import { ErroApi, requisitar } from './clienteHttp';
import { guardarSessao, limparSessao } from './sessao';

export async function autenticar({ email, senha }) {
  const resposta = await requisitar('/api/user/login', {
    metodo: 'POST',
    autenticado: false,
    corpo: { email, password: senha },
  });

  if (resposta.user.role !== 'ADMIN') {
    throw new ErroApi(403, 'Esta área é exclusiva para administradores.');
  }

  const sessao = { usuario: paraUsuario(resposta.user), token: resposta.token };
  guardarSessao(sessao);

  return sessao;
}

export function encerrarSessao() {
  limparSessao();
}

export function paraUsuario(resposta) {
  return {
    id: resposta.id,
    nome: resposta.name,
    email: resposta.email,
    papel: resposta.role,
    criadoEm: resposta.createdAt,
  };
}
