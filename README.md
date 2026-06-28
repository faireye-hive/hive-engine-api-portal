# Documentação Completa das APIs do Hive Engine

Esta documentação compila os endpoints de API usados pelo Hive Engine, incluindo a SMT API (enginerpc.com) e o Servidor JSON-RPC oficial, bem como a History API. O objetivo é fornecer uma referência abrangente para desenvolvedores de IA que desejam interagir com a plataforma Hive Engine.

## 1. SMT API (enginerpc.com)

A SMT API, hospedada em `https://smt-api.enginerpc.com/`, é um serviço crucial para a indexação de comentários e a gestão de interações sociais relacionadas a tokens na blockchain Hive. Ela oferece uma variedade de endpoints para acessar dados de estado, configuração, feeds de usuários e discussões [1].

### Endpoints de Estado e Configuração

| Endpoint | Método HTTP | Descrição | Parâmetros de Query | Exemplo de Uso |
|---|---|---|---|---|
| `/state` | `GET` | Retorna o estado atual do sincronizador de blocos da SMT API, incluindo o último bloco e timestamp processados. | Nenhum | `/state` |
| `/info` | `GET` | Fornece informações detalhadas sobre o pool de recompensas de um token específico. | `token` (obrigatório): Símbolo do token (ex: `BYTE`, `BEE`). | `/info?token=BYTE` |
| `/config` | `GET` | Retorna as configurações de um token, como o ID do pool de recompensas. Se nenhum token for especificado, retorna as configurações de todos os tokens. | `token` (opcional): Símbolo do token. | `/config?token=BYTE` |

### Endpoints de Feed e Discussões

Estes endpoints permitem a recuperação de diferentes tipos de feeds e discussões, com opções de filtragem e paginação.

