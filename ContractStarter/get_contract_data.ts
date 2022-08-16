//import sn_abi from '../L2ContractHelper/compiled/contract_abi.json';
import mw from './three_layer_nn_weights_epoch330.json';
import * as fs from 'fs';
import { join } from 'path';
import { ethers } from 'ethers';
import { RockafellerBotL1__factory } from '../L1Contract/typechain-types/factories/contracts/RockafellerBotL1.sol/RockafellerBotL1__factory'

/*import {
  Account,
  Contract,
  Provider,
  ec,
  json,
  number,
  Abi
} from "starknet";*/

//const PRIME = number.toBN("3618502788666131213697322783095070105623107215331596699973092056135872020481")

const WETH_ADDRESS = process.env.weth_addr ?? "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
const LOAD_DIR = 'jsonModelData';

import config from './config'
import fetch from 'cross-fetch'
globalThis.fetch = fetch

import { getTokensQuery, TokenPriceSliceData } from '../DataAquisition/scripts/get_token_price';

export async function handler (): Promise<void> {
    const provider = new ethers.providers.AlchemyProvider("goerli", "NnMaaIDS0ol9DW-uYqr6j1kHIK9W9suo");
    const RfB = RockafellerBotL1__factory.connect(config.L1_CONTRACT_ADDRESS, provider);
    /*const sn_keypair = ec.getKeyPair(number.toBN(config.SN_PRIVATE_KEY));
    const account_address = config.SN_ACCOUNT_ADDRESS;

    const sn_provider = new Provider();
    const sn_account = new Account(sn_provider, account_address, sn_keypair);

    const L2Contract = new Contract(sn_abi as Abi, config.SN_CONTRACT_ADDRESS, sn_account);*/

    var enddate: Date = new Date(Date.now());

    var startdate: Date = new Date(enddate.getTime() - 60*60*1000*36)

    var data = await getTokensQuery("WETH", WETH_ADDRESS, startdate, enddate);

    var dataPost = data.map((item: TokenPriceSliceData) => {return Math.trunc((data[0].price - item.price)*(10**8))});

    if(dataPost.length != 36) throw `Data gotten from TheGraph is not of sufficient length: Should be 36; actually ${dataPost.length}`;
    var remaining_usdc = await RfB.currentAmountUSDC();
    var remaining_weth = await RfB.currentAmountWEth();
    var curr_price = data[0].price;
    var price_ratio = Math.trunc((1/curr_price)*(10**12))

    const body = { price_ratio: price_ratio, remaining_usdc: remaining_usdc.toString(), remaining_weth: remaining_weth.toString(), data_len: dataPost.length, data: dataPost, 
      a_num_rows: mw.a_num_rows, a_num_cols: mw.a_num_cols, a_data_ptr_len: mw.a_data_ptr_len, a_data_ptr: mw.a_data_ptr,  a_bias_ptr_len: mw.a_bias_ptr_len, a_bias_ptr: mw.a_bias_ptr,
      b_num_rows: mw.b_num_rows, b_num_cols: mw.b_num_cols, b_data_ptr_len: mw.b_data_ptr_len, b_data_ptr: mw.b_data_ptr,  b_bias_ptr_len: mw.b_bias_ptr_len, b_bias_ptr: mw.b_bias_ptr,
      c_num_rows: mw.c_num_rows, c_num_cols: mw.c_num_cols, c_data_ptr_len: mw.c_data_ptr_len, c_data_ptr: mw.c_data_ptr,  c_bias_ptr_len: mw.c_bias_ptr_len, c_bias_ptr: mw.c_bias_ptr,}

    //var s3 = new aws.S3({apiVersion:'latest'})

    const now = new Date();

    var filepath = join(process.env.environment ?? 'dev', LOAD_DIR, `current_modeldata.json`);

    //const detailsPath = join(process.env.environment ?? 'dev', LOAD_DIR, 'current.json')

    const detailsBody = JSON.stringify({dateTime: now.toISOString(), pathPrefix: process.env.environment ?? 'dev', fileName: now.toISOString() + '_modeldata.json'});

    // const details_file = await s3.upload({
    //   Bucket: 'rocky-modeldatabucket',
    //   Key: detailsPath,
    //   Body: detailsBody
    // }).promise();

  
    // const data_file = await s3.upload({
    //   Bucket: 'rocky-modeldatabucket',
    //   Key: filepath,
    //   Body: JSON.stringify(body)
    // }).promise();
    
    fs.writeFileSync(filepath, JSON.stringify(body));

    //L2Contract.calculateStrategy(remaining_weth, remaining_usdc, weth_price_ratio, )
    /*var result = await L2Contract.three_layer_nn(dataPost, mw.a_num_rows, mw.a_num_cols, removeNegatives(mw.a_data_ptr), removeNegatives(mw.a_bias_ptr),
        mw.b_num_rows, mw.b_num_cols, removeNegatives(mw.b_data_ptr), removeNegatives(mw.b_bias_ptr),
        mw.c_num_rows, mw.c_num_cols, removeNegatives(mw.c_data_ptr), removeNegatives(mw.c_bias_ptr), mw.scale_factor);*/
    
    //console.log(data);
    //console.log(result);
}

// function removeNegatives(nums: Array<number>) : Array<any> {
//     return nums.map((item: number) => number.toBN(item).umod(PRIME));
// }

handler()