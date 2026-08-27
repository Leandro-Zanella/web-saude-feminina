import { useState } from 'react';
import { paleta, espacamento, raioBorda, tipografia } from '@/src/tema';

const VARIANTES = {
  primario: { fundo: paleta.rosas.botao, pressionado: paleta.rosas.pressionado, texto: paleta.neutros.branco },
  contorno: { fundo: paleta.neutros.branco, pressionado: paleta.rosas.claro, texto: paleta.rosas.marca },
  perigo: { fundo: paleta.estados.erro, pressionado: '#B23636', texto: paleta.neutros.branco },
};

export function Botao({
  titulo,
  icone,
  variante = 'primario',
  carregando = false,
  desabilitado = false,
  estiloAdicional,
  ...demaisPropriedades
}) {
  const [pressionado, definirPressionado] = useState(false);
  const inativo = desabilitado || carregando;
  const cores = VARIANTES[variante];

  return (
    <button
      {...demaisPropriedades}
      disabled={inativo}
      onMouseEnter={() => definirPressionado(true)}
      onMouseLeave={() => definirPressionado(false)}
      style={{
        ...estilos.botao,
        color: cores.texto,
        backgroundColor: inativo
          ? paleta.rosas.desabilitado
          : pressionado
            ? cores.pressionado
            : cores.fundo,
        border: variante === 'contorno' ? `1px solid ${paleta.rosas.marca}` : '1px solid transparent',
        cursor: inativo ? 'default' : 'pointer',
        ...estiloAdicional,
      }}
    >
      {icone}
      {carregando ? 'Aguarde...' : titulo}
    </button>
  );
}

const estilos = {
  botao: {
    ...tipografia.botao,
    borderRadius: raioBorda.md,
    padding: `${espacamento.md}px ${espacamento.lg}px`,
    minHeight: 44,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: espacamento.sm,
    fontFamily: 'inherit',
  },
};