| Endpoint | Método HTTP | Descrição | Parâmetros de Query | Exemplo de Uso |
|---|---|---|---|---|
| `/get_feed` | `GET` | Retorna o feed de um usuário, incluindo posts e reblogs. | `token` (obrigatório): Símbolo do token. `tag` (obrigatório): Nome da conta do usuário. `limit` (opcional, padrão: 20): Número máximo de posts. `start_author` (opcional): Autor para iniciar a paginação. `start_permlink` (opcional): Permlink para iniciar a paginação. `include_reblogs` (opcional, padrão: `true`): Incluir reblogs no feed. `no_votes` (opcional, padrão: `false`): Não incluir votos. `voter` (opcional): Filtrar votos por um votante específico. | `/get_feed?limit=20&tag=faireye&token=BYTE&include_reblogs=true` |
| `/get_discussions_by_created` | `GET` | Retorna discussões ordenadas pela data de criação. | `token` (obrigatório): Símbolo do token. `limit` (opcional, padrão: 20): Número máximo de posts. `tag` (opcional): Filtrar por tag. `start_author` (opcional): Autor para iniciar a paginação. `start_permlink` (opcional): Permlink para iniciar a paginação. `no_votes` (opcional, padrão: `false`): Não incluir votos. `voter` (opcional): Filtrar votos por um votante específico. | `/get_discussions_by_created?limit=200&token=BYTE` |
| `/get_discussions_by_trending` | `GET` | Retorna discussões em alta, baseadas em um algoritmo de pontuação. | `token` (obrigatório): Símbolo do token. `limit` (opcional, padrão: 20): Número máximo de posts. `tag` (opcional): Filtrar por tag. `start_author` (opcional): Autor para iniciar a paginação. `start_permlink` (opcional): Permlink para iniciar a paginação. `no_votes` (opcional, padrão: `false`): Não incluir votos. `voter` (opcional): Filtrar votos por um votante específico. | `/get_discussions_by_trending?token=BEE` |
| `/get_discussions_by_hot` | `GET` | Retorna discussões 
quentes, também baseadas em um algoritmo de pontuação. | `token` (obrigatório): Símbolo do token. `limit` (opcional, padrão: 20): Número máximo de posts. `tag` (opcional): Filtrar por tag. `start_author` (opcional): Autor para iniciar a paginação. `start_permlink` (opcional): Permlink para iniciar a paginação. `no_votes` (opcional, padrão: `false`): Não incluir votos. `voter` (opcional): Filtrar votos por um votante específico. | `/get_discussions_by_hot?token=BEE` |
| `/get_discussions_by_promoted` | `GET` | Retorna discussões promovidas. | `token` (obrigatório): Símbolo do token. `limit` (opcional, padrão: 20): Número máximo de posts. `tag` (opcional): Filtrar por tag. `start_author` (opcional): Autor para iniciar a paginação. `start_permlink` (opcional): Permlink para iniciar a paginação. `no_votes` (opcional, padrão: `false`): Não incluir votos. `voter` (opcional): Filtrar votos por um votante específico. | `/get_discussions_by_promoted?token=BEE` |
| `/get_discussions_by_payout` | `GET` | Retorna discussões ordenadas por valor de payout. | `token` (obrigatório): Símbolo do token. `limit` (opcional, padrão: 20): Número máximo de posts. `tag` (opcional): Filtrar por tag. `start_author` (opcional): Autor para iniciar a paginação. `start_permlink` (opcional): Permlink para iniciar a paginação. `no_votes` (opcional, padrão: `false`): Não incluir votos. `voter` (opcional): Filtrar votos por um votante específico. | `/get_discussions_by_payout?token=BEE` |
| `/get_comment_discussions_by_payout` | `GET` | Retorna discussões de comentários ordenadas por valor de payout. | `token` (obrigatório): Símbolo do token. `limit` (opcional, padrão: 20): Número máximo de posts. `tag` (opcional): Filtrar por tag. `start_author` (opcional): Autor para iniciar a paginação. `start_permlink` (opcional): Permlink para iniciar a paginação. `no_votes` (opcional, padrão: `false`): Não incluir votos. `voter` (opcional): Filtrar votos por um votante específico. | `/get_comment_discussions_by_payout?token=BEE` |
| `/get_discussions_by_blog` | `GET` | Retorna posts de blog de um usuário. | `token` (obrigatório): Símbolo do token. `tag` (obrigatório): Nome da conta do blog. `limit` (opcional, padrão: 20): Número máximo de posts. `start_author` (opcional): Autor para iniciar a paginação. `start_permlink` (opcional): Permlink para iniciar a paginação. `include_reblogs` (opcional, padrão: `false`): Incluir reblogs. `no_votes` (opcional, padrão: `false`): Não incluir votos. `voter` (opcional): Filtrar votos por um votante específico. | `/get_discussions_by_blog?tag=someuser&token=BEE` |
| `/get_discussions_by_comments` | `GET` | Retorna comentários feitos por um usuário. | `token` (obrigatório): Símbolo do token. `tag` (obrigatório): Nome da conta. `limit` (opcional, padrão: 20): Número máximo de posts. `start_author` (opcional): Autor para iniciar a paginação. `start_permlink` (opcional): Permlink para iniciar a paginação. `no_votes` (opcional, padrão: `false`): Não incluir votos. `voter` (opcional): Filtrar votos por um votante específico. | `/get_discussions_by_comments?limit=200&token=BYTE` |
| `/get_discussions_by_replies` | `GET` | Retorna respostas recebidas por um usuário. | `token` (obrigatório): Símbolo do token. `tag` (obrigatório): Nome da conta. `limit` (opcional, padrão: 20): Número máximo de posts. `start_author` (opcional): Autor para iniciar a paginação. `start_permlink` (opcional): Permlink para iniciar a paginação. `no_votes` (opcional, padrão: `false`): Não incluir votos. `voter` (opcional): Filtrar votos por um votante específico. | `/get_discussions_by_replies?limit=20&tag=faireye&token=BYTE` |
| `/get_trending_tags` | `GET` | Retorna tags em alta. | `token` (obrigatório): Símbolo do token. `limit` (opcional, padrão: 40): Número máximo de tags. | `/get_trending_tags?token=BEE` |
| `/get_following` | `GET` | Retorna a lista de contas que um usuário segue. | `follower` (obrigatório): Nome da conta do seguidor. `limit` (opcional, padrão: 1000): Número máximo de contas. `start` (opcional): Conta para iniciar a paginação. `status` (opcional): Filtrar por status (ex: `ignore`, `blog`). `hive` (opcional, padrão: `false`): Retornar apenas seguidores do Hive. | `/get_following?follower=someuser` |
| `/get_follow_count` | `GET` | Retorna a contagem de seguidores e seguidos de uma conta. | `account` (obrigatório): Nome da conta. | `/get_follow_count?account=someuser` |

