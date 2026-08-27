# Flor — Gestão Web de conteúdo

Interface web de administração do [app Flor](../app-saude-feminina), consumindo a
[API Spring](../api-saude-feminina). Permite criar, editar e excluir artigos com um
editor hipermídia (texto formatado, imagens e vídeos) e gerenciar as contas de
administrador.

Construído em **React + Vite** com JavaScript e convenções em português, espelhando
o padrão de código do app.

---

## Stack

- **React 19** + **Vite 8**
- **react-router-dom 7** (rotas)
- **TipTap 3** (editor de texto rico)
- **react-icons** (FontAwesome 5, o mesmo conjunto de ícones do app)
- **oxlint**

---

## Como rodar

A API precisa estar no ar antes:

```bash
cd ../api-saude-feminina
docker compose up -d      # Postgres na 5432
./mvnw spring-boot:run    # API na 8080
```

Depois:

```bash
npm install
npm run dev               # http://localhost:5173
```

O endereço da API é `http://localhost:8080`. Para apontar para outro ambiente,
defina `VITE_API_URL` no `.env`.

Só entra quem tem `role = ADMIN`. O `data.sql` da API já semeia o primeiro:

```
admin@saudefeminina.com / admin123
```

Os demais saem pela própria tela de Administradores, que exige um admin logado.

---

## Estrutura do projeto

```text
src/
├── tema/                         # paleta e medidas isoladas (mesmas do app)
│   ├── paleta.js                 # cores agrupadas por família
│   ├── espacamento.js            # espacamento + raioBorda
│   ├── tipografia.js
│   └── index.js
├── servicos/                     # única camada que conhece a API
│   ├── configuracao.js           # URL_BASE_API + montarUrlMidia
│   ├── clienteHttp.js            # fetch com Bearer e ErroApi
│   ├── sessao.js                 # token e usuário no localStorage
│   ├── autenticacao.js           # autenticar, encerrarSessao
│   ├── artigos.js                # CRUD de artigo
│   ├── usuarios.js               # listar e criar administradores
│   ├── midia.js                  # upload de imagem
│   └── index.js
├── contextos/
│   └── ContextoUsuario.jsx       # ProvedorUsuario + hook useUsuario
├── componentes/
│   ├── Tabela.jsx                # tabela genérica (colunas + dados + ações)
│   ├── EditorRico.jsx            # TipTap com barra de ferramentas
│   ├── LayoutAdmin.jsx           # cabeçalho fixo + abas + outlet
│   ├── RotaProtegida.jsx         # redireciona para /login sem sessão
│   ├── Botao.jsx, CampoTexto.jsx, Cartao.jsx, Logo.jsx
│   └── index.js
├── paginas/
│   ├── Login/                    # index.jsx + FormularioLogin.jsx
│   ├── Artigos/                  # index.jsx (tabela) + FormularioArtigo.jsx
│   └── Usuarios/                 # index.jsx (tabela) + FormularioUsuario.jsx
├── utilitarios/formatacao.js     # formatarData
├── App.jsx                       # rotas
└── index.css                     # reset + estilos da área de digitação
```

---

## Convenções

- **Idioma**: variáveis, funções, props e comentários em português
  (`definirTitulo`, `aoEnviar`, `carregando`, `estilos`).
- **Path alias**: `@/*` resolve para a raiz (`vite.config.js` + `jsconfig.json`).
  Todos os imports internos usam `@/src/...`.
- **Estilo em objetos**: sem CSS-in-JS ou biblioteca de UI. Cada arquivo termina
  com um `const estilos = { ... }` aplicado via `style={...}`, igual ao
  `StyleSheet.create` do app. O `index.css` guarda só o reset e o que precisa de
  seletor real (a área de digitação do TipTap).
- **Separação página ↔ formulário**: `index.jsx` compõe a tela, `FormularioX.jsx`
  cuida de estado, validação e envio.
- **Tradução de nomes**: a API responde em inglês (`title`, `contentHtml`), a web
  usa português. A conversão acontece só em `src/servicos/`.

---

## Rotas

| Caminho | Tela | Acesso |
|---|---|---|
| `/login` | `PaginaLogin` | público |
| `/artigos` | `PaginaArtigos` (tabela) | admin |
| `/artigos/novo` | `FormularioArtigo` (criação) | admin |
| `/artigos/:id` | `FormularioArtigo` (edição) | admin |
| `/usuarios` | `PaginaUsuarios` (tabela) | admin |
| `/usuarios/novo` | `FormularioUsuario` (criação) | admin |
| `/usuarios/:id` | `FormularioUsuario` (edição) | admin |

