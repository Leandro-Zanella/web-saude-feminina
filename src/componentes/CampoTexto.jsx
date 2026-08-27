import { useState } from 'react';
import { paleta, espacamento, raioBorda, tipografia } from '@/src/tema';

export function CampoTexto({ rotulo, mensagemErro, multilinha = false, ...demaisPropriedades }) {
  const [focado, definirFocado] = useState(false);
  const Elemento = multilinha ? 'textarea' : 'input';

  const borda = mensagemErro
    ? paleta.estados.erro
    : focado
      ? paleta.rosas.marca
      : 'transparent';

  return (
    <div style={estilos.container}>
      <label style={estilos.rotulo}>{rotulo}</label>
      <Elemento
        {...demaisPropriedades}
        onFocus={() => definirFocado(true)}
        onBlur={() => definirFocado(false)}
        style={{ ...estilos.entrada, border: `1px solid ${borda}`, minHeight: multilinha ? 80 : 0 }}
      />
      {mensagemErro && <span style={estilos.mensagemErro}>{mensagemErro}</span>}
    </div>
  );
}

const estilos = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: espacamento.xs,
  },
  rotulo: {
    ...tipografia.rotulo,
    color: paleta.textos.primario,
  },
  entrada: {
    backgroundColor: paleta.neutros.campo,
    borderRadius: raioBorda.md,
    padding: `${espacamento.md}px ${espacamento.lg}px`,
    fontSize: 14,
    fontFamily: 'inherit',
    color: paleta.textos.primario,
    outline: 'none',
    resize: 'vertical',
  },
  mensagemErro: {
    fontSize: 12,
    color: paleta.estados.erro,
  },
};
