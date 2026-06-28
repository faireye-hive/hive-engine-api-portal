---
name: hive-engine-api
description: Reference for the Hive Engine sidechain (the second-layer token/NFT/market platform built on top of the Hive blockchain). Use this skill whenever the user mentions "Hive Engine", "SMT API", "enginerpc", token symbols like BEE/BYTE/SWAP.HIVE, staking/delegating/unstaking Hive Engine tokens, the Hive Engine internal DEX/market (buyBook, sellBook, metrics, tradesHistory), Hive Engine NFTs, the JSON-RPC contracts API (api.hive-engine.com), the History API (history.hive-engine.com), or building custom_json / transfer payloads to interact with Hive Engine contracts. Also trigger this for Hive Keychain integration code (requestCustomJson, requestTransfer) when the target is a Hive Engine contract action, and for any dashboard, bot, or app that reads balances, market data, or transaction history from Hive Engine. Don't confuse this with the base Hive blockchain API (condenser/bridge calls like get_discussion, get_accounts) — use this skill specifically for the Hive Engine sidechain layer.
---

# Hive Engine API Reference

Hive Engine is a sidechain ("layer 2") built on top of the Hive blockchain. It lets accounts create and manage **tokens**, **NFTs**, and a **decentralized market**, while still using Hive's own consensus and account/key system for authentication. Reads happen over plain HTTP (SMT API, JSON-RPC, History API); writes happen by broadcasting a normal Hive transaction (`custom_json` or `transfer`) whose payload the Hive Engine side-validators pick up and execute.

Use this skill as a lookup reference: find the right API/contract/table/action below, copy the example, adapt the fields. Don't guess endpoint names or payload shapes from memory — they're listed exhaustively here.

## Mental model: which of the 4 systems do I need?

| I want to... | Use |
|---|---|
| Read a balance, market price, NFT data, or any contract state | **JSON-RPC API** (`api.hive-engine.com/rpc/contracts`) |
| Read a user's social feed/discussions tied to a token (SMT-flavored Hive posts) | **SMT API** (`smt-api.enginerpc.com`) |
| Get a deep, paginated transaction history for an account/token | **History API** (`history.hive-engine.com`) |
| Change state — transfer, stake, buy/sell, issue NFT, etc. | **Broadcast a transaction** (`custom_json` or `transfer` with a Hive Engine JSON payload), normally **signed via Hive Keychain** |

If the user is building a dashboard (balances, market metrics, trade history) → JSON-RPC `find`/`findOne` + History API. If they're building something that posts/reads token-gated content → SMT API. If they're building anything that lets a user click a button to actually do something on-chain → Keychain section below.

---

## 1. JSON-RPC Contracts API (the one you'll use most)

**Base URL:** `https://api.hive-engine.com/rpc/`
Two endpoints: `/blockchain` (block info) and `/contracts` (everything else). All requests are `POST` with JSON-RPC 2.0 body.

### 1.1 Reading data: `find` and `findOne`

```bash
curl -X POST https://api.hive-engine.com/rpc/contracts \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "findOne",
    "params": {
      "contract": "tokens",
      "table": "balances",
      "query": { "account": "alice", "symbol": "BEE" }
    },
    "id": 1
  }'
```

- `find` → array of matching documents. `findOne` → single document or `null`.
- `params` also accepts `limit`, `offset`, `indexes` (for sorting, e.g. `[{"index": "balance", "descending": true}]`) — use these for pagination instead of fetching everything and slicing client-side.

JS helper used across this reference:

```javascript
async function heFind(method, contract, table, query, extra = {}) {
  const res = await fetch('https://api.hive-engine.com/rpc/contracts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', method, params: { contract, table, query, ...extra }, id: 1 })
  });
  const { result } = await res.json();
  return result;
}
// heFind('findOne', 'tokens', 'balances', { account: 'alice', symbol: 'BEE' })
```

### 1.2 Block info

```javascript
// getLatestBlockInfo() and getBlockInfo(blockNumber) both go through /blockchain
fetch('https://api.hive-engine.com/rpc/blockchain', {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ jsonrpc: '2.0', method: 'getLatestBlockInfo', id: 1 })
});
```

### 1.3 Contract: `tokens`