`RotaProtegida` envolve tudo que não é `/login` e redireciona quando não há sessão.

---

## Sessão

`autenticar()` recusa quem não é `ADMIN` — o login responde 200 para qualquer
usuário válido, então a checagem do papel acontece logo depois, antes de guardar a
sessão. Usuário e token ficam no `localStorage` (chave `flor.sessao`), para o F5
não derrubar a sessão.

---

## Tabela genérica

`Tabela` é usada pelas duas listagens. Recebe os dados e a definição das colunas:

```jsx
const COLUNAS = [
  { chave: 'titulo', rotulo: 'Título' },
  { chave: 'atualizadoEm', rotulo: 'Atualizado em', formatar: (linha) => formatarData(linha.atualizadoEm) },
];

<Tabela
  titulo="Artigos"
  colunas={COLUNAS}
  dados={artigos}
  acoes={[{ chave: 'editar', icone: <FaPen />, titulo: 'Editar', aoClicar: (linha) => navegar(`/artigos/${linha.id}`) }]}
  rotuloAdicionar="Novo artigo"
  aoAdicionar={() => navegar('/artigos/novo')}
/>
```

| Prop | Descrição |
|---|---|
| `colunas` | `[{ chave, rotulo, formatar? }]` — `formatar` recebe a linha inteira |
| `dados` | Array de registros; cada um precisa de `id` |
| `acoes` | `[{ chave, icone, titulo, cor, aoClicar(linha) }]` — botões no fim da linha |
| `aoAdicionar` | Quando presente, mostra o botão de criação no cabeçalho |

---

## Formulário de artigo

Um único componente serve criação e edição, decidido pela flag `modoEdicao`
(derivada da presença do `:id` na rota). Em modo edição ele busca o artigo por
`GET /api/article/{id}` antes de montar o editor, para o TipTap já iniciar com o
conteúdo carregado.

### Editor rico

Extensões: `StarterKit` (títulos, negrito, itálico, sublinhado, tachado, listas,
citação, link, desfazer/refazer), `TextStyle` + `Color` (cor do texto), `Image`
e `Youtube`.

### Imagens: relativo × absoluto

O `POST /api/media` devolve o caminho relativo (`/media/uuid.png`).

- **Capa** é gravada **relativa**, porque o app já roda `montarUrlMidia` no
  `coverImageUrl`.
- **Imagens dentro do conteúdo** entram no HTML com a **URL absoluta**, porque o
  app renderiza o `contentHtml` cru numa `WebView` e não resolveria um caminho
  relativo.

---

## Integração com o app

O app chama `listarArtigos()` dentro de um `useFocusEffect`, então basta voltar
para a aba Conteúdos para ver o que foi criado, editado ou excluído aqui. O
`VisualizadorHtml` do app renderiza o HTML numa `WebView`, o que faz imagens e
iframes de vídeo aparecerem como no editor.

---

## Endpoints consumidos

| Método | Rota | Uso na web |
|---|---|---|
| `POST` | `/api/user/login` | entrar (recusa quem não é `ADMIN`) |
| `GET` | `/api/user/admins` | tabela de administradores |
| `GET` | `/api/user/{id}` | carregar o formulário em modo edição |
| `POST` | `/api/user` | criar administrador (papel vai no corpo) |
| `PUT` | `/api/user/{id}` | editar nome e e-mail |
| `DELETE` | `/api/user/{id}` | exclusão lógica (`deleted_at`) |
| `GET` | `/api/article` | tabela de artigos |
| `GET` | `/api/article/{id}` | carregar o formulário em modo edição |
| `POST` | `/api/article` | criar artigo |
| `PUT` | `/api/article/{id}` | editar artigo |
| `DELETE` | `/api/article/{id}` | excluir artigo |
| `POST` | `/api/media` | upload de imagem (campo `file`) |

O `POST /api/user/register` não é usado aqui: ele é o cadastro público do app e
grava sempre `USER`. A criação de administrador passa pelo `POST /api/user`, que
exige token de `ADMIN`.

A senha só existe no formulário de criação. A edição manda apenas nome, e-mail e
papel — troca de credencial não faz parte desta tela.

---

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção em `dist/` |
| `npm run preview` | Pré-visualiza o build |
| `npm run lint` | oxlint |
