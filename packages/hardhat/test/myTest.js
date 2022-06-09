const { ethers } = require("hardhat");
const { expect } = require("chai");
//using "hardhat-abi-exporter" package to publish abi to packages/hardhat/abi prior to
//each deploy. To do this we call "hardhat clear-abi && hardhat export-abi" in the test command of package.json
const walletABI = require("../abi/contracts/SmartWallet.sol/SmartWallet.json");

const magicValue = "0x1626ba7e";

const  arbitrarySignature =
  "0xc531a1d9046945d3732c73d049da2810470c3b0663788dca9e9f329a35c8a0d56add77ed5ea610b36140641860d13849abab295ca46c350f50731843c6517eee1c";

const  arbitraryMsgHash =
  "0xec4870a1ebdcfbc1cc84b0f5a30aac48ed8f17973e0189abdb939502e1948238";

const arbitrarySalt = 
  '0x0000000000000000000000000000000000000000000000000000000000000001'; //salt method just for testing... evaluate proper implementation later

const arbitrarySalt2 = 
  '0x0000000000000000000000000000000000000000000000000000000000000002';

const message = "a simple message";

let WalletFactory, WalletFactory_Deployer, wallet, alice, aliceWallet, walletDeployTransaction, signature, hash, events;

beforeEach(async () => {
  WalletFactory_Deployer = await ethers.getContractFactory("WalletFactory");
  SmartWallet_Deployer = await ethers.getContractFactory("SmartWallet");
  [alice] = await ethers.getSigners();
  WalletFactory = await WalletFactory_Deployer.deploy();

  // Submit the transaction and wait for it to be added to current block's pending transactions
  aliceWallet = await WalletFactory.createWallet(arbitrarySalt, alice.address, {from: alice.address});

  // Wait for one block confirmation. The transaction has been mined at this point.
  walletDeployTransaction = await aliceWallet.wait();

  // Get the events emitted when the aliceWallet is created
  events = walletDeployTransaction?.events // # => Event[] | undefined

  let WALLET_CREATION =  events.find(
    item => item.event == 'WalletCreated');

  //the address of the newly deployed wallet will be the first paramater of the "Wallet Created" event
  let walletAddress = WALLET_CREATION.args[0];

  //connect to deployed contract instance using a signer ("alice") to allow read-write access
  wallet = new ethers.Contract(walletAddress, walletABI, alice);

  signature = await alice.signMessage(message);

  hash = ethers.utils.hashMessage(message);
})

describe("1271Wallet", () => {

  describe("Signature Methods", () => {
    it("Should utilize a valid signing method", async () => {
      expect(ethers.utils.verifyMessage(message, signature)).to.equal(alice.address);
    })
    it("Should produce a correctly formatted data hash", async () => {
      expect(ethers.utils.isBytesLike(hash)).to.be.true;
      expect(ethers.utils.arrayify(hash).length).to.equal(32);
    })
    it("Should produce a correctly formatted signature", async () => {
      expect(ethers.utils.isBytesLike(signature)).to.be.true;
      expect(ethers.utils.arrayify(signature).length).to.equal(65);
    })
  })

  describe("SmartWallet Deployment", () => {
    it("Should transfer ownership of the newly deployed wallet to the address specified", async () => {
      expect(await wallet.owner()).to.equal(alice.address);
    });
  });

  describe("isValidSignature()", () => {
    it("Should return the correct magic value when isValidSignature is called correctly", async () => {
      expect(
        await wallet.isValidSignature(hash, signature)
      ).to.be.equal(magicValue);
    });

    it("should revert for invalid signatures", async () => {
      await expect(
        wallet.isValidSignature(arbitraryMsgHash, arbitrarySignature)
      ).to.be.revertedWith("the recovered address is not the registered owner of this wallet");
    });

  });
});
