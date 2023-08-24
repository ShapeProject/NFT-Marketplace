# Shape_NFT_MarketPlace

## tagline

Shapeは、部屋の滞在権NFTを1か月単位でリストできるマーケットプレイスです。

## What it does

NFTのP2P取引によって、スムーズに部屋を借りることができるとともに、取引状況をトレース、蓄積することも可能となります。  

居住用不動産に宿泊し、滞在利用する権利をマーケットプレイスでやりとりします。

## The problem it solves

特定の地域に拘束されないライフスタイルや働き方は、コロナ禍も経て一気に浸透しました。他方で、新たな暮らしのニーズに対応する形態の住まいは不足しており、居住用不動産の流動性を高める仕組みが必要だと考えています。

新たな住まい方を実現する場合には旅館業法の規制が問題になります。現在の行政実務の解釈基準も前提にすると、同法は明らかに時代にフィットしておらずルールメイクが必須と感じています。Shapeでは現状で取り得る法的スキームにて実装予定です。  

過大な担保や保証を回避しつつ、円滑なオンチェーン取引を貫徹するためには、「新たな信用」の構築や、紛争解決（デフォルト対応）の仕組みが必要となります。Shapeは、この最も重要な課題に取り組んでいきます。

## Challenges I ran into

NFTマーケットプレイスDappの開発に初チャレンジしました。機能はOpenseaほど多機能ではありませんが、Shapeが目指す課題解決のために必要な要素を構築しました。また、単なるNFTマーケットプレイスの開発だけでなく、決済と同時にNFT売買機能を実装するため、Slashが提供するslash extension機能を呼び出すようにスマートコントラクトを実装しました。仕組みを理解してアプリに導入する部分は苦労しましたが、おかげでSlashを利用した決済機能の実装イメージが鮮明になりました。

## Technologies I used

1. ERC721
2. solidity
3. hardhat
4. ISlashCustomPlugin
5. Next.js
6. JavaScript
7. pinata
8. Tailwind CSS
9. Shibuya Network

## How we built it

フロントエンドについては、Next.js＋JavaScript＋Tailwind CSSで構築を行いました。ベースとなったNFTマーケットプレイスのソースを参考に賃貸の宿泊権をやり取りできるようにアレンジを加えています。  

バックエンドについては、ERC721の基本的な機能に加えて、SlashCustomPluginを継承して決済と同時にNFT発行処理が実行されるように調整しています。開発用のフレームワークについては、hardhatを利用しました。

## What we learned

NFTマーケットプレイスDappの開発手法に加えて、Slashの基本的な仕組みや決済と同時に任意の処理を呼び出す方法を学びました。今回学んだことで今後別のDappを開発した際にも決済が必要な機能があればSlashの機能を利用していきたいと考えています。

## What's next for

私たちの目指す最終的なマーケットプレイスに必要な要素として次の機能を実装していく予定です。
又貸しや契約の分割機能の実装により、NFTを流動性を増加させ、部屋の利用効率を高めることを目指します。

1. 又貸し機能
2. 信用スコアの実装及びNFTとの連携機能
3. 契約の分割対応

## contract address

