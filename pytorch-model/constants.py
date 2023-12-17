import os

# --- For Data Acquisition ---
API_URL = "https://rest.coinapi.io/v1/ohlcv/"
TIME_START = "2023-01-20T06:30:00"
EXCHANGE = "BINANCE_SPOT"

# --- For process_dataset.py ---
RAW_DATA_FILE = "NEAR_USDT_pricedata.csv"
LABEL_FIELDS = ["eth_nexthourprice", "eth_nextdayprice", "eth_nextweekprice"]
DATASET_DIR = "datasets"

# --- Dataset stuff ---
TRAIN_DATASET_FILENAME = "train.npy"
TRAIN_LABELS_FILENAME = "train_labels.npy"
VAL_DATASET_FILENAME = "val.npy"
VAL_LABELS_FILENAME = "val_labels.npy"
FEATURES_TO_IDX_FILENAME = "feature_idx.json"
LABELS_TO_IDX_FILENAME = "label_idx.json"

# --- General ---
RANDOM_SEED = 420

# --- For training ---
DEFAULT_TRAIN_EPOCHS = 50
DEFAULT_TRAIN_LR = 1e-3 # 3e-4 initially
DEFAULT_BATCH_SIZE = 32
DEFAULT_OPTIM = "adam"
DEFAULT_EVAL_EVERY = 5
DEFAULT_PRINT_EVERY = 1
DEFAULT_SAVE_EVERY = 10
DEFAULT_PRINT_EVERY_MINIBATCH = 1e20 # Never

# --- For eval ---
DEFAULT_EVAL_PRINT_EVERY_MINIBATCH = 100

# --- Models are saved under {task_type}_task/{model_type}/{model_name}/{epoch}.pth ---
# --- Visuals are saved under {task_type}_viz/{model_type}/{model_name}/{img_name}.png ---
def get_model_dir(task_name, model_type, model_name):
    return os.path.join(f"{task_name}_task", model_type, model_name)
def get_viz_dir(task_name, model_type, model_name):
    return os.path.join(f"{task_name}_viz", model_type, model_name)

# --- Datasets are saved under datasets/{task_type}/{files} ---
def get_dataset_filepath(task_type, filename, create=False):
    data_dir = os.path.join(DATASET_DIR, task_type)
    if create:
        os.path.isdir(data_dir) or os.makedirs(data_dir)
    return os.path.join(DATASET_DIR, task_type, filename)

# --- All datasets ---

# Gives future Bitcoin prices --> not great
HOUR_DAY_WEEK_TASK = "btc_eth_hour_day_week"
# No context --> only one timestamp worth of price info
HDW_NO_CONTEXT_TASK = "btc_eth_hdw_no_context"
# Playground regression task
PLAYGROUND_REGRESSION_TASK = "playground_regression"
# Classifies which direction the price will move
CLASSIFICATION_ETH_6HR_NO_CONTEXT_TASK = "btc_eth_classification_eth_6hr_no_context"
# In theory, the best one. With context and classification
CLASSIFICATION_ETH_6HR_TASK = "btc_eth_classification_eth_6hr"
# Ryan will just play around with this until it works
PLAYGROUND_TASK = "playground_task"

# --- Models ---
SIMPLE_3_LAYER_NN = "simple_3_layer_nn"
SIMPLE_5_LAYER_NN = "simple_5_layer_nn"
SIMPLE_3_LAYER_CLASSIFIER = "simple_3_layer_classifier"
SIMPLE_5_LAYER_CLASSIFIER = "simple_5_layer_classifier"
SIMPLE_RNN = "simple_rnn"
SIMPLE_LSTM = "simple_lstm"