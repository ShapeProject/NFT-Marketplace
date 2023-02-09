import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react';

import images from '../assets';
import { NFTContext } from '../context/NFTContext';

/**
 * NFTCard
 * @param {*} param0 nft, onProfilePage
 * @returns
 */
const HotelCard = ({ hotels }) => {
  const { nftCurrency } = useContext(NFTContext);

  console.log('hotels:', hotels);

  return (
    <>
      {hotels.map((hotel) => {
        const {
          hotelName,
          hotelImageUrl,
          hotelMinCharge,
        } = hotel.hotel[0].hotelBasicInfo;
        console.log(hotelName);
        return (
          <Link href={{ pathname: '/nft-details', query: hotel }}>
            <div className="flex-1 min-w-215 max-w-max xs:max-w-none sm:w-full sm:min-w-155 minmd:min-w-256 minlg:min-w-327 dark:bg-nft-black-3 bg-white rounded-2xl p-4 m-4 minlg:m-8 sm:my-2 sm:mx-2 cursor-pointer shadow-md">
              <div className="relative w-full h-52 sm:h-36 xs:h-56 minmd:h-60 minlg:h-300 rounded-2xl overflow-hidden">
                <Image
                  src={hotelImageUrl || 'https://img.travel.rakuten.co.jp/share/HOTEL/4624/4624.jpg'}
                  layout="fill"
                  objectFit="cover"
                  alt="nft01"
                />
              </div>
              <div className="mt-3 flex flex-col">
                <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm minlg:text-xl">
                  {hotelName}
                </p>
                <div className="flexBetween mt-1 minlg:mt-3 flex-row xs:flex-col xs:items-start xs:mt-3">
                  <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xs minlg:text-lg">
                    {hotelMinCharge}
                    <span className="font-normal"> {nftCurrency}</span>
                  </p>
                </div>
                <div className="mt-1 minlg:mt-3 flexBetween flex-row" />
              </div>
            </div>
          </Link>
        );
      })}
    </>
  );
};

export default HotelCard;