| Table | Key fields | Use it for |
|---|---|---|
| `balances` | `account`, `symbol`, `balance`, `stake`, `delegatedStake`, `delegationReceived` | Current holdings, staking dashboards |
| `delegations` | `from`, `to`, `symbol`, `amount` | Active stake delegations |
| `pendingUnstakes` | `account`, `symbol`, `quantity`, `completeTimestamp` | Unstake countdown UI |
| `pendingUndelegations` | `from`, `to`, `symbol`, `amount`, `completeTimestamp` | Undelegation countdown UI |
| `contractsBalances` | `contract`, `symbol`, `balance` | Funds held by other contracts (e.g. market escrow) |
| `params` | `symbol`, `precision`, `maxSupply`, `supply`, `circulatingSupply` | Token metadata / supply stats |

**Actions** (broadcast as `custom_json`/`transfer`, see §3): `create`, `issue`, `transfer`, `stake`, `unstake`, `delegate`, `undelegate`.

```json
{ "contractName": "tokens", "contractAction": "transfer",
  "contractPayload": { "symbol": "BEE", "to": "alice", "quantity": "100", "memo": "Payment" } }
```

```json
{ "contractName": "tokens", "contractAction": "stake",
  "contractPayload": { "symbol": "BEE", "to": "alice", "quantity": "1000" } }
```

```json
{ "contractName": "tokens", "contractAction": "unstake",
  "contractPayload": { "symbol": "BEE", "quantity": "100" } }
```

```json
{ "contractName": "tokens", "contractAction": "delegate",
  "contractPayload": { "symbol": "BEE", "to": "alice", "quantity": "500" } }
```

```json
{ "contractName": "tokens", "contractAction": "create",
  "contractPayload": { "symbol": "MYTOKEN", "name": "My Token", "url": "https://example.com",
    "precision": 8, "maxSupply": "1000000" } }
```

### 1.4 Contract: `market` (the internal DEX)

| Table | Key fields | Use it for |
|---|---|---|
| `buyBook` | `txId`, `account`, `symbol`, `quantity`, `price`, `tokensLocked`, `expiration` | Open buy orders / order book UI |
| `sellBook` | `txId`, `account`, `symbol`, `quantity`, `price`, `expiration` | Open sell orders / order book UI |
| `tradesHistory` | `buyer`, `seller`, `symbol`, `quantity`, `price`, `volume`, `timestamp` | Trade tape, charting (this is what feeds OHLCV) |
| `metrics` | `symbol`, `lastPrice`, `priceChangePercent`, `highPrice`, `lowPrice`, `volumeHive`, `volumeToken` | Ticker / dashboard summary cards |

This is the contract behind any "Hive Engine DEX dashboard" — `metrics` for the ticker row, `tradesHistory` for charts (bucket by `timestamp` client-side, e.g. chunked by UTC day), `buyBook`/`sellBook` for the order book.

> **Unverified: `timestamp` unit.** This reference doesn't confirm whether `tradesHistory.timestamp` (and other tables' timestamps) is in seconds or milliseconds. Before doing any time-bucketing (candles, day-chunked caching), pull one real record and check the magnitude against the current Unix time — a ~10-digit number is seconds, ~13-digit is milliseconds — rather than assuming.

```javascript
const metrics = await heFind('findOne', 'market', 'metrics', { symbol: 'BEE' });
const trades = await heFind('find', 'market', 'tradesHistory', { symbol: 'BEE' },
  { limit: 200, indexes: [{ index: 'timestamp', descending: true }] });
```

**Actions:**

```json
{ "contractName": "market", "contractAction": "buy",
  "contractPayload": { "symbol": "BEE", "quantity": "1", "price": "0.00000001" } }
```

```json
{ "contractName": "market", "contractAction": "sell",
  "contractPayload": { "symbol": "BEE", "quantity": "100000", "price": "1" } }
```

```json
{ "contractName": "market", "contractAction": "marketBuy",
  "contractPayload": { "symbol": "BEE", "quantity": "100" } }
```
*(`marketBuy`/`marketSell` fill at best available price instead of placing a limit order.)*

