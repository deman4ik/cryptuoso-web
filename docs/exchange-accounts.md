---
slug: "exchange-accounts"
order: 3
title: "Acccount Configuration"
description: "How to create API keys"
metaTitle: "Exchange API Keys | Cryptuoso Cryptocurrency Trading Bot"
metaDescription: "Cryptuoso - How to create API keys"
---

## What is an API key?

An API key is the bridge between a Software (Cryptuoso Trading Bot) and any supported Exchange (Binance). The API key allows to make deals and monitor positions on your account.

## Why does Cryptuoso need API keys?

-   Read out the actual information about coins prices.
-   Ask the exchange about you portfolio status for account statistics
-   Send buy and sell commands to your exchange automatically

By using this API key, we do not require any Login information of your exchange, nor can we withdraw any funds (Make sure to never enable withdrawal rights in your API keys. As this allows companies to withdraw funds. We explicitly do **NOT** want these rights.)

## How can I create API keys?

Look at the section for your Exchange.

-   [Binance Futures](./binance-futures)

Coming Soon

-   KuCoin Futures
-   Huobi Futures

## Using an API Key

API keys consist of a public/private key(secret) pair, both of which must be provided to our software.

### Cryptuoso Trading Telegram Bot

1. Go to the [@cryptuoso_bot](https://t.me/cryptuoso_bot) in Telegram
2. Go to 👤 **Account** / 🔑 **Link Exchange Account**
3. Select Exchange **"Binance Futures"**
4. Enter your API Key
5. Enter your API Secret (Private Key)
6. Wait till you API Key Pair will be tested. Cryptuoso Platform will create and immediately cancel order to test your keys.
7. Now you can start automated trading in 🏠 **Main Menu** / 📈 **Trading** section.
