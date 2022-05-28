const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");
const { keccak256 } = require("@ethersproject/keccak256");
const { getContractAt } = require("@nomiclabs/hardhat-ethers/dist/src/helpers");
const contracts = require("../../react-app/src/contracts/contracts");
const walletABI = require("../../react-app/src/contracts/SmartWallet.abi");
const { call } = require("ramda");
const { providers } = require("../../react-app/node_modules/ethers/lib");
use(solidity);

describe("1271Wallet", function () {
  let WalletFactory, WalletFactory_contractFactory, wallet, owner, addr1, addr2;

  beforeEach(async function () {
    WalletFactory_contractFactory = await ethers.getContractFactory("WalletFactory");
    SmartWallet_contractFactory = await ethers.getContractFactory("SmartWallet");
     [owner, addr1, addr2] = await ethers.getSigners();

    WalletFactory = await WalletFactory_contractFactory.deploy();
    //SmartWallet = await 
    //console.log("owner address: ", owner.address)
    //console.log(WalletFactory.address)
    //salt method just for testing... evaluate proper implementation later
    //salt = keccak256(owner.address, WalletFactory.address);

    // Submit the transaction and wait for it to be added to current block's pending transactions
    let sampleWallet = await WalletFactory.createWallet(123, owner.address, {from: owner.address});

    // Wait for one block confirmation. The transaction has been mined at this point.
    const receipt = await sampleWallet.wait();
    // Get the events
    const events = receipt?.events // # => Event[] | undefined
    //console.log(events)
    //filter events
        //initial constructor will have ownership transferred to walletfactory address
            //filter events where event="OwnerShipTransferred" and confirm args.newOwner === WalletFactory.address
    let TRANSFER_OWNERSHIP = events.filter(
      event => event.event == 'OwnershipTransferred');
        //createWallet function will also emit an "OwnershipTransferred" event where args.NewOwner ===
    let WALLET_CREATION = events.find(
      event => event.event == 'WalletCreated');

    //the address of the newly deployed wallet will be the first paramater of the "Wallet Created" event
    let walletAddress = WALLET_CREATION.args[0];

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
  });

  describe("Deployment()", function () {
    it("Should transfer ownership of the newly deployed wallet to the address specified", async function () {
      expect(await wallet.owner()).to.equal(owner.address);
    });
    it("should fail when wallet owner not correctly set at creation", async function() {
      expect(await wallet.owner()).not.to.equal(addr1.address);
    })
  });

  describe("1271Wallet", function () {
    
    it("Should return the correct magic value when isValidSignature is called correctly", async function () {
      // const arbitrarySignature =
      // "0xc531a1d9046945d3732c73d049da2810470c3b0663788dca9e9f329a35c8a0d56add77ed5ea610b36140641860d13849abab295ca46c350f50731843c6517eee1c";
      // const arbitrarySignatureHash = soliditySha3({
      //   t: "bytes",
      //   v: arbitrarySignature,
      // });
      // const arbitraryMsgHash =
      //   "0xec4870a1ebdcfbc1cc84b0f5a30aac48ed8f17973e0189abdb939502e1948238";
  
      const magicValue = "0x1626ba7e";
      // const msgHash = ethers.utils.hashMessage("Hello World");
      let randomSigner = ethers.Wallet.createRandom();
      //[owner, addr1, addr2] = await ethers.getSigners();
      const hash = ethers.utils.keccak256(owner.address)
      let flatSig = await randomSigner.signMessage(ethers.utils.arrayify(hash));
      //const msg = await owner.signMessage("hellow world")
      //let tx = wallet.isValidSignature()
      let recovered = ethers.utils.recoverAddress(hash, flatSig)
      //expect(owner.address.to.equal(recovered))
      //console.log(randomSigner.address, recovered)
      // //const [adminWallet, userWallet] = await ethers.getSigners();
      // const timestamp = Date.now();

      // // STEP 1:
      // // building hash has to come from system address
      // // 32 bytes of data
      // let messageHash = ethers.utils.solidityKeccak256(
      //     ["address", "uint"],
      //     [owner.address, timestamp]
      // );

      // // STEP 2: 32 bytes of data in Uint8Array
      // let messageHashBinary = ethers.utils.arrayify(messageHash);

      // // STEP 3: To sign the 32 bytes of data, make sure you pass in the data
      // let signature = await owner.signMessage(messageHashBinary);
      //const account = '0x99bd0006D13542A0917Cf8F2F986Ca7667b84268'
      const data = '0x47173285a8d7341e5e972fc677286384f802f8ef42a5ec5f03bbfa254cb01fad'
      const signature = '0x0304494527023df3a811f5ad61aa35177a4455eb4bf098561f9380a574915f4c1ff4a5fc653afdfc086dcc9662848097703d18b82156618ccec1e5c9da7623e51b4760269d07f9a074dc2d6ab10cf52ff77852662e40fbb4b27289126a5bb538271e147c0952204161d710bb070a6e470b0b1ef65d11f1dc074e235e3dfaef00ae1b'

      //const result = await wallet.methods.isValidSignature(data, signature).call()
      let tx = await wallet.isValidSignature(data, signature);
      let ownerQuery = await wallet.owner();
      // Wait for one block confirmation. The transaction has been mined at this point.
      //let receipt = await tx.wait();
      
      console.log(ownerQuery, owner.address, tx)
    });

  });
});
