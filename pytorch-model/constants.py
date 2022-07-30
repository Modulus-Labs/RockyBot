# --- For process_dataset.py ---
RAW_DATA_FILE = "eth_btc_pricedata.csv"
LABEL_FIELDS = ["eth_nexthourprice", "eth_nextdayprice", "eth_nextweekprice"]
DATASET_DIR = "datasets"

# --- Dataset stuff ---
TRAIN_DATASET_FILENAME = "eth_btc_train.npy"
VAL_DATASET_FILENAME = "eth_btc_val.npy"
TRAIN_LABELS_FILENAME = "eth_btc_train_labels.npy"
VAL_LABELS_FILENAME = "eth_btc_val_labels.npy"
FEATURES_TO_IDX_FILENAME = "eth_btc_feature_idx.json"
LABELS_TO_IDX_FILENAME = "eth_btc_label_idx.json"

# --- General ---
RANDOM_SEED = 420

# --- For training ---
DEFAULT_TRAIN_EPOCHS = 50
DEFAULT_TRAIN_LR = 1e-3 # 3e-4 initially
DEFAULT_BATCH_SIZE = 32
DEFAULT_OPTIM = "adam"

# --- Models are saved under {task_type}_task/{model_type}/{model_name}/{epoch}.pth ---
# --- Visuals are saved under {task_type}_viz/{model_type}/{model_name}/{img_name}.png ---
def get_model_dir(task_name, model_type, model_name):
    return os.path.join(f"{task_name}_task", model_type, model_name)
def get_viz_dir(task_name, model_type, model_name):
    return os.path.join(f"{task_name}_viz", model_type, model_name)

HOUR_DAY_WEEK_TASK = "btc_eth_hour_day_week"