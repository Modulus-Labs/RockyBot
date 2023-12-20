# RockyBot

![watercolor of rocky staying alive -- DALLE (original, digital ink)](./rockybot_img.png "watercolor of rocky staying alive -- DALLE (original, digital ink)")

> "watercolor of rocky staying alive" -- DALLE (original, digital ink)

- [Introduction](#introduction)
- [L2 Contract](#l2contract)
- [PyTorch Model](#model)

<a name="introduction"/>

## Introduction

RockyBot is the first ever fully on-chain AI trading bot!! Features include

- An L1 contract which holds funds and exchanges WEth / USDC on Uniswap.
- An L2 contract implementing a simple (but flexible) 3-layer neural network for predicting future WEth prices.
- A simple frontend for visualization and PyTorch code for training both regressors and classifiers.

Rocky is live at [rockybot.app](https://www.rockybot.app/) -- check out how he's doing!!

<a name="l2contract"/>

## L2 Contract (Cairo Model)

The Cairo neural net model can be found in the `L2ContractHelper` directory, under the `L2RockafellerBot.cairo` file (pardon our misspelling!).

To play with creating your own neural net, copy over all the code from [this line](https://github.com/Modulus-Labs/RockyBot/blob/46ba19eabda2cf35d8ca9805f762f37d53a4fcae/L2ContractHelper/L2RockafellerBot.cairo#L272) onwards and follow the example given by the `three_layer_nn` function. For tips or tricks, feel free to hop on our [Discord](https://t.co/KlRkssrQhz) and reach out!

## Getting Started

This directory is for all things training-related with respect to Rocky!

### Installation

- Install Conda from the [official site](https://www.anaconda.com/products/distribution).
- Create Conda env: `conda create --name rockybot-env --file pytorch-model-env.txt`

> (Note that you should run the above command from this directory!)

<a name="model"/>

## Pytorch Model

All of the below is with respect to the `pytorch-model/` directory!

Note that the model type which is implemented in Cairo is the simple 3-layer neural net with ReLU activations between each layer (except the final layer, which outputs raw logits/softmax distribution), trained on the dataset derived from [`process_playground_task()`](https://github.com/Modulus-Labs/RockyBot/blob/46ba19eabda2cf35d8ca9805f762f37d53a4fcae/pytorch-model/process_dataset.py#L167) function.

### Data Acquisition

The data acquisition happens within the `DataAquisition/` directory! The current setup pulls the on-chain data via the Graph. The dataset is currently extracted and lives within the `pytorch-model` where the model is trained and evaluated.

However, if you'd like to pull another asset than ETH or BTC, you might have to pull your own data using the same setup. For that, you will need your own API_KEY from the Graph.

After you acquire the key, go to the `DataAquisition/` directory and modify the `config.ts` script with your own API_KEY by changing the `API_KEY` variable.

### Data Generation

Simply run `process_dataset.py` with no arguments. This command generates `.npy` files for the `playground_task` task which will be used in classification eval/training.

### Model Training

This function makes liberal use of [argparse](https://docs.python.org/3/library/argparse.html)! See the [`get_train_args()`](https://github.com/Modulus-Labs/RockyBot/blob/46ba19eabda2cf35d8ca9805f762f37d53a4fcae/pytorch-model/opts.py#L15) function for full details. Sample command is as follows:

```
python3 classification_train.py \
	--dataset playground_task \
	--model-type simple_3_layer_classifier \
	--num-epochs 100 \
	--model-name rockybot_sample_1
```

Results (saved model files, train stats, etc) are stored in `playground_task_task/simple_3_layer_classifier/rockybot_sample_1`.

### Model Validation

Similarly to the train command, we use argparse here. Example command is as follows:

```
python3 classification_eval.py \
	--dataset playground_task \
	--model-name rockybot_sample_1 \
	--model-type simple_3_layer_classifier
```

Enter the corresponding model checkpoint to load and evaluate. This command outputs the val loss and accuracy (note that these models will grossly overfit the training set, since market data is noisy and learning is ungeneralizable, as far as we can tell), and generates a confusion matrix as well (see `playground_task_viz/simple_3_layer_classifier/rockybot_sample_1/Confusion_Matrix.png`).

### Sample Directory

This is how your directory structure should look after running `process_dataset.py`, `classification_train.py`, and `classification_eval.py`!

```
├── classification_eval.py
├── classification_train.py
├── constants.py
├── datasets
│   └── playground_task
│       ├── feature_idx.json
│       ├── label_idx.json
│       ├── train.npy
│       ├── train_labels.npy
│       ├── val.npy
│       └── val_labels.npy
├── datasets.py
├── eth_btc_pricedata.csv
├── models.py
├── opts.py
├── playground_task_task
│   └── simple_3_layer_classifier
│       └── ryan_test_8
│           ├── final_model.pth
│           └── train_stats.json
├── playground_task_viz
│   └── simple_3_layer_classifier
│       └── ryan_test_8
│           └── Confusion_Matrix.png
├── process_dataset.py
├── pytorch-model-env.txt
├── regression_eval.py
├── regression_train.py
├── test.json
├── test.npy
├── tree.txt
├── utils.py
└── viz_utils.py
```
