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
> **Importante:** sempre que atualizar o sistema, publique este arquivo de regras de novo.
> A **lista de usuários** só funciona com as regras novas (versão 4.0 do arquivo).

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

## Novidades da versão 5.0 (cadastro mais rápido e sem duplicar)

### 1) Foto da etiqueta preenche o cadastro

Na aba **Estoque**, no cartão **Novo produto**, apareceu o botão **Fotografar etiqueta do produto**.
Tire (ou escolha) a foto da etiqueta impressa da embalagem e o programa lê o texto e tenta preencher:

- **Nome** do produto (procura a linha “Descrição”, “Produto” ou “Nome”; se não achar, usa a linha
  com mais letras da etiqueta);
- **Código / referência** (procura “REF”, “Código”, “Modelo” ou um código de barras de 8, 12, 13 ou
  14 dígitos);
- **Tamanhos** (procura “TAM” / “Tamanhos” e separa P, M, G, GG…).

O programa só preenche campo **vazio** — não apaga o que você já digitou. Para conferir o que ele
leu, abra **“Texto que o programa leu na foto”**. Como toda leitura de foto, pode errar: **sempre
olhe os campos antes de salvar**. Etiqueta impressa e bem iluminada funciona bem; etiqueta escrita
à mão, amassada ou com brilho costuma não ser lida. A leitura acontece no próprio aparelho (a foto
não é enviada para lugar nenhum) e precisa de internet **na primeira vez**, para baixar o leitor.

### 2) Aviso quando o produto já existe

Ao clicar em **Salvar produto**, se já existe produto com o **mesmo nome e os mesmos tamanhos**
(ignorando maiúsculas, acentos e a ordem dos tamanhos), o programa **não cadastra duplicado**:
mostra um quadro amarelo com o código e a quantidade atual do produto existente e três opções:

- **Somar N un. ao estoque existente** — entra como movimentação “Cadastro somado” no Histórico;
- **Cadastrar como novo mesmo assim** — para quando é outra peça de verdade;
- **Cancelar**.

### 3) Código / referência do fornecedor no produto

O cadastro e a janela **Editar produto** ganharam o campo **Código / referência** (opcional).
Ele aparece embaixo do nome na lista de produtos e entra na **busca** — dá para achar a peça pelo
código do fornecedor, não só pelo IMP-0001.

## Novidades da versão 4.9 (avisos de notificação removidos)

A opção de avisos de pedido novo no celular foi removida a pedido. O que mudou na prática:

- O item **Avisos de pedido novo** saiu do menu.
- O programa não pede mais permissão de notificação e não mostra avisos na tela do celular.
- O aviso amarelo dentro do próprio app, quando outro usuário mexe nos pedidos, continua igual.
- Todo o resto continua funcionando igual, inclusive o modo sem internet.

## Novidades da versão 4.7 (funciona sem internet)

Quando o sinal do galpão cai, dá para continuar trabalhando: o programa guarda a operação
no próprio aparelho e envia ao sistema sozinho quando a conexão volta.

- **Novo pedido sem internet:** a tela aceita normalmente. O pedido fica guardado no aparelho
  e sobe para o sistema quando a internet voltar. O número (PED-…) só é gerado na hora do
  envio — até lá o pedido aparece na faixa azul como “aguardando envio”.
- **Movimentação sem internet** (entrada e saída): igual. O saldo do estoque só é alterado
  quando a operação chega ao sistema, então o saldo mostrado pode ficar desatualizado até lá.
- **Faixa azul no topo da tela:** mostra quantas operações estão guardadas, com os botões
  **Enviar agora**, **Ver lista** e, em cada item, **Tirar** (para apagar algo digitado errado).
- **Envio automático:** a cada vez que a internet volta, o programa envia sozinho (e tenta
  de novo a cada 45 segundos enquanto houver algo pendente).
- **Se um envio não puder ser feito** (ex.: estoque insuficiente na hora de mandar), o item
  fica marcado em vermelho com o motivo, nada é aplicado e nada é perdido.
- **Não duplica:** o programa marca cada operação antes de enviar; se a conexão cair no meio,
  ele percebe que já entrou e não lança duas vezes.
