import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCallback, useContext, useMemo, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

import axios from 'axios';
import FormData from 'form-data';
import * as fs from 'fs';
import images from '../assets';
import { Button, Input, Loader } from '../components';
import { NFTContext } from '../context/NFTContext';
// baseURI for pinata API
const baseAPIUrl = 'https://api.pinata.cloud';

/**
 * CreateItem component
 * @returns component
 */
const CreateItem = () => {
  const { createSale, isLoadingNFT } = useContext(NFTContext);
  const [fileUrl, setFileUrl] = useState(null);
  const [imageApiUrl, setImageApiUrl] = useState(null);
  const [postedFile, setPostedFile] = useState(null);
  const { theme } = useTheme();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [hotelBasicInfo, setHotelBasicInfo] = useState([]);
  // const [apiHotelName, setApiHotelName] = useState(null);
  // const [apiAddress2, setApiAddress2] = useState(null);
  // const [apiHotelMinCharge, setApiHotelMinCharge] = useState(null);
  // const [hotelPolicyInfo, setHotelPolicyInfo] = useState([]);

  console.log(`fileUrl : ${fileUrl}`);

  const pinataApiKey = process.env.NEXT_PUBLIC_PROJECT_ID;
  const pinataApiSecret = process.env.NEXT_PUBLIC_PROJECT_SECRET;

  // const { hotelMinCharge, address1, address2, hotelName } = hotelBasicInfo;
  console.log('fs: ', fs);
  // console.log('globalのhotel :', hotelName);
  // console.log('globalのhotel :', address1);
  // console.log('globalのhotel :', address2);
  // console.log('globalのhotel :', hotelImageUrl);
  // console.log('globalのhotel :', hotelMinCharge);

  /**
   * uploadToInfura function
   * @param {*} file file data
   */
  const uploadToInfura = async (file) => {
    try {
      console.log('uploadToInfuraの中のfile', file);
      // create request params
      const postData = new FormData();
      postData.append('file', file);
      postData.append('pinataOptions', '{"cidVersion": 1}');
      postData.append('pinataMetadata', '{"name": "テストname", "keyvalues": {"company": "nearHotel"}}');
      console.log(`"postDataUpload: " ${postData}`);

      // upload to pinata
      const res = await axios.post(
        // APIのURL
        `${baseAPIUrl}/pinning/pinFileToIPFS`,
        // req params
        postData,
        // header
        {
          headers: {
            accept: 'application/json',
            pinata_api_key: `${pinataApiKey}`,
            pinata_secret_api_key: `${pinataApiSecret}`,
            'Content-Type': `multipart/form-data; boundary=${postData}`,
          },
        },
      );

      console.log('CID:', res.data.IpfsHash);
      const url = `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
      console.log(`fileUrl : ${url}`);

      setPostedFile(file);
      setFileUrl(url);
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  };

  /**
   * onDrop callback function
   */
  const onDrop = useCallback(async (acceptedFile) => {
    console.log('acceptedFile[0]', acceptedFile[0]);
    console.log('acceptedFile', acceptedFile);
    await uploadToInfura(acceptedFile[0]);
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: 'image/*',
    maxSize: 5000000,
  });

  // add tailwind classes acording to the file status
  const fileStyle = useMemo(
    () => `dark:bg-nft-black-1 bg-white border dark:border-white border-nft-gray-2 flex flex-col items-center p-5 rounded-sm border-dashed  
       ${isDragActive ? ' border-file-active ' : ''} 
       ${isDragAccept ? ' border-file-accept ' : ''} 
       ${isDragReject ? ' border-file-reject ' : ''}`,
    [isDragActive, isDragReject, isDragAccept],
  );

  const [formInput, updateFormInput] = useState({
    price: '',
    name: '',
    description: '',
  });
  // hotel api 実装のため一旦コメントアウト
  // const router = useRouter();

  useEffect(async () => {
    if (!router.isReady) return;

    setHotelBasicInfo(router.query);
    console.log('router.query.hotelImageUrl', router.query.hotelImageUrl);
    const { hotelImageUrl, hotelName, address2, hotelMinCharge } = router.query;
    console.log('useEffectのimageURL :', hotelImageUrl);
    console.log(Date.now());
    // setApiHotelName(hotelName);
    // setApiAddress2(address2);
    // setApiHotelMinCharge(hotelMinCharge);

    updateFormInput({ ...formInput, name: hotelName });
    updateFormInput({ ...formInput, description: address2 });
    updateFormInput({ ...formInput, price: hotelMinCharge });

    setImageApiUrl(hotelImageUrl);
  }, [router.isReady]);

  /**
   * createMarket function
   */
  const createMarket = async () => {
    // get form datas
    const { name, description, price } = formInput;
    console.log(`"name: " ${name}`);
    console.log(`"description: " ${description}`);
    console.log(`"price: " ${price}`);
    console.log(`"fileUrl: " ${fileUrl}`);
    console.log(`"imageApiUrl: " ${imageApiUrl}`);
    if (!name || !description || !price || (!fileUrl || !imageApiUrl)) return;

    try {
      // create req param datas
      const postData = new FormData();
      postData.append('file', postedFile);
      postData.append('pinataOptions', '{"cidVersion": 1}');
      postData.append('pinataMetadata', '{"name": "テストname", "keyvalues": {"company": "nearHotel"}}');
      console.log(`"postDataMarket: " ${postData}`);

      // upload to pinata
      const res = await axios.post(
        // API
        `${baseAPIUrl}/pinning/pinFileToIPFS`,
        // req param data
        postData,
        // header
        {
          headers: {
            accept: 'application/json',
            pinata_api_key: `${pinataApiKey}`,
            pinata_secret_api_key: `${pinataApiSecret}`,
            'Content-Type': `multipart/form-data; boundary=${postData}`,
          },
        },
      );

      // うまくいかないので別の方法で試してみた
      // const data = JSON.stringify({
      //   ipfsPinHash: fileUrl,
      //   name,
      //   description,
      // });

      // const config = {
      //   method: 'post',
      //   url: `${baseAPIUrl}/pinning/pinFileToIPFS`,
      //   headers: {
      //     accept: 'application/json',
      //     pinata_api_key: `${pinataApiKey}`,
      //     pinata_secret_api_key: `${pinataApiSecret}`,
      //     'Content-Type': `multipart/form-data; boundary=${data}`,
      //   },
      //   data,
      // };

      // const res = await axios(config);

      console.log(res.data);

      console.log(res.data);
      console.log('CID:', res.data.IpfsHash);
      const url = `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
      console.log(`nftUrl : ${url}`);

      /* after file is uploaded to IPFS, pass the URL to save it on Blockchain */
      // call createSale fuction
      await createSale(url, formInput.price);
      router.push('/');
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  };

  if (isLoadingNFT) {
    return (
      <div className="flexCenter" style={{ height: '51vh' }}>
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex justify-center sm:px-4 p-12">
      <div className="w-3/5 md:w-full">
        <h1 className="font-poppins dark:text-white text-nft-black-1 font-semibold text-2xl">
          Create new NFT
        </h1>

        <div className="mt-16">
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">
            Upload file
          </p>
          <div className="mt-4">
            <div {...getRootProps()} className={fileStyle}>
              <input {...getInputProps()} />
              <div className="flexCenter flex-col text-center">
                <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">
                  JPG, PNG, GIF, SVG, WEBM, MP3, MP4. Max 100mb.
                </p>

                <div className="my-12 w-full flex justify-center">
                  <Image
                    src={images.upload}
                    width={100}
                    height={100}
                    objectFit="contain"
                    alt="file upload"
                    className={theme === 'light' ? 'filter invert' : undefined}
                  />
                </div>

                <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm">
                  Drag and Drop File
                </p>
                <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm mt-2">
                  Or browse media on your device
                </p>
              </div>
            </div>
            {fileUrl && (
              <aside>
                <div>
                  <img src={fileUrl} alt="Asset_file" />
                </div>
              </aside>
            )}
            {/* {fileUrl ? (
              <aside>
                <div>
                  <img src={fileUrl} alt="Asset_file" />
                </div>
              </aside>
            ) : (
              <aside>
                <div>
                  <img src={imageApiUrl} alt="Asset_file" />
                </div>
              </aside>
            )} */}
          </div>
        </div>

        <Input
          inputType="input"
          title="Name"
          placeholder="Asset Name"
          value={formInput.name}
          handleClick={(e) => updateFormInput({ ...formInput, name: e.target.value })}
        />

        <Input
          inputType="textarea"
          title="Description"
          value={formInput.description}
          placeholder="Asset Description"
          handleClick={(e) => updateFormInput({ ...formInput, description: e.target.value })}
        />

        <Input
          inputType="number"
          title="Price"
          value={formInput.price}
          placeholder="Asset Price"
          handleClick={(e) => updateFormInput({ ...formInput, price: e.target.value })}
        />

        <div className="mt-7 w-full flex justify-end">
          <Button
            btnName="Create Item"
            btnType="primary"
            classStyles="rounded-xl"
            handleClick={createMarket}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateItem;
