# Documentação Completa das APIs do Hive Engine

## Introdução

O Hive Engine é uma plataforma de sidechain que permite a criação e gerenciamento de tokens, NFTs e mercados descentralizados na blockchain Hive. Esta documentação fornece uma referência técnica abrangente para desenvolvedores que desejam integrar com as APIs do Hive Engine.

Existem **três principais formas de interagir** com o Hive Engine:

1. **Via `custom_json`** - Enviar operações JSON customizadas para a blockchain
2. **Via `transfer`** - Transferir fundos com JSON no memo
3. **Via RPC API** - Consultar dados através de endpoints HTTP

---

## 1. Métodos de Interação com o Hive Engine

### 1.1 Via `custom_json`

Envie uma operação `custom_json` para a blockchain principal com os seguintes parâmetros:

```json
{
  "id": "ssc-mainnet-hive",
  "json": [
    {
      "contractName": "NAME OF THE CONTRACT",
      "contractAction": "ACTION OF THE CONTRACT TO PERFORM",
      "contractPayload": { "OBJECT": "THAT WILL BE PASSED TO THE CONTRACT ACTION" }
    },
    {
      "contractName": "NAME OF THE CONTRACT",
      "contractAction": "ACTION OF THE CONTRACT TO PERFORM",
      "contractPayload": { "OBJECT": "THAT WILL BE PASSED TO THE CONTRACT ACTION" }
    }
  ]
}
```

**Exemplo prático:**

```json
{
  "id": "ssc-mainnet-hive",
  "json": [
    {
      "contractName": "market",
      "contractAction": "buy",
      "contractPayload": {
        "symbol": "BEE",
        "quantity": "1",
        "price": "0.00000001"
      }
    }
  ]
}
```

### 1.2 Via `transfer`

Transfira fundos com o seguinte JSON como memo:

```json
{
  "id": "ssc-mainnet-hive",
  "json": {
    "contractName": "NAME OF THE CONTRACT",
    "contractAction": "ACTION OF THE CONTRACT TO PERFORM",
    "contractPayload": { "OBJECT": "THAT WILL BE PASSED TO THE CONTRACT ACTION" }
  }
}
```

**Nota:** O campo `id` identifica para qual sidechain você quer enviar a transação:
- `ssc-mainnet-hive` - Para Hive Engine (mainnet)
- `ssc-mainnet1` - Para Steem Engine (mainnet)

### 1.3 Via RPC API (Recomendado para Leitura)

Consulte dados através de endpoints HTTP usando JSON-RPC 2.0.

---

## 2. Contratos Disponíveis

O Hive Engine oferece vários contratos principais:

