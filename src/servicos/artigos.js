import { requisitar } from './clienteHttp';
import { montarUrlMidia } from './configuracao';

export async function listarArtigos() {
  const resposta = await requisitar('/api/article');
  return resposta.map(paraArtigo);
}

export async function obterArtigo(id) {
  return paraArtigo(await requisitar(`/api/article/${id}`));
}

export async function criarArtigo(dados) {
  return paraArtigo(await requisitar('/api/article', { metodo: 'POST', corpo: paraCorpo(dados) }));
}

export async function editarArtigo(id, dados) {
  return paraArtigo(
    await requisitar(`/api/article/${id}`, { metodo: 'PUT', corpo: paraCorpo(dados) }),
  );
}

export async function excluirArtigo(id) {
  await requisitar(`/api/article/${id}`, { metodo: 'DELETE' });
}

function paraArtigo(resposta) {
  return {
    id: resposta.id,
    titulo: resposta.title,
    resumo: resposta.summary,
    conteudoHtml: resposta.contentHtml,
    caminhoCapa: resposta.coverImageUrl,
    urlCapa: montarUrlMidia(resposta.coverImageUrl),
    nomeAutor: resposta.authorName,
    criadoEm: resposta.createdAt,
    atualizadoEm: resposta.updatedAt,
  };
}

function paraCorpo({ titulo, resumo, conteudoHtml, caminhoCapa }) {
  return {
    title: titulo,
    summary: resumo,
    contentHtml: conteudoHtml,
    coverImageUrl: caminhoCapa,
  };
}
