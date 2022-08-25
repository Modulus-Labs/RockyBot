import {Provider as Sn_Provider} from "starknet";
import { ethers } from "ethers";
import { RockafellerBotL1__factory } from '../L1Contract/typechain-types/factories/contracts/RockafellerBotL1.sol/RockafellerBotL1__factory'
import fs from 'fs';
import {MAINNET_PRIVATE_KEY} from '../L1Contract/keys.config';

import { initializeApp } from "firebase-admin/app";
import { credential } from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

import { RockyTradesDocument } from "../FirebaseScripts/types/firebase";

const firebaseConfig = {
    apiKey: "AIzaSyBPeEjqjrh3uXeDlpWt2a5BWR2GPJcZKcg",
    authDomain: "rockefellerbot.firebaseapp.com",
    projectId: "rockefellerbot",
    storageBucket: "rockefellerbot.appspot.com",
    messagingSenderId: "441044501776",
    appId: "1:441044501776:web:ab0078ee1140cdd7d05195",
    credential: credential.cert("/home/aweso/rockyfirebasekey.json")
  };
  

const L1_CONTRACT_ADDRESS = "0x3804D8A14b6a2Bdcf3eCaCe58D713DC783a8F2dE";

async function handler(): Promise<void> {
    const sn_provider = new Sn_Provider({
        network: 'mainnet-alpha' // or 'goerli-alpha'
    });

    var f = fs.readFileSync('./dev/transHashData/current_trans_hash.json')
    var trans = JSON.parse(f.toString())
    do {
        console.log("Checking if trans is accepted on L1")
        var t_receipt = await sn_provider.getTransactionReceipt(trans);
        //console.log(t_receipt)
        if((t_receipt.status == "ACCEPTED_ON_L2" || t_receipt.status == "ACCEPTED_ON_L1") && t_receipt.l2_to_l1_messages.length == 0) {
            const app = initializeApp(firebaseConfig);
            const db = getFirestore(app);
            var time = new Date()
            var trade_document: RockyTradesDocument = {
                action_type: "HOLD",
                amount: "0",
                timestamp: time
            }
            await db.collection("rocky_trades").doc(time.getTime().toString()).set(trade_document);
            return;
        }
        if(t_receipt.status != "ACCEPTED_ON_L1")
            await new Promise(r => setTimeout(r, 120000));
    } while(t_receipt.status != "ACCEPTED_ON_L1")
    var message = t_receipt.l2_to_l1_messages[0]
    console.log(message)
    var trade_instruction = (message as any).payload[0];
    var trade_amount = (message as any).payload[1];
    const provider = new ethers.providers.AlchemyProvider("mainnet", "-HC6HC2R9crhQe3tcu4h4Qq2nYfCRc9t");

    const owner = new ethers.Wallet(MAINNET_PRIVATE_KEY, provider);

    const RfB = RockafellerBotL1__factory.connect(L1_CONTRACT_ADDRESS, owner)

    console.log("Starting Trade!")

    const add_funds_trans = await RfB.receiveInstruction(trade_instruction, trade_amount, {gasLimit:1000000});
    await add_funds_trans.wait()
    console.log("Trade Complete!")
}

handler()

