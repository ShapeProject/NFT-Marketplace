require('dotenv').config();
require('@nomicfoundation/hardhat-toolbox');
require('@nomiclabs/hardhat-etherscan');
require("@nomiclabs/hardhat-web3");
require('hardhat-deploy');

/** @type import('hardhat/config').HardhatUserConfig */

const {
  ALCHEMY_GOERLI_URL,
  ALCHEMY_MUMBAI_URL,
  PRIVATE_KEY,
  GNOSISSCAN_API_KEY
  // ETHERSCAN_KEY,
} = process.env;

module.exports = {
  solidity: '0.8.4',
  paths: {                         
    artifacts: './../frontend/context',  
  },
  networks: {
    goerli: {
      url: "https://eth-goerli.g.alchemy.com/v2/PPq6amF0yaNOJF3LlBoggF5UIzDSgnEe",
      // accounts: [`0x${PRIVATE_KEY}`],
      accounts: ["0x7613804cf920d15097a7e2cd92febd64f981e55579091c50aa7aae61116b9847"],
    },
    // sepolia: {     
    //   url: "https://rpc.sepolia.org",      
    //   // accounts: [`0x${PRIVATE_KEY}`],
    //   accounts: ["0x7613804cf920d15097a7e2cd92febd64f981e55579091c50aa7aae61116b9847"],
    // },
    // mumbai: {
    //   url: ALCHEMY_MUMBAI_URL,
    //   accounts: [`0x${PRIVATE_KEY}`],
    // },
    // fuji: {
    //   url: 'https://api.avax-test.network/ext/bc/C/rpc',
    //   gasPrice: 225000000000,
    //   chainId: 43113,
    //   accounts: [PRIVATE_KEY]
    // },
    // bsctest: {
    //   url: "https://data-seed-prebsc-1-s1.binance.org:8545",
    //   chainId: 97,
    //   gasPrice: 20000000000,
    //   accounts: [PRIVATE_KEY]
    // },
    // shibuya: {
    //   url:"https://shibuya.public.blastapi.io",
    //   chainId:81,
    //   accounts:[PRIVATE_KEY],
    // },
    // shiden: {
    //   url:"https://shiden.api.onfinality.io/public",
    //   chainId:336,
    //   accounts:[PRIVATE_KEY],
    // },
    // astar: {
    //   url: "https://evm.astar.network",
    //   chainId: 592,
    //   accounts:[PRIVATE_KEY],
    // },
    // mainnet: {
    //   url: MAINNET_URL,
    //   accounts: [`0x${PRIVATE_KEY}`],
    // },
  },
  // etherscan: {
  //   apiKey: {
  //     shibuya: GNOSISSCAN_API_KEY
  //   },
  //   customChains: [
  //     {
  //       network: "shibuya",
  //       chainId: 81,
  //       urls: {
  //         apiURL: "https://blockscout.com/shibuya/api",
  //         browserURL: "https://blockscout.com/shibuya/"
  //       }
  //     }
  //   ]
  // },
  
};
