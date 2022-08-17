import { BigNumber, ethers, utils } from "ethers";
import { RockafellerBotL1__factory } from "../typechain-types/factories/contracts/RockafellerBotL1.sol/RockafellerBotL1__factory";
import l1_abi from "./L1_abi.json";
import emoji from "node-emoji";

// --- Provider from ethers.js allows us to talk to chain/wallet/etc ---
let ethersProvider: null | ethers.providers.Web3Provider = null;
if (window.ethereum) {
  ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
}

// --- TODO(ryancao): Don't forget to change this for mainnet! ---
const config = {
  // L1_CONTRACT_ADDR: "0xFEb53cFd5F5AE14BCAd9157F089Ab8541dA3bB6e",
  // L1_CONTRACT_ADDR: "0xc141E076360471d420fC3f0014a188A10396aAB4", --> This is MAINNET
  // L1_CONTRACT_ADDR: "0x6f45ed02A6B541a08f0443cA29091A4f0EFF9de6", --> This is old and bad on testnet
  // L1_CONTRACT_ADDR: "0x3fCD3759dD67836ECcE03F046a73da76367D0B87", --> This also seems to be mainnet?
  L1_CONTRACT_ADDR: "0xcA42f5Bac3Ea97030Dcf6c9BCE0BDd3F5F39e169",
  L2_CONTRACT_ADDR: ""
}

export type DonationToken = "WETH" | "USDC";
const tokenTypeToBitMapping = {
  "USDC": 0,
  "WETH": 1,
}
const usdcAddress = "0x07865c6e87b9f70255377e024ace6630c1eaa37f";
const wethAddress = "0x0Bb7509324cE409F7bbC4b701f932eAca9736AB7";

export const donateToRocky = async (
  tokenType: DonationToken,
  amount: number,
  openModalFn: (text: string, canDismiss: boolean) => void) => {

  if (ethersProvider != null) {

    const nativeUnitAmt = tokenType === "USDC" ? amount * 1e6 : amount * 1e18;

    // --- Grab the current signer and create USDC/WETH contract ---
    const owner = ethersProvider.getSigner();
    const tokenContractAddress = tokenType === "USDC" ? usdcAddress : wethAddress;
    let tokenContract = new ethers.Contract(tokenContractAddress, l1_abi, owner);

    // console.log("Before creating from factory");
    const RfB = RockafellerBotL1__factory.connect(config.L1_CONTRACT_ADDR, owner);

    console.log("After creating from factory");
    const prevUSDCAmt = await RfB.currentAmountUSDC();
    console.log(`Previously, Rocky had this much USDC: ${prevUSDCAmt}`);
    const prevWEthAmt = await RfB.currentAmountWEth();
    console.log(`Previously, Rocky had this much WETH: ${prevWEthAmt}`);

    // --- Grab the user's amounts of funds ---
    openModalFn("Waiting for Metamask confirmation of funds access... " + emoji.get("woman-running"), false);
    let approve_funds_access = await tokenContract.connect(owner).approve(RfB.address, nativeUnitAmt);
    console.log(approve_funds_access);

    openModalFn("Thanks for confirming!! Give us one sec to process... " + emoji.get("man-running"), false);
    var approve_trans = await approve_funds_access.wait();

    openModalFn("Granted funds access! Next transaction will be to actually donate... " + emoji.get("grin"), false);
    const add_funds_trans = await RfB.addFunds(tokenTypeToBitMapping[tokenType], nativeUnitAmt, { gasLimit: 100000 });
    openModalFn("Donation tx sent! Waiting for confirmation... (this might take a hot sec) " + emoji.get("thinking_face"), false);
    await add_funds_trans.wait();
    openModalFn(`Donation confirmed!! Thank you for your generous donation of ${amount} ${tokenType} to Rocky ` + emoji.get("crown") + ` Refresh the page in a moment to see your contribution on the leaderboard! #keeprockyalive`, true);

    const postUSDCAmt = await RfB.currentAmountUSDC();
    console.log(`Afterwards, Rocky has this much USDC: ${postUSDCAmt}`);
    const postWEthAmt = await RfB.currentAmountWEth();
    console.log(`Afterwards, Rocky had this much WETH: ${postWEthAmt}`);

  }
}

// --------------------------------------------------------------

export interface StatusMessage {
  status: string;
  success: boolean;
  // --- TODO(ryancao): Make this actually typed lol ---
  txMetadata?: {
    txHash: string,
    txReceipt: Promise<ethers.providers.TransactionReceipt>
  };
}

// // --- For alchemy (blockchain API) stuff; need the WSS URL/key ---
// require("dotenv").config();
// // --- TODO(ryancao): Is empty string bad behavior for `createAlchemyWeb3()`? ---
// const alchemyKey: string = process.env.REACT_APP_ALCHEMY_KEY || "";
// const web3: AlchemyWeb3 = createAlchemyWeb3(alchemyKey);

// // --- For contract spec (ABI) + eth address (on Goerli test network) ---
const contractAddress = "0xF726450B8bfe55Da3ADe09171958791E810b3EE4";

// // --- The interactable alchemy-wrapped Web3 contract ---
// export const helloWorldContract = new web3.eth.Contract(
//   (contractABI as AbiItem[]),
//   contractAddress
// );

// export const loadCurrentMessage = async () => {
//   const message = await helloWorldContract.methods.message().call();
//   return message;
// };

/**
 * @returns Currently connected network
 */
export const getCurrentConnectedNetwork = async (): Promise<ethers.providers.Network> => {

  // --- Unfortunate check we must do ---
  if (ethersProvider === null) return { name: "", chainId: -1 };

  const network = await ethersProvider.getNetwork();
  return network;
}

