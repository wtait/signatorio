//const { ethers } = require("hardhat");
const { ethers } = require("ethers");
require("@nomiclabs/hardhat-waffle");
const fs = require('fs');
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");
const { keccak256 } = require("@ethersproject/keccak256");
const { getContractAt } = require("@nomiclabs/hardhat-ethers/dist/src/helpers");
const contracts = require("../../react-app/src/contracts/contracts");
//const walletABI = require("../../react-app/src/contracts/SmartWallet.abi");
const walletABI = require("../abi/contracts/SmartWallet.sol/SmartWallet.json");
const { call } = require("ramda");
const { providers } = require("../../react-app/node_modules/ethers/lib");
const { Signer } = require("crypto");
const { SignerWithAddress } = require("@nomiclabs/hardhat-ethers/dist/src/signer-with-address");
const { isHexString } = require("@ethersproject/bytes");
//const { Signer } = require("crypto");
use(solidity);

describe("1271Wallet", function () {
  let WalletFactory, WalletFactory_contractFactory, wallet, wallet2, owner, addr1, addr2;

  beforeEach(async function () {
    WalletFactory_contractFactory = await hre.ethers.getContractFactory("WalletFactory");
    SmartWallet_contractFactory = await hre.ethers.getContractFactory("SmartWallet");
     [owner, addr1, addr2] = await hre.ethers.getSigners();

    WalletFactory = await WalletFactory_contractFactory.deploy();
    //SmartWallet = await 
    //console.log("owner address: ", owner.address)
    console.log("wallet factory: " + WalletFactory.address)
    //salt method just for testing... evaluate proper implementation later
    //salt = keccak256(owner.address, WalletFactory.address);

    // Submit the transaction and wait for it to be added to current block's pending transactions
    let sampleWallet = await WalletFactory.createWallet('0x0000000000000000000000000000000000000000000000000000000000000001', owner.address, {from: owner.address});
    let sampleWallet2 = await WalletFactory.createWallet('0x0000000000000000000000000000000000000000000000000000000000000002', addr1.address, {from: owner.address})
    // Wait for one block confirmation. The transaction has been mined at this point.
    const receipt = await sampleWallet.wait();
    const receipt2 = await sampleWallet2.wait();
    // Get the events
    const events = receipt?.events // # => Event[] | undefined
    const events2 = receipt2?.events
    //console.log(events)
    //filter events
        //initial constructor will have ownership transferred to walletfactory address
            //filter events where event="OwnerShipTransferred" and confirm args.newOwner === WalletFactory.address
    let TRANSFER_OWNERSHIP = events.filter(
      event => event.event == 'OwnershipTransferred');
        //createWallet function will also emit an "OwnershipTransferred" event where args.NewOwner ===
    let WALLET_CREATION = events.find(
      event => event.event == 'WalletCreated');
    let WALLET_CREATION2 = events2.find(
      event => event.event == 'WalletCreated');
    //the address of the newly deployed wallet will be the first paramater of the "Wallet Created" event
    let walletAddress = WALLET_CREATION.args[0];
    let wallet2Address = WALLET_CREATION2.args[0];
      console.log("wallet address: " + walletAddress);
    //connect to deployed contract instance using a signer ("owner") to allow read-write access
      // Read-Only; By connecting to a Provider, allows:
      // - Any constant function
      // - Querying Filters
      // - Populating Unsigned Transactions for non-constant methods
      // - Estimating Gas for non-constant (as an anonymous sender)
      // - Static Calling non-constant methods (as anonymous sender)
      // wallet = new ethers.Contract(walletAddress, abi, provider);

      // Read-Write; By connecting to a Signer, allows:
      // - Everything from Read-Only (except as Signer, not anonymous)
      // - Sending transactions for non-constant functions
    wallet = new ethers.Contract(walletAddress, walletABI, owner);
    wallet2 = new ethers.Contract(wallet2Address, walletABI, addr1);
    //console.log(wallet)
  });

  describe("Deployment()", function () {
    it("Should transfer ownership of the newly deployed wallet to the address specified", async function () {
      expect(await wallet.owner()).to.equal(owner.address);
      expect(await wallet2.owner()).to.equal(addr1.address);
    });
    it("should fail when wallet owner not correctly set at creation", async function() {
      expect(await wallet.owner()).not.to.equal(addr1.address);
    })
  });

  describe("1271Wallet", function () {
    
    it("Should return the correct magic value when isValidSignature is called correctly", async function () {
  
      const magicValue = "0x1626ba7e";

      const message = "a simple message";
      const signature = await owner.signMessage(message)
      let verifiedAddress = ethers.utils.verifyMessage(message, signature);
  
      expect(verifiedAddress).to.equal(owner.address);

      console.log("is msg bytes? ", ethers.utils.isBytes(message));
      //const result = await wallet.methods.isValidSignature(data, signature).call()
      
      //let tx = await wallet.isValidSignature(data, signature);
      let ownerQuery = await wallet.owner();
      // Wait for one block confirmation. The transaction has been mined at this point.
      //let receipt = await tx.wait();
      
    //console.log("wallet.owner() call: " + ownerQuery, ", expected owner: " + owner.address, "isValidSignature: " + tx)
    });

  });
});
