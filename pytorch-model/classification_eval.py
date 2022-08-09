import glob
import json
import os

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
import viz_utils


def update_confusion_matrix(confusion_matrix, y_true, y_pred):
    """
    Updates the given confusion matrix.
    Assumes that y_true and y_pred have dimensions (B, C) if RNN,
    else just (C,) if feedforward model.
    """
    # y_correct = y_true * y_pred
    # y_incorrect = (y_correct + y_pred) % 2

    for y_true_class, y_pred_class in zip(y_true, y_pred):
        confusion_matrix[y_true_class, y_pred_class] += 1

    # for row_y_true, row_y_pred in zip(y_true, y_pred):
    #     for y_true_class, y_pred_class in zip(row_y_true, row_y_pred):
    #         confusion_matrix[y_true_class, y_pred_class] += 1


def eval_model(model, val_dataloader, criterion, args):
    """
    Evaluates model over validation set.
    """
    print("\n" + ("-" * 30) + " Evaluating model! " + ("-" * 30))
    total_loss = 0
    total_correct = 0
    total_examples = 0
    
    avg_loss = None
    avg_acc = None

    model.eval()
    
    # --- Set up confusion matrix ---
    val_dataset = val_dataloader.dataset
    confusion_matrix = torch.zeros(val_dataset.get_output_dim(), val_dataset.get_output_dim())

    with torch.no_grad():
        for idx, (x, y) in tqdm(enumerate(val_dataloader), total=len(val_dataloader)):

            # --- Move to GPU ---
            # x = x.cuda(constants.GPU, non_blocking=True)
            # y = y.cuda(constants.GPU, non_blocking=True)

            # --- Compute logits ---
            logits = model(x)
            loss = criterion(logits, y)
            
            # print(x[0])
            # print(y)
            # print(logits[0])
            # exit()

            # --- Bookkeeping ---
            _, predicted = torch.max(logits.data, 1)
            total_correct += (predicted == y).sum().item()

            total_loss += loss.item()
            total_examples += y.shape[0]
            # total_examples += y.shape[0] * y.shape[1]

            avg_loss = total_loss / total_examples
            avg_acc = total_correct / total_examples
            
            # --- Updates confusion matrix ---
            update_confusion_matrix(confusion_matrix, y, predicted)
            
            # if idx % args.print_every_eval_minibatch == 0:
            #     tqdm.write(f"Val minibatch number: {idx} | Avg loss: {avg_loss} | Avg acc: {avg_acc}")

    # --- Invert labels to idx ---
    temp_idx_to_labels = [None] * len(val_dataset.labels_to_idx)
    for k, v in val_dataset.labels_to_idx.items():
        temp_idx_to_labels[v] = k
    idx_to_labels = list()
    for idx in range(len(temp_idx_to_labels) - 1):
        bucket_low = temp_idx_to_labels[idx]
        bucket_high = temp_idx_to_labels[idx + 1]
        idx_to_labels.append(f"{bucket_low}_{bucket_high}")
                
    # --- Generate confusion matrix image ---
    viz_save_dir = constants.get_viz_dir(args.dataset, args.model_type, args.model_name)
    confusion_matrix_path = os.path.join(viz_save_dir, "Confusion_Matrix.png")
    viz_utils.plot_confusion_matrix(confusion_matrix, 
                                    confusion_matrix_path, 
                                    "Confusion Matrix", 
                                    idx_to_labels)

    return avg_loss, avg_acc, total_examples


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
    if not os.path.isdir(viz_save_dir):
        raise RuntimeError(f"Error: {viz_save_dir} does not exist! Exiting...\n")
    
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
    criterion = nn.CrossEntropyLoss()#.cuda(constants.GPU)
    print("Done!\n")

    # --- Run eval ---
    val_avg_loss, val_avg_acc, total_examples = eval_model(model, 
                                                           val_dataloader, 
                                                           criterion, 
                                                           args)
    print(f"Avg loss: {val_avg_loss} | Avg acc: {val_avg_acc} | "\
          f"Total number of val examples: {total_examples}")


if __name__ == "__main__":
    main()