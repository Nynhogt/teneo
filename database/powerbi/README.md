# Power BI + PostgreSQL do TENEO

Este projeto usa **PostgreSQL** (veja `docker-compose.yml` e
`services/api/config/database.yml`). Não existe MySQL na stack atual. O Power BI
também consegue conectar em MySQL, mas isso exigiria adicionar um servidor MySQL
separado ao projeto. As instruções abaixo cobrem o banco que já existe.

## 1. Subir o banco e criar as tabelas

O Power BI só enxerga as tabelas depois que o Rails executa as migrações. Suba a
stack (o entrypoint da API roda `rails db:prepare`):

```powershell
docker compose up -d --build
docker compose ps
```

Aguarde o serviço `db` ficar saudável e a API concluir a preparação do banco.

## 2. Criar o usuário somente leitura

O script `setup.sql` cria:

- o usuário `powerbi_reader`, com transações somente leitura e timeout de 60s;
- o schema `bi`;
- a view `bi.organizations` com os dados liberados para o Power BI.

Execute (a senha é obrigatória):

```powershell
powershell -ExecutionPolicy Bypass -File .\database\powerbi\setup.ps1 -Password "TroqueEstaSenha"
```

Se preferir rodar manualmente:

```powershell
Get-Content -Raw -Encoding UTF8 .\database\powerbi\setup.sql |
  docker compose exec -T db psql -U teneo -d teneo_development -v powerbi_password='TroqueEstaSenha'
```

O script é idempotente: pode ser executado novamente para trocar a senha ou
recriar a view. Ele **não** libera acesso direto às tabelas de `public`; o Power
BI acessa apenas o schema `bi`.

Valide o acesso:

```powershell
docker compose exec db psql -U powerbi_reader -d teneo_development `
  -c "SELECT * FROM bi.organizations LIMIT 5;"
```

## 3. Conectar no Power BI Desktop

1. Abra o **Power BI Desktop** e clique em **Obter dados > Mais > PostgreSQL**.
2. Preencha:
   - **Servidor:** `localhost:5432`
   - **Banco de dados:** `teneo_development`
3. Em credenciais, escolha a aba **Banco de dados** (não use "Windows") e informe:
   - **Usuário:** `powerbi_reader`
   - **Senha:** a mesma definida no passo 2
4. No navegador, abra o schema **bi**, selecione **organizations** e clique em
   **Carregar**.

Use **Importação** para melhor desempenho. Use **DirectQuery** apenas se precisar
de dados em tempo real, lembrando que cada visual consulta o banco.

As credenciais e a URL também estão no arquivo `consultas.pq`, que serve de
referência para consultas no Editor Avançado.

## 4. Atualização publicada na nuvem

Se o relatório for publicado no Power BI Service e o banco continuar local, é
necessário um **Gateway de dados local** no computador que executa o Docker, com
o PostgreSQL configurado como fonte. Mantenha o Docker e o banco em execução para
que a atualização agendada funcione.

## 5. Observações de segurança

- Troque `change-me-powerbi` por uma senha forte; não versione a senha no Git.
- O usuário `powerbi_reader` não pode escrever no banco.
- Libere apenas views no schema `bi`. Ao criar novas views, conceda `SELECT` para
  `powerbi_reader`.
- Não use o usuário `teneo` (administrador) no Power BI.
- Em produção, use SSL, restrinja a rede e prefira um usuário/segredo gerenciado.

## Problemas comuns

| Sintoma | Causa provável | Solução |
| --- | --- | --- |
| `relation "public.organizations" does not exist` | Migrações não executadas | Suba a API ou rode `docker compose run --rm api bundle exec rails db:prepare` |
| `password authentication failed` | Senha antiga | Execute novamente o `setup.ps1` com a nova senha |
| `permission denied for schema bi` | Script não aplicado | Execute o `setup.sql` com o usuário administrador |
| `docker` não reconhecido | Docker Desktop fechado | Abra o Docker Desktop e confirme `docker compose ps` |
| Porta diferente de 5432 | `POSTGRES_PORT` alterado no `.env` | Use a porta publicada no `docker compose ps` |
| Falha de SSL no Power BI | Servidor local sem TLS | Para uso local, aceite a conexão sem SSL; em produção, habilite TLS |
