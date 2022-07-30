# --- For process_dataset.py ---
RAW_DATA_FILE = "eth_btc_pricedata.csv"
LABEL_FIELDS = ["eth_nexthourprice", "eth_nextdayprice", "eth_nextweekprice"]
DATASET_DIR = "datasets"
TRAIN_DATASET_FILENAME = "eth_btc_train.npy"
VAL_DATASET_FILENAME = "eth_btc_val.npy"
TRAIN_LABELS_FILENAME = "eth_btc_train_labels.npy"
VAL_LABELS_FILENAME = "eth_btc_val_labels.npy"
FEATURES_TO_IDX_FILENAME = "eth_btc_feature_idx.json"
LABELS_TO_IDX_FILENAME = "eth_btc_label_idx.json"

RANDOM_SEED = 420