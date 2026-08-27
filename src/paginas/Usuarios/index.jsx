import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPen, FaTrash } from 'react-icons/fa';
import { Tabela } from '@/src/componentes';
import { useUsuario } from '@/src/contextos';
import { excluirUsuario, listarAdministradores } from '@/src/servicos';
import { formatarData } from '@/src/utilitarios';
import { paleta } from '@/src/tema';

const COLUNAS = [
  { chave: 'nome', rotulo: 'Nome' },
  { chave: 'email', rotulo: 'E-mail' },
  { chave: 'criadoEm', rotulo: 'Criado em', formatar: (linha) => formatarData(linha.criadoEm) },
];

export function PaginaUsuarios() {
  const navegar = useNavigate();
  const { usuario } = useUsuario();
  const [administradores, definirAdministradores] = useState([]);
  const [carregando, definirCarregando] = useState(true);

  const buscar = () =>
    listarAdministradores().then((encontrados) => {
      definirAdministradores(encontrados);
      definirCarregando(false);
    });

  useEffect(() => {
    buscar();
  }, []);

  const remover = async (administrador) => {
    if (administrador.id === usuario.id) {
      window.alert('Você não pode excluir a sua própria conta.');
      return;
    }
    if (window.confirm(`Excluir o administrador "${administrador.nome}"?`)) {
      await excluirUsuario(administrador.id);
      buscar();
    }
  };

  const acoes = [
    {
      chave: 'editar',
      titulo: 'Editar',
      icone: <FaPen />,
      cor: paleta.rosas.marca,
      aoClicar: (administrador) => navegar(`/usuarios/${administrador.id}`),
    },
    {
      chave: 'excluir',
      titulo: 'Excluir',
      icone: <FaTrash />,
      cor: paleta.estados.erro,
      aoClicar: remover,
    },
  ];

  return (
    <Tabela
      titulo="Administradores"
      colunas={COLUNAS}
      dados={administradores}
      acoes={acoes}
      carregando={carregando}
      rotuloAdicionar="Novo administrador"
      aoAdicionar={() => navegar('/usuarios/novo')}
      mensagemVazio="Nenhum administrador cadastrado."
    />
  );
}
