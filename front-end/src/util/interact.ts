import { ethers } from "ethers";
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
  L1_CONTRACT_ADDR: "0x3804d8a14b6a2bdcf3ecace58d713dc783a8f2de", // This is the MAINNET ADDRESS
  // L1_CONTRACT_ADDR: "0xcA42f5Bac3Ea97030Dcf6c9BCE0BDd3F5F39e169", // This is the TESTNET ADDRESS
  L2_CONTRACT_ADDR: ""
}

export type DonationToken = "WETH" | "USDC";
const tokenTypeToBitMapping = {
  "USDC": 0,
  "WETH": 1,
}

// --- These are testnet ---
// const usdcAddress = "0x07865c6e87b9f70255377e024ace6630c1eaa37f";
// const wethAddress = "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6";

// --- These are mainnet ---
const usdcAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

export const donateToRocky = async (
  tokenType: DonationToken,
  amount: number,
  openModalFn: (text: string, canDismiss: boolean) => void) => {

  if (ethersProvider != null) {

    const nativeUnitAmt = (tokenType === "USDC" ? amount * 1e6 : amount * 1e18).toString();

    // --- Grab the current signer and create USDC/WETH contract ---
    const owner = ethersProvider.getSigner();
    const tokenContractAddress = tokenType === "USDC" ? usdcAddress : wethAddress;
    let tokenContract = new ethers.Contract(tokenContractAddress, l1_abi, owner);

    // console.log("Before creating from factory");
    const RfB = RockafellerBotL1__factory.connect(config.L1_CONTRACT_ADDR, owner);

    // --- Grab the user's amounts of funds ---
    openModalFn("Waiting for Metamask confirmation of funds access... " + emoji.get("woman-running"), false);
    let approveFundsAccessPromise = tokenContract.connect(owner).approve(RfB.address, nativeUnitAmt);

    approveFundsAccessPromise.then((approveFundsAccessObj: any) => {

      // console.log("approveFundsAccessObj");
      // console.log(approveFundsAccessObj);
      openModalFn(`Thanks for confirming! Waiting on tx (${approveFundsAccessObj.hash})... ` + emoji.get("man-running"), false);

      // --- Wait for the tx to finish approving ---
      approveFundsAccessObj.wait().then((approved: any) => {
        console.log("Approved");
        console.log(approved);

        openModalFn("Granted funds access! Next transaction will be to actually donate... " + emoji.get("grin"), false);
        const addFundsTransPromise = RfB.addFunds(tokenTypeToBitMapping[tokenType], nativeUnitAmt, { gasLimit: 100000 });
        addFundsTransPromise.then((result) => {
          openModalFn(`Donation tx sent! Waiting for confirmation... (${result.hash}) ` + emoji.get("thinking_face"), false);
          result.wait().then(() => {
            openModalFn(`Donation confirmed!! (${result.hash}) Thank you for your generous donation of ${amount} ${tokenType} to Rocky ` + emoji.get("crown") + ` Refresh the page in a moment to see your contribution on the leaderboard! #keeprockyalive`, true);
          })
            .catch((resultWaitError: any) => {
              // console.error("Error confirming transaction");
              // console.error(resultWaitError);
              openModalFn(`Error: ${resultWaitError.message}`, true);
              return;
            });
        })
          .catch((fundAddError: any) => {
            // console.error("Error adding funds");
            // console.error(fundAddError);
            openModalFn(`Error: ${fundAddError.message}`, true);
            return;
          });
      })
        .catch((error: any) => {

        })
    })
      .catch((error: any) => {
        // console.error("Disapproved or some other error");
        openModalFn(`Error: ${error.message}`, true);
        return;
      });

  }
}

// --------------------------------------------------------------

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
          address: null,
          status: "Connect to MetaMask using the top right button.",
        }
      }
    } catch (error: any) {
      return {
        address: null,
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