| Contrato | Descrição | URL |
|----------|-----------|-----|
| **tokens** | Gerenciamento de tokens e staking | [Hive Engine](http://hive-engine.rocks/contracts) / [Steem Engine](https://steem-engine.rocks/contracts) |
| **market** | Mercado descentralizado de compra/venda | [Hive Engine](http://hive-engine.rocks/contracts/e95757627d94815fe31f39f5630dc775d78b2bca) / [Steem Engine](https://steem-engine.rocks/contracts/fe7e9a0fcb6382423ca32b18459d675af94216c4) |
| **nft** | Gerenciamento de NFTs | [Documentação](https://hive-engine.github.io/engine-docs/) |

---

## 3. Contrato: TOKENS

### 3.1 Tabelas do Contrato Tokens

#### Tabela: `balances`

Saldos de tokens por conta.

| Campo | Descrição |
|-------|-----------|
| `account` | Nome da conta |
| `symbol` | Símbolo do token |
| `balance` | Saldo disponível |
| `stake` | Quantidade de tokens em stake |
| `delegatedStake` | Quantidade de tokens delegados |
| `delegationReceived` | Quantidade de tokens recebidos em delegação |

**Exemplo de Query:**

```bash
curl -s -H "Content-type: application/json" -d '{
  "jsonrpc": "2.0",
  "method": "findOne",
  "params": {
    "contract": "tokens",
    "table": "balances",
    "query": {
      "account": "alice",
      "symbol": "BEE"
    }
  },
  "id": 1
}' https://api.hive-engine.com/rpc/contracts
```

#### Tabela: `delegations`

Delegações ativas de tokens entre contas.

| Campo | Descrição |
|-------|-----------|
| `from` | Conta que delegou |
| `to` | Conta que recebeu a delegação |
| `symbol` | Símbolo do token |
| `amount` | Quantidade delegada |

#### Tabela: `pendingUnstakes`

Unstakes pendentes (em processo de desbloqueio).

| Campo | Descrição |
|-------|-----------|
| `account` | Conta que fez o unstake |
| `symbol` | Símbolo do token |
| `quantity` | Quantidade em unstake |
| `completeTimestamp` | Timestamp quando o unstake será completo |

#### Tabela: `pendingUndelegations`

Undelegações pendentes (delegações sendo removidas).

| Campo | Descrição |
|-------|-----------|
| `from` | Conta que removeu a delegação |
| `to` | Conta que recebeu a delegação |
| `symbol` | Símbolo do token |
| `amount` | Quantidade sendo undelegada |
| `completeTimestamp` | Timestamp quando a undelegação será completa |

#### Tabela: `contractsBalances`

Saldos de tokens em contratos.

| Campo | Descrição |
|-------|-----------|
| `contract` | Nome do contrato |
| `symbol` | Símbolo do token |
| `balance` | Saldo do contrato |

#### Tabela: `params`

Parâmetros globais do contrato de tokens.

| Campo | Descrição |
|-------|-----------|
| `symbol` | Símbolo do token |
| `precision` | Precisão decimal do token |
| `maxSupply` | Fornecimento máximo |
| `supply` | Fornecimento atual |
| `circulatingSupply` | Fornecimento em circulação |

### 3.2 Ações do Contrato Tokens

#### Ação: `create`

Cria um novo token.

**Payload:**

```json
{
  "contractName": "tokens",
  "contractAction": "create",
  "contractPayload": {
    "symbol": "MYTOKEN",
    "name": "My Token",
    "url": "https://example.com",
    "desc": "Description of my token",
    "precision": 8,
    "maxSupply": "1000000"
  }
}
```

#### Ação: `issue`

Emite novos tokens para uma conta.

**Payload:**

```json
{
  "contractName": "tokens",
  "contractAction": "issue",
  "contractPayload": {
    "symbol": "MYTOKEN",
    "to": "alice",
    "quantity": "1000"
  }
}
```

#### Ação: `transfer`

Transfere tokens entre contas.

**Payload:**

```json
{
  "contractName": "tokens",
  "contractAction": "transfer",
  "contractPayload": {
    "symbol": "BEE",
    "to": "alice",
    "quantity": "100",
    "memo": "Payment for services"
  }
}
```

#### Ação: `stake`

Faz stake de tokens (bloqueia para receber recompensas).

**Payload:**

```json
{
  "contractName": "tokens",
  "contractAction": "stake",
  "contractPayload": {
    "symbol": "BEE",
    "to": "alice",
    "quantity": "1000"
  }
}
```

#### Ação: `unstake`

Remove stake de tokens (inicia processo de desbloqueio).

**Payload:**

```json
{
  "contractName": "tokens",
  "contractAction": "unstake",
  "contractPayload": {
    "symbol": "BEE",
    "quantity": "100"
  }
}
```

#### Ação: `delegate`

Delega tokens em stake para outra conta.

**Payload:**

```json
{
  "contractName": "tokens",
  "contractAction": "delegate",
  "contractPayload": {
    "symbol": "BEE",
    "to": "alice",
    "quantity": "500"
  }
}
```

#### Ação: `undelegate`

Remove delegação de tokens.

**Payload:**

```json
{
  "contractName": "tokens",
  "contractAction": "undelegate",
  "contractPayload": {
    "symbol": "BEE",
    "from": "alice",
    "quantity": "500"
  }
}
```

---

## 4. Contrato: MARKET

### 4.1 Tabelas do Contrato Market

#### Tabela: `buyBook`

Lista de todas as ordens de compra pendentes.

| Campo | Descrição |
|-------|-----------|
| `txId` | ID da transação |
| `timestamp` | Timestamp da ordem |
| `account` | Conta que fez a ordem |
| `symbol` | Símbolo do token |
| `quantity` | Quantidade de tokens a comprar |
| `price` | Preço (base/token) |
| `priceDec` | Preço descendente (base/token) |
| `tokensLocked` | Tokens base bloqueados no contrato |
| `expiration` | Expiração da ordem |

**Exemplo de Query:**

```bash
curl -s -H "Content-type: application/json" -d '{
  "jsonrpc": "2.0",
  "method": "find",
  "params": {
    "contract": "market",
    "table": "buyBook",
    "query": {
      "symbol": "BEE"
    }
  },
  "id": 1
}' https://api.hive-engine.com/rpc/contracts
```

#### Tabela: `sellBook`

Lista de todas as ordens de venda pendentes.

| Campo | Descrição |
|-------|-----------|
| `txId` | ID da transação |
| `timestamp` | Timestamp da ordem |
| `account` | Conta que fez a ordem |
| `symbol` | Símbolo do token |
| `quantity` | Quantidade de tokens a vender |
| `price` | Preço (base/token) |
| `priceDec` | Preço descendente (base/token) |
| `expiration` | Expiração da ordem |

#### Tabela: `tradesHistory`

Histórico de todas as transações realizadas.

| Campo | Descrição |
|-------|-----------|
| `type` | Tipo de transação |
| `buyer` | Conta do comprador |
| `seller` | Conta do vendedor |
| `symbol` | Símbolo do token |
| `quantity` | Quantidade transacionada |
| `price` | Preço da transação |
| `timestamp` | Timestamp da transação |
| `volume` | Volume da transação |
| `buyTxId` | ID da transação de compra |
| `sellTxId` | ID da transação de venda |

#### Tabela: `metrics`

Métricas do mercado (preço, volume, etc).

| Campo | Descrição |
|-------|-----------|
| `symbol` | Símbolo do token |
| `lastPrice` | Último preço |
| `priceChangePercent` | Mudança percentual de preço |
| `highPrice` | Preço mais alto |
| `lowPrice` | Preço mais baixo |
| `volumeHive` | Volume em HIVE |
| `volumeToken` | Volume em token |

### 4.2 Ações do Contrato Market

#### Ação: `buy`

Cria uma ordem de compra.

**Payload:**

```json
{
  "contractName": "market",
  "contractAction": "buy",
  "contractPayload": {
    "symbol": "BEE",
    "quantity": "1",
    "price": "0.00000001"
  }
}
```

#### Ação: `sell`

Cria uma ordem de venda.

**Payload:**

```json
{
  "contractName": "market",
  "contractAction": "sell",
  "contractPayload": {
    "symbol": "BEE",
    "quantity": "100000",
    "price": "1"
  }
}
```

#### Ação: `cancel`

Cancela uma ordem pendente.

**Payload:**

```json
{
  "contractName": "market",
  "contractAction": "cancel",
  "contractPayload": {
    "type": "buy",
    "id": "a47906faa9071cf524e0bc8909b0d6f81f4fd48f"
  }
}
```

**Parâmetros:**
- `type`: "buy" ou "sell"
- `id`: ID da transação da ordem

#### Ação: `marketBuy`

Compra tokens ao melhor preço disponível (market order).

**Payload:**

```json
{
  "contractName": "market",
  "contractAction": "marketBuy",
  "contractPayload": {
    "symbol": "BEE",
    "quantity": "100"
  }
}
```

#### Ação: `marketSell`

Vende tokens ao melhor preço disponível (market order).

**Payload:**

```json
{
  "contractName": "market",
  "contractAction": "marketSell",
  "contractPayload": {
    "symbol": "BEE",
    "quantity": "100"
  }
}
```

---

## 5. Contrato: NFT

### 5.1 Visão Geral de NFTs

NFTs (Non-Fungible Tokens) no Hive Engine são tokens únicos com propriedades customizáveis. Cada NFT pode ter dados específicos armazenados on-chain.

### 5.2 Estrutura de Dados de NFT

Cada NFT possui:
- **Symbol**: Identificador único do tipo de NFT
- **ID**: Número único para cada instância (começa em 1)
- **Properties**: Dados customizáveis definidos pelo criador
- **Locked Tokens**: Tokens bloqueados dentro do NFT

### 5.3 Taxas de Emissão

A taxa de emissão é calculada como:

```
fee = base fee + ((base fee) × (número de propriedades de dados))
```

**Exemplo:** Para emitir 3 NFTs com 4 propriedades de dados:
- Taxa base: 0.001 BEE
- Taxa por propriedade: 0.001 BEE × 4 = 0.004 BEE
- Taxa por token: 0.005 BEE
- **Taxa total: 0.015 BEE**

### 5.4 Tokens Bloqueados em NFTs

Quando um NFT é emitido, é possível bloquear outros tokens dentro dele:

- **Máximo de 10 tipos diferentes** de tokens regulares por NFT
- **Máximo de 50 instâncias de NFT** por NFT (container)
- Tokens bloqueados só podem ser recuperados **queimando o NFT**
- Tokens bloqueados **não são devolvidos ao emissor**, mas ao detentor do NFT

### 5.5 Ações do Contrato NFT

#### Ação: `create`

Cria um novo tipo de NFT.

**Payload:**

```json
{
  "contractName": "nft",
  "contractAction": "create",
  "contractPayload": {
    "symbol": "MYNFT",
    "name": "My NFT Collection",
    "url": "https://example.com",
    "desc": "Description of my NFT"
  }
}
```

#### Ação: `addProperty`

Adiciona uma propriedade de dados ao NFT.

**Payload:**

```json
{
  "contractName": "nft",
  "contractAction": "addProperty",
  "contractPayload": {
    "symbol": "MYNFT",
    "name": "color",
    "type": "string"
  }
}
```

#### Ação: `issueMultiple`

Emite múltiplas instâncias de um NFT.

**Payload:**

```json
{
  "contractName": "nft",
  "contractAction": "issueMultiple",
  "contractPayload": {
    "symbol": "MYNFT",
    "to": ["alice", "bob"],
    "properties": [
      { "color": "red", "size": "large" },
      { "color": "blue", "size": "small" }
    ]
  }
}
```

#### Ação: `transfer`

Transfere uma instância de NFT.

**Payload:**

```json
{
  "contractName": "nft",
  "contractAction": "transfer",
  "contractPayload": {
    "symbol": "MYNFT",
    "to": "alice",
    "id": "1"
  }
}
```

#### Ação: `burn`

Queima uma instância de NFT (recupera tokens bloqueados).

**Payload:**

```json
{
  "contractName": "nft",
  "contractAction": "burn",
  "contractPayload": {
    "symbol": "MYNFT",
    "id": "1"
  }
}
```

---

## 6. SMT API (enginerpc.com)

A SMT API fornece endpoints para indexação de comentários e interações sociais relacionadas a tokens.

**Base URL:** `https://smt-api.enginerpc.com/`

### 6.1 Endpoints de Estado

#### `GET /state`

Retorna o estado atual do sincronizador de blocos.

```bash
curl https://smt-api.enginerpc.com/state
```

**Resposta:**

```json
{
  "lastBlock": 12345678,
  "lastBlockTimestamp": "2026-06-28T00:00:00Z"
}
```

#### `GET /info?token=SYMBOL`

Informações sobre o pool de recompensas de um token.

```bash
curl "https://smt-api.enginerpc.com/info?token=BYTE"
```

#### `GET /config?token=SYMBOL`

Configurações de um token.

```bash
curl "https://smt-api.enginerpc.com/config?token=BYTE"
```

### 6.2 Endpoints de Feed e Discussões

#### `GET /get_feed`

Retorna o feed de um usuário.

**Parâmetros:**
- `token` (obrigatório): Símbolo do token
- `tag` (obrigatório): Nome da conta
- `limit` (opcional, padrão: 20): Número máximo de posts
- `include_reblogs` (opcional, padrão: true): Incluir reblogs

```bash
curl "https://smt-api.enginerpc.com/get_feed?limit=20&tag=faireye&token=BYTE&include_reblogs=true"
```

#### `GET /get_discussions_by_created`

Discussões ordenadas pela data de criação.

```bash
curl "https://smt-api.enginerpc.com/get_discussions_by_created?limit=200&token=BYTE"
```

#### `GET /get_discussions_by_trending`

Discussões em alta.

```bash
curl "https://smt-api.enginerpc.com/get_discussions_by_trending?token=BEE"
```

#### `GET /get_discussions_by_hot`

Discussões quentes.

```bash
curl "https://smt-api.enginerpc.com/get_discussions_by_hot?token=BEE"
```

#### `GET /get_discussions_by_promoted`

Discussões promovidas.

```bash
curl "https://smt-api.enginerpc.com/get_discussions_by_promoted?token=BEE"
```

#### `GET /get_discussions_by_comments`

Comentários de um usuário.

```bash
curl "https://smt-api.enginerpc.com/get_discussions_by_comments?limit=200&token=BYTE&tag=username"
```

#### `GET /get_discussions_by_replies`

Respostas recebidas por um usuário.

```bash
curl "https://smt-api.enginerpc.com/get_discussions_by_replies?limit=20&tag=faireye&token=BYTE"
```

### 6.3 Endpoints de Conta

#### `GET /@account`

Dados da conta para um token.

```bash
curl "https://smt-api.enginerpc.com/@sagarkothari88?token=BYTE"
```

#### `GET /@account/permlink`

Detalhes de um post específico.

```bash
curl "https://smt-api.enginerpc.com/@sagarkothari88/cc8a12ab?token=BYTE"
```

#### `GET /get_account_history`

Histórico de transações de uma conta.

**Parâmetros:**
- `account` (obrigatório): Nome da conta
- `token` (opcional): Símbolo do token
- `limit` (opcional, padrão: 100): Número máximo de transações
- `offset` (opcional, padrão: 0): Deslocamento para paginação

```bash
curl "https://smt-api.enginerpc.com/get_account_history?account=faireye&token=BYTE&limit=30&offset=0"
```

---

## 7. History API (history.hive-engine.com)

Fornece histórico detalhado de transações.

**Base URL:** `https://history.hive-engine.com/`

### 7.1 Endpoints

#### `GET /accountHistory`

Histórico de transações de uma conta.

**Parâmetros:**
- `account` (obrigatório): Nome da conta
- `symbol` (opcional): Símbolo do token
- `limit` (opcional, padrão: 500): Número máximo de transações
- `offset` (opcional, padrão: 0): Deslocamento para paginação
- `type` (opcional): Tipo de transação (user, contract)

```bash
curl "https://history.hive-engine.com/accountHistory?account=faireye&symbol=BYTE&limit=30&offset=0"
```

---

## 8. JSON-RPC API (api.hive-engine.com)

A API principal para interagir com contratos.

**Base URL:** `https://api.hive-engine.com/rpc/`

### 8.1 Métodos RPC

#### `find(contract, table, query)`

Encontra documentos em uma tabela.

```bash
curl -X POST https://api.hive-engine.com/rpc/contracts \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "find",
    "params": {
      "contract": "tokens",
      "table": "balances",
      "query": {
        "account": "alice",
        "symbol": "BEE"
      }
    },
    "id": 1
  }'
```

#### `findOne(contract, table, query)`

Encontra um único documento.

```bash
curl -X POST https://api.hive-engine.com/rpc/contracts \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "findOne",
    "params": {
      "contract": "market",
      "table": "metrics",
      "query": {
        "symbol": "BEE"
      }
    },
    "id": 1
  }'
```

#### `getLatestBlockInfo()`

Obtém informações do último bloco.

```bash
curl -X POST https://api.hive-engine.com/rpc/blockchain \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "getLatestBlockInfo",
    "id": 1
  }'
```

#### `getBlockInfo(blockNumber)`

Obtém informações de um bloco específico.

```bash
curl -X POST https://api.hive-engine.com/rpc/blockchain \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "getBlockInfo",
    "params": {
      "blockNumber": 12345678
    },
    "id": 1
  }'
```

---

## 9. Referências e Recursos

- **Documentação Oficial:** https://hive-engine.github.io/engine-docs/
- **Hive Engine Explorer:** http://hive-engine.rocks/
- **Steem Engine Explorer:** https://steem-engine.rocks/
- **Repositório GitHub:** https://github.com/hive-engine/

---

## 10. Dicas e Boas Práticas

### 10.1 Performance

- Use `findOne()` quando procurar por um documento específico
- Use `find()` com queries específicas para limitar resultados
- Implemente paginação com `limit` e `offset` para grandes conjuntos de dados

### 10.2 Segurança

- Nunca exponha chaves privadas em código
- Valide todas as entradas de usuário
- Use HTTPS para todas as requisições
- Implemente rate limiting em suas aplicações

### 10.3 Tratamento de Erros

Sempre trate possíveis erros nas respostas RPC:

```json
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32600,
    "message": "Invalid Request"
  },
  "id": 1
}
```

### 10.4 Integração com Aplicações

Para integrar com aplicações web/mobile:

1. Use a SMT API para leitura de dados públicos
2. Use a JSON-RPC API para queries complexas
3. Use `custom_json` ou `transfer` para transações
4. Implemente cache local para melhor performance

---

## 11. Exemplos de Código

### JavaScript/Node.js

```javascript
const axios = require('axios');

async function getTokenBalance(account, symbol) {
  const response = await axios.post('https://api.hive-engine.com/rpc/contracts', {
    jsonrpc: '2.0',
    method: 'findOne',
    params: {
      contract: 'tokens',
      table: 'balances',
      query: { account, symbol }
    },
    id: 1
  });
  return response.data.result;
}

getTokenBalance('alice', 'BEE').then(console.log);
```

### Python

```python
import requests

def get_token_balance(account, symbol):
    response = requests.post('https://api.hive-engine.com/rpc/contracts', json={
        'jsonrpc': '2.0',
        'method': 'findOne',
        'params': {
            'contract': 'tokens',
            'table': 'balances',
            'query': {'account': account, 'symbol': symbol}
        },
        'id': 1
    })
    return response.json()['result']

print(get_token_balance('alice', 'BEE'))
```

### cURL

```bash
curl -X POST https://api.hive-engine.com/rpc/contracts \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "findOne",
    "params": {
      "contract": "tokens",
      "table": "balances",
      "query": {
        "account": "alice",
        "symbol": "BEE"
      }
    },
    "id": 1
  }'
```

---

**Última atualização:** Junho 2026
**Versão:** 2.0
**Autor:** Manus AI

Esta documentação é baseada na documentação oficial do Hive Engine e foi compilada para facilitar o desenvolvimento de aplicações que integram com a plataforma.
