import { URL_BASE_API, montarUrlMidia } from './configuracao';
import { ErroApi, cabecalhoAutenticado } from './clienteHttp';

/**
 * Sobe o arquivo e devolve o caminho relativo (`/media/uuid.png`) e a URL absoluta.
 * O caminho relativo é o que vai para a capa; a URL absoluta é a que entra no HTML,
 * porque o app renderiza o conteúdo numa WebView e não resolve caminho relativo.
 */
export async function enviarMidia(arquivo) {
  const formulario = new FormData();
  formulario.append('file', arquivo);

  const resposta = await fetch(`${URL_BASE_API}/api/media`, {
    method: 'POST',
    headers: cabecalhoAutenticado(),
    body: formulario,
  });

  if (!resposta.ok) {
    throw new ErroApi(resposta.status, 'Não foi possível enviar o arquivo.');
  }

  const { url } = await resposta.json();
  return { caminho: url, urlAbsoluta: montarUrlMidia(url) };
}