- **O programa abre sem internet:** a tela e os arquivos do Firebase ficam guardados no
  aparelho, então dá para abrir e lançar mesmo sem sinal.
- Continuam precisando de internet: atender pedido, cancelar, excluir, editar pedido ou
  produto, restaurar backup e ver os dados de outros usuários.
- **Atenção:** o que está pendente fica guardado **neste aparelho**. Não limpe os dados do
  navegador nem desinstale o app antes de enviar. A fila guarda até 200 operações.

## Novidades da versão 4.6 (campo de CPF/CNPJ mais limpo)

- Na aba **Etiquetas**, o campo **CPF / CNPJ (opcional)** não mostra mais aquele texto
  pequeno embaixo (“CPF ou CNPJ”). O campo ficou só com o nome e a caixa de digitação.
- O formato automático continua igual: você digita só os números e o programa coloca os
  pontos, a barra e o traço sozinho.

## Novidades da versão 4.5 (toque no celular)

Botões, atalhos e abas ficaram maiores e mais fáceis de acertar com o dedo.
Nenhuma função mudou — só o tamanho e o jeito de tocar.

- **Botões mais altos:** os botões comuns passaram a ter ~50px de altura (o recomendado para
  o dedo é pelo menos 48px), e os botões pequenos das listas (editar, excluir, etc.) ficaram
  com 46px e mais espaço entre eles, para não apertar o botão errado.
- **Atalhos da tela Início maiores**, com ícone maior e texto um pouco maior.
- **Barra inferior mais confortável:** as quatro abas (Início, Pedidos, Etiquetas, Gestão)
  ficaram mais altas, com ícone maior.
- **Menu lateral:** cada item do menu com 52px de altura; o botão de fechar também cresceu.
- **Campos de digitação** com no mínimo 48px de altura.
- **Resposta mais rápida ao toque:** o programa não espera mais o “duplo toque” do navegador,
  então o botão reage na hora, e o retângulo azul de seleção ao tocar some.
- Vale para Android, iPhone e também computador com tela de toque.

## Novidades da versão 4.4 (layout novo)

O programa ganhou a tela inicial com atalhos, menu e barra inferior — o visual pedido,
funcionando igual no **Android, no iPhone e no computador**. Nenhuma função do sistema mudou.

- **Tela Início:** ao entrar, você vê um resumo no topo (produtos, pedidos e unidades), seis
  atalhos grandes — **Pedidos, Etiquetas, Estoque, Relatório, Movimentar e Hist. pedidos** —,
  um aviso quando há produto zerado/abaixo do mínimo (ou pedido pendente) e o botão
  **Criar novo pedido**, que já abre o formulário na aba Pedidos.
- **Menu (ícone ☰ no canto superior esquerdo):** abre a lista de todas as seções e mostra a
  conta logada, o botão **Baixar backup**, o **Tema claro/escuro** e **Sair da conta**.
  O círculo com as iniciais no canto direito abre o mesmo menu.
- **Barra inferior no celular:** **Início · Pedidos · Etiquetas · Gestão**. Gestão abre o
  menu com Estoque, Relatório, Movimentar e os históricos. No computador essa barra some e
  as seções ficam numa faixa de abas no topo.
- **Visual escuro por padrão**, com cartões arredondados e cores nos atalhos — parecido com o
  aplicativo de referência. Se preferir claro, troque em **Menu > Tema claro** (fica salvo no
  aparelho).
- **Computador:** a mesma tela ocupa a largura da janela, com os atalhos em 3 colunas e as
  abas de seções sempre visíveis no topo.
- **Celular:** campos e botões no tamanho do dedo, barra inferior fixa respeitando a área
  segura do iPhone, e o título da seção sempre no topo (não precisa mais rolar até o menu).
- **Cabeçalho fixo:** o título da tela e os botões de menu/conta continuam visíveis ao rolar.

## Novidades das versões anteriores (visual e celular)
Interface refeita, sem mudar nenhuma função do sistema (login, estoque, pedidos, histórico,
etiquetas e relatórios continuam iguais).

