pragma solidity >=0.6.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "./SmartWallet.sol";
import "@openzeppelin/contracts/utils/Create2.sol";
import '@openzeppelin/contracts/proxy/Initializable.sol';

contract WalletFactory is Initializable, SmartWallet {

    event WalletCreated (
        address indexed _Wallet,
        address indexed _Owner, 
        address indexed _Caller
    );


    function createWallet(bytes32 _salt, address payable _owner) public {
        address newWalletAddress;
        newWalletAddress = Create2.deploy(0, _salt, type(SmartWallet).creationCode);

        SmartWallet(newWalletAddress).initialize(_owner);
    
        emit WalletCreated(newWalletAddress, _owner, msg.sender);
    }

}