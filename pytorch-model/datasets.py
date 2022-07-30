import glob
import numpy as np
import os
import torch
from torch.utils.data import Dataset

import constants


class BTC_ETH_Hour_Day_Week_Dataset(Dataset):
    """
    Regression dataset for Eth (hour, day, week) prices, given BTC/ETH features.
    """
    def __init__(self, mode="train"):
        if mode == "train":
            print(f"Setting up train BTC/ETH dataset...")
            self.data_path = os.path.join(constants.DATASET_DIR, constants.TRAIN_DATASET_FILENAME)
            self.label_path = os.path.join(constants.DATASET_DIR, constants.TRAIN_LABELS_FILENAME)
        elif mode == "val":
            print(f"Setting up val BTC/ETH dataset...")
            self.data_path = os.path.join(constants.DATASET_DIR, constants.VAL_DATASET_FILENAME)
            self.label_path = os.path.join(constants.DATASET_DIR, constants.VAL_LABELS_FILENAME)
        else:
            print(f"Error: mode should be one of [train, val] but got {mode} instead.")

        # --- Load in dataset + labels ---
        with open(self.data_path, "rb") as f:
            self.x = torch.from_numpy(np.load(f))
        with open(self.label_path, "rb") as f:
            self.y = torch.from_numpy(np.load(f))

    def get_input_dim(self):
        return self.x.shape[1]

    def get_output_dim(self):
        return self.y.shape[1]

    def __getitem__(self, idx):
        return self.x[idx], self.y[idx]

    def __len__(self):
        return len(self.x)


# --- For argparse ---
DATASETS = {
    constants.HOUR_DAY_WEEK_TASK: BTC_ETH_Hour_Day_Week_Dataset
}