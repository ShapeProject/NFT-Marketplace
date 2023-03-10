// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./interfaces/ISlashCustomPlugin.sol";
import "./libs/UniversalERC20.sol";

import "hardhat/console.sol";

/**
 * NFTMarketplace Contract
 */
contract NFTMarketplace is ERC721URIStorage, ISlashCustomPlugin {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsSold;
    using UniversalERC20 for IERC20;

    uint256 listingPrice = 0.025 ether;
    address payable owner;

    mapping(uint256 => MarketItem) private idToMarketItem;
    mapping(string => uint256) public purchaseInfo;

    // struct of MarketItem
    struct MarketItem {
      uint256 tokenId;
      address payable seller;
      address payable owner;
      uint256 price;
      bool sold;
    }

    // struct of PurchaseInfo data
    struct PurchaseInfo {
      uint256 tokenId;
    }

    /////////////////////////////////////////////////////////////////////////////////////
    // Event
    /////////////////////////////////////////////////////////////////////////////////////

    event MarketItemCreated (
      uint256 indexed tokenId,
      address seller,
      address owner,
      uint256 price,
      bool sold
    );

    event TokenWithdrawn(address tokenContract, uint256 amount);
    event Payment(address from, address to, uint amount);

    /////////////////////////////////////////////////////////////////////////////////////
    // function
    /////////////////////////////////////////////////////////////////////////////////////

    /**
     * constructor
     */
    constructor() ERC721("Shape Market", "SHP") {
      owner = payable(msg.sender);
    }

    /**
     * Updates the listing price of the contract
     */
    function updateListingPrice(uint _listingPrice) public payable {
      require(owner == msg.sender, "Only marketplace owner can update listing price.");
      listingPrice = _listingPrice;
    }

    /**
     * Returns the listing price of the contract
     */
    function getListingPrice() public view returns (uint256) {
      return listingPrice;
    }

    /**
     * Mints a token and lists it in the marketplace
     */
    function createToken(string memory tokenURI, uint256 price) public payable returns (uint) {
      _tokenIds.increment();
      uint256 newTokenId = _tokenIds.current();
      
      _mint(msg.sender, newTokenId);
      _setTokenURI(newTokenId, tokenURI);
      createMarketItem(newTokenId, price);
      return newTokenId;
    }

    /**
     * createMarketItem function
     */
    function createMarketItem(
      uint256 tokenId,
      uint256 price
    ) private {
      require(price > 0, "Price must be at least 1 wei");
      require(msg.value == listingPrice, "Price must be equal to listing price");

      idToMarketItem[tokenId] =  MarketItem(
        tokenId,
        payable(msg.sender),
        payable(address(this)),
        price,
        false
      );

      setApprovalForAll(address(this), true);
      // _transfer(msg.sender, address(this), tokenId);
      emit MarketItemCreated(
        tokenId,
        msg.sender,
        address(this),
        price,
        false
      );
    }

    /**
     * allows someone to resell a token they have purchased
     */
    function resellToken(uint256 tokenId, uint256 price) public payable {
      require(idToMarketItem[tokenId].owner == msg.sender, "Only item owner can perform this operation");
      require(msg.value == listingPrice, "Price must be equal to listing price");
      idToMarketItem[tokenId].sold = false;
      idToMarketItem[tokenId].price = price;
      idToMarketItem[tokenId].seller = payable(msg.sender);
      idToMarketItem[tokenId].owner = payable(address(this));
      _itemsSold.decrement();

      setApprovalForAll(address(this), true);
      // _transfer(msg.sender, address(this), tokenId);
    }

    /**
     * Creates the sale of a marketplace item 
     * Transfers ownership of the item, as well as funds between parties
     * @param tokenId token Id
     */ 
    function createMarketSale(
      uint256 tokenId
    ) public payable {
      uint price = idToMarketItem[tokenId].price;
      // require(msg.value == price, "Please submit the asking price in order to complete the purchase");
      require(isApprovedForAll(ownerOf(tokenId), address(this)), "The owner has not approved the token id to sell");
      
      address oldOwner = ownerOf(tokenId);
      idToMarketItem[tokenId].owner = payable(msg.sender);
      idToMarketItem[tokenId].sold = true;
      idToMarketItem[tokenId].seller = payable(address(0));
      _itemsSold.increment();

      // transer NFT
      _transfer(oldOwner, msg.sender, tokenId);

      payable(owner).transfer(listingPrice);
      payable(idToMarketItem[tokenId].seller).transfer(msg.value);

    }

    /**
     * @dev receive payment from SlashCore Contract
     * @param receiveToken: payment receive token 
     * @param amount: payment receive amount
     * @param paymentId: PaymentId generated by the merchant when creating the payment URL
     * @param optional: Optional parameter passed at the payment
     * @param reserved: Reserved parameter
     */
    function receivePayment(
      address receiveToken,
      uint256 amount,
      string memory paymentId,
      string memory optional,
      bytes calldata reserved
    ) public payable override {
      require(amount > 0, "invalid amount");
      require(receiveToken != address(0), "invalid token");
      // transfer ERC20 Token from msg.sender to owner
      IERC20(receiveToken).universalTransferFrom(msg.sender, owner, amount);
      // decode reserved data
      PurchaseInfo memory info = abi.decode(reserved, (PurchaseInfo));
      // call createMarketSale function
      createMarketSale(info.tokenId);
      
      // set purchaseInfo
      purchaseInfo[paymentId] = info.tokenId;
      emit Payment(msg.sender, owner, amount);
    }

    /**
     * Returns all unsold market items
     */
    function fetchMarketItems() public view returns (MarketItem[] memory) {
      uint itemCount = _tokenIds.current();
      uint unsoldItemCount = _tokenIds.current() - _itemsSold.current();
      uint currentIndex = 0;

      MarketItem[] memory items = new MarketItem[](unsoldItemCount);
      for (uint i = 0; i < itemCount; i++) {
        if (idToMarketItem[i + 1].owner == address(this)) {
          uint currentId = i + 1;
          MarketItem storage currentItem = idToMarketItem[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }

    /** 
     * Returns only items that a user has purchased
     */
    function fetchMyNFTs() public view returns (MarketItem[] memory) {
      uint totalItemCount = _tokenIds.current();
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].owner == msg.sender) {
          itemCount += 1;
        }
      }

      MarketItem[] memory items = new MarketItem[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].owner == msg.sender) {
          uint currentId = i + 1;
          MarketItem storage currentItem = idToMarketItem[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }

    /**
     * Returns only items a user has listed
     */
    function fetchItemsListed() public view returns (MarketItem[] memory) {
      uint totalItemCount = _tokenIds.current();
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].seller == msg.sender) {
          itemCount += 1;
        }
      }

      MarketItem[] memory items = new MarketItem[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].seller == msg.sender) {
          uint currentId = i + 1;
          MarketItem storage currentItem = idToMarketItem[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }

    /**
     * withdrawToken
     * @param tokenAddress token address (USDT)
     * Shibuya network 0x94373a4919B3240D86eA41593D5eBa789FEF3848(USDT)
     */
    function withdrawToken(address tokenAddress) external {
      // check balance
      require(
        IERC20(tokenAddress).universalBalanceOf(address(this)) > 0,
        "balance is zero"
      );

      // check owner address
      require(
        msg.sender == owner,
        "msg.sender must be owner address"
      );

      // transfer ERC20 token
      IERC20(tokenAddress).universalTransfer(
        msg.sender,
        IERC20(tokenAddress).universalBalanceOf(address(this))
      );

      emit TokenWithdrawn(
        tokenAddress,
        IERC20(tokenAddress).universalBalanceOf(address(this))
      );
    }

    /**
     * @dev Check if the contract is Slash Plugin
     */
    function supportSlashExtensionInterface()
        external
        pure
        override
        returns (uint8)
    {
        return 2;
    }
}