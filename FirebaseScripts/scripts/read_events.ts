
import { initializeApp } from "firebase-admin/app";
import { credential } from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { ethers } from 'ethers';
import { RockafellerBotL1__factory } from '../../L1Contract/typechain-types/factories/contracts/RockafellerBotL1.sol/RockafellerBotL1__factory'
import { executedTradeEventFilter } from '../../L1Contract/typechain-types/contracts/RockafellerBotL1.sol/RockafellerBotL1';
import { RockyDonationsDocument, RockyStatusDocument, RockyTradesDocument } from "../types/firebase";
import axios from "axios";
import { BigFloat } from "bigfloat.js";


import serviceAccount from '/home/aweso/rockyfirebasekey.json';



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPeEjqjrh3uXeDlpWt2a5BWR2GPJcZKcg",
  authDomain: "rockefellerbot.firebaseapp.com",
  projectId: "rockefellerbot",
  storageBucket: "rockefellerbot.appspot.com",
  messagingSenderId: "441044501776",
  appId: "1:441044501776:web:ab0078ee1140cdd7d05195",
  credential: credential.cert("/home/aweso/rockyfirebasekey.json")
};

const L1_CONTRACT_ADDR = "0x3804D8A14b6a2Bdcf3eCaCe58D713DC783a8F2dE";

type cryptoCompareRequest = {
    USDC: number
}

// Initialize Firebase

async function handler() {
    const provider = new ethers.providers.AlchemyProvider("mainnet", "-HC6HC2R9crhQe3tcu4h4Qq2nYfCRc9t");
    const RfB = RockafellerBotL1__factory.connect(L1_CONTRACT_ADDR, provider);
    const url = "https://min-api.cryptocompare.com/data/price?fsym=WETH&tsyms=USDC";

    const apiCall = await axios({
        method:'get',
        url
    })
    const exchangeRate = new BigFloat(apiCall.data.USDC);

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    var promises: Array<Promise<any>> = new Array<Promise<any>>()

    //get rocky trades
    {
        console.log("getting trades!");
        const trades = await RfB.queryFilter(RfB.filters.executedTrade());
        const tradeDocuments: RockyTradesDocument[]  = await Promise.all(trades.map(async (trade) => {

            var amountToken = new BigFloat(trade.args.amount.toString())
            if(trade.args.instruction == 0) var amountUSD = amountToken.div(10**6);
            else var amountUSD = amountToken.div(new BigFloat(10).pow(18)).mul(exchangeRate);

            var blockTimestamp = new Date((await trade.getBlock()).timestamp*1000);
            return {
                action_type: trade.args.instruction == 0 ? "BUY" : "SELL",
                amount: amountUSD.toString(),
                timestamp: blockTimestamp
            }
        }));
        console.log("writing trades!");
        tradeDocuments.forEach((tradeDocument) => {
            promises.push(db.collection("rocky_trades").doc(tradeDocument.timestamp.getTime().toString()).set(tradeDocument));
        });
        console.log("done with trades");
    }

    //get rocky donations
    {
        console.log("getting donations!");
        const donations = await RfB.queryFilter(RfB.filters.receivedFunds());
        const donationDocuments: RockyDonationsDocument[] = await Promise.all(donations.map(async (trade) => {
            var ens = await provider.lookupAddress(trade.args.sender);
            var blockTimestamp = new Date((await trade.getBlock()).timestamp*1000);
            return {
                amount: trade.args.amount.toString(),
                contributor_address: ens ?? trade.args.sender,
                timestamp: blockTimestamp,
                token: trade.args.tokenType == 0 ? "USDC" : "WETH"
            }
        }));
        console.log("writing donations!");
        console.log(donationDocuments.length);
        donationDocuments.forEach((donationDocument) => {
            promises.push(db.collection("rocky_donations").doc(donationDocument.timestamp.getTime().toString()).set(donationDocument));
        });
        console.log("done with donations");
    }
    
    //get rocky status
    {
        const latest = (await  db.collection('rocky_latest').doc('latest').get()).data();
        console.log("getting rocky status");
        var current_usdc = await RfB.currentAmountUSDC();
        var current_weth = await RfB.currentAmountWEth();
        var net_worth = (new BigFloat(current_usdc.toString())).div(10**6).add((new BigFloat(current_weth.toString())).div(new BigFloat(10).pow(18)).mul(exchangeRate))
        const statusDocument: RockyStatusDocument = {
            current_usdc: current_usdc.toString(),
            current_weth: current_weth.toString(),
            net_worth: net_worth.toString(),
            timestamp: new Date()
        }
        console.log("writing rocky status");
        if(latest?.current_usdc != current_usdc || latest?.current_weth != current_weth) {
            console.log("blah");
            promises.push(db.collection('rocky_latest').doc('latest').set(statusDocument));
            promises.push(db.collection("rocky_status").doc(statusDocument.timestamp.getTime().toString()).set(statusDocument));
        }
    }
    await Promise.all(promises);
}

handler();