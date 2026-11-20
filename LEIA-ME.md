# Imports Brasil Estoque – versão web para a empresa

Mesmo sistema de antes, agora com **login** e **dados compartilhados em tempo real**:
o que um funcionário lança aparece na hora para todos, em qualquer celular ou computador.
Tudo roda em planos **gratuitos** (Firebase + um host estático).

Arquivos:
- `index.html`, `sw.js`, `manifest.json`, `logo.png`, `icon-*.png` – o site
- `firebase-config.js` – **você edita** (passo 4)
- `firestore.rules` – regras de segurança do banco (passo 3)

---

## 1) Criar o projeto no Firebase (grátis)
1. Acesse https://console.firebase.google.com e entre com uma conta Google da empresa.
2. **Adicionar projeto** → nome `imports-brasil-estoque` → pode desativar o Google Analytics → Criar.

## 2) Ligar o banco e o login
1. Menu **Build > Firestore Database > Criar banco de dados**. Escolha o local **southamerica-east1 (São Paulo)** e **modo de produção**.
2. Menu **Build > Authentication > Vamos começar > E-mail/senha > Ativar > Salvar**.
3. Ainda em Authentication, aba **Settings > User actions**: **desmarque "Enable create (sign-up)"**.
   Isso impede que estranhos criem conta. Só você cria usuários.
4. Aba **Users > Add user**: cadastre e-mail e senha de cada funcionário.

## 3) Colar as regras de segurança
Firestore Database > aba **Regras** > apague tudo, cole o conteúdo de `firestore.rules` > **Publicar**.

## 4) Conectar o site ao seu projeto
1. Engrenagem (Configurações do projeto) > **Geral** > "Seus apps" > ícone **</>** (Web) > apelido `estoque` > Registrar app.
2. Copie os valores `apiKey`, `authDomain`, `projectId` e `appId` e cole em `firebase-config.js`, no lugar dos `COLE_AQUI`.
   (Esses valores não são secretos; a proteção é o login + regras.)

## 5) Publicar o site (escolha UMA opção grátis)
- **Netlify (mais fácil):** https://app.netlify.com/drop → arraste a **pasta** inteira. Pronto, você recebe um endereço `https://xxxx.netlify.app`.
- **GitHub Pages:** crie um repositório, envie todos os arquivos, Settings > Pages > Deploy from branch (main, /root).
- **Cloudflare Pages / Firebase Hosting:** também funcionam (site estático).

## 6) Autorizar o endereço no login
Firebase > Authentication > Settings > **Authorized domains > Add domain** → adicione o endereço do seu site
(ex.: `xxxx.netlify.app` ou `seuusuario.github.io`). Sem isso o login é recusado.

## 7) Usar
- Abra o endereço no celular/PC e entre com e-mail e senha.
- No celular: menu do navegador > **Adicionar à tela inicial** (vira um app).
- Para atualizar o site depois, publique os arquivos de novo (o sistema pega a versão nova sozinho).

---

## Trazer os dados da versão antiga
Na versão antiga (a que guardava no aparelho): aba Estoque > **Baixar backup**.
Na versão nova: aba Estoque > **Importar backup** e escolha o arquivo.
Faça isso uma vez só, em um aparelho (a restauração substitui os dados de todos).

## Backup
Faça **Baixar backup** com frequência (ex.: toda semana) e guarde o arquivo.

## O que mudou em relação à versão antiga
- Login obrigatório; cada movimentação e pedido registra o **e-mail de quem lançou**.
- Dados na nuvem, compartilhados; saídas/baixas usam transações, então dois usuários
  nunca baixam o mesmo estoque ao mesmo tempo nem baixam o mesmo pedido duas vezes.
- Histórico mostra as 500 movimentações mais recentes (o backup leva todas).
- Precisa de internet para lançar movimentações (para consultar, o último estado fica salvo no aparelho).

## Limites do plano gratuito (Firebase Spark)
50 mil leituras e 20 mil gravações por dia, 1 GB. Para uma equipe pequena/média é mais que suficiente.
Todos os usuários logados têm as mesmas permissões (inclusive apagar e restaurar backup).

---

## Novidades desta atualização (visual e celular)
Interface refeita, sem mudar nenhuma função do sistema (login, estoque, pedidos, histórico,
etiquetas e relatórios continuam iguais).

- **Feita para o celular:** as tabelas de Estoque, Histórico e Relatório viram cartões
  empilhados, com os nomes dos campos ao lado de cada valor — nada mais de arrastar a
  tabela para o lado nem texto cortado.
- **Campos e botões maiores**, do tamanho certo para o dedo, e teclado que não dá zoom
  automático no iPhone.
- **Menu de abas em pílulas**, sempre rolando até a aba aberta.
- **Visual mais moderno:** cabeçalho com logotipo, cartões arredondados, sombras suaves,
  cor da marca mais viva, tela de login nova e avisos flutuantes.
- **Modo escuro** automático (acompanha o celular/computador) e respeito à área segura
  do iPhone (notch).
