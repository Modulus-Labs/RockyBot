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
    def __init__(self, mode):
        if mode == "train":
            print(f"Setting up train hour/day/week dataset (with Bitcoin future prices)...")
            self.data_path = constants.get_dataset_train_filepath(constants.HOUR_DAY_WEEK_TASK)
            self.label_path = constants.get_dataset_train_labelpath(constants.HOUR_DAY_WEEK_TASK)
        elif mode == "val":
            print(f"Setting up val hour/day/week dataset (with Bitcoin future prices)...")
            self.data_path = constants.get_dataset_val_filepath(constants.HOUR_DAY_WEEK_TASK)
            self.label_path = constants.get_dataset_val_labelpath(constants.HOUR_DAY_WEEK_TASK)
        else:
            print(f"Error: mode should be one of [train, val] but got {mode} instead.")

        # --- Load in dataset + labels ---
        with open(self.data_path, "rb") as f:
            self.x = torch.from_numpy(np.load(f)).float()
        with open(self.label_path, "rb") as f:
            self.y = torch.from_numpy(np.load(f)).float()

    def get_input_dim(self):
        return self.x.shape[1]

    def get_output_dim(self):
        return self.y.shape[1]

    def __getitem__(self, idx):
        return self.x[idx], self.y[idx]

    def __len__(self):
        return len(self.x)

    
class HDW_No_Context_Dataset(Dataset):
    """
    Regression dataset for Eth (hour, day, week) prices. No future BTC price given.
    """
    def __init__(self, mode):
        if mode == "train":
            print(f"Setting up train HDW no context dataset...")
            self.data_path = constants.get_dataset_train_filepath(constants.HDW_NO_CONTEXT_TASK)
            self.label_path = constants.get_dataset_train_labelpath(constants.HDW_NO_CONTEXT_TASK)
        elif mode == "val":
            print(f"Setting up val HDW no context dataset...")
            self.data_path = constants.get_dataset_val_filepath(constants.HDW_NO_CONTEXT_TASK)
            self.label_path = constants.get_dataset_val_labelpath(constants.HDW_NO_CONTEXT_TASK)
        else:
            print(f"Error: mode should be one of [train, val] but got {mode} instead.")

        # --- Load in dataset + labels ---
        with open(self.data_path, "rb") as f:
            self.x = torch.from_numpy(np.load(f)).float()
        with open(self.label_path, "rb") as f:
            self.y = torch.from_numpy(np.load(f)).float()

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
    constants.HOUR_DAY_WEEK_TASK: BTC_ETH_Hour_Day_Week_Dataset,
    constants.HDW_NO_CONTEXT_TASK: HDW_No_Context_Dataset,
}