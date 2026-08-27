import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import { Color, TextStyle } from '@tiptap/extension-text-style';
import { useRef } from 'react';
import {
  FaBold,
  FaImage,
  FaItalic,
  FaLink,
  FaListOl,
  FaListUl,
  FaQuoteRight,
  FaRedo,
  FaStrikethrough,
  FaUnderline,
  FaUndo,
  FaVideo,
} from 'react-icons/fa';
import { enviarMidia } from '@/src/servicos';
import { paleta, espacamento, raioBorda, tipografia } from '@/src/tema';

const NIVEIS_TITULO = [1, 2, 3];

export function EditorRico({ conteudoInicial, aoMudar }) {
  const seletorArquivo = useRef(null);

  const editor = useEditor({
    extensions: [StarterKit, TextStyle, Color, Image, Youtube],
    content: conteudoInicial,
    onUpdate: ({ editor: instancia }) => aoMudar(instancia.getHTML()),
  });

  if (!editor) {
    return null;
  }

  const inserirImagem = async (evento) => {
    const { urlAbsoluta } = await enviarMidia(evento.target.files[0]);
    editor.chain().focus().setImage({ src: urlAbsoluta }).run();
    evento.target.value = '';
  };

  const inserirVideo = () => {
    const url = window.prompt('Cole o link do vídeo no YouTube:');
    if (url) {
      editor.commands.setYoutubeVideo({ src: url, width: 640, height: 360 });
    }
  };

  const inserirLink = () => {
    const url = window.prompt('Cole o endereço do link:');
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  return (
    <div style={estilos.container}>
      <div style={estilos.barraFerramentas}>
        {NIVEIS_TITULO.map((nivel) => (
          <Ferramenta
            key={nivel}
            titulo={`Título ${nivel}`}
            ativo={editor.isActive('heading', { level: nivel })}
            aoClicar={() => editor.chain().focus().toggleHeading({ level: nivel }).run()}
          >
            H{nivel}
          </Ferramenta>
        ))}

        <Ferramenta
          titulo="Parágrafo"
          ativo={editor.isActive('paragraph')}
          aoClicar={() => editor.chain().focus().setParagraph().run()}
        >
          P
        </Ferramenta>

        <span style={estilos.divisor} />

        <Ferramenta
          titulo="Negrito"
          ativo={editor.isActive('bold')}
          aoClicar={() => editor.chain().focus().toggleBold().run()}
        >
          <FaBold />
        </Ferramenta>
        <Ferramenta
          titulo="Itálico"
          ativo={editor.isActive('italic')}
          aoClicar={() => editor.chain().focus().toggleItalic().run()}
        >
          <FaItalic />
        </Ferramenta>
        <Ferramenta
          titulo="Sublinhado"
          ativo={editor.isActive('underline')}
          aoClicar={() => editor.chain().focus().toggleUnderline().run()}
        >
          <FaUnderline />
        </Ferramenta>
        <Ferramenta
          titulo="Tachado"
          ativo={editor.isActive('strike')}
          aoClicar={() => editor.chain().focus().toggleStrike().run()}
        >
          <FaStrikethrough />
        </Ferramenta>

        <span style={estilos.divisor} />

        <Ferramenta
          titulo="Lista com marcadores"
          ativo={editor.isActive('bulletList')}
          aoClicar={() => editor.chain().focus().toggleBulletList().run()}
        >
          <FaListUl />
        </Ferramenta>
        <Ferramenta
          titulo="Lista numerada"
          ativo={editor.isActive('orderedList')}
          aoClicar={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <FaListOl />
        </Ferramenta>
        <Ferramenta
          titulo="Citação"
          ativo={editor.isActive('blockquote')}
          aoClicar={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <FaQuoteRight />
        </Ferramenta>

        <span style={estilos.divisor} />

        <input
          type="color"
          title="Cor do texto"
          style={estilos.seletorCor}
          value={editor.getAttributes('textStyle').color ?? paleta.textos.primario}
          onChange={(evento) => editor.chain().focus().setColor(evento.target.value).run()}
        />

        <Ferramenta titulo="Link" ativo={editor.isActive('link')} aoClicar={inserirLink}>
          <FaLink />
        </Ferramenta>
        <Ferramenta titulo="Imagem" aoClicar={() => seletorArquivo.current.click()}>
          <FaImage />
        </Ferramenta>
        <Ferramenta titulo="Vídeo do YouTube" aoClicar={inserirVideo}>
          <FaVideo />
        </Ferramenta>

        <span style={estilos.divisor} />

        <Ferramenta titulo="Desfazer" aoClicar={() => editor.chain().focus().undo().run()}>
          <FaUndo />
        </Ferramenta>
        <Ferramenta titulo="Refazer" aoClicar={() => editor.chain().focus().redo().run()}>
          <FaRedo />
        </Ferramenta>
      </div>

      <EditorContent editor={editor} className="editor-rico" />

      <input
        ref={seletorArquivo}
        type="file"
        accept="image/*"
        hidden
        onChange={inserirImagem}
      />
    </div>
  );
}

function Ferramenta({ titulo, ativo, aoClicar, children }) {
  return (
    <button
      type="button"
      title={titulo}
      onClick={aoClicar}
      style={{
        ...estilos.ferramenta,
        backgroundColor: ativo ? paleta.rosas.claro : paleta.neutros.branco,
        color: ativo ? paleta.rosas.marca : paleta.textos.primario,
      }}
    >
      {children}
    </button>
  );
}

const estilos = {
  container: {
    border: `1px solid ${paleta.neutros.borda}`,
    borderRadius: raioBorda.md,
    overflow: 'hidden',
    backgroundColor: paleta.neutros.branco,
  },
  barraFerramentas: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: espacamento.xs,
    padding: espacamento.sm,
    borderBottom: `1px solid ${paleta.neutros.borda}`,
    backgroundColor: paleta.neutros.fundo,
  },
  ferramenta: {
    ...tipografia.rotulo,
    minWidth: 32,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: `1px solid ${paleta.neutros.borda}`,
    borderRadius: raioBorda.sm,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  divisor: {
    width: 1,
    height: 24,
    backgroundColor: paleta.neutros.borda,
    margin: `0 ${espacamento.xs}px`,
  },
  seletorCor: {
    width: 32,
    height: 32,
    padding: 2,
    border: `1px solid ${paleta.neutros.borda}`,
    borderRadius: raioBorda.sm,
    cursor: 'pointer',
    background: paleta.neutros.branco,
  },
};
