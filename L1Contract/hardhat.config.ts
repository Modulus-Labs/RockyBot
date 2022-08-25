import { HardhatUserConfig } from "hardhat/config";
import '@typechain/hardhat';
import '@nomiclabs/hardhat-ethers';
import "@nomicfoundation/hardhat-toolbox";

import { GOERLI_PRIVATE_KEY, MAINNET_PRIVATE_KEY } from "./keys.config";

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  defaultNetwork: "mainnet",
  networks: {
    hardhat: {
      forking: {
        url: "https://eth-mainnet.g.alchemy.com/v2/-HC6HC2R9crhQe3tcu4h4Qq2nYfCRc9t",
      },
      allowUnlimitedContractSize: true
    },
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/NnMaaIDS0ol9DW-uYqr6j1kHIK9W9suo`,
      accounts: [GOERLI_PRIVATE_KEY]
    },
    mainnet: {
      url: 'https://eth-mainnet.g.alchemy.com/v2/-HC6HC2R9crhQe3tcu4h4Qq2nYfCRc9t',
      accounts: [MAINNET_PRIVATE_KEY]
    }
  }
};

export default config;
