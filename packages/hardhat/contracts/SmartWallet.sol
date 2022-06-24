pragma solidity >=0.6.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/cryptography/ECDSA.sol";
import '@openzeppelin/contracts/proxy/Initializable.sol';

contract SmartWallet is Initializable {

  address payable public owner;

  event WalletTransferred (
      address indexed _Wallet,
      address indexed _PreviousOwner, 
      address indexed _NewOwner
  );



  function initialize(address payable _owner) initializer public {
      owner = _owner;
  }

  //allows this contract to sign messages requested from 
  //applications that support erc1271 even though no private key exists for this wallet.

  function isValidSignature(
    bytes32 _hash,
    bytes calldata _signature
  ) external view returns (bytes4){
        // Prevent signer from being 0x0
    // require(
    //   signer != address(0x0),
    //   "SignatureValidator#recoverSigner: INVALID_SIGNER"
    // );
    address recovered = ECDSA.recover(_hash, _signature);
    if (recovered == owner) {
      return 0x1626ba7e;
    } else {
      revert("the recovered address is not the registered owner of this wallet");
    }

  }

}
