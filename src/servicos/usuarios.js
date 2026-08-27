import { requisitar } from './clienteHttp';
import { paraUsuario } from './autenticacao';

/** A gestão web só cria e edita contas de administrador. */
const PAPEL_DA_WEB = 'ADMIN';

export async function listarAdministradores() {
  const resposta = await requisitar('/api/user/admins');
  return resposta.map(paraUsuario);
}

export async function obterUsuario(id) {
  return paraUsuario(await requisitar(`/api/user/${id}`));
}

export async function criarAdministrador({ nome, email, senha }) {
  const resposta = await requisitar('/api/user', {
    metodo: 'POST',
    corpo: { name: nome, email, password: senha, userRole: PAPEL_DA_WEB },
  });
  return paraUsuario(resposta);
}

export async function editarUsuario(id, { nome, email }) {
  const resposta = await requisitar(`/api/user/${id}`, {
    metodo: 'PUT',
    corpo: { name: nome, email, userRole: PAPEL_DA_WEB },
  });
  return paraUsuario(resposta);
}

export async function excluirUsuario(id) {
  await requisitar(`/api/user/${id}`, { metodo: 'DELETE' });
}
