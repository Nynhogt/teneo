# TENEO

Base de uma plataforma SaaS para construção civil e gestão ambiental. O projeto
separa a interface Next.js, a API Rails, o serviço de análise em Go e o
PostgreSQL. O Docker Compose reúne os serviços para desenvolvimento local.

## Requisitos no Windows

- Windows 10/11 e PowerShell
- Git, Node.js LTS, Ruby 3.2 ou superior e Go
- Docker Desktop instalado e aberto, com containers Linux habilitados
- Zed (opcional, para editar o projeto)

## Passo a passo

1. Abra a pasta do projeto no Zed. No terminal PowerShell, entre na pasta:

   ```powershell
   Set-Location C:\caminho\para\Teneo-api
   ```

2. Crie sua configuração local a partir do exemplo:

   ```powershell
   Copy-Item .env.example .env
   ```

   Para desenvolvimento local, os valores padrão funcionam. Não reutilize as
   credenciais de exemplo em produção.

3. Confirme que o Docker Desktop está aberto e inicie o banco e os serviços:

   ```powershell
   docker compose up --build
   ```

   Na primeira execução, o Docker baixa imagens e instala dependências; isso
   pode levar alguns minutos. A API prepara o banco automaticamente.

4. Acesse os serviços e confirme os indicadores de saúde:

   - Interface web: <http://localhost:3000>
   - API Rails: <http://localhost:3001/api/v1/health>
   - Serviço Go: <http://localhost:8080/health>
   - PostgreSQL: `localhost:5432`

5. Para encerrar, pressione `Ctrl+C` e execute:

   ```powershell
   docker compose down
   ```

   Os dados do PostgreSQL ficam no volume `postgres_data`. Para apagar esse
   volume e todos os dados locais, use `docker compose down --volumes`.

## Desenvolvimento sem Docker

O caminho recomendado para começar é executar todo o ambiente com Docker
Compose. Para rodar um serviço diretamente no Windows, instale também o
PostgreSQL e suas dependências e configure as variáveis de ambiente
correspondentes antes de iniciar o serviço.

## Estrutura

```text
apps/web/                 Next.js + TypeScript
services/api/             Ruby on Rails (API)
services/analytics/       Go
database/init/            Scripts opcionais de inicialização do banco
database/powerbi/         Usuário, views e consultas para o Power BI
docker-compose.yml        Banco e serviços locais
.env.example              Variáveis de exemplo
```

## Power BI

O banco do projeto é PostgreSQL; não há MySQL no Docker Compose. Para conectar
o Power BI com acesso somente leitura, suba a stack e execute:

```powershell
powershell -ExecutionPolicy Bypass -File .\database\powerbi\setup.ps1 -Password "TroqueEstaSenha"
```

Depois, no Power BI Desktop, use o conector PostgreSQL com servidor
`localhost:5432`, banco `teneo_development` e usuário `powerbi_reader`. Os passos
detalhados, as consultas de exemplo e a configuração de atualização na nuvem
estão em [`database/powerbi/README.md`](database/powerbi/README.md).

## Próximos passos do produto

1. Definir autenticação, papéis e fluxo de convite para empresas.
2. Modelar empresas, obras, materiais, compras, despesas e movimentações.
3. Associar todo dado de negócio a uma empresa e validar a associação em cada
   operação autorizada no servidor. Nunca confiar em um `organization_id`
   enviado pelo navegador como prova de acesso.
4. Adicionar testes, migrações e endpoints de negócio antes de publicar.
5. Configurar segredos, HTTPS, backups, monitoramento e políticas de isolamento
   próprias de produção.

O banco compartilhado é apenas uma decisão de hospedagem: o isolamento entre
empresas precisa ser aplicado no servidor em todas as consultas e operações.
Este esqueleto ainda não implementa login nem autorização multiempresa; não o
use com dados reais ou como serviço de produção.

Rails usa Active Record para PostgreSQL; Go terá seu próprio acesso ao banco
quando as análises precisarem de dados. Prisma não é necessário nesta
arquitetura.
