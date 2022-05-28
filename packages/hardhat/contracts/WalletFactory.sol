pragma solidity >=0.6.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "./SmartWallet.sol";
//import "@openzeppelin/contracts/utils/Create2.sol";
import "@openzeppelin/contracts/utils/Address.sol";


contract WalletFactory is SmartWallet {

    event WalletCreated (
        address indexed _Wallet,
        address indexed _Owner, 
        address indexed _Caller
    );

    // constructor () SmartWallet(msg.sender) public {

    // }

    // function createWallet(bytes32 _salt, address payable _owner) public returns (address) {
    //     address newWalletAddress;
    //     newWalletAddress = Create2.deploy(0, _salt, type(smartWallet).creationCode);

    //     //smartWallet(newWalletAddress).transferOwnership(_owner);
    
    //     emit WalletCreated(newWalletAddress, _owner);

    //     return newWalletAddress;
    // }

    function createWallet(uint _salt, address payable _walletOwner) external returns (address) {
        SmartWallet _contract = new SmartWallet{
            salt: bytes32(_salt)
        }();
        //set the owner of the newly created wallet
        _contract.transferOwnership(_walletOwner);
        if(_contract.getOwner() != _walletOwner) {
            revert("ownership not transferred from factory to desired owner");
        }
        emit WalletCreated(address(_contract), _walletOwner, msg.sender);
        return(address(_contract));
    }

    // function computeAddress(bytes32 salt) public view returns (address) {
    //     return Create2.computeAddress(salt, type(smartWallet).creationCode);
    // }
}