- **Feita para o celular:** as tabelas de Estoque, Histórico e Relatório viram cartões
  empilhados, com os nomes dos campos ao lado de cada valor — nada mais de arrastar a
  tabela para o lado nem texto cortado.
- **Campos e botões maiores**, do tamanho certo para o dedo, e teclado que não dá zoom
  automático no iPhone.
- **Aviso de pedidos mexidos por outro usuário:** quando alguém cria, atende, cancela ou
  exclui um pedido, aparece uma faixa amarela no topo da tela, em qualquer aba, dizendo o
  que mudou (ex.: “Novo pedido de Ana (PED-0016). A lista já foi atualizada.”). A lista se
  atualiza sozinha; a faixa tem os botões **Ver pedidos** e **Fechar** e desaparece quando
  você abre a aba Pedidos. Mudanças feitas por você mesmo não geram aviso.
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
- **Logo no PDF do pedido:** o **Pedido em PDF** sai com a **logo da Imports Brasil** no
  topo, à esquerda, na faixa preta do cabeçalho — o documento fica com a cara da empresa.
- **Pedido em PDF:** cada pedido criado na aba **Pedidos** agora tem o botão
  **Pedido em PDF**. Ele gera o documento do pedido (com o nome da empresa no topo, número,
  cliente, cidade de destino, data, situação, quem lançou e a lista de itens com código e
  quantidade) pronto para salvar, imprimir ou enviar ao cliente no WhatsApp. O PDF abre em
  uma aba nova; se o celular bloquear a janela, o arquivo é baixado direto.
- **Nº da nota fiscal na etiqueta:** na aba **Etiquetas**, o campo que antes pedia o número
  do pedido agora se chama **Nº da nota fiscal (vira código de barras)**. O número digitado
  sai impresso embaixo do código de barras com o título **NOTA FISCAL**, no lugar de
  "PEDIDO". Ao escolher um pedido, o destinatário e a cidade continuam preenchendo sozinhos;
  o número da nota fiscal é digitado por você (o campo é limpo ao trocar de pedido, para não
  sair a nota errada na etiqueta).
- **CNPJ do remetente na etiqueta:** na aba **Etiquetas**, embaixo do campo **Remetente**
  apareceu **CNPJ do remetente (Imports Brasil)**. Digite só os números — o programa põe os
  pontos, a barra e o traço sozinho — e o CNPJ sai impresso na faixa escura do topo da
  etiqueta, logo abaixo de **IMPORTS BRASIL**. O valor fica guardado no aparelho para as
  próximas etiquetas; se deixar em branco, a etiqueta continua como antes.
- **Pedido avulso (sem estoque):** o cartão **Pedido avulso (sem estoque)** foi removido da
  aba **Pedidos** na versão 3.6. Para pedidos com itens que não estão cadastrados, use o
  campo **Item fora do estoque (nome livre)** dentro do **Novo pedido** — o pedido pode
  misturar itens do estoque e itens livres, e os itens livres não baixam estoque. Pedidos
  avulsos antigos continuam na lista e no histórico, marcados como “pedido avulso”, com o
  botão **Marcar como atendido**.
- **Histórico de pedidos:** nova aba **Hist. pedidos** com busca em **todos** os pedidos
  (pendentes, atendidos e cancelados). O campo **Buscar por nome** procura no nome do cliente,
  no nome dos itens, no número do pedido, na cidade e no usuário; pode digitar mais de uma
  palavra (ex.: “ana joinville”). Os campos **De** e **Até** filtram por data (o dia final
  entra inteiro), e o filtro **Status** mostra só pendentes, atendidos ou cancelados.
  Cada linha traz data, número, cliente, cidade, itens, total de unidades e status, com os
  botões **PDF** e **Etiqueta**. O botão **Limpar filtros** volta a mostrar todos os pedidos.
- **Item fora do estoque no pedido normal:** dentro de **Novo pedido** (aba Pedidos) há o
  campo **Item fora do estoque (nome livre)**, com tamanho/variação opcional e quantidade.
  Você pode misturar itens do estoque com itens digitados no mesmo pedido — útil quando parte
  do pedido é de outro setor. O item digitado aparece marcado como “fora do estoque”; ao
  clicar em **Dar baixa no estoque**, só os itens cadastrados são descontados e o sistema avisa
  que os itens fora do estoque não alteram o estoque. Se não houver nenhum produto cadastrado,
  o pedido pode ser montado só com itens livres.
