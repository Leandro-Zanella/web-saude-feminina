import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPen, FaTrash } from 'react-icons/fa';
import { Tabela } from '@/src/componentes';
import { excluirArtigo, listarArtigos } from '@/src/servicos';
import { formatarData } from '@/src/utilitarios';
import { paleta } from '@/src/tema';

const COLUNAS = [
  { chave: 'titulo', rotulo: 'Título' },
  { chave: 'nomeAutor', rotulo: 'Autor' },
  { chave: 'atualizadoEm', rotulo: 'Atualizado em', formatar: (linha) => formatarData(linha.atualizadoEm) },
];

export function PaginaArtigos() {
  const navegar = useNavigate();
  const [artigos, definirArtigos] = useState([]);
  const [carregando, definirCarregando] = useState(true);

  const buscar = () =>
    listarArtigos().then((encontrados) => {
      definirArtigos(encontrados);
      definirCarregando(false);
    });

  useEffect(() => {
    buscar();
  }, []);

  const remover = async (artigo) => {
    if (window.confirm(`Excluir o artigo "${artigo.titulo}"?`)) {
      await excluirArtigo(artigo.id);
      buscar();
    }
  };

  const acoes = [
    {
      chave: 'editar',
      titulo: 'Editar',
      icone: <FaPen />,
      cor: paleta.rosas.marca,
      aoClicar: (artigo) => navegar(`/artigos/${artigo.id}`),
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
      titulo="Artigos"
      colunas={COLUNAS}
      dados={artigos}
      acoes={acoes}
      carregando={carregando}
      rotuloAdicionar="Novo artigo"
      aoAdicionar={() => navegar('/artigos/novo')}
      mensagemVazio="Nenhum artigo publicado ainda."
    />
  );
}
