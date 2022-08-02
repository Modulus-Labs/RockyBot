import os

# --- For process_dataset.py ---
RAW_DATA_FILE = "eth_btc_pricedata.csv"
LABEL_FIELDS = ["eth_nexthourprice", "eth_nextdayprice", "eth_nextweekprice"]
DATASET_DIR = "datasets"

# --- Dataset stuff ---
TRAIN_DATASET_FILENAME = "train.npy"
VAL_DATASET_FILENAME = "val.npy"
TRAIN_LABELS_FILENAME = "train_labels.npy"
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
def get_dataset_train_filepath(task_type):
    return os.path.join(DATASET_DIR, task_type, TRAIN_DATASET_FILENAME)
def get_dataset_train_labelpath(task_type):
    return os.path.join(DATASET_DIR, task_type, TRAIN_LABELS_FILENAME)
def get_dataset_val_filepath(task_type):
    return os.path.join(DATASET_DIR, task_type, VAL_DATASET_FILENAME)
def get_dataset_val_labelpath(task_type):
    return os.path.join(DATASET_DIR, task_type, VAL_LABELS_FILENAME)
def get_dataset_features_to_idx_path(task_type):
    return os.path.join(DATASET_DIR, task_type, FEATURES_TO_IDX_FILENAME)
def get_dataset_labels_to_idx_path(task_type):
    return os.path.join(DATASET_DIR, task_type, LABELS_TO_IDX_FILENAME)

# --- All datasets ---

# Gives future Bitcoin prices --> not great
HOUR_DAY_WEEK_TASK = "btc_eth_hour_day_week"
# No context --> only one timestamp worth of price info
HDW_NO_CONTEXT_TASK = "btc_eth_hdw_no_context"
# Classifies which direction the price will move
CLASSIFICATION_NO_CONTEXT_TASK = "btc_eth_classification_no_context"
# In theory, the best one. With context and classification
CLASSIFICATION_TASK = "btc_eth_classification"

# --- Default model ---
SIMPLE_3_LAYER_NN = "simple_3_layer_nn"