- **Editar e excluir pedidos:** cada pedido na lista da aba **Pedidos** tem os botões
  **Editar pedido** e **Excluir pedido**. Em **Editar** dá para corrigir cliente e cidade e,
  enquanto o pedido está **Pendente**, mudar os itens: alterar quantidade (ou deixar 0 para
  tirar), usar **Remover**, adicionar itens do estoque e itens fora do estoque. Pedidos já
  **Atendidos** aceitam só a correção de cliente e cidade (os itens não mudam porque o estoque
  já foi descontado), e pedidos cancelados não são editáveis. **Excluir** funciona para
  qualquer pedido. Ao excluir um pedido **Atendido**, as unidades dos itens do estoque
  **voltam automaticamente** para o estoque, e o programa registra uma **Entrada** no
  histórico de movimentações com a observação **Estorno do pedido PED-XXXX**. Itens fora do
  estoque e pedidos avulsos não mexem no estoque. A exclusão é definitiva e pede confirmação.
- **Peso e volume no pedido:** dentro de **Novo pedido** (aba Pedidos) apareceram os campos
  **Peso (opcional)** e **Volume (opcional)**. Pode digitar livremente, por exemplo `2,5 kg`
  e `3 caixas` ou `0,12 m³`. O peso e o volume aparecem na lista de pedidos, saem no
  **Pedido em PDF** (campos **PESO** e **VOLUME**) e podem ser corrigidos depois pelo botão
  **Editar pedido** — inclusive em pedidos já **Atendidos**, porque essas informações não
  mexem no estoque. Pedidos antigos, criados antes desta versão, também aceitam o
  preenchimento. Ao escolher um pedido na aba **Etiquetas**, o peso do pedido preenche
  sozinho o campo **Peso** da etiqueta (dá para ajustar na hora). O **Hist. pedidos** também
  encontra pedidos pelo peso e pelo volume digitados.
- **Novo pedido mais direto:** o campo **Cliente** saiu do formulário. No lugar dele ficou o
  campo **Pedido feito por**, para anotar o nome de quem fez o pedido, e o campo de destino
  passou a se chamar **Cidade de destino e cliente** — ali você escreve o nome do cliente e a
  cidade juntos, por exemplo `Ana - Joinville / SC`. O nome continua saindo no **Pedido em
  PDF**, no **Hist. pedidos** e na **Etiqueta de envio**: ao escolher o pedido, o programa
  separa o nome antes do hífen (ou da vírgula) como destinatário e o restante como cidade,
  e você pode corrigir os dois campos na hora. O **Pedido em PDF** também passou a mostrar
  **PEDIDO FEITO POR**.
- **Chat e calculadora removidos:** os dois ícones do canto superior direito saíram, junto
  com as janelas de chat e calculadora. A tela ficou mais limpa — o resto do sistema não mudou.
- **Foto da nota fiscal preenche a etiqueta:** na aba **Etiquetas** apareceu o botão
  **Anexar foto da nota fiscal**. Tire uma foto da DANFE (ou escolha uma da galeria) e o
  programa lê o texto da imagem e preenche sozinho o **Destinatário**, o **CPF/CNPJ**, a
  **Cidade / UF**, o **Endereço** (com bairro e CEP), o **Nº da nota fiscal** (tirado da
  chave de acesso) e o **Peso** (peso bruto). O texto lido aparece em “Texto que o programa
  leu na foto”, para você conferir. **Sempre olhe os campos antes de imprimir** — foto
  tremida, escura ou torta pode fazer o programa errar. Na primeira vez o programa baixa
  um leitor de texto (~15 MB) e por isso precisa de internet; depois fica mais rápido.
  A foto não é enviada para lugar nenhum: a leitura acontece no próprio celular/computador.
- **Créditos:** rodapé com o criador do programa (Rafael Antonio) e a versão (5.0).

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