### Endpoints de Conta e Conteúdo Específico

| Endpoint | Método HTTP | Descrição | Parâmetros de Query | Exemplo de Uso |
|---|---|---|---|---|
| `/@<account>` | `GET` | Retorna o saldo e outros dados da conta para um token específico. | `token` (opcional): Símbolo do token. | `/@sagarkothari88?token=BYTE` |
| `/@<account>/<permlink>` | `GET` | Retorna detalhes de um post específico, incluindo votos ativos. | `token` (opcional): Símbolo do token. | `/@sagarkothari88/cc8a12ab?token=BYTE` |
| `/get_account_history` | `GET` | Retorna o histórico de transações de uma conta para um token específico. | `account` (obrigatório): Nome da conta. `token` (opcional): Símbolo do token. `limit` (opcional, padrão: 100): Número máximo de transações. `offset` (opcional, padrão: 0): Deslocamento para paginação. `type` (opcional): Tipo de transação (ex: `user`, `contract`). | `/get_account_history?account=faireye&symbol=BYTE&limit=30&offset=0` |
| `/get_staked_accounts` | `GET` | Retorna uma lista de contas com tokens staked. | `token` (obrigatório): Símbolo do token. | `/get_staked_accounts?token=BEE` |

## 2. Hive Engine JSON-RPC API

Esta é a API principal para interagir com os smart contracts do Hive Engine. Ela permite a execução de métodos RPC para consultar o estado da blockchain e dos contratos [2].

**Base URL:** `https://api.hive-engine.com/rpc/`

### Endpoints Principais

| Endpoint | Método HTTP | Descrição | Métodos RPC Comuns | Exemplo de Uso |
|---|---|---|---|---|
| `/blockchain` | `POST` | Consulta informações sobre os blocos da sidechain. | `getLatestBlockInfo()`: Obtém o último bloco. `getBlockInfo(blockNumber)`: Obtém informações de um bloco específico. | Exemplo de `POST` body para `getLatestBlockInfo`: `{"jsonrpc": "2.0", "method": "getLatestBlockInfo", "id": 1}` |
| `/contracts` | `POST` | Permite interagir com os smart contracts do Hive Engine (tokens, mercado, etc). | `find(contract, table, query)`: Encontra documentos em uma tabela de contrato. `findOne(contract, table, query)`: Encontra um único documento em uma tabela de contrato. | Exemplo de `POST` body para `find`: `{"jsonrpc": "2.0", "method": "find", "params": {"contract": "tokens", "table": "tokens", "query": {"symbol": "BEE"}}, "id": 1}` |

## 3. History API (history.hive-engine.com)

A History API fornece um histórico detalhado de transações para contas e tokens específicos. O código-fonte indica que esta API é um servidor NodeJS que indexa transações históricas [3].

**Base URL:** `https://history.hive-engine.com/`

### Endpoints Principais

| Endpoint | Método HTTP | Descrição | Parâmetros de Query | Exemplo de Uso |
|---|---|---|---|---|
| `/accountHistory` | `GET` | Obtém o histórico de transações de uma conta para um token específico. | `account` (obrigatório): Nome da conta. `symbol` (opcional): Símbolo do token. `limit` (opcional, padrão: 500): Número máximo de transações. `offset` (opcional, padrão: 0): Deslocamento para paginação. `type` (opcional): Tipo de transação (ex: `user`, `contract`). | `/accountHistory?account=faireye&symbol=BYTE&limit=30&offset=0` |

## Referências

[1] hive-engine/distribution-engine-smt. (s.d.). *GitHub*. Disponível em: [https://github.com/hive-engine/distribution-engine-smt](https://github.com/hive-engine/distribution-engine-smt)
[2] hivesmartcontracts-wiki/JSON-RPC-server.md at main · hive-engine/hivesmartcontracts-wiki. (s.d.). *GitHub*. Disponível em: [https://github.com/hive-engine/hivesmartcontracts-wiki/blob/main/JSON-RPC-server.md](https://github.com/hive-engine/hivesmartcontracts-wiki/blob/main/JSON-RPC-server.md)
[3] hive-engine/ssc_tokens_history. (s.d.). *GitHub*. Disponível em: [https://github.com/hive-engine/ssc_tokens_history](https://github.com/hive-engine/ssc_tokens_history)
