import { URL_BASE_API } from './configuracao';
import { obterToken } from './sessao';

const MENSAGENS_POR_STATUS = {
  400: 'Dados inválidos.',
  401: 'Sessão expirada. Entre novamente.',
  403: 'Você não tem permissão para acessar isto.',
  404: 'Recurso não encontrado.',
  409: 'Este e-mail já está em uso.',
};

export class ErroApi extends Error {
  constructor(status, mensagem) {
    super(mensagem);
    this.name = 'ErroApi';
    this.status = status;
  }
}

/** Monta o cabeçalho com o token da sessão. */
export function cabecalhoAutenticado() {
  return { Authorization: `Bearer ${obterToken()}` };
}

export async function requisitar(caminho, opcoes = {}) {
  const { metodo = 'GET', corpo, autenticado = true } = opcoes;

  const cabecalhos = { Accept: 'application/json' };
  if (corpo) {
    cabecalhos['Content-Type'] = 'application/json';
  }
  if (autenticado) {
    Object.assign(cabecalhos, cabecalhoAutenticado());
  }

  let resposta;
  try {
    resposta = await fetch(`${URL_BASE_API}${caminho}`, {
      method: metodo,
      headers: cabecalhos,
      body: corpo && JSON.stringify(corpo),
    });
  } catch {
    throw new ErroApi(0, `Não foi possível falar com a API em ${URL_BASE_API}.`);
  }

  return interpretarResposta(resposta);
}

async function interpretarResposta(resposta) {
  if (resposta.status === 204) {
    return null;
  }

  const dados = await resposta.json();

  if (resposta.ok) {
    return dados;
  }

  throw new ErroApi(
    resposta.status,
    dados.message ?? Object.values(dados)[0] ?? MENSAGENS_POR_STATUS[resposta.status],
  );
}
