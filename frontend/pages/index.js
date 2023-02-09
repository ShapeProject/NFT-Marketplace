import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useContext, useEffect, useRef, useState } from 'react';

import axios from 'axios';
import images from '../assets';
import { Banner, CreatorCard, Loader, NFTCard, SearchBar, SearchHotel, HotelCard, Button } from '../components';
import { NFTContext } from '../context/NFTContext';
import { getCreators } from '../utils/getTopCreators';
import { makeid } from '../utils/makeId';
import { shortenAddress } from '../utils/shortenAddress';

/**
 * Home Component
 * @returns
 */
const Home = () => {
  const { fetchNFTs } = useContext(NFTContext);
  const [nfts, setNfts] = useState([]);
  const [nftsCopy, setNftsCopy] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hideButtons, setHideButtons] = useState(false);
  const [activeSelect, setActiveSelect] = useState('Recently Added');
  const [hotelList, setHotelList] = useState([]);
  const [formInput, updateFormInput] = useState({ contry: '', prefecture: '', city: '' });

  const scrollRef = useRef(null);
  const parentRef = useRef(null);

  const { theme } = useTheme();
  const REQUEST_URL = 'https://app.rakuten.co.jp/services/api/Travel/SimpleHotelSearch/20170426';
  const APP_ID = '1034665255539887341';

  // get hotel information from RAKUTEN TRAVEL API
  const rakutenAPI = async () => {
    try {
      console.log('rakutenAPIに入りました！');
      const { country, prefecture, city } = formInput;
      const params = {
        format: 'json',
        largeClassCode: country,
        middleClassCode: prefecture,
        smallClassCode: city,
        applicationId: APP_ID,
      };
      console.log('axios前！');

      // upload to pinata
      const res = await axios.get(
        // APIのURL
        REQUEST_URL,
        // req params
        { params },
        { headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST,GET,PUT,DELETE',
          'Access-Control-Allow-Headers': 'Content-Type',
        } },
      );
      console.log('axiosあと！');
      // axios.defaults.withCredentials = true;
      console.log('res: ', res.data.hotels);
      const { hotels } = res.data;
      setHotelList(hotels);
      // hotels.map((hotel) => {
      //   const {
      //     hotelNo,
      //     hotelName,
      //     hotelImageUrl,
      //     roomImageUrl,
      //     hotelMinCharge,
      //     address1,
      //     reviewAverage,
      //   } = hotel.hotel[0].hotelBasicInfo;
      //   console.log(hotelName);
      //   return (
      //     <HotelCard key={hotelNo} name={hotelName} roomImage={roomImageUrl} hotelImage={hotelImageUrl} price={hotelMinCharge} address={address1} review={reviewAverage} />
      //   );
      // });

      console.log('returnあと');
    } catch (error) {
      console.log('Error getting info of hotels: ', error);
    }
  };

  // useEffect(() => {
  //   rakutenAPI().then((hotelsData) => {
  //     setHotelList(hotelsData);
  //     setIsLoading(false);
  //   });
  // }, []);

  useEffect(() => {
    fetchNFTs().then((items) => {
      setNfts(items.reverse());
      setNftsCopy(items);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    const sortedNfts = [...nfts];

    switch (activeSelect) {
      case 'Price (low to high)':
        setNfts(sortedNfts.sort((a, b) => a.price - b.price));
        break;
      case 'Price (high to low)':
        setNfts(sortedNfts.sort((a, b) => b.price - a.price));
        break;
      case 'Recently added':
        setNfts(sortedNfts.sort((a, b) => b.tokenId - a.tokenId));
        break;
      default:
        setNfts(nfts);
        break;
    }
  }, [activeSelect]);

  /**
   * onHandleSearch function
   * @param {*} value form data
   */
  const onHandleSearch = (value) => {
    const filteredNfts = nfts.filter(({ name }) => name.toLowerCase().includes(value.toLowerCase()));

    if (filteredNfts.length === 0) {
      setNfts(nftsCopy);
    } else {
      setNfts(filteredNfts);
    }
  };

  /**
   * onClearSearch function
   */
  const onClearSearch = () => {
    if (nfts.length && nftsCopy.length) {
      setNfts(nftsCopy);
    }
  };

  /**
   * handleScroll function
   * @param {*} direction
   */
  const handleScroll = (direction) => {
    const { current } = scrollRef;

    const scrollAmount = window.innerWidth > 1800 ? 270 : 210;

    if (direction === 'left') {
      current.scrollLeft -= scrollAmount;
    } else {
      current.scrollLeft += scrollAmount;
    }
  };

  /**
   * check if scrollRef container is overfilling its parentRef container
   * @returns
   */
  const isScrollable = () => {
    const { current } = scrollRef;
    const { current: parent } = parentRef;

    if (current?.scrollWidth >= parent?.offsetWidth) {
      return setHideButtons(false);
    }
    return setHideButtons(true);
  };

  // if window is resized
  useEffect(() => {
    isScrollable();
    window.addEventListener('resize', isScrollable);

    return () => {
      window.removeEventListener('resize', isScrollable);
    };
  });

  // call getCreators function
  const creators = getCreators(nfts);

  return (
    <div className="flex justify-center sm:px-4 p-12">
      <div className="w-full minmd:w-4/5">
        <Banner
          name={(
            <>
              Discover, collect, and sell <br /> extraordinary NFTs
            </>
          )}
          childStyles="md:text-4xl sm:text-2xl xs:text-xl text-left"
          parentStyle="justify-start mb-7 h-72 sm:h-60 p-12 xs:p-4 xs:h-44 rounded-3xl"
        />

        <div className="flexBetween mx-4 xs:mx-0 minlg:mx-8 sm:flex-col sm:items-start">
          <h1 className="flex-1 font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold sm:mb-4">
            Seach Your Hotels
          </h1>

          <div className="flex-2 sm:w-full flex flex-row sm:flex-col">
            <SearchHotel
              placeholder="Put Country name"
              handleSearch={(e) => updateFormInput({ ...formInput, country: e.target.value })}
            />
            <SearchHotel
              placeholder="Prefecture name"
              handleSearch={(e) => updateFormInput({ ...formInput, prefecture: e.target.value })}
            />
            <SearchHotel
              placeholder="City name"
              handleSearch={(e) => updateFormInput({ ...formInput, city: e.target.value })}
            />
            <Button
              btnName="Search"
              btnType="primary"
              classStyles="rounded-md"
              handleClick={rakutenAPI}
            />
          </div>
        </div>
        <div className="mt-3 w-full flex flex-wrap justify-start md:justify-center">
          {!hotelList ? (
            <p>You can search Hotel here</p>
          ) : (
            <HotelCard hotels={hotelList} />
          )}
        </div>

        {!isLoading && !nfts.length ? (
          <h1 className="font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold ml-4 xs:ml-0">
            That&apos;s weird... No NFTs for sale!
          </h1>
        ) : isLoading ? (
          <Loader />
        ) : (
          <>
            <div>
              <h1 className="font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold ml-4 xs:ml-0">
                Best Creators
              </h1>

              <div
                className="relative flex-1 max-w-full flex mt-3"
                ref={parentRef}
              >
                <div
                  className="flex flex-row w-max overflow-x-scroll no-scrollbar select-none"
                  ref={scrollRef}
                >
                  {creators.map((creator, i) => (
                    <CreatorCard
                      key={creator.seller}
                      rank={i + 1}
                      creatorImage={images[`creator${i + 1}`]}
                      creatorName={shortenAddress(creator.seller)}
                      creatorEths={creator.sumall}
                    />
                  ))}
                  {[6, 7, 8, 9, 10].map((i) => (
                    <CreatorCard
                      key={`creator-${i}`}
                      rank={i}
                      creatorImage={images[`creator${i}`]}
                      creatorName={`0x${makeid(3)}...${makeid(4)}`}
                      creatorEths={10 - i * 0.534}
                    />
                  ))}
                  {!hideButtons && (
                    <>
                      <div
                        onClick={() => handleScroll('left')}
                        className="absolute w-8 h-8 minlg:w-12 minlg:h-12 top-45 cursor-pointer left-0"
                      >
                        <Image
                          src={images.left}
                          layout="fill"
                          objectFit="contain"
                          alt="left_arrow"
                          className={
                            theme === 'light' ? 'filter invert' : undefined
                          }
                        />
                      </div>
                      <div
                        onClick={() => handleScroll('right')}
                        className="absolute w-8 h-8 minlg:w-12 minlg:h-12 top-45 cursor-pointer right-0"
                      >
                        <Image
                          src={images.right}
                          layout="fill"
                          objectFit="contain"
                          alt="left_arrow"
                          className={
                            theme === 'light' ? 'filter invert' : undefined
                          }
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-10">
              <div className="flexBetween mx-4 xs:mx-0 minlg:mx-8 sm:flex-col sm:items-start">
                <h1 className="flex-1 font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold sm:mb-4">
                  Hot Bids
                </h1>

                <div className="flex-2 sm:w-full flex flex-row sm:flex-col">
                  <SearchBar
                    activeSelect={activeSelect}
                    setActiveSelect={setActiveSelect}
                    handleSearch={onHandleSearch}
                    clearSearch={onClearSearch}
                  />
                </div>
              </div>
              <div className="mt-3 w-full flex flex-wrap justify-start md:justify-center">
                {nfts.map((nft) => (
                  <NFTCard key={nft.tokenId} nft={nft} />
                ))}
                {/* {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                  <NFTCard
                    key={`nft-${i}`}
                    nft={{
                      i,
                      name: `Nifty NFT ${i}`,
                      price: (10 - i * 0.534).toFixed(2),
                      seller: `0x${makeid(3)}...${makeid(4)}`,
                      owner: `0x${makeid(3)}...${makeid(4)}`,
                      description: 'Cool NFT on Sale',
                    }}
                  />
                ))} */}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
