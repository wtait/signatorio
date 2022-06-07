pragma solidity >=0.6.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "./SmartWallet.sol";
import "@openzeppelin/contracts/utils/Create2.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import '@openzeppelin/contracts/proxy/Initializable.sol';

contract WalletFactory is Initializable, SmartWallet {

    event WalletCreated (
        address indexed _Wallet,
        address indexed _Owner, 
        address indexed _Caller
    );

    // event WalletFactoryInitialized (
    //     address indexed _WalletFactory,
    //     address indexed _Deployer
    // );

    // constructor () SmartWallet(msg.sender) public {

    // }



    function createWallet(bytes32 _salt, address payable _owner) public {
        address newWalletAddress;
        newWalletAddress = Create2.deploy(0, _salt, type(SmartWallet).creationCode);

        //smartWallet(newWalletAddress).transferOwnership(_owner);
        SmartWallet(newWalletAddress).initialize(_owner);
    
        emit WalletCreated(newWalletAddress, _owner, msg.sender);

        // return newWalletAddress;
    }

    // function createWallet(uint _salt, address payable _walletOwner) external returns (address) {
    //     SmartWallet _contract = new SmartWallet{
    //         salt: bytes32(_salt)
    //     }();
    //     //set the owner of the newly created wallet
    //     _contract.transferOwnership(_walletOwner);
    //     if(_contract.getOwner() != _walletOwner) {
    //         revert("ownership not transferred from factory to desired owner");
    //     }
    //     emit WalletCreated(address(_contract), _walletOwner, msg.sender);
    //     return(address(_contract));
    // }



//     function createWallet(address _ownerAddress, address _templateAddress, bytes32 _walletType, bytes12 _salt) public {
//     require(_templateAddress != address(0), 'MISSING_Wallet_TEMPLATE_ADDRESS');

//     bytes32 salt;

//     // solium-disable-next-line
//     assembly
//     {
//         let pointer := mload(0x40)
//         // The salt is the msg.sender
//         mstore(pointer, shl(96, caller()))
//         // followed by the _salt provided
//         mstore(add(pointer, 0x14), _salt)
//         salt := mload(pointer)
//     }

//     address payable newWallet = address(
//         uint160(_templateAddress.createClone2(salt))
//     );

//     emit WalletCreated(_ownerAddress, _templateAddress, newWallet, _walletType);
// }

    // function computeAddress(bytes32 salt) public view returns (address) {
    //     return Create2.computeAddress(salt, type(smartWallet).creationCode);
    // }
}