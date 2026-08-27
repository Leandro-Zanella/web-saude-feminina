import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Botao, CampoTexto, Cartao } from '@/src/componentes';
import { criarAdministrador, editarUsuario, obterUsuario } from '@/src/servicos';
import { paleta, espacamento, tipografia } from '@/src/tema';

const USUARIO_VAZIO = { nome: '', email: '', senha: '' };

export function FormularioUsuario() {
  const { id } = useParams();
  const navegar = useNavigate();
  const modoEdicao = Boolean(id);

  const [usuario, definirUsuario] = useState(USUARIO_VAZIO);
  const [carregando, definirCarregando] = useState(modoEdicao);
  const [salvando, definirSalvando] = useState(false);
  const [erro, definirErro] = useState('');

  useEffect(() => {
    if (modoEdicao) {
      obterUsuario(id).then((encontrado) => {
        definirUsuario(encontrado);
        definirCarregando(false);
      });
    }
  }, [id, modoEdicao]);

  const alterar = (campo, valor) => definirUsuario((atual) => ({ ...atual, [campo]: valor }));

  const salvar = async (evento) => {
    evento.preventDefault();
    definirErro('');
    definirSalvando(true);
    try {
      if (modoEdicao) {
        await editarUsuario(id, usuario);
      } else {
        await criarAdministrador(usuario);
      }
      navegar('/usuarios');
    } catch (problema) {
      definirErro(problema.message);
      definirSalvando(false);
    }
  };

  if (carregando) {
    return <p style={estilos.aviso}>Carregando administrador...</p>;
  }

  return (
    <Cartao>
      <h2 style={estilos.titulo}>{modoEdicao ? 'Editar administrador' : 'Novo administrador'}</h2>

      <form style={estilos.formulario} onSubmit={salvar}>
        <CampoTexto
          rotulo="Nome"
          value={usuario.nome}
          onChange={(evento) => alterar('nome', evento.target.value)}
        />

        <CampoTexto
          rotulo="E-mail"
          type="email"
          value={usuario.email}
          onChange={(evento) => alterar('email', evento.target.value)}
        />

        {/* A senha só é definida na criação: a edição não mexe em credencial. */}
        {!modoEdicao && (
          <CampoTexto
            rotulo="Senha"
            type="password"
            value={usuario.senha}
            onChange={(evento) => alterar('senha', evento.target.value)}
          />
        )}

        {erro && <span style={estilos.erro}>{erro}</span>}

        <div style={estilos.acoes}>
          <Botao
            titulo="Cancelar"
            variante="contorno"
            type="button"
            onClick={() => navegar('/usuarios')}
          />
          <Botao titulo="Salvar" type="submit" carregando={salvando} />
        </div>
      </form>
    </Cartao>
  );
}

const estilos = {
  titulo: {
    ...tipografia.tituloMedio,
    margin: `0 0 ${espacamento.xl}px`,
    color: paleta.textos.primario,
  },
  formulario: {
    display: 'flex',
    flexDirection: 'column',
    gap: espacamento.lg,
    maxWidth: 420,
  },
  acoes: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: espacamento.md,
  },
  erro: {
    fontSize: 13,
    color: paleta.estados.erro,
  },
  aviso: {
    ...tipografia.corpo,
    color: paleta.textos.secundario,
  },
};
