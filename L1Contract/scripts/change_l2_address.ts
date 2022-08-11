import { ethers } from "hardhat";
import { RockafellerBotL1__factory } from '../typechain-types/factories/contracts/RockafellerBotL1.sol/RockafellerBotL1__factory'
import config from '../config';

// const CONTRACT_ADDR = "0x16Feac48BF8abe18a6276950A927feDb80582529"
// const L2_CONTRACT_ADDR = "0x067ac66e2fe22627bb900cc61152b7db3a7ec31d82d1577bfc54790341899921"

async function main() {
    const [owner, otherAccount] = await ethers.getSigners();

    const RfB = RockafellerBotL1__factory.connect(config.L1_CONTRACT_ADDR, owner)
    //var thing = await owner.provider?.waitForTransaction(approve_trans.hash);
    const add_funds_trans = await RfB.updateL2Contract(config.L2_CONTRACT_ADDR);
    await add_funds_trans.wait()
    console.log(await RfB.l2ContractAddress())
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });