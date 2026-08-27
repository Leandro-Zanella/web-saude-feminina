import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Botao, CampoTexto, Cartao, EditorRico } from '@/src/componentes';
import { criarArtigo, editarArtigo, enviarMidia, montarUrlMidia, obterArtigo } from '@/src/servicos';
import { paleta, espacamento, raioBorda, tipografia } from '@/src/tema';

const ARTIGO_VAZIO = { titulo: '', resumo: '', conteudoHtml: '', caminhoCapa: null };

export function FormularioArtigo() {
  const { id } = useParams();
  const navegar = useNavigate();
  const modoEdicao = Boolean(id);
  const seletorCapa = useRef(null);

  const [artigo, definirArtigo] = useState(ARTIGO_VAZIO);
  const [carregando, definirCarregando] = useState(modoEdicao);
  const [salvando, definirSalvando] = useState(false);
  const [erro, definirErro] = useState('');

  useEffect(() => {
    if (modoEdicao) {
      obterArtigo(id).then((encontrado) => {
        definirArtigo(encontrado);
        definirCarregando(false);
      });
    }
  }, [id, modoEdicao]);

  const alterar = (campo, valor) => definirArtigo((atual) => ({ ...atual, [campo]: valor }));

  const trocarCapa = async (evento) => {
    const { caminho } = await enviarMidia(evento.target.files[0]);
    alterar('caminhoCapa', caminho);
    evento.target.value = '';
  };

  const salvar = async (evento) => {
    evento.preventDefault();
    definirErro('');
    definirSalvando(true);
    try {
      if (modoEdicao) {
        await editarArtigo(id, artigo);
      } else {
        await criarArtigo(artigo);
      }
      navegar('/artigos');
    } catch (problema) {
      definirErro(problema.message);
      definirSalvando(false);
    }
  };

  if (carregando) {
    return <p style={estilos.aviso}>Carregando artigo...</p>;
  }

  return (
    <Cartao>
      <h2 style={estilos.titulo}>{modoEdicao ? 'Editar artigo' : 'Novo artigo'}</h2>

      <form style={estilos.formulario} onSubmit={salvar}>
        <CampoTexto
          rotulo="Título"
          value={artigo.titulo}
          onChange={(evento) => alterar('titulo', evento.target.value)}
        />

        <CampoTexto
          rotulo="Resumo"
          multilinha
          value={artigo.resumo ?? ''}
          onChange={(evento) => alterar('resumo', evento.target.value)}
        />

        <div style={estilos.campo}>
          <label style={estilos.rotulo}>Imagem de capa</label>
          <div style={estilos.linhaCapa}>
            {artigo.caminhoCapa && (
              <img src={montarUrlMidia(artigo.caminhoCapa)} alt="Capa" style={estilos.capa} />
            )}
            <Botao
              titulo={artigo.caminhoCapa ? 'Trocar capa' : 'Escolher capa'}
              variante="contorno"
              type="button"
              onClick={() => seletorCapa.current.click()}
            />
          </div>
          <input ref={seletorCapa} type="file" accept="image/*" hidden onChange={trocarCapa} />
        </div>

        <div style={estilos.campo}>
          <label style={estilos.rotulo}>Conteúdo</label>
          <EditorRico
            conteudoInicial={artigo.conteudoHtml}
            aoMudar={(html) => alterar('conteudoHtml', html)}
          />
        </div>

        {erro && <span style={estilos.erro}>{erro}</span>}

        <div style={estilos.acoes}>
          <Botao
            titulo="Cancelar"
            variante="contorno"
            type="button"
            onClick={() => navegar('/artigos')}
          />
          <Botao titulo="Salvar" type="submit" carregando={salvando} />
        </div>
      </form>
    </Cartao>
  );
}

const estilos = {
  titulo: {
    ...tipografia.tituloMedio,
    margin: `0 0 ${espacamento.xl}px`,
    color: paleta.textos.primario,
  },
  formulario: {
    display: 'flex',
    flexDirection: 'column',
    gap: espacamento.lg,
  },
  campo: {
    display: 'flex',
    flexDirection: 'column',
    gap: espacamento.xs,
  },
  rotulo: {
    ...tipografia.rotulo,
    color: paleta.textos.primario,
  },
  linhaCapa: {
    display: 'flex',
    alignItems: 'center',
    gap: espacamento.lg,
  },
  capa: {
    width: 120,
    height: 80,
    objectFit: 'cover',
    borderRadius: raioBorda.md,
    border: `1px solid ${paleta.neutros.borda}`,
  },
  acoes: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: espacamento.md,
  },
  erro: {
    fontSize: 13,
    color: paleta.estados.erro,
  },
  aviso: {
    ...tipografia.corpo,
    color: paleta.textos.secundario,
  },
};
