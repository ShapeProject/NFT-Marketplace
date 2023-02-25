import { useTheme } from 'next-themes';
import Image from 'next/image';

import images from '../assets';

/**
 * SearchHotel
 * @param {*} param0 activeSelect,setActiveSelect,handleSearch,clearSearch
 * @returns
 */
const SearchHotel = ({
  handleSearch, placeholder,
}) => {
  const { theme } = useTheme();

  return (
    <div className="flex-1 flexCenter dark:bg-nft-black-2 bg-white border dark:border-nft-black-2 border-nft-gray-2 py-3 px-4 rounded-md">
      <Image
        src={images.search}
        objectFit="contain"
        width={20}
        height={20}
        alt="search"
        className={theme === 'light' ? 'filter invert' : undefined}
      />
      <input
        type="text"
        placeholder={placeholder}
        className="dark:bg-nft-black-2 bg-white mx-4 w-full font-poppins dark:text-white text-nft-black-1 font-normal text-xs outline-none"
        onChange={handleSearch}
      />
    </div>
  );
};

export default SearchHotel;
