# Imports Brasil Estoque – versão web para a empresa

Mesmo sistema de antes, agora com **login** e **dados compartilhados em tempo real**:
o que um funcionário lança aparece na hora para todos, em qualquer celular ou computador.
Tudo roda em planos **gratuitos** (Firebase + um host estático).

Arquivos:
- `index.html`, `sw.js`, `manifest.json`, `icon-*.png` – o site
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

## Como atualizar o site no GitHub
No repositório: **Add file > Upload files** e envie estes arquivos, substituindo os antigos:

- `index.html`
- `sw.js`
- `manifest.json`
- `LEIA-ME.md`

**Não substitua o seu `firebase-config.js`**: ele já tem os dados do seu projeto e este
pacote não mexe nele.

Depois de ~1 minuto, abra o site e atualize a página. No celular, se continuar aparecendo
a versão antiga, feche a aba (ou o app na tela inicial) e abra de novo: o sistema busca a
versão nova sozinho.
