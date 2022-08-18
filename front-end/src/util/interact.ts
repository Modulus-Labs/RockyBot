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
  L1_CONTRACT_ADDR: "0x3804d8a14b6a2bdcf3ecace58d713dc783a8f2de", // This is the MAINNET ADDRESS
  // L1_CONTRACT_ADDR: "0xcA42f5Bac3Ea97030Dcf6c9BCE0BDd3F5F39e169", // This is the TESTNET ADDRESS
  L2_CONTRACT_ADDR: ""
}

/*
Error: transaction failed [ See: https://links.ethers.org/v5-errors-CALL_EXCEPTION ] (transactionHash="0x5b3dc2382a1ba65ecb754711ef8b3e99259d1d654874ead4b5d23470260f3b2f", transaction={"hash":"0x5b3dc2382a1ba65ecb754711ef8b3e99259d1d654874ead4b5d23470260f3b2f","type":2,"accessList":null,"blockHash":null,"blockNumber":null,"transactionIndex":null,"confirmations":0,"from":"0xD39511C7B8B15C58Fe71Bcfd430c1EB3ed94ff25","gasPrice":{"type":"BigNumber","hex":"0x037d16bb56"},"maxPriorityFeePerGas":{"type":"BigNumber","hex":"0x59682f00"},"maxFeePerGas":{"type":"BigNumber","hex":"0x037d16bb56"},"gasLimit":{"type":"BigNumber","hex":"0x0186a0"},"to":"0x3804D8A14b6a2Bdcf3eCaCe58D713DC783a8F2dE","value":{"type":"BigNumber","hex":"0x00"},"nonce":12,"data":"0x776bd459000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000038d7ea4c68000","r":"0x2a226ce3de4e67ab887124ce8f80a0fce3583072ff7879dd25b7712a1be53f4a","s":"0x1c4a6afd2d45309660fae848d87e1c0aa91acbcd921a8288f8f2c4a011d9e81a","v":1,"creates":null,"chainId":0}, receipt={"to":"0x3804D8A14b6a2Bdcf3eCaCe58D713DC783a8F2dE","from":"0xD39511C7B8B15C58Fe71Bcfd430c1EB3ed94ff25","contractAddress":null,"transactionIndex":173,"gasUsed":{"type":"BigNumber","hex":"0x77a0"},"logsBloom":"0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","blockHash":"0x734ce63b14f19b17b131a93fff64abce5769bf0f07311578304472227c3e91e8","transactionHash":"0x5b3dc2382a1ba65ecb754711ef8b3e99259d1d654874ead4b5d23470260f3b2f","logs":[],"blockNumber":15362368,"confirmations":2,"cumulativeGasUsed":{"type":"BigNumber","hex":"0xe1a464"},"effectiveGasPrice":{"type":"BigNumber","hex":"0x02b7c08624"},"status":0,"type":2,"byzantium":true}, code=CALL_EXCEPTION, version=providers/5.6.8)
*/

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

    const nativeUnitAmt = tokenType === "USDC" ? amount * 1e6 : amount * 1e18;

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

export interface StatusMessage {
  status: string;
  success: boolean;
  // --- TODO(ryancao): Make this actually typed lol ---
  txMetadata?: {
    txHash: string,
    txReceipt: Promise<ethers.providers.TransactionReceipt>
  };
}

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