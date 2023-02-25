import axios from 'axios';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import Web3Modal from 'web3modal';
import superAgent from 'superagent';

import { MarketAddress, MarketAddressABI } from './constants';

export const NFTContext = React.createContext();

// create contract data
const fetchContract = (signerOrProvider) => new ethers.Contract(MarketAddress, MarketAddressABI, signerOrProvider);

/**
 * NFTProvider component
 * @param {*} param0 children component
 * @returns
 */
export const NFTProvider = ({ children }) => {
  const nftCurrency = 'ETH';
  const [currentAccount, setCurrentAccount] = useState('');
  const [isLoadingNFT, setIsLoadingNFT] = useState(false);
  const [nfts, setNfts] = useState([]);

  /**
   * fetchNFTs function
   * @returns
   */
  const fetchNFTs = async () => {
    setIsLoadingNFT(false);

    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    const provider = new ethers.providers.JsonRpcProvider('https://eth-goerli.g.alchemy.com/v2/PPq6amF0yaNOJF3LlBoggF5UIzDSgnEe');

    // get contract object
    const contract = fetchContract(provider);
    console.log('contractAddress: ', contract.address);
    // get MarketItems
    const data = await contract.fetchMarketItems();

    const items = await Promise.all(
      data.map(async ({ tokenId, seller, owner, price: unformattedPrice }) => {
        console.log('tokenId: ', tokenId);
        console.log('seller: ', seller);
        console.log('owner: ', owner);
        // get tokenURI
        const tokenURI = await contract.tokenURI(tokenId);
        console.log('tokenURI: ', tokenURI);

        // 下記方法でtokenのmetadata取れなかったので一旦コメントアウトget token metadata
        // const {
        //   data: { image, name, description },
        // } = await axios.get(tokenURI);
        // console.log('image: ', image);
        // get NFT price

        const metadata = async () => {
          await superAgent
            .get(`https://deep-index.moralis.io/api/v2/nft/${contract.address}`)
            .query({
            // chain: `${networkId}`,0x5
              chain: '0x5',
              format: 'decimal',
            })
            .set({
              Accept: 'application/json',
              'x-api-key': `${process.env.NEXT_PUBLIC_PROJECT_MORALIS_API_KEY}`,
            })
            .end((err, res) => {
              if (err) {
                console.log('NFTのデータ取得中にエラー発生', err);
                return err;
              }
              console.log('データ取得成功！：', res.body);
              console.log('データ取得成功！：', res.body.result);
              // nft自体が配列のためそれをループして回してとってくるひつようがあるnft[].metadataでやっと取ってこれる
              setNfts(res.body.result);
              return res.body.result;
              // const nft = res.body.result;
              // console.log('Context内のnft！：', nft);
              // console.log('JSON.parse(nft[1].metadata)', JSON.parse(nft[1].metadata).name);
              // console.log('nft: ', nft);
              // const NFTData = JSON.parse(nft[1].metadata);
              // setNfts(JSON.parse(nft[1].metadata));
              // console.log('NFTData: ', NFTData);
              // console.log('nft.name: ', NFTData.nsame);
              // console.log('nft.image: ', NFTData.image);
              // console.log('nft.description: ', NFTData.description);
              // return NFTData;
            });
        };

        await metadata();
        console.log('tokenURI: ', tokenURI);
        console.log('name: ', nfts.name);
        console.log('description: ', nfts.description);
        console.log('image: ', nfts.image);

        const price = ethers.utils.formatUnits(
          unformattedPrice.toString(),
          'ether',
        );

        return {
          price,
          tokenId: tokenId.toNumber(),
          id: tokenId.toNumber(),
          seller,
          owner,
          image: nfts.metadata.image,
          name: nfts.metadata.name,
          description: nfts.metadata.description,
          tokenURI,
        };
      }),
    );

    return items;
  };

  /**
   * fetchMyNFTsOrCreatedNFTs function
   */
  const fetchMyNFTsOrCreatedNFTs = async (type) => {
    setIsLoadingNFT(false);

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    // get contract object
    const contract = fetchContract(signer);
    // get data
    const data = type === 'fetchItemsListed' ? await contract.fetchItemsListed() : await contract.fetchMyNFTs();

    const items = await Promise.all(
      data.map(async ({ tokenId, seller, owner, price: unformattedPrice }) => {
        const tokenURI = await contract.tokenURI(tokenId);
        const {
          data: { image, name, description },
        } = await axios.get(tokenURI);
        const price = ethers.utils.formatUnits(
          unformattedPrice.toString(),
          'ether',
        );

        return {
          price,
          tokenId: tokenId.toNumber(),
          seller,
          owner,
          image,
          name,
          description,
          tokenURI,
        };
      }),
    );

    return items;
  };

  /**
   * createSale fucntion
   * @param {*} url tokenURI url
   * @param {*} formInputPrice NFT price
   */
  const createSale = async (url, formInputPrice) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    // get price
    const price = ethers.utils.parseUnits(formInputPrice, 'ether');
    // get contract object
    const contract = fetchContract(signer);
    // get listing price
    const listingPrice = await contract.getListingPrice();

    // call createToken function
    const transaction = await contract.createToken(url, price, {
      value: listingPrice.toString(),
    });

    setIsLoadingNFT(true);
    await transaction.wait();
  };

  /**
   * buyNft function
   * @param {*} nft NFT data
   */
  const buyNft = async (nft) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    // get signer data
    const signer = provider.getSigner();
    // create contract data
    const contract = new ethers.Contract(
      MarketAddress,
      MarketAddressABI,
      signer,
    );
    // get price
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');

    const transaction = await contract.createMarketSale(nft.tokenId, {
      value: price,
      gasLimit: 3000000,
    });

    setIsLoadingNFT(true);
    await transaction.wait();
    setIsLoadingNFT(false);
  };

  /**
   * connectWallet function
   * @returns
   */
  const connectWallet = async () => {
    if (!window.ethereum) return alert('Please install MetaMask.');
    // get account data
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    setCurrentAccount(accounts[0]);
    window.location.reload();
  };

  /**
   * checkIfWalletIsConnect function
   * @returns
   */
  const checkIfWalletIsConnect = async () => {
    if (!window.ethereum) return alert('Please install MetaMask.');

    const accounts = await window.ethereum.request({ method: 'eth_accounts' });

    if (accounts.length) {
      setCurrentAccount(accounts[0]);
    } else {
      console.log('No accounts found');
    }
  };

  useEffect(() => {
    checkIfWalletIsConnect();
  }, []);

  return (
    <NFTContext.Provider
      value={{
        nftCurrency,
        buyNft,
        createSale,
        fetchNFTs,
        fetchMyNFTsOrCreatedNFTs,
        connectWallet,
        currentAccount,
        isLoadingNFT,
      }}
    >
      {children}
    </NFTContext.Provider>
  );
};
