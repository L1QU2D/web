---
title: "Injected Solana provider"
sidebar_label: "Injected Solana provider"
slug: "solana-provider"
---

[block:api-header]
{
  "title": "Detecting the provider"
}
[/block]
Coinbase Wallet injects a Solana provider into the top-level window of web applications.
The provider can be used to read on-chain data, establish connections to user accounts, sign messages, and send transactions.

You can access this provider at `window.coinbaseSolana`.
```javascript
const getProvider = () => {
  if ('coinbaseSolana' in window) {
    return window.coinbaseSolana;
  }
  // Redirect user if Coinbase Wallet isn’t installed
  window.open('https://www.coinbase.com/wallet', '_blank');
};
```

:::info
If a user does have Coinbase Wallet installed and no provider is found, we recommend redirecting the user to download Coinbase Wallet.
:::