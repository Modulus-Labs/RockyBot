import { HardhatUserConfig } from "hardhat/config";
import '@typechain/hardhat';
import '@nomiclabs/hardhat-ethers';
import "@nomicfoundation/hardhat-toolbox";

const GOERLI_PRIVATE_KEY = "692c0b19927202bd79d8b623f4311a5f5249fa88d618eacb5a129fa78e26f74f";

const config: HardhatUserConfig = {
  solidity: "0.8.9",
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
    }
  }
};

export default config;
