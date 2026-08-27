import { FaRunning } from 'react-icons/fa';
import { paleta, espacamento, raioBorda } from '@/src/tema';

export function Logo({ tamanhoIcone = 36, horizontal = false }) {
  return (
    <div style={horizontal ? estilos.containerHorizontal : estilos.container}>
      <div style={{ ...estilos.circuloIcone, width: tamanhoIcone * 2, height: tamanhoIcone * 2 }}>
        <FaRunning size={tamanhoIcone} color={paleta.neutros.branco} />
      </div>
      <div>
        <p style={{ ...estilos.nomeMarca, fontSize: horizontal ? 18 : 32 }}>Flor</p>
        <p style={{ ...estilos.subtitulo, fontSize: horizontal ? 11 : 13 }}>
          Saúde &amp; Bem-estar feminino
        </p>
      </div>
    </div>
  );
}

const estilos = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: espacamento.sm,
    textAlign: 'center',
  },
  containerHorizontal: {
    display: 'flex',
    alignItems: 'center',
    gap: espacamento.md,
  },
  circuloIcone: {
    backgroundColor: paleta.rosas.marca,
    borderRadius: raioBorda.lg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  nomeMarca: {
    margin: 0,
    fontWeight: 700,
    color: paleta.textos.primario,
    letterSpacing: -0.5,
  },
  subtitulo: {
    margin: 0,
    color: paleta.textos.secundario,
  },
};
