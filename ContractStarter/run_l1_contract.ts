import {Provider as Sn_Provider} from "starknet";
import { ethers } from "ethers";
import { RockafellerBotL1__factory } from '../L1Contract/typechain-types/factories/contracts/RockafellerBotL1.sol/RockafellerBotL1__factory'
import fs from 'fs';
import config from './config'

async function handler(): Promise<void> {
    const sn_provider = new Sn_Provider({
        network: 'goerli-alpha' // or 'goerli-alpha'
    });

    var f = fs.readFileSync('./dev/transHashData/current_trans_hash.json')
    var trans = JSON.parse(f.toString())
    do {
        console.log("Checking if trans is accepted on L1")
        var t_receipt = await sn_provider.getTransactionReceipt(trans);
        console.log(t_receipt)
        if(t_receipt.status == "ACCEPTED_ON_L2" && t_receipt.l2_to_l1_messages.length == 0) {
            return;
        }
        await new Promise(r => setTimeout(r, 120000));
    } while(t_receipt.status != "ACCEPTED_ON_L1")
    var message = t_receipt.l2_to_l1_messages[0]
    console.log(message)
    var trade_instruction = message[0];
    var trade_amount = message[1];
    const provider = new ethers.providers.AlchemyProvider("goerli", "NnMaaIDS0ol9DW-uYqr6j1kHIK9W9suo");

    const owner = new ethers.Wallet(config.GOERLI_PRIVATE_KEY, provider);

    const RfB = RockafellerBotL1__factory.connect(config.L1_CONTRACT_ADDRESS, owner)

    const add_funds_trans = await RfB.receiveInstruction(trade_instruction, trade_amount);
    await add_funds_trans.wait()
}

handler()

