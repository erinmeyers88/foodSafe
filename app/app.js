import './app.css'
import Web3 from 'web3'

let accounts
let account
let foodSafeABI
let foodSafeContract
let foodSafeCode
let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
window.App = {
  start: function () {
    web3.eth.getAccounts(function (err, accs) {
      if (err !== null) {
        alert('There was an error fetching your accounts.')
        return
      }
      if (accs.length === 0) {
        alert('Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.')
        return
      }

      accounts = accs
      account = accounts[0]
      web3.eth.defaultAccount = account
      let foodSafeSource = 'pragma solidity ^0.4.6; contract FoodSafe { struct Location{ string Name; uint LocationId; uint PreviousLocationId; uint Timestamp; string Secret;} mapping(uint => Location) Trail; uint8 TrailCount=0;    function AddNewLocation(uint LocationId, string Name, string Secret) { Location memory newLocation; newLocation.Name = Name; newLocation.LocationId= LocationId; newLocation.Secret= Secret; newLocation.Timestamp = now;        if(TrailCount!=0) { newLocation.PreviousLocationId= Trail[TrailCount].LocationId;} Trail[TrailCount] = newLocation;TrailCount++;} function GetTrailCount() returns(uint8){ return TrailCount;} function GetLocation(uint8 TrailNo) returns (string,uint,uint,uint,string){ return (Trail[TrailNo].Name, Trail[TrailNo].LocationId, Trail[TrailNo].PreviousLocationId, Trail[TrailNo].Timestamp,Trail[TrailNo].Secret);}}'
      web3.eth.compile.solidity(foodSafeSource, function (error, foodSafeCompiled) {
        console.log(error)
        console.log(foodSafeCompiled)
        foodSafeABI = foodSafeCompiled['<stdin>:FoodSafe'].info.abiDefinition
        foodSafeContract = web3.eth.contract(foodSafeABI)
        foodSafeCode = foodSafeCompiled['<stdin>:FoodSafe'].code

      })
    })
  },
  createContract: function () {
    foodSafeContract.new('', {from: account, data: foodSafeCode, gas: 3000000}, function (error, deployedContract) {
      if (deployedContract.address) {
        document.getElementById('contractAddress').value = deployedContract.address
      }
    })
  },
}

window.addEventListener('load', function () {
  App.start()
})
