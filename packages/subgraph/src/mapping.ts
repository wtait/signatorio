import { BigInt, Address } from "@graphprotocol/graph-ts"
import {
  WalletCreated
} from "../generated/WalletFactory/WalletFactory"

// import {
//   WalletFactory
// } from "../generated/WalletFactory/WalletFactory"

import { Wallet, Owner } from "../generated/schema"


export function handleWalletCreated(event: WalletCreated): void {
//   event WalletCreated (
//     address indexed _Wallet,
//     address indexed _Owner, 
//     address indexed _Caller
// );

  // type Wallet @entity {
  //   id: ID!
  //   owner: Owner!
  //   address: Bytes!
  //   createdAt: BigInt!
  //   transactionHash: String!

  // type Owner @entity {
  //   id: ID!
  //   wallets: [Wallet!] @derivedFrom(field: "owner")

  let ownerAddress = event.params._Owner.toHexString()
  let owner = Owner.load(ownerAddress)

  if(owner == null) {
    owner = new Owner(ownerAddress)
    owner.address = event.params._Owner
  }

  let wallet = new Wallet(event.params._Wallet.toHex() + "-" + ownerAddress);
  wallet.owner = ownerAddress;
  wallet.address = event.params._Wallet
  wallet.createdAt = event.block.timestamp
  wallet.transactionHash = event.transaction.hash.toHex()

  owner.save()
  wallet.save()

}

// export function handleSetPurpose(event: SetPurpose): void {

//   let senderString = event.params.sender.toHexString()

//   let sender = Sender.load(senderString)

//   if (sender == null) {
//     sender = new Sender(senderString)
//     sender.address = event.params.sender
//     sender.createdAt = event.block.timestamp
//     sender.purposeCount = BigInt.fromI32(1)
//   }
//   else {
//     sender.purposeCount = sender.purposeCount.plus(BigInt.fromI32(1))
//   }

//   let purpose = new Purpose(event.transaction.hash.toHex() + "-" + event.logIndex.toString())

//   purpose.purpose = event.params.purpose
//   purpose.sender = senderString
//   purpose.createdAt = event.block.timestamp
//   purpose.transactionHash = event.transaction.hash.toHex()

//   purpose.save()
//   sender.save()

// }
