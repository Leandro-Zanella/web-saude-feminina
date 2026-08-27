import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cartao, Logo } from '@/src/componentes';
import { useUsuario } from '@/src/contextos';
import { paleta, espacamento, tipografia } from '@/src/tema';
import { FormularioLogin } from './FormularioLogin';

export function PaginaLogin() {
  const { entrar, carregando } = useUsuario();
  const navegar = useNavigate();
  const [erroGeral, definirErroGeral] = useState('');

  const aoEnviar = async (dados) => {
    definirErroGeral('');
    try {
      await entrar(dados);
      navegar('/artigos');
    } catch (erro) {
      definirErroGeral(erro.message);
    }
  };

  return (
    <div style={estilos.pagina}>
      <div style={estilos.coluna}>
        <Logo />

        <Cartao>
          <div style={estilos.cabecalhoCartao}>
            <h1 style={estilos.titulo}>Gestão de conteúdo</h1>
            <p style={estilos.subtitulo}>Entre com sua conta de administrador</p>
          </div>

          <FormularioLogin aoEnviar={aoEnviar} carregando={carregando} erroGeral={erroGeral} />
        </Cartao>
      </div>
    </div>
  );
}

const estilos = {
  pagina: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: espacamento.xl,
    backgroundColor: paleta.neutros.fundo,
  },
  coluna: {
    width: '100%',
    maxWidth: 400,
    display: 'flex',
    flexDirection: 'column',
    gap: espacamento.xl,
  },
  cabecalhoCartao: {
    marginBottom: espacamento.lg,
  },
  titulo: {
    ...tipografia.tituloMedio,
    margin: 0,
    color: paleta.textos.primario,
  },
  subtitulo: {
    ...tipografia.subtitulo,
    margin: `${espacamento.xs}px 0 0`,
    color: paleta.textos.secundario,
  },
};
