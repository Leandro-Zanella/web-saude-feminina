import { useState } from 'react';
import { Botao, CampoTexto } from '@/src/componentes';
import { paleta, espacamento } from '@/src/tema';

export function FormularioLogin({ aoEnviar, carregando, erroGeral }) {
  const [email, definirEmail] = useState('');
  const [senha, definirSenha] = useState('');
  const [erros, definirErros] = useState({});

  const validar = () => {
    const novosErros = {};
    if (!email.trim()) {
      novosErros.email = 'Informe seu e-mail.';
    }
    if (!senha) {
      novosErros.senha = 'Informe sua senha.';
    }
    definirErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const lidarComEnvio = (evento) => {
    evento.preventDefault();
    if (validar()) {
      aoEnviar({ email: email.trim(), senha });
    }
  };

  return (
    <form style={estilos.formulario} onSubmit={lidarComEnvio}>
      <CampoTexto
        rotulo="E-mail"
        type="email"
        value={email}
        onChange={(evento) => definirEmail(evento.target.value)}
        mensagemErro={erros.email}
      />

      <CampoTexto
        rotulo="Senha"
        type="password"
        value={senha}
        onChange={(evento) => definirSenha(evento.target.value)}
        mensagemErro={erros.senha}
      />

      {erroGeral && <span style={estilos.erroGeral}>{erroGeral}</span>}

      <Botao titulo="Entrar" type="submit" carregando={carregando} />
    </form>
  );
}

const estilos = {
  formulario: {
    display: 'flex',
    flexDirection: 'column',
    gap: espacamento.lg,
  },
  erroGeral: {
    fontSize: 13,
    color: paleta.estados.erro,
    textAlign: 'center',
  },
};
