# 機能設計書

## 実行環境 (予定)

| No. | モジュール名               | 場所                 |
| --- | -------------------------- | -------------------- |
| 1   | フロントエンド             | Vercel               |
| 2   | バックエンド(コントラクト) | ブロックチェーン     |
| 3   | API                        |  |
| 4   | ストレージ                 | IPFS           |

## 機能一覧表

| 機能名                   | 説明                                                                              |
| ------------------------ | --------------------------------------------------------------------------------- |
| ログイン 機能     | ウォレットアドレスによりログインする機能                                              |
| NFT発行機能     | 賃貸借NFTを発行する機能                                                        |
| NFT購入機能     | 賃貸借NFTを購入する機能                                                        |
| 発行済みNFTの表示機能     | 賃貸借NFTの一覧表示機能                                                        |
| NFTのリスト機能             | 購入したNFTを2時流通する機能（comming）                             |
| ホテル検索機能 | 楽天APIでホテルを検索する機能                                        |                                 |

## 画面一覧

| 画面名                  | 概要                                                            |
| ----------------------- | --------------------------------------------------------------- |
| ログイン画面            | ウォレットアドレスでログインする画面                |
| Home 画面               | 賃貸借NFTの一覧, ホテル検索が表示される画面 |
| NFTミント画面                | 賃貸借の名前や画像、説明を入力してNFTとして発行する画面                               |
| NFT購入画面                | 賃貸借NFTを購入する画面                                      |
| Slash決済画面    | NFT購入画面から決済のために遷移する画面                     |
| Myページ画面    | 自身の購入したNFTを表示する画面               |

## 変数一覧

| コントラクト名 | 構造体  | 変数名       | 型                                           | 内容                                                                                                              |
| --------------- | --------- |------------ | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| NFTMarketplace |            | owner    | address                        | コントラクトのデプロイ者                                                                                                    |
| NFTMarketplace | MarketItem | tokenId  | uint256                        | NFTのトークンid                                                                                                  |
| NFTMarketplace | MarketItem | seller   | address                        | NFTを売りに出す人                                                                             |
| NFTMarketplace | MarketItem | owner    | address                        | NFTの所有者                                                                                    |
| NFTMarketplace | MarketItem | price    | uint256                        | 賃貸借NFTの値段                                                                     |
| NFTMarketplace | MarketItem | sold     | bool                           | 購入済みか否かのbool                                 |
| NFTMarketplace |            | idToMarketItem | uint256 => MarketItem    | トークンidとその賃貸NFTの情報のmap                      |
| NFTMarketplace |            | purchaseInfo   | mapping(string => string) | Slash決済に必要な情報。paymentIdに決済のオプションを含むことができるmap |

## メソッド一覧

| コントラクト名  | メソッド名            | 内容                                                           |
| --------------- | --------------------- | -------------------------------------------------------------- |
| NFTMarketplace | updateListingPrice    | リスト代を更新するための関数(コントラクトownerのみ実行可能)               |
| NFTMarketplace | getListingPrice       | 現在のリスト代を取得するための関数                                   |
| NFTMarketplace | createToken           | NFTを発行する関数                                         |
| NFTMarketplace | createMarketItem      | NFTのトークン情報を構造体に保存するための関数。NFTを発行する際に呼び出される  |
| NFTMarketplace | resellToken | 購入済みのNFTを2時流通するための関数                                           |
| NFTMarketplace | createMarketSale  | NFTを購入する関数                                           |
| NFTMarketplace | receivePayment               | Slash決済のための関数                                                   |
| NFTMarketplace | fetchMarketItems                | 購入されていないNFTの一覧取得のための関数                                                   |
| NFTMarketplace | fetchMyNFTs          | ユーザーが購入したNFTの一覧取得のための関数                  |
| NFTMarketplace | fetchItemsListed          | ユーザーがリストしたNFTの一覧取得のための関数                          |


## API 一覧

| メソッド種類 | API 名                 | 概要                                         |
| ------------ | ---------------------- | -------------------------------------------- |

