import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

import { Token, ChainId } from "@uniswap/sdk";

import { RockafellerBotL1__factory } from '../typechain-types/factories/contracts/RockafellerBotL1.sol/RockafellerBotL1__factory'

describe("RockafellerBotL1", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshopt in every test.
  async function deployRfBFixture() {
    const ONE_GWEI = 1_000_000_000;

    const initialAmount = ONE_GWEI;

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const l2ContractAddress = 0xF;
    var uniswapRouter = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
    var starknetCore = "0xc662c410C0ECf747543f5bA90660f6ABeBD9C8c4";
    var usdcAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    var wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

    let abi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_account","type":"address"}],"name":"unBlacklist","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"minter","type":"address"}],"name":"removeMinter","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"},{"name":"_symbol","type":"string"},{"name":"_currency","type":"string"},{"name":"_decimals","type":"uint8"},{"name":"_masterMinter","type":"address"},{"name":"_pauser","type":"address"},{"name":"_blacklister","type":"address"},{"name":"_owner","type":"address"}],"name":"initialize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"masterMinter","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"unpause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"mint","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_amount","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"minter","type":"address"},{"name":"minterAllowedAmount","type":"uint256"}],"name":"configureMinter","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newPauser","type":"address"}],"name":"updatePauser","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"paused","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"account","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"pause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"minter","type":"address"}],"name":"minterAllowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"pauser","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newMasterMinter","type":"address"}],"name":"updateMasterMinter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"account","type":"address"}],"name":"isMinter","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newBlacklister","type":"address"}],"name":"updateBlacklister","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"blacklister","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"currency","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_account","type":"address"}],"name":"blacklist","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_account","type":"address"}],"name":"isBlacklisted","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"minter","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"burner","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"minter","type":"address"},{"indexed":false,"name":"minterAllowedAmount","type":"uint256"}],"name":"MinterConfigured","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"oldMinter","type":"address"}],"name":"MinterRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"newMasterMinter","type":"address"}],"name":"MasterMinterChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_account","type":"address"}],"name":"Blacklisted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_account","type":"address"}],"name":"UnBlacklisted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"newBlacklister","type":"address"}],"name":"BlacklisterChanged","type":"event"},{"anonymous":false,"inputs":[],"name":"Pause","type":"event"},{"anonymous":false,"inputs":[],"name":"Unpause","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"newAddress","type":"address"}],"name":"PauserChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"previousOwner","type":"address"},{"indexed":false,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]
    let usdc = new ethers.Contract(usdcAddress, abi, owner);
    let weth = new ethers.Contract(wethAddress, abi, owner);
    const RfBFactory = new RockafellerBotL1__factory();

    const RfB = await RfBFactory.connect(owner).deploy(l2ContractAddress, uniswapRouter, starknetCore, usdcAddress);
    await RfB.deployed();
    var approveTrans = await usdc.connect(owner).approve(RfB.address, initialAmount * 20);
    var thing = await owner.provider?.waitForTransaction(approveTrans.hash);
    const impersonatedSigner = await ethers.getImpersonatedSigner("0x6D7689794314f729e99e791d46FfFA52dfA40d2A");
    var thing2 = await usdc.connect(impersonatedSigner).transfer(owner.address, initialAmount * 10);
    await owner.provider?.waitForTransaction(thing2.hash);
    var thing3 = await RfB.addFunds(initialAmount);
    await owner.provider?.waitForTransaction(thing3.hash);

    var approveTrans = await usdc.connect(otherAccount).approve(RfB.address, initialAmount * 20);
    var thing = await otherAccount.provider?.waitForTransaction(approveTrans.hash);
    var thing2 = await usdc.connect(impersonatedSigner).transfer(otherAccount.address, initialAmount * 10);
    await owner.provider?.waitForTransaction(thing2.hash);


    return { RfB, l2ContractAddress, uniswapRouter, owner, starknetCore, initialAmount, usdc, otherAccount, weth };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { RfB, owner } = await loadFixture(deployRfBFixture);

      expect(await RfB.owner()).to.equal(owner.address);
    });
    it("Should have the right amount", async function () {
      const {RfB, owner, initialAmount, usdc} = await loadFixture(deployRfBFixture);
      expect(await usdc.balanceOf(RfB.address)).to.equal(initialAmount);
      expect(await RfB.currentAmountUSDC()).to.equal(initialAmount);
    })
  });

  describe("Transactions", function () {
    it("Should let arbitrary users add funds", async function () {
      const newAmount = 1_000_000_000;
      const { RfB, initialAmount, usdc, otherAccount } = await loadFixture(deployRfBFixture);
      var addFundsTrans = await RfB.connect(otherAccount).addFunds(newAmount);
      otherAccount.provider?.waitForTransaction(addFundsTrans.hash);
      
      expect(await usdc.balanceOf(RfB.address)).to.equal(initialAmount + newAmount)
      expect(await RfB.currentAmountUSDC()).to.equal(initialAmount + newAmount);
    });
    it("Should let the owner withdraw funds", async function () {
      const {RfB, owner, initialAmount, usdc} = await loadFixture(deployRfBFixture);
      //console.log(await usdc.balanceOf(RfB.address))

      var withdrawTrans = await RfB.withdrawl(initialAmount);
      owner.provider?.waitForTransaction(withdrawTrans.hash);

      expect(await usdc.balanceOf(RfB.address)).to.equal(0)
      expect(await RfB.currentAmountUSDC()).to.equal(0);
    })
    it("Should prevent arbitrary user from withdrawing funds", async function() {
      const {RfB, initialAmount, usdc, otherAccount} = await loadFixture(deployRfBFixture);

      await expect(RfB.connect(otherAccount).withdrawl(initialAmount, {gasLimit: 500000})).to.be.revertedWith("Ownable: caller is not the owner");
    })
  });

  describe("Trades", function() {
    it("Should buy WEth on buy signal", async function() {
      const tradeAmount = 500_000_000;
      const {RfB, owner, initialAmount, usdc, weth} = await loadFixture(deployRfBFixture);
      var trans = await RfB.receiveInstruction(0, tradeAmount);
      await owner.provider?.waitForTransaction(trans.hash);
      expect(await usdc.balanceOf(RfB.address)).to.equal(initialAmount - tradeAmount);
      expect(await RfB.currentAmountUSDC()).to.equal(initialAmount - tradeAmount);
      //expect(await RfB.currentAmountWEth()).to.approximately(291449061631339404n, 100_000_000_000_000_000n);
      //expect(await weth.balanceOf(RfB.address)).to.approximately(291449061631339405n, 100_000_000_000_000_000n);
    });
  })
});