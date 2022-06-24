import WalletConnectProvider from "@walletconnect/web3-provider";
import { Button, Affix, Layout, Space } from "antd";
import "antd/dist/antd.css";
import { useUserAddress } from "eth-hooks";
import { ethers, BigNumber} from "ethers";
import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Web3Modal from "web3modal";
import { ConsoleSqlOutlined, GithubOutlined } from "@ant-design/icons";
import "./App.css";
import { Address, Header } from "./components";
import { INFURA_ID, NETWORKS } from "./constants";
import signatorLogo from "./images/sig-logo.png";
import Signator from "./Signator";
import SignatorViewer from "./SignatorViewer";
import eip1271 from "./contracts/contracts";
import EthCrypto from 'eth-crypto';



const { Footer } = Layout;
/*
    Welcome to Signatorio !
*/




/// 📡 What chain are your contracts deployed to?
const targetNetwork = NETWORKS.localhost; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

// 😬 Sorry for all the console logging
const DEBUG = true;

// 🛰 providers
if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");

const scaffoldEthProvider = new ethers.providers.StaticJsonRpcProvider("https://rpc.scaffoldeth.io:48544");
const mainnetInfura = new ethers.providers.StaticJsonRpcProvider("https://mainnet.infura.io/v3/" + INFURA_ID);

// 🔭 block explorer URL
const blockExplorer = targetNetwork.blockExplorer;

/*
  Web3 modal helps us "connect" external wallets:
*/
const web3Modal = new Web3Modal({
  // network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: INFURA_ID,
      },
    },
  },
});

const logoutOfWeb3Modal = async () => {
  await web3Modal.clearCachedProvider();
  window.localStorage.removeItem("walletconnect");
  setTimeout(() => {
    window.location.reload();
  }, 1);
};

