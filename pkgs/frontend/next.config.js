const withEnv = require('next-env');
const dotenvLoad = require('dotenv-load');

dotenvLoad();

module.exports = withEnv();

module.exports = {
  reactStrictMode: true,
  images: {
    domains: [
      'ipfs.infura.io',
      'api.pinata.cloud',
      'gateway.pinata.cloud',
      'img.travel.rakuten.co.jp',
    ],
  },
  resolve: {
    fallback: {
      fs: false,
    },
  },
  i18n: {
    locales: ['en-US', 'fr', 'nl-NL'],
    defaultLocale: 'en-US',
  },
  // webpack5: true,
  // webpack: (config) => {
  //   config.resolve.fallback = { fs: false };

  //   return config;
  // },
};

// module.exports = {
//   webpack: (config, { isServer }) => {
//     // 空のオブジェクト渡すことでnpmパッケージがfsモジュールに依存しないようにします
//     if (!isServer) {
//       config.node = {
//         fs: 'empty',
//       };
//     }
//     return config;
//   },
// };