| network           | contract address                             |
| ----------------- | -------------------------------------------- |
| Munmbai Network   | [0](https://mumbai.polygonscan.com/address/) |
| Shibuya Network   | [0x16A39C809bCC52080BB6Ab0828b995524fC3D77b](https://blockscout.com/shibuya/address/0x16A39C809bCC52080BB6Ab0828b995524fC3D77b) |
| Shiden            | [0](https://blockscout.com/shiden/address/)  |
| Avalanche testnet | [0](https://testnet.snowtrace.io/address/)   |
| goerli            | [0x290C4c22069B6801f2ba587A8cBba87d37d4980C](https://goerli.etherscan.io/address/0x290C4c22069B6801f2ba587A8cBba87d37d4980C)    |
| sepolia           | [0](https://sepolia.etherscan.io/address/)   |
| BSC Testnet       | [0](https://testnet.bscscan.com/address/)    |
| Astar Network     | [0](https://blockscout.com/astar/address/)   |

### Slashを介したNFT購入フロー

[![](https://mermaid.ink/img/pako:eNqVU09LAkEc_Soyhy7VF9hDEEXHLnbcy-BOKelq63gIEZoZKCEDCyMKwrKyMjKif7b6bX6uq9-i2R3dlEptD8vAvDe_9968yaJI0iBIQ2mylSFmhCzH8IaFE7oZkh-N0TjRQuk4TkeBH7Wb-8BOgJU7z3ankQdxDOIRREuBQVTlGvi7_M8vLMyGozhFFlMpLQT8Dfg1iDywB-AV4E_Am8A_J_FWV9bcU7t7WehWWeeZK_hg24d6wnyoUuSWmr3zipzSYx_ubbNP6IMCwlLSpBaOUE2RnL2qW9x1DlvAXpw9WzpUPByn_WPbjUdf-R2Ie08qK0hZbqnsh1EDJlO5kqk4F69OMa_IweDBsJ_TQyPj62XpcxzXs_3NDaJR9OGAgpCmp0_S7Efs1Atte7e3c-aWbxSBxNNkmoj-nYyqFYgHEEUQQhZmemtjuX-7C6SPGDSNXzoU9NNfAav_Xruhng5XfDTIGe8mKna3doDmUIJYCRwz5GvMemfoiEZJguhIk0sDW5s60s2cxOEMTYa3zQjSqJUhcyiTMjAdvFykrWN5L7kvtPLKpw?type=png)](https://mermaid.live/edit#pako:eNqVU09LAkEc_Soyhy7VF9hDEEXHLnbcy-BOKelq63gIEZoZKCEDCyMKwrKyMjKif7b6bX6uq9-i2R3dlEptD8vAvDe_9968yaJI0iBIQ2mylSFmhCzH8IaFE7oZkh-N0TjRQuk4TkeBH7Wb-8BOgJU7z3ankQdxDOIRREuBQVTlGvi7_M8vLMyGozhFFlMpLQT8Dfg1iDywB-AV4E_Am8A_J_FWV9bcU7t7WehWWeeZK_hg24d6wnyoUuSWmr3zipzSYx_ubbNP6IMCwlLSpBaOUE2RnL2qW9x1DlvAXpw9WzpUPByn_WPbjUdf-R2Ie08qK0hZbqnsh1EDJlO5kqk4F69OMa_IweDBsJ_TQyPj62XpcxzXs_3NDaJR9OGAgpCmp0_S7Efs1Atte7e3c-aWbxSBxNNkmoj-nYyqFYgHEEUQQhZmemtjuX-7C6SPGDSNXzoU9NNfAav_Xruhng5XfDTIGe8mKna3doDmUIJYCRwz5GvMemfoiEZJguhIk0sDW5s60s2cxOEMTYa3zQjSqJUhcyiTMjAdvFykrWN5L7kvtPLKpw)

## How to start

1. create `.env` file in backend directory & `.env.local` file in frontend directory
2. enter your APIKey & privatekey

```zsh
ALCHEMY_GOERLI_URL=YOUR_DATA
ALCHEMY_MUMBAI_URL=YOUR_DATA
PRIVATE_KEY=YOUR_DATA
```

```zsh
NEXT_PUBLIC_PROJECT_ID=YOUR_DATA
NEXT_PUBLIC_PROJECT_SECRET=YOUR_DATA
```

3. install modules

```bash
pnpm install
```

4. deploy contract

```bash
pnpm backend run deploy --network <network_name>
```

result example

```zsh
=================================================================
NFTMarket deployed to:  0xA1a196ee107067Bf34F69fadb4997Ab2D5f66827
=================================================================
```

5. start frontend

```bash
pnpm frontend run dev 
```

### 参考文献

1. [jsmasterypro-nft-marketplace](https://gitfront.io/r/user-6930330/yQ8XwQZYNAat/jsmasterypro-nft-marketplace/)
2. [ERC721: transfer caller is not owner nor approved](https://stackoverflow.com/questions/69302320/erc721-transfer-caller-is-not-owner-nor-approved)
3. [sepolia faucet](https://sepoliafaucet.net/)
4. [sepolia faucet2](https://faucet-sepolia.rockx.com/)
5. [Slash](https://slash.fi/)
6. [NFT決済フロー](https://mermaid.live/edit#pako:eNqVU09LAkEc_Soyhy7VF9hDEEXHLnbcy-BOKelq63gIEZoZKCEDCyMKwrKyMjKif7b6bX6uq9-i2R3dlEptD8vAvDe_9968yaJI0iBIQ2mylSFmhCzH8IaFE7oZkh-N0TjRQuk4TkeBH7Wb-8BOgJU7z3ankQdxDOIRREuBQVTlGvi7_M8vLMyGozhFFlMpLQT8Dfg1iDywB-AV4E_Am8A_J_FWV9bcU7t7WehWWeeZK_hg24d6wnyoUuSWmr3zipzSYx_ubbNP6IMCwlLSpBaOUE2RnL2qW9x1DlvAXpw9WzpUPByn_WPbjUdf-R2Ie08qK0hZbqnsh1EDJlO5kqk4F69OMa_IweDBsJ_TQyPj62XpcxzXs_3NDaJR9OGAgpCmp0_S7Efs1Atte7e3c-aWbxSBxNNkmoj-nYyqFYgHEEUQQhZmemtjuX-7C6SPGDSNXzoU9NNfAav_Xruhng5XfDTIGe8mKna3doDmUIJYCRwz5GvMemfoiEZJguhIk0sDW5s60s2cxOEMTYa3zQjSqJUhcyiTMjAdvFykrWN5L7kvtPLKpw)
7. [chainlink](https://docs.chain.link/data-feeds/price-feeds/)
8. [【Qita】markdownでシーケンス図を書こう](https://qiita.com/konitech913/items/90f91687cfe7ece50020)
9. [dogechain faucet](https://faucet.dogechain.dog/)
10. [slashロゴデータ](https://slash.fi/media_kit)
11. [【Slash】Implement Frontend and Integrate APIs](https://slash-fi.gitbook.io/docs/integration-guide/integration-guide/window-widget-integration/implement-frontend-and-integrate-apis)
12. [slashApp dashboard](https://testnet.slash.fi/admin/dashboard)
13. [https://1-notes.com/javascript-create-a-random-string/](https://1-notes.com/javascript-create-a-random-string/)
14. [slash extension](https://ext.slash.fi/)
15. [【GitHub】slash-extension-nft-minting](https://github.com/mashharuki/slash-extension-nft-minting)
16. [【Figma】shape全体像](https://www.figma.com/file/dklO5wpMlUXHhNfJ2TGzj7/Shape?node-id=0%3A1)
17. [【chainlink】testnet contracts](https://docs.chain.link/any-api/testnet-oracles/)
18. [【chainlink】hackson resources](https://docs.chain.link/resources/hackathon-resources)
19. [【Zenn】AstarテストネットにデプロイしたコントラクトをHardhatからVerifyする](https://zenn.dev/pokena/articles/f54111c987e0c5)
20. [Hardhat Verification Plugin](https://docs.blockscout.com/for-users/verifying-a-smart-contract/hardhat-verification-plugin#config-file)
21. [hardhat-etherscan](https://hardhat.org/hardhat-runner/plugins/nomiclabs-hardhat-etherscan#adding-support-for-other-networks)
22. [【Sample】verified contract](https://blockscout.com/shibuya/address/0x83f15ccdD1278908dF5bC646E903afE2f342deC1)

### 開発メモ
1. NFT作成の際に日本語ではなく英語入力にする
👉postの際に日本語の情報をヘッダに入れることでエラーとなる。