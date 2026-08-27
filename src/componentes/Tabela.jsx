import { FaPlus } from 'react-icons/fa';
import { paleta, espacamento, raioBorda, tipografia } from '@/src/tema';
import { Botao } from './Botao';

/**
 * Tabela genérica.
 * colunas: [{ chave, rotulo, formatar? }]
 * acoes:   [{ chave, icone, titulo, cor, aoClicar(linha) }]
 */
export function Tabela({
  titulo,
  colunas,
  dados,
  acoes = [],
  rotuloAdicionar,
  aoAdicionar,
  carregando,
  mensagemVazio = 'Nenhum registro encontrado.',
}) {
  return (
    <div style={estilos.container}>
      <div style={estilos.cabecalho}>
        <h2 style={estilos.titulo}>{titulo}</h2>
        {aoAdicionar && (
          <Botao titulo={rotuloAdicionar} icone={<FaPlus size={12} />} onClick={aoAdicionar} />
        )}
      </div>

      <table style={estilos.tabela}>
        <thead>
          <tr>
            {colunas.map((coluna) => (
              <th key={coluna.chave} style={estilos.celulaCabecalho}>
                {coluna.rotulo}
              </th>
            ))}
            {acoes.length > 0 && <th style={{ ...estilos.celulaCabecalho, width: 1 }}>Ações</th>}
          </tr>
        </thead>
        <tbody>
          {carregando && (
            <tr>
              <td style={estilos.celulaAviso} colSpan={colunas.length + 1}>
                Carregando...
              </td>
            </tr>
          )}

          {!carregando && dados.length === 0 && (
            <tr>
              <td style={estilos.celulaAviso} colSpan={colunas.length + 1}>
                {mensagemVazio}
              </td>
            </tr>
          )}

          {!carregando &&
            dados.map((linha) => (
              <tr key={linha.id}>
                {colunas.map((coluna) => (
                  <td key={coluna.chave} style={estilos.celula}>
                    {coluna.formatar ? coluna.formatar(linha) : linha[coluna.chave]}
                  </td>
                ))}

                {acoes.length > 0 && (
                  <td style={estilos.celula}>
                    <div style={estilos.linhaAcoes}>
                      {acoes.map((acao) => (
                        <button
                          key={acao.chave}
                          title={acao.titulo}
                          onClick={() => acao.aoClicar(linha)}
                          style={{ ...estilos.botaoAcao, color: acao.cor }}
                        >
                          {acao.icone}
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

const estilos = {
  container: {
    backgroundColor: paleta.neutros.cartao,
    border: `1px solid ${paleta.neutros.borda}`,
    borderRadius: raioBorda.lg,
    overflow: 'hidden',
  },
  cabecalho: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: espacamento.lg,
    padding: espacamento.lg,
    borderBottom: `1px solid ${paleta.neutros.borda}`,
  },
  titulo: {
    ...tipografia.tituloMedio,
    margin: 0,
    color: paleta.textos.primario,
  },
  tabela: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  celulaCabecalho: {
    ...tipografia.rotulo,
    textAlign: 'left',
    whiteSpace: 'nowrap',
    color: paleta.textos.secundario,
    padding: `${espacamento.md}px ${espacamento.lg}px`,
    borderBottom: `1px solid ${paleta.neutros.borda}`,
  },
  celula: {
    ...tipografia.corpo,
    color: paleta.textos.primario,
    padding: `${espacamento.md}px ${espacamento.lg}px`,
    borderBottom: `1px solid ${paleta.neutros.borda}`,
  },
  celulaAviso: {
    ...tipografia.corpo,
    color: paleta.textos.secundario,
    padding: espacamento.xl,
    textAlign: 'center',
  },
  linhaAcoes: {
    display: 'flex',
    gap: espacamento.sm,
  },
  botaoAcao: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: espacamento.xs,
    display: 'flex',
  },
};
