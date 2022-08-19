# RockyBot

![watercolor of rocky staying alive -- DALLE (original, digital ink)](./rockybot_img.png "watercolor of rocky staying alive -- DALLE (original, digital ink)")
"watercolor of rocky staying alive" -- DALLE (original, digital ink)

- [Introduction](#introduction)
- [PyTorch Model](#model)
- [L2 Contract](#l2contract)

<a name="introduction"/>

## Introduction
RockyBot is the first ever fully on-chain AI trading bot!! Features include

- An L1 contract which holds funds and exchanges WEth / USDC on Uniswap.
- An L2 contract implementing a simple (but flexible) 3-layer neural network for predicting future WEth prices.
- A simple frontend for visualization and PyTorch code for training both regressors and classifiers.

Rocky is live at [rockybot.app](https://www.rockybot.app/) -- check out how he's doing!!

<a name="model"/>

## Pytorch Model
Check out the README.md file within the `pytorch-model` directory!

<a name="l2contract"/>

## L2 Contract (Cairo Model)
The Cairo neural net model can be found in the `L2ContractHelper` directory, under the `L2RockafellerBot.cairo` file (pardon our misspelling!). 

To play with creating your own neural net, copy over all the code from [this line](https://github.com/Modulus-Labs/RockyBot/blob/46ba19eabda2cf35d8ca9805f762f37d53a4fcae/L2ContractHelper/L2RockafellerBot.cairo#L272) onwards and follow the example given by the `three_layer_nn` function. For tips or tricks, feel free to hop on our [Discord](https://t.co/KlRkssrQhz) and reach out!
