# Guia: Como configurar o Banco de Dados no Vercel

### Por que mudar do SQLite?
O **SQLite** (seu banco atual) guarda os dados em um arquivo local (`db.sqlite3`). No Vercel, o sistema de arquivos é **"read-only"** (somente leitura) e **"ephemeral"** (temporário). 
- **Read-only**: O Vercel impede a escrita no arquivo, por isso o erro `readonly database`.
- **Ephemeral**: Mesmo que funcionasse, cada vez que o servidor reiniciasse ou você fizesse um novo deploy, todos os seus dados (transações, usuários) seriam apagados.

Para produção, precisamos de um banco de dados **externo e persistente**. A opção mais fácil para quem usa Vercel é o **Vercel Postgres**.

---

### Passo a Passo: Configurando o Vercel Postgres

Siga estas instruções no seu navegador:

#### 1. Criar o Banco de Dados
1. Acesse o [Dashboard da Vercel](https://vercel.com/dashboard).
2. Clique no seu projeto (`finance-api` ou similar).
3. Na barra superior, clique na aba **Storage**.
4. Clique em **Create Database** e selecione **Postgres**.
5. Clique em **Continue**, aceite os termos e selecione uma região próxima a você (ex: `Washington, D.C. (iad1)`).
6. Clique em **Create**.

#### 2. Conectar ao Projeto
1. Após a criação, você verá uma tela de "Connect Project".
2. Certifique-se de que seu projeto está selecionado e clique em **Connect**.
3. A Vercel vai gerar automaticamente várias variáveis de ambiente (como `POSTGRES_URL`, `POSTGRES_USER`, etc.).

#### 3. Configurar a Variável Principal
O Django (usando a biblioteca `dj-database-url` que já configurei) procura por uma variável chamada `DATABASE_URL`.
1. No dashboard do seu projeto, vá em **Settings** > **Environment Variables**.
2. Verifique se existe a variável `POSTGRES_URL`.
3. Clique em **Add New Variable**:
   - **Key**: `DATABASE_URL`
   - **Value**: Copie e cole o mesmo valor que está em `POSTGRES_URL`.
4. Salve a alteração.

#### 4. Atualizar o Build Command
Para que o banco de dados seja criado corretamente (com as tabelas de transações, usuários, etc.), precisamos rodar as "migrations" durante o deploy.
1. Vá em **Settings** > **General**.
2. Procure a seção **Build & Development Settings**.
3. Em **Build Command**, ative o botão (Override) e digite:
   ```bash
   bash vercel-build.sh
   ```
4. Clique em **Save**.

#### 5. Fazer um Novo Deploy
Para aplicar tudo, faça um novo deploy:
1. Vá na aba **Deployments**.
2. Clique nos três pontinhos (`...`) do último deploy e selecione **Redeploy**.

---

### Verificação
Após o redeploy finalizar, tente criar uma transação no site em produção. Agora o erro deve desaparecer e os dados serão salvos permanentemente!