- **Relatório/impressão** continuam em tabela normal no papel.
- O site guarda a versão nova em cache assim que abre (`sw.js` atualizado).
- **Lista de produtos recolhida:** na aba Estoque, a lista de produtos cadastrados começa
  fechada (só o título e a contagem) e abre no botão **Expandir** — a tela fica bem mais curta
  no celular. Ao usar a busca, a lista abre sozinha.
- **Etiquetas:** novo campo **CPF / CNPJ (opcional)**. Se preenchido, sai impresso na etiqueta
  abaixo do nome do destinatário; o valor fica guardado no aparelho para a próxima etiqueta.
- **Calculadora:** ícone no canto superior direito abre uma calculadora em popup (somar,
  subtrair, multiplicar e dividir) para conferir valores sem sair da tela.
- **Soma por produto:** na aba Estoque, um cartão **Soma por produto** agrupa automaticamente
  os produtos que têm o mesmo nome e mostra o total somado — por exemplo, babydoll em P, M e G
  aparece como um grupo só, com a soma e a quantidade de cada tamanho. O grupo mostra ainda
  quantas variações existem, o estoque mínimo somado e a situação (Em estoque, Baixo ou Zerado).
  A busca do estoque também filtra os grupos.
- **Pedidos com tamanho:** na aba Pedidos (e em Movimentar), a lista de produtos mostra o nome
  completo com o tamanho e o saldo — por exemplo `IMP-0031 – Babydoll (P) · 14 un.`. Os itens
  adicionados ao pedido e os pedidos já criados também aparecem com o tamanho ao lado do nome.
- **Soma por produto no Relatório:** a aba Relatório agora tem a tabela **Soma por produto**
  (antes do inventário completo), com cada produto agrupado, o total somado de todas as
  variações, o detalhe `tamanho × quantidade`, o mínimo somado e a situação. Ela também sai
  no PDF (botão **Gerar PDF**), junto com o resto do relatório.
- **Tamanhos / Variações:** no cadastro de **Novo produto** (aba Estoque), o campo agora se
  chama **Tamanhos / Variações** e aceita qualquer variação, não só letra de tamanho —
  por exemplo `P, M, G` ou `10ml, 20ml`.
- **Tabelas recolhíveis no Relatório:** as seções **Soma por produto** e **Inventário completo**
  agora começam recolhidas, com um botão **Expandir / Recolher** em cada uma — a página fica
  curta e limpa, e o resumo com os números continua sempre visível. No **Gerar PDF** as duas
  tabelas saem completas, recolhidas ou não na tela.
- **CPF / CNPJ com formato automático:** no campo **CPF / CNPJ (opcional)** da aba
  Etiquetas basta digitar os números — o programa coloca os pontos, a barra e o traço
  sozinho e mostra embaixo se o que você digitou é **CPF** (11 números) ou **CNPJ**
  (14 números). Na etiqueta sai escrito `CPF: 000.000.000-00` ou
  `CNPJ: 00.000.000/0000-00` conforme o caso. O campo começa sempre **vazio**: o número
  não fica mais guardado no aparelho.
- **Peso na etiqueta (opcional):** na aba **Etiquetas** há agora o campo **Peso (opcional)**
  — pode digitar livremente, por exemplo `2,5 kg` ou `850 g`. Se preenchido, o peso sai
  impresso na etiqueta logo abaixo do CPF/CNPJ; se ficar em branco, nada muda na etiqueta.
  O valor fica guardado no aparelho para a próxima etiqueta.
- **Logo da empresa no programa:** o logotipo IMPORTS BRASIL aparece no cabeçalho e na tela
  de login (substituiu o quadradinho com "IB").
- **Ícone e nome ao instalar no celular:** quando o site é adicionado à tela inicial
  (Android: "Instalar app" / iPhone: "Adicionar à Tela de Início"), o atalho agora usa a
  **logo da empresa** como ícone e aparece com o nome **IMPORTS BRASIL**.
- **Pedido em PDF:** cada pedido criado na aba **Pedidos** agora tem o botão
  **Pedido em PDF**. Ele gera o documento do pedido (com o nome da empresa no topo, número,
  cliente, cidade de destino, data, situação, quem lançou e a lista de itens com código e
  quantidade) pronto para salvar, imprimir ou enviar ao cliente no WhatsApp. O PDF abre em
  uma aba nova; se o celular bloquear a janela, o arquivo é baixado direto.
- **Créditos:** rodapé com o criador do programa (Rafael Antonio) e a versão (2.9).

## Como atualizar o site no GitHub
No repositório: **Add file > Upload files** e envie estes arquivos, substituindo os antigos:

- `index.html`
- `sw.js`
- `manifest.json`
- `logo.png`
- `icon-192.png`
- `icon-180.png`
- `icon-512.png`
- `icon-maskable-512.png`
- `LEIA-ME.md`

**Não substitua o seu `firebase-config.js`**: ele já tem os dados do seu projeto e este
pacote não mexe nele.

Depois de ~1 minuto, abra o site e atualize a página. No celular, se continuar aparecendo
a versão antiga, feche a aba (ou o app na tela inicial) e abra de novo: o sistema busca a
versão nova sozinho.
