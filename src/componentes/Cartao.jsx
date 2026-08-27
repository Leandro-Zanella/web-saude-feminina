import { paleta, espacamento, raioBorda } from '@/src/tema';

export function Cartao({ children, estiloAdicional }) {
  return <div style={{ ...estilos.cartao, ...estiloAdicional }}>{children}</div>;
}

const estilos = {
  cartao: {
    backgroundColor: paleta.neutros.cartao,
    border: `1px solid ${paleta.neutros.borda}`,
    borderRadius: raioBorda.lg,
    padding: espacamento.xl,
  },
};
