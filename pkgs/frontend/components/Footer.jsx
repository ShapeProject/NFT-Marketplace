import { useTheme } from 'next-themes';
import Image from 'next/image';

import images from '../assets';
import Button from './Button';

/**
 * FooterLinks component
 * @param {*} param0 heading, items, extraClasses
 * @returns
 */
const FooterLinks = ({ heading, items, extraClasses }) => (
  <div className={`flex-1 justify-start items-start ${extraClasses}`}>
    <h3 className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl mb-10">
      {heading}
    </h3>
    {/* items */}
    {items.map((item, index) => (
      <p
        key={item + index}
        className="font-poppins dark:text-white text-nft-black-1 font-normal text-base cursor-pointer dark:hover:text-nft-gray-1 hover:text-nft-black-1 my-3"
      >
        {item}
      </p>
    ))}
  </div>
);

/**
 * Footer component
 * @returns
 */
const Footer = () => {
  const { theme } = useTheme();

  // image data arrary
  const pngs = [
    images.github,
    images.instagram,
    images.twitter,
    images.telegram,
    images.discord,
    images.note,
  ];

  // image url array
  const links = [
    'https://github.com/ShapeProject',
    '#',
    'https://twitter.com/Shape_ProjectJa',
    '#',
    '#',
    'https://note.com/shape_fit',
  ];

  return (
    <footer className="flexCenter flex-col border-t dark:border-nft-black-1 border-nft-gray-1 sm:py-8 py-16">
      <div className="w-full minmd:w-4/5 flex flex-row md:flex-col sm:px-4 px-16">
        <div className="flexStart flex-1 flex-col">
          <div className="flexCenter cursor-pointer">
            <Image
              src={images.ShapeLogoNoBackground}
              objectFit="contain"
              width={32}
              height={32}
              alt="logo"
            />
            <p className=" dark:text-white text-nft-dark font-semibold text-lg ml-1">
              Shape
            </p>
          </div>
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-base mt-6">
            Get the latest updates
          </p>
          <div className="flexBetween md:w-full  mt-6 dark:bg-nft-black-2 bg-white border dark:border-nft-black-2 border-nft-gray-2 rounded-md">
            <a href="https://twitter.com/Shape_ProjectJa">
              <div className="flex-initial">
                <Button
                  btnName="Please follow us!!"
                  btnType="primary"
                  classStyles="rounded-md"
                />
              </div>
            </a>
          </div>
        </div>

        <div className="flex-1 flexBetweenStart flex-wrap ml-10 md:ml-0 md:mt-8">
          <FooterLinks
            heading="Shape"
            items={['Explore', 'How it Works', 'Contact Us']}
          />
          <FooterLinks
            heading="Support"
            items={[
              'Help Center',
              'Terms of service',
              'Legal',
              'Privacy policy',
            ]}
            extraClasses="ml-4"
          />
        </div>
      </div>

      <div className="flexCenter w-full mt-5 border-t dark:border-nft-black-1 border-nft-gray-1 sm:px-4 px-16">
        <div className="flexBetween flex-row w-full minmd:w-4/5 sm:flex-col mt-7">
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-base">
            Shape Team. All Rights Reserved
          </p>
          <div className="flex flex-row sm:mt-4">
            {pngs.map((image, index) => (
              <div className="mx-2 cursor-pointer" key={`image ${index}`}>
                <a href={links[index]}>
                  <Image
                    src={image}
                    key={index}
                    objectFit="contain"
                    width={24}
                    height={24}
                    alt="social"
                    className={theme === 'light' ? 'filter invert' : undefined}
                  />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;