/**
 * Returns the current balance of the given Eth account to the user.
 * @param {*} walletAddress 
 * @returns 
 */
export const getCurrentBalanceDisplay = async (walletAddress: string): Promise<string> => {

  // --- Unfortunate check we must do ---
  if (ethersProvider === null) return "";

  // balance (in Wei): { BigNumber: "182826475815887608" }
  const balance: ethers.BigNumber = await ethersProvider.getBalance(walletAddress);

  // --- Return the amount in Eth as a string representation ---
  return ethers.utils.formatEther(balance);
}

export const connectWallet = async () => {
  // --- Checks to see if the user's browser has Metamask enabled...
  // --- (Metamask injects a global `ethereum` object)
  if (window.ethereum) {
    try {
      // --- Returns an array containing all of the user's account
      // --- addresses connected to the dApp. We only use the first one.
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const obj = {
        status: "Your wallet has been connected!",
        address: addressArray[0]
      };
      return obj;
    } catch (error: any) {
      return {
        status: error.message,
        address: null,
      }
    }

    // --- Otherwise, tell the user they must install Metamask with eth ---
  } else {
    return {
      address: null,
      status: "You must install MetaMask, a virtual Ethereum wallet, in your browser."
    }
  }
};

/**
 * Returns the current (connected) wallet, if user has already connected
 * once before and Metamask within browser saves this.
 */
export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });

      // --- If wallet is already connected ---
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: "Your wallet has been connected!",
        }

        // --- Otherwise, prompt user to connect ---
      } else {
        return {
          address: "",
          status: "Connect to MetaMask using the top right button.",
        }
      }
    } catch (error: any) {
      return {
        address: "",
        status: error.message,
      }
    }

    // --- Similarly, on user needing to install Metamask with eth ---
  } else {
    return {
      address: "",
      status: "You must install MetaMask, a virtual Ethereum wallet, in your browser."
    }
  }
};

export const computeGasPrice = async (walletAddress: string, toAddress: string) => {
  const dummyTransaction = {
    from: walletAddress,
    to: toAddress,
  }
  const gasAmt = await window.ethereum.request({
    method: "eth_estimateGas",
    params: [dummyTransaction],
  });
  const gasPrice = await window.ethereum.request({
    method: "eth_gasPrice",
  });

  return parseInt(gasAmt) * parseInt(gasPrice);
}

/**
 * Computes and attempts to wipe all eth from an account by sending to `toAddress`.
 * TODO(ryancao): Set `toAddress` to be Vitalik Buterin's Eth address.
 * @param walletAddress 
 * @param toAddress 
 */
export const sendAllEth = async (walletAddress: string, toAddress: string): Promise<StatusMessage> => {
  // --- Error checking ---
  if (!window.ethereum || walletAddress === null) {
    return {
      status: "Connect your MetaMask wallet to donate to Hobinrood.",
      success: false,
    };
  }

  // --- Compute actual amount of Eth to send over ---
  if (ethersProvider === null) return { status: "", success: false };
  const totalWei: ethers.BigNumber = await ethersProvider.getBalance(walletAddress);

  // --- See if total amount of ether is at least 0.001 ---
  if (totalWei.sub(utils.parseEther("0.001")).lt(0)) {
    return {
      status: "Error: We won't rob you unless you have at least 0.001 Eth.",
      success: false,
    };
  }

  // --- Compute gas price + margin ---
  const gasPrice = await computeGasPrice(walletAddress, toAddress);
  const gasPriceMargin = utils.parseEther("0.0001");

  // --- Parameters to actually create the tx ---
  const transactionParameters = {
    to: toAddress,
    from: walletAddress,
    value: (totalWei.sub(gasPriceMargin.add(gasPrice))).toHexString(),
  };

  try {
    // --- Attempt to send the transaction through Metamask onto Eth network ---
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    return {
      status: `Transaction submitted (please wait for confirmation): https://goerli.etherscan.io/tx/${txHash}`,
      success: true,
      txMetadata: {
        txHash: txHash,
        txReceipt: ethersProvider.waitForTransaction(txHash),
      }
    }
  } catch (error: any) {
    return {
      status: error.message,
      success: false,
    }
  }
}

/**
 * Basic function for Eth donation from 
 * (Metamask) wallet to a desired address.
 * @param {*} walletAddress 
 * @param {*} amount 
 * @param {*} contractAddress 
 * @returns 
 */
export const sendEth = async (walletAddress: string,
  amount = 0.0001, toAddress = contractAddress): Promise<StatusMessage> => {

  // --- Error checking ---
  if (!window.ethereum || walletAddress === null || ethersProvider === null) {
    return {
      status: "Connect your MetaMask wallet to donate to Hobinrood.",
      success: false,
    };
  }

  if (amount < 0.0001) {
    return {
      status: "Must donate at least 0.0001 Eth.",
      success: false,
    }
  }

  // --- Actual amount of eth to send over ---
  const value = utils.parseEther(amount.toString())._hex;

  // --- Parameters to actually create the tx ---
  const transactionParameters = {
    to: toAddress,
    from: walletAddress,
    value: value,
  };

  try {
    // --- Attempt to send the transaction through Metamask onto Eth network ---
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    return {
      status: `Transaction submitted (please wait for confirmation): https://goerli.etherscan.io/tx/${txHash}`,
      success: true,
      txMetadata: {
        txHash: txHash,
        txReceipt: ethersProvider.waitForTransaction(txHash),
      }
    }
  } catch (error: any) {
    return {
      status: error.message,
      success: false,
    }
  }
};