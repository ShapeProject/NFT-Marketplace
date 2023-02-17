import { useContext } from 'react';

import { NFTContext } from '../context/NFTContext';

/**
 * Input component
 * @param {*} param0 inputType, title, placeholder, handleClick
 * @returns
 */
const Input = ({ inputType, title, placeholder, handleClick, value }) => {
  const { nftCurrency } = useContext(NFTContext);

  return (
    <div className="mt-10 w-full">
      <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">
        {title}
      </p>

      {inputType === 'number' ? (
        <div className="dark:bg-nft-black-1 bg-white border dark:border-nft-black-1 border-nft-gray-2 rounded-lg w-full outline-none font-poppins dark:text-white text-nft-gray-2 text-base mt-4 px-4 py-3 flexBetween flex-row">
          {!value ? (
            <input
              type="number"
              className="flex-1 w-full dark:bg-nft-black-1 bg-white outline-none "
              placeholder={placeholder}
              onChange={handleClick}
            />
          ) : (
            <input
              type="number"
              className="flex-1 w-full dark:bg-nft-black-1 bg-white outline-none "
              placeholder={placeholder}
              value={value}
              onChange={handleClick}
            />
          )}

          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">
            {nftCurrency}
          </p>
        </div>
      ) : inputType === 'textarea' ? (
        <dev>
          {!value ? (
            <textarea
              rows={10}
              className="dark:bg-nft-black-1 bg-white border dark:border-nft-black-1 border-nft-gray-2 rounded-lg w-full outline-none font-poppins dark:text-white text-nft-gray-2 text-base mt-4 px-4 py-3"
              placeholder={placeholder}
              onChange={handleClick}
            />
          ) : (
            <textarea
              rows={10}
              className="dark:bg-nft-black-1 bg-white border dark:border-nft-black-1 border-nft-gray-2 rounded-lg w-full outline-none font-poppins dark:text-white text-nft-gray-2 text-base mt-4 px-4 py-3"
              placeholder={placeholder}
              value={value}
              onChange={handleClick}
            />
          )}
        </dev>
      ) : (
        <dev>
          {!value ? (
            <input
              className="dark:bg-nft-black-1 bg-white border dark:border-nft-black-1 border-nft-gray-2 rounded-lg w-full outline-none font-poppins dark:text-white text-nft-gray-2 text-base mt-4 px-4 py-3"
              placeholder={placeholder}
              onChange={handleClick}
            />
          ) : (
            <input
              className="dark:bg-nft-black-1 bg-white border dark:border-nft-black-1 border-nft-gray-2 rounded-lg w-full outline-none font-poppins dark:text-white text-nft-gray-2 text-base mt-4 px-4 py-3"
              placeholder={placeholder}
              value={value}
              onChange={handleClick}
            />
          )}
        </dev>

      )}
    </div>
  );
};

export default Input;
