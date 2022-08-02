import glob
import json
import matplotlib.pyplot as plt
import os
import seaborn as sns
sns.set_theme()

import os
import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.utils.data import DataLoader
import numpy as np

from tqdm import tqdm

import constants
import datasets
import models
import opts


def eval_model(model, val_dataloader, criterion, args):
    """
    Evaluates model over validation set.
    """
    print("\n" + ("-" * 30) + " Evaluating model! " + ("-" * 30))
    total_loss = 0
    total_residual = 0
    total_examples = 0
    
    avg_loss = None
    avg_residual = None

    model.eval()

    with torch.no_grad():
        for idx, (x, y) in tqdm(enumerate(val_dataloader), total=len(val_dataloader)):

            # --- Move to GPU ---
            # x = x.cuda(constants.GPU, non_blocking=True)
            # y = y.cuda(constants.GPU, non_blocking=True)

            # --- Compute logits ---
            logits = model(x)
            loss = criterion(y, logits)

            # --- Bookkeeping ---
            residuals = torch.abs(y - logits)

            total_loss += loss.item()
            total_residual += torch.sum(residuals).item()
            total_examples += y.shape[0]

            avg_loss = total_loss / total_examples
            avg_residual = total_residual / total_examples

    return avg_loss, avg_residual, total_examples


def main():
    # --- Args ---
    args = opts.get_eval_args()
    print("\n" + "-" * 30 + " Args " + "-" * 30)
    for k, v in vars(args).items():
        print(f"{k}: {v}")
    print()
    
    # --- Model and viz save dir ---
    model_save_dir = constants.get_model_dir(args.dataset, args.model_type, args.model_name)
    viz_save_dir = constants.get_viz_dir(args.dataset, args.model_type, args.model_name)
    if not os.path.isdir(model_save_dir):
        raise RuntimeError(f"Error: {model_save_dir} does not exist! Exiting...\n")
    
    # --- Get model weight path ---
    model_filenames = sorted(list(os.path.basename(x) for x in glob.glob(os.path.join(model_save_dir, "*.pth"))))
    for model_file in model_filenames:
        print(model_file)
    user_choice = input("Please select which model .pth file to load -> ")
    while user_choice not in model_filenames:
        user_choice = input (f"Error. Failed to find specified model. Please try again -> ")
    model_weights_path = os.path.join(model_save_dir, user_choice)
    print(f"--> Selected {model_weights_path} as the model weights file.\n")

    # --- Setup dataset ---
    print("--> Setting up dataset...")
    val_dataset = datasets.DATASETS[args.dataset](mode="val")
    print("Done!\n")

    # --- Dataloaders ---
    print("--> Setting up dataloaders...")
    val_dataloader = DataLoader(val_dataset, batch_size=args.batch_size, shuffle=False, num_workers=1)
    print("Done!\n")

    # --- Setup model ---
    # TODO(ryancao): Actually pull the ResNet model! ---
    print("--> Setting up model...")
    model = models.MODEL_TYPES[args.model_type](val_dataset)
    model.load_state_dict(torch.load(model_weights_path, map_location=torch.device("cpu")))
    # torch.cuda.set_device(constants.GPU)
    # model = model.cuda(constants.GPU)
    print("Done!\n")
    
    # --- Loss fn ---
    print("--> Setting up loss fn...")
    criterion = nn.MSELoss()#.cuda(constants.GPU)
    print("Done!\n")

    # --- Run eval ---
    val_avg_loss, val_avg_residual, total_examples = eval_model(model, val_dataloader, criterion, args)
    print(f"Avg loss: {val_avg_loss} | Avg residual: {val_avg_residual} | "\
          f"Total number of val examples: {total_examples}")


if __name__ == "__main__":
    main()