# RockyBot PyTorch Training

- [Getting Started](#getting-started)
- [Training](#training)
- [Sample Directory](#sample-directory)

<a name="getting-started"/>

## Getting Started
This directory is for all things training-related with respect to Rocky!

### Installation
- Install Conda from the [official site](https://www.anaconda.com/products/distribution).
- Create Conda env: `conda create --name rockybot-env --file pytorch-model-env.txt`

(Note that you should run the above command from this directory!)

<a name="training"/>

## Training
Note that the model type which is implemented in Cairo is the simple 3-layer neural net with ReLU activations between each layer (except the final layer, which outputs raw logits/softmax distribution), trained on the dataset derived from [`process_playground_task()`](https://github.com/Modulus-Labs/RockyBot/blob/46ba19eabda2cf35d8ca9805f762f37d53a4fcae/pytorch-model/process_dataset.py#L167) function.

### Data Generation
Simply run `process_dataset.py` with no arguments. This command generates `.npy` files for the `playground_task` task which will be used in classification eval/training. 

The dataset currently generated for training/eval has as features the price (1 WEth --> USDC) difference between the current timestamp's price and 0-35 hours before. The label is the price bucket (defined [here](https://github.com/Modulus-Labs/RockyBot/blob/46ba19eabda2cf35d8ca9805f762f37d53a4fcae/pytorch-model/process_dataset.py#L234)) for price difference between the next hour's price and the current price.

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

## Sample Directory
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