```json
{ "contractName": "market", "contractAction": "cancel",
  "contractPayload": { "type": "buy", "id": "a47906faa9071cf524e0bc8909b0d6f81f4fd48f" } }
```
*(`type` is `"buy"` or `"sell"`; `id` is the order's `txId` from `buyBook`/`sellBook`.)*

### 1.5 Contract: `nft`

NFTs are a `symbol` + numeric `id` (starting at 1) with custom `properties`. They can lock up to **10 token types**, **50 instances max per container**; locked tokens are released to whoever holds the NFT when it's **burned** — never back to the original issuer.

Issuance fee formula: `fee = baseFee + (baseFee × numberOfDataProperties)` per NFT, e.g. 4 properties → 0.001 + 0.004 = 0.005 BEE per token.

**Actions:**

```json
{ "contractName": "nft", "contractAction": "create",
  "contractPayload": { "symbol": "MYNFT", "name": "My NFT Collection", "url": "https://example.com" } }
```

```json
{ "contractName": "nft", "contractAction": "addProperty",
  "contractPayload": { "symbol": "MYNFT", "name": "color", "type": "string" } }
```

```json
{ "contractName": "nft", "contractAction": "issueMultiple",
  "contractPayload": { "symbol": "MYNFT", "to": ["alice", "bob"],
    "properties": [{ "color": "red" }, { "color": "blue" }] } }
```

```json
{ "contractName": "nft", "contractAction": "transfer",
  "contractPayload": { "symbol": "MYNFT", "to": "alice", "id": "1" } }
```

```json
{ "contractName": "nft", "contractAction": "burn",
  "contractPayload": { "symbol": "MYNFT", "id": "1" } }
```

For reading NFT instances/config, query the `nft` contract's per-symbol tables the same way as above (`find`/`findOne`); table names follow the pattern `<SYMBOL>instances` and `<SYMBOL>params` — confirm exact table names against the live `nft` contract info if unsure, since they're generated per-token.

---

## 2. SMT API (`smt-api.enginerpc.com`)

Indexes Hive **posts/comments** tied to a token context (rewards, feeds, discussions). All `GET`, base URL `https://smt-api.enginerpc.com/`.

| Endpoint | Required params | Notes |
|---|---|---|
| `/state` | — | Sync status: last block + timestamp processed |
| `/info?token=` | `token` | Reward pool info for a token |
| `/config?token=` | — | Token config; omit `token` for all tokens |
| `/get_feed` | `token`, `tag` | User's feed (posts + reblogs). `include_reblogs` default `true` |
| `/get_discussions_by_created` | `token` | Newest first. Optional `tag`, `limit` (default 20) |
| `/get_discussions_by_trending` | `token` | Trending algorithm |
| `/get_discussions_by_hot` | `token` | Hot algorithm |
| `/get_discussions_by_promoted` | `token` | Promoted posts |
| `/get_discussions_by_payout` | `token` | Sorted by payout |
| `/get_comment_discussions_by_payout` | `token` | Comments only, sorted by payout |
| `/get_discussions_by_blog` | `token`, `tag` | A blog's posts |
| `/get_discussions_by_comments` | `token`, `tag` | Comments made by an account |
| `/get_discussions_by_replies` | `token`, `tag` | Replies received by an account |
| `/get_trending_tags` | `token` | Trending tags, `limit` default 40 |
| `/get_following` | `follower` | Follow list. `status` filters (`blog`, `ignore`); `hive=true` for Hive-only follows |
| `/get_follow_count` | `account` | Follower/following counts |
| `/@<account>` | optional `token` | Account balance/data |
| `/@<account>/<permlink>` | optional `token` | Single post detail incl. active votes |
| `/get_account_history` | `account` | Transaction history. `limit` default 100, `offset`, `type` (`user`/`contract`) |
| `/get_staked_accounts?token=` | `token` | Accounts with staked balance |

```bash
curl "https://smt-api.enginerpc.com/get_discussions_by_trending?token=BEE&limit=20"
```

---

## 3. History API (`history.hive-engine.com`)

Deep, paginated **transaction** history (the NodeJS indexer). One endpoint:

```bash
curl "https://history.hive-engine.com/accountHistory?account=faireye&symbol=BYTE&limit=30&offset=0"
```

Params: `account` (required), `symbol` (optional — omit for all tokens), `limit` (default 500), `offset` (default 0), `type` (`user` or `contract`).

Prefer this over the JSON-RPC contract tables when you need **historical** transactions beyond current state — `tokens`/`market` tables via JSON-RPC only show current/open state (e.g. open orders), not the full history of what happened.

---

## 4. Writing: broadcasting actions to Hive Engine

Every "write" above (`transfer`, `stake`, `buy`, `issueMultiple`, etc.) is delivered as a normal **Hive** operation containing a Hive Engine envelope. There is no separate Hive Engine signing system — it rides on Hive's own `custom_json` or `transfer` ops, validated by Hive Engine's witnesses after the fact.

### 4.1 Envelope shapes

**Via `custom_json`** (most actions — no token movement on the L1 side):

```json
{
  "id": "ssc-mainnet-hive",
  "json": [
    { "contractName": "market", "contractAction": "buy",
      "contractPayload": { "symbol": "BEE", "quantity": "1", "price": "0.00000001" } }
  ]
}
```
Note `json` is an **array** here — you can batch multiple contract calls in one custom_json (they execute in order, atomically as a single Hive Engine "transaction").

**Via `transfer`** (when you're moving real HIVE/HBD as part of the call, e.g. buying a token with HIVE on-chain in the same step): put the JSON in the **memo**, with `json` as a single object (not an array):

```json
{
  "id": "ssc-mainnet-hive",
  "json": { "contractName": "market", "contractAction": "buy",
    "contractPayload": { "symbol": "BEE", "quantity": "1", "price": "0.00000001" } }
}
```

`id` selects the sidechain: `ssc-mainnet-hive` for Hive Engine, `ssc-mainnet1` for the legacy Steem Engine — almost always use `ssc-mainnet-hive` unless explicitly working with Steem.

### 4.2 Signing with Hive Keychain

Keychain is the standard way end users approve these broadcasts in a browser app — never ask for or handle a user's private key directly.

**`requestCustomJson`** — for the `custom_json` envelope:

```javascript
window.hive_keychain.requestCustomJson(
  username,                  // Hive account name, or null to let user pick
  'ssc-mainnet-hive',        // id
  'Active',                  // key type: most Hive Engine actions need Active
  JSON.stringify([{
    contractName: 'tokens',
    contractAction: 'transfer',
    contractPayload: { symbol: 'BEE', to: 'alice', quantity: '100', memo: 'Payment' }
  }]),
  'Transfer BEE',            // display message shown in the Keychain popup
  (response) => {
    if (response.success) {
      console.log('Broadcast tx:', response.result.id);
    } else {
      console.error('Keychain rejected/failed:', response.message);
    }
  }
);
```

**`requestTransfer`** — for the `transfer`-with-memo envelope:

```javascript
window.hive_keychain.requestTransfer(
  username,
  'market-account-or-recipient', // 'to' account (depends on the contract action's expected recipient)
  '1',                            // amount, as a string
  JSON.stringify({
    contractName: 'market',
    contractAction: 'buy',
    contractPayload: { symbol: 'BEE', quantity: '1', price: '0.00000001' }
  }),
  'HIVE',                          // currency: 'HIVE' or 'HBD'
  (response) => {
    if (response.success) {
      console.log('Broadcast tx:', response.result.id);
    } else {
      console.error('Keychain rejected/failed:', response.message);
    }
  },
  false                             // enforce: set true to force this exact 'to' account
);
```

**Picking which key type to request:** most Hive Engine contract actions (`transfer`, `stake`, `buy`, `sell`, NFT actions) require **Active** authority since they move value. Read-only social actions inherited from base Hive (e.g. follow/vote-adjacent custom_json some apps layer on top) might only need **Posting** — when unsure, default to `Active`.

**Always check `response.success` before assuming the broadcast landed** — Keychain reports wallet-side broadcast success, not Hive Engine-side contract execution success. To confirm the contract action actually took effect (e.g. the stake really applied), poll the relevant JSON-RPC table (§1) or look up the transaction via the History API (§3) a few seconds after broadcast, since side-chain validation lags the base Hive block by a small amount.

---

## 5. Practical notes

- **Precision matters**: token `quantity`/`price` fields are strings, and must respect the token's `precision` (from `tokens.params`) — sending more decimal places than the token supports gets the transaction rejected by validators, not just rounded.
- **Pagination**: always pass `limit`/`offset` (JSON-RPC) or `offset` (History API) for anything that could grow unbounded (trade history, account history) — don't fetch-all-and-filter client-side.
- **Caching**: market `metrics` and `tradesHistory` are good candidates for short-lived local caching (e.g. chunked by UTC day) since trade history before "today" never changes.
- **Errors**: JSON-RPC errors come back as standard JSON-RPC 2.0 error objects (`{"error": {"code": ..., "message": ...}}`) — always check for an `error` key before reading `result`.
- **Never** put private keys in code or ask the user for them — Keychain (or HiveSigner, Hive Auth) is the way real apps get a user's signature.
