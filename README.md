# RockyBot

L1 Contracts should be compiled with 'npx hardhat compile'; this will also compile typechain bindings

L2 Contract should be compiled with 'starknet-compile L2RockafellerBot.cairo     --output ./compiled/contract_compiled.json     --abi ./compiled/contract_abi.json'

all typescript files should be bundled with './node_modules/.bin/esbuild ./scripts/[typescript file] --bundle --outdir=./bin --platform=node'