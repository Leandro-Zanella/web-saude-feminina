import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import { useUsuario } from '@/src/contextos';
import { paleta, espacamento, raioBorda, tipografia } from '@/src/tema';
import { Botao } from './Botao';
import { Logo } from './Logo';

const ABAS = [
  { caminho: '/artigos', rotulo: 'Artigos' },
  { caminho: '/usuarios', rotulo: 'Usuários' },
];

export function LayoutAdmin() {
  const { usuario, sair } = useUsuario();
  const navegar = useNavigate();

  const encerrar = () => {
    sair();
    navegar('/login');
  };

  return (
    <div style={estilos.pagina}>
      <header style={estilos.cabecalho}>
        <Logo tamanhoIcone={18} horizontal />

        <nav style={estilos.navegacao}>
          {ABAS.map((aba) => (
            <NavLink
              key={aba.caminho}
              to={aba.caminho}
              style={({ isActive }) => ({
                ...estilos.aba,
                backgroundColor: isActive ? paleta.rosas.claro : 'transparent',
                color: isActive ? paleta.rosas.marca : paleta.textos.secundario,
              })}
            >
              {aba.rotulo}
            </NavLink>
          ))}
        </nav>

        <div style={estilos.areaUsuario}>
          <span style={estilos.nomeUsuario}>{usuario.nome}</span>
          <Botao
            titulo="Sair"
            variante="contorno"
            icone={<FaSignOutAlt size={12} />}
            onClick={encerrar}
          />
        </div>
      </header>

      <main style={estilos.conteudo}>
        <Outlet />
      </main>
    </div>
  );
}

const estilos = {
  pagina: {
    minHeight: '100vh',
    backgroundColor: paleta.neutros.fundo,
  },
  cabecalho: {
    display: 'flex',
    alignItems: 'center',
    gap: espacamento.xl,
    padding: `${espacamento.md}px ${espacamento.xl}px`,
    backgroundColor: paleta.neutros.branco,
    borderBottom: `1px solid ${paleta.neutros.borda}`,
  },
  navegacao: {
    display: 'flex',
    gap: espacamento.sm,
    flex: 1,
  },
  aba: {
    ...tipografia.rotulo,
    textDecoration: 'none',
    padding: `${espacamento.sm}px ${espacamento.lg}px`,
    borderRadius: raioBorda.md,
  },
  areaUsuario: {
    display: 'flex',
    alignItems: 'center',
    gap: espacamento.md,
  },
  nomeUsuario: {
    ...tipografia.corpo,
    color: paleta.textos.secundario,
  },
  conteudo: {
    maxWidth: 1040,
    margin: '0 auto',
    padding: espacamento.xl,
  },
};