function App() {
  const mainnetProvider = scaffoldEthProvider && scaffoldEthProvider._network ? scaffoldEthProvider : mainnetInfura;

  const [injectedProvider, setInjectedProvider] = useState();

  const [chainList, setChainList] = useState([]);

  useEffect(() => {
    const getChainList = async () => {
      try {
        const rawChainList = await fetch("https://chainid.network/chains.json");
        const chainListJson = await rawChainList.json();

        setChainList(chainListJson);
      } catch (e) {
        console.log(e);
      }
    };
    getChainList();
  }, []);

  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const address = useUserAddress(injectedProvider);


  const simpleSignature = async () => {
    const signer = injectedProvider.getSigner();
    const message = "a simple message";
  
    let signature = await signer.signMessage(message);
    let address = ethers.utils.verifyMessage(message, signature);
  
    console.log('signer: ', signer)
    console.log('signature: ', signature);
    console.log('address: ', address);
  } 

  
// now do a 1271 signature
  //compile a 1271 compliant signer contract.
  //craft a 1271 compliant message for the requester to send to the signer contract
  //test with a variety of signature requests
  //generate a mnemonic from the signer contract
    //using the mnemonic, load the signer contract into metamask and sign a message from metamask

 const contractSignature = async () => {
    //contract wallet
    // const signer = injectedProvider.getSigner();
    // const message = "I own this";
    //let signature = await signer.signMessage(message);
    // const signature = '0x0304494527023df3a811f5ad61aa35177a4455eb4bf098561f9380a574915f4c1ff4a5fc653afdfc086dcc9662848097703d18b82156618ccec1e5c9da7623e51b4760269d07f9a074dc2d6ab10cf52ff77852662e40fbb4b27289126a5bb538271e147c0952204161d710bb070a6e470b0b1ef65d11f1dc074e235e3dfaef00ae1b'
    // const account = injectedProvider.getSigner().getAddress()
    // const data = '0x47173285a8d7341e5e972fc677286384f802f8ef42a5ec5f03bbfa254cb01fad'
    // const magicValue = '0x20c13b0b'
    // const instance = new ethers.Contract(account, eip1271(), injectedProvider)
    // ethers.ContractFactory()
    // console.log('1271 instance: ', instance)
    //console.log("magic value: ", instance.isValidSignature(data, signature))
    //const result = await instance.isValidSignature(data, signature)
  
    console.log('no worky yet')
    //console.log('the 1271 abi: ', eip1271())
    //message
    //response/signature
    //

    // const identity = EthCrypto.createIdentity();
    // console.dir(identity);

    // const rawTransaction = {
    //   from: identity.address, // sender address
    //   to: '0x86Fa049857E0209aa7D9e616F7eb3b3B78ECfdb0', // reciever address
    //   value: BigNumber.from('1000000000000000000'), // amount of wei we want to send (= 1 ether)
    //   nonce: 0, // incremental tx-number. Add +1 for every transaction you do
    //   gasPrice: 5000000000,
    //   gasLimit: 21000 // normal gasLimit for code-less transactions
    // };
    

    // const serializedTx = EthCrypto.signTransaction(
    //   rawTransaction,
    //   identity.privateKey
    // );
    // const serializedTx = ethers.utils.serializeTransaction(rawTransaction, identity.privateKey);
    // console.log(serializedTx);

 }

 const deployWallet = async () => {
    //deployment works. 
    //now need to have a factory contract that inherits create2:
      // deploys the wallet
      // initiates wallet by transferring ownership from the factory to the itended owner (caller)

      // emits an event upon initialization so that the subgraph can feed the event to the frontend.
      // when frontend detects that the signer() has an associated wallet it will replace the "new wallet" button with a wallet detail widget (show contract address and link to details page)
      

    // Connect to the network
    let provider = ethers.getDefaultProvider('kovan');
    const signer = injectedProvider.getSigner();

    // Load the wallet to deploy the contract with
    // let privateKey = '0x0123456789012345678901234567890123456789012345678901234567890123';
    // let wallet = new ethers.Wallet(privateKey, provider);
    const arbitrarySalt = 
    '0x0000000000000000000000000000000000000000000000000000000000000001'; //salt method just for testing... evaluate proper implementation later

    const abi = require("../src/contracts/WalletFactory.abi");
    // const Bytecode = require("../src/contracts/WalletContract.bytecode");
    //NEED TO LOAD THIS DYNAMICALLY!!
      //currently hardcoded based transaction data emitted on command line for local hardhat network
    const walletFactoryAddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3'; //deployed address on kovan
    let WalletFactory = new ethers.Contract(walletFactoryAddress, abi, signer);

    // Deployment is asynchronous, so we use an async IIFE
    (async function() {
      // const deployer = injectedProvider.getSigner();
      // let walletFactoryInstance = ethers.Contract.connect(signer);

      // let WalletFactory = ethers.Contract.attach(walletFactoryAddress);

      let wallet = await WalletFactory.createWallet(arbitrarySalt, address);
        // Create an instance of a Contract Factory
        // let factory = new ethers.ContractFactory(walletABI, walletBytecode, deployer);

        // Notice we pass in "Hello World" as the parameter to the constructor
        // let contract = await factory.deploy();

        // The address the Contract WILL have once mined
        // See: https://ropsten.etherscan.io/address/0x2bd9aaa2953f988153c8629926d22a6a5f69b14e
        console.log("deploying wallet: ", wallet);
        // "0x2bD9aAa2953F988153c8629926D22A6a5F69b14E"

        // The transaction that was sent to the network to deploy the Contract
        // See: https://ropsten.etherscan.io/tx/0x159b76843662a15bd67e482dcfbee55e8e44efad26c5a614245e12a00d4b1a51
        // console.log("contract has been deployed. deployment hash is: ", contract.deployTransaction.hash);
        // "0x159b76843662a15bd67e482dcfbee55e8e44efad26c5a614245e12a00d4b1a51"

        // The contract is NOT deployed yet; we must wait until it is mined
        // await contract.deployed()

        // Done! The contract is deployed.
    })();
 }



// authereum example =================================
//  const account = '0x99bd0006D13542A0917Cf8F2F986Ca7667b84268'
//  const data = '0x47173285a8d7341e5e972fc677286384f802f8ef42a5ec5f03bbfa254cb01fad'
//  const signature = '0x0304494527023df3a811f5ad61aa35177a4455eb4bf098561f9380a574915f4c1ff4a5fc653afdfc086dcc9662848097703d18b82156618ccec1e5c9da7623e51b4760269d07f9a074dc2d6ab10cf52ff77852662e40fbb4b27289126a5bb538271e147c0952204161d710bb070a6e470b0b1ef65d11f1dc074e235e3dfaef00ae1b'
 
//  const magicValue = '0x20c13b0b'
//  const instance = await new web3.eth.Contract(eip1271Abi, account)
//  const result = await instance.methods.isValidSignature(data, signature).call()
//  const verified = (result === magicValue
// =======================================================














  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    setInjectedProvider(new ethers.providers.Web3Provider(provider));

    provider.on("chainChanged", chainId => {
      console.log(`chain changed to ${chainId}! updating providers`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    provider.on("accountsChanged", () => {
      console.log(`account changed!`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    // Subscribe to session disconnection
    provider.on("disconnect", (code, reason) => {
      console.log(code, reason);
      logoutOfWeb3Modal();
    });
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  const [route, setRoute] = useState();
  useEffect(() => {
    setRoute(window.location.pathname);
  }, [setRoute]);

  const modalButtons = [];
  if (web3Modal) {
    if (web3Modal.cachedProvider) {
      modalButtons.push(
        <Button
          key="logoutbutton"
          style={{ verticalAlign: "top", marginLeft: 8, marginTop: 2 }}
          shape="round"
          size="large"
          onClick={logoutOfWeb3Modal}
        >
          logout
        </Button>,
        <Button onClick={simpleSignature}>Simp</Button>,
        <Button onClick={contractSignature}>1271</Button>, 
        <Button onClick={deployWallet}>New Wallet</Button>
      );
    } else {
      modalButtons.push(
        <Button
          key="loginbutton"
          style={{ verticalAlign: "top", marginLeft: 8, marginTop: 2 }}
          shape="round"
          size="large"
          /* type={minimized ? "default" : "primary"}     too many people just defaulting to MM and having a bad time */
          onClick={loadWeb3Modal}
        >
          connect
        </Button>,
      );
    }
  }

  return (
    <div className="App">
      {/* ✏️ Edit the header and change the title to your project name */}
      <Affix offsetTop={0}>
        <Header
          extra={[
            address && <Address address={address} ensProvider={mainnetProvider} blockExplorer={blockExplorer} />,
            ...modalButtons,
          ]}
        />
      </Affix>
      <div className="logo-wrapper">
        <img className="logo" src={signatorLogo} alt="Signatorio" />
      </div>
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <Signator
              mainnetProvider={mainnetProvider}
              injectedProvider={injectedProvider}
              address={address}
              loadWeb3Modal={loadWeb3Modal}
              chainList={chainList}
            />
          </Route>
          <Route path="/view">
            <SignatorViewer
              mainnetProvider={mainnetProvider}
              injectedProvider={injectedProvider}
              address={address}
              loadWeb3Modal={loadWeb3Modal}
              chainList={chainList}
            />
          </Route>
        </Switch>
      </BrowserRouter>

      {/* <ThemeSwitch /> */}
      <Footer style={{ textAlign: "center", fontSize: "16px" }}>
        <Space>
          <a href="https://github.com/austintgriffith/scaffold-eth/tree/signatorio" target="_blank">
            <GithubOutlined />
          </a>
          <span>Built with 💙</span>
          <a href="https://buidlguidl.com/" target="_blank">
            🏰 BuidlGuidl{" "}
          </a>
        </Space>
      </Footer>
    </div>
  );
}

export default App;
