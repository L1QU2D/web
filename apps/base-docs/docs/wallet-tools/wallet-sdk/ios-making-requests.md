---
title: 'Making requests'
sidebar_label: 'Making requests'
slug: 'ios-making-requests'
---

Requests to Coinbase Wallet can be made by calling the `makeRequest` function provided by the SDK. This function also accepts a list of `actions`.

```swift
cbwallet.makeRequest(
    Request(actions: [
        Action(jsonRpc: .eth_signTypedData_v3(
            address: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
            message: Data()))
    ])
) { result in
    self.log("\(result)")
}
```

## Batch requests

The client supports sending multiple `actions` as a single batch request.

For example, the code below will make requests for a user account and to switch chains:

```swift
cbwallet.makeRequest(
    Request(actions: [
        Action(jsonRpc: .eth_requestAccounts),
        Action(jsonRpc: .wallet_switchEthereumChain(chainId: "1666600000"))
    ])
) { result in
    self.log("\(result)")
}
```

An example request is provided in our [sample application](https://github.com/MobileWalletProtocol/wallet-mobile-sdk/blob/main/ios/example/SampleClient/ViewController.swift).