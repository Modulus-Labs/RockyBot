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
            self.data_path = constants.get_dataset_filepath(
                constants.HOUR_DAY_WEEK_TASK, constants.TRAIN_DATASET_FILENAME)
            self.label_path = constants.get_dataset_filepath(
                constants.HOUR_DAY_WEEK_TASK, constants.TRAIN_LABELS_FILENAME)
        elif mode == "val":
            print(f"Setting up val hour/day/week dataset (with Bitcoin future prices)...")
            self.data_path = constants.get_dataset_filepath(
                constants.HOUR_DAY_WEEK_TASK, constants.VAL_DATASET_FILENAME)
            self.label_path = constants.get_dataset_filepath(
                constants.HOUR_DAY_WEEK_TASK, constants.VAL_LABELS_FILENAME)
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
            self.data_path = constants.get_dataset_filepath(
                constants.HDW_NO_CONTEXT_TASK, constants.TRAIN_DATASET_FILENAME)
            self.label_path = constants.get_dataset_filepath(
                constants.HDW_NO_CONTEXT_TASK, constants.TRAIN_LABELS_FILENAME)
        elif mode == "val":
            print(f"Setting up val HDW no context dataset...")
            self.data_path = constants.get_dataset_filepath(
                constants.HDW_NO_CONTEXT_TASK, constants.VAL_DATASET_FILENAME)
            self.label_path = constants.get_dataset_filepath(
                constants.HDW_NO_CONTEXT_TASK, constants.VAL_LABELS_FILENAME)
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


class Classification_Eth_6hr_No_Context_Dataset(Dataset):
    """
    Classification dataset for Eth +6 hr prices. No future BTC price given.
    """
    def __init__(self, mode):
        if mode == "train":
            print(f"Setting up train classify Eth+6hr no context dataset...")
            self.data_path = constants.get_dataset_filepath(
                constants.CLASSIFICATION_ETH_6HR_NO_CONTEXT_TASK, constants.TRAIN_DATASET_FILENAME)
            self.label_path = constants.get_dataset_filepath(
                constants.CLASSIFICATION_ETH_6HR_NO_CONTEXT_TASK, constants.TRAIN_LABELS_FILENAME)
        elif mode == "val":
            print(f"Setting up val Eth+6hr no context dataset...")
            self.data_path = constants.get_dataset_filepath(
                constants.CLASSIFICATION_ETH_6HR_NO_CONTEXT_TASK, constants.VAL_DATASET_FILENAME)
            self.label_path = constants.get_dataset_filepath(
                constants.CLASSIFICATION_ETH_6HR_NO_CONTEXT_TASK, constants.VAL_LABELS_FILENAME)
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


class Classification_Eth_6hr_Dataset(Dataset):
    """
    Classification dataset for Eth +6 hr prices, WITH previous price context.
    No future BTC price given.
    """
    def __init__(self, mode):
        if mode == "train":
            print(f"Setting up train HDW no context dataset...")
            self.data_path = constants.get_dataset_filepath(
                constants.CLASSIFICATION_ETH_6HR_TASK, constants.TRAIN_DATASET_FILENAME)
            self.label_path = constants.get_dataset_filepath(
                constants.CLASSIFICATION_ETH_6HR_TASK, constants.TRAIN_LABELS_FILENAME)
        elif mode == "val":
            print(f"Setting up val HDW no context dataset...")
            self.data_path = constants.get_dataset_filepath(
                constants.CLASSIFICATION_ETH_6HR_TASK, constants.VAL_DATASET_FILENAME)
            self.label_path = constants.get_dataset_filepath(
                constants.CLASSIFICATION_ETH_6HR_TASK, constants.VAL_LABELS_FILENAME)
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
    constants.CLASSIFICATION_ETH_6HR_NO_CONTEXT_TASK: Classification_Eth_6hr_No_Context_Dataset
    constants.CLASSIFICATION_ETH_6HR_TASK: Classification_Eth_6hr_Dataset
}