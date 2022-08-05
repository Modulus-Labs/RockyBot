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
import utils
import viz_utils


def train_one_epoch(model, train_dataloader, criterion, opt, args):

    # --- Time to train! ---
    total_loss = 0
    total_correct = 0
    total_examples = 0
    
    avg_loss = None
    avg_acc = None

    model.train()

    for idx, (x, y) in tqdm(enumerate(train_dataloader), total=len(train_dataloader)):

        # --- Move to GPU ---
        # x = x.cuda(constants.GPU, non_blocking=True)
        # y = y.cuda(constants.GPU, non_blocking=True)

        # --- Compute logits ---
        logits = model(x)
        loss = criterion(logits, y)

        # --- Gradient + GD step ---
        opt.zero_grad()
        loss.backward()
        opt.step()

        # --- Bookkeeping ---
        _, predicted = torch.max(logits.data, 1)
        total_correct += (predicted == y).sum().item()

        total_loss += loss.item()
        total_examples += y.shape[0] * y.shape[1]
        
        avg_loss = total_loss / total_examples
        avg_acc = total_correct / total_examples

        # if idx % args.print_every_train_minibatch == 0:
        #     tqdm.write(f"Train minibatch number: {idx} | Avg loss: {avg_loss} | Avg acc: {avg_acc}")


    return avg_loss, avg_acc, total_examples


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

    with torch.no_grad():
        for idx, (x, y) in tqdm(enumerate(val_dataloader), total=len(val_dataloader)):

            # --- Move to GPU ---
            # x = x.cuda(constants.GPU, non_blocking=True)
            # y = y.cuda(constants.GPU, non_blocking=True)

            # --- Compute logits ---
            logits = model(x)
            loss = criterion(logits, y)

            # --- Bookkeeping ---
            _, predicted = torch.max(logits.data, 1)
            total_correct += (predicted == y).sum().item()

            total_loss += loss.item()
            total_examples += y.shape[0] * y.shape[1]

            avg_loss = total_loss / total_examples
            avg_acc = total_correct / total_examples
            
            # if idx % args.print_every_eval_minibatch == 0:
            #     tqdm.write(f"Val minibatch number: {idx} | Avg loss: {avg_loss} | Avg acc: {avg_acc}")

    return avg_loss, avg_acc, total_examples


def train(args, model, train_dataloader, val_dataloader, criterion, opt):
    """
    Trains and evaluates model.
    """
    print("\n--- Begin training! ---\n")
    train_losses = dict()
    train_accs = dict()
    val_losses = dict()
    val_accs = dict()
    viz_path = constants.get_model_dir(args.dataset, args.model_type, args.model_name)
    model_save_dir = constants.get_viz_dir(args.dataset, args.model_type, args.model_name)

    for epoch in range(args.num_epochs):

        if epoch % args.eval_every == 0:
            # --- Time to evaluate! ---
            val_avg_loss, val_avg_acc, _ = eval_model(model, val_dataloader, criterion, args)
            val_losses[epoch] = val_avg_loss
            val_accs[epoch] = val_avg_acc
            
            # --- Report and plot losses/ious ---
            print(f" Val avg loss: {val_avg_loss} | Val avg acc: {val_avg_acc}\n")
            # viz_utils.plot_losses_ious(val_losses, val_ious, viz_path, prefix="val")
            
        # --- Train ---
        train_avg_loss, train_avg_acc, _ = train_one_epoch(model, train_dataloader, criterion, opt, args)
        train_losses[epoch] = train_avg_acc
        train_accs[epoch] = train_avg_loss

        # --- Print results ---
        if epoch % args.print_every == 0:
            print(f"Epoch: {epoch} | Train avg loss: {train_avg_loss} | Train avg acc: {train_avg_acc}")

        # --- Plot loss/metrics so far (TODO: do this every epoch?) ---
        # --- Then save all train stats ---
        # viz_utils.plot_losses_ious(train_losses, train_accs, viz_path, prefix="train")
        save_train_stats(train_losses, train_accs, val_losses, val_accs, args)
        
        # --- Only save actual model files every so often ---
        if epoch % args.save_every == 0:
            model_save_path = os.path.join(model_save_dir, f"model_epoch_{epoch}.pth")
            print(f"Saving model to {model_save_path}...")
            torch.save(model.state_dict(), model_save_path)

    return train_losses, train_accs, val_losses, val_accs


def save_train_stats(train_losses, train_accs, val_losses, val_accs, args):
    """Save train stats"""

    model_save_dir = constants.get_model_dir(args.dataset, args.model_type, args.model_name)
    train_stats = {
        "train_losses": train_losses,
        "train_accs": train_accs,
        "val_losses": val_losses,
        "val_accs": val_accs,
        "model_type": args.model_type,
        "learning_rate": args.lr,
        "optimizer": args.optimizer,
    }
    train_stats_save_path = os.path.join(model_save_dir, "train_stats.json")
    print(f"Saving current train stats to {train_stats_save_path}...")
    with open(train_stats_save_path, "w") as f:
        json.dump(train_stats, f)


def main():
    
    # --- Check for GPU ---
    device = "cuda:0" if torch.cuda.is_available() else "cpu"
    
    # --- Args ---
    args = opts.get_train_args()
    print("\n" + "-" * 30 + " Args " + "-" * 30)
    for k, v in vars(args).items():
        print(f"{k}: {v}")
    print()
    
    # --- Model and viz save dir ---
    model_save_dir = constants.get_model_dir(args.dataset, args.model_type, args.model_name)
    viz_save_dir = constants.get_viz_dir(args.dataset, args.model_type, args.model_name)
    if os.path.isdir(model_save_dir):
        raise RuntimeError(f"Error: {model_save_dir} already exists! Exiting...")
    elif os.path.isdir(viz_save_dir):
        raise RuntimeError(f"Error: {viz_save_dir} already exists! Exiting...")
    else:
        print(f"--> Creating directory {model_save_dir}...")
        os.makedirs(model_save_dir)
        print(f"--> Creating directory {viz_save_dir}...")
        os.makedirs(viz_save_dir)
    print("Done!\n")

    # --- Setup dataset ---
    print("--> Setting up dataset...")
    train_dataset = datasets.DATASETS[args.dataset](mode="train")
    val_dataset = datasets.DATASETS[args.dataset](mode="val")
    print("Done!\n")

    # --- Dataloaders ---
    print("--> Setting up dataloaders...")
    train_dataloader = DataLoader(train_dataset, batch_size=args.batch_size, shuffle=True, num_workers=1)
    val_dataloader = DataLoader(val_dataset, batch_size=args.batch_size, shuffle=False, num_workers=1)
    print("Done!\n")

    # --- Setup model ---
    print("--> Setting up model...")
    model = models.MODEL_TYPES[args.model_type](train_dataset)
    # torch.cuda.set_device(device)
    # model = model.cuda(device)
    print("Done!\n")

    # --- Optimizer ---
    print("--> Setting up optimizer/criterion...")
    opt = torch.optim.Adam(model.parameters(), lr=args.lr)
    
    # --- Loss fn ---
    criterion = nn.CrossEntropyLoss(weight=train_dataset.get_weights())#.cuda(constants.GPU)
    print("Done!\n")

    # --- Train ---
    train_losses, train_accs, val_losses, val_accs =\
        train(args, model, train_dataloader, val_dataloader, criterion, opt)

    # --- Save model ---
    model_save_path = os.path.join(model_save_dir, "final_model.pth")
    print(f"Done training! Saving model to {model_save_path}...")
    torch.save(model.state_dict(), model_save_path)
    
    # --- Plot final round of loss/iou metrics ---
    # viz_utils.plot_losses_ious(train_losses, train_ious, viz_save_dir, prefix="train")
    # viz_utils.plot_losses_ious(val_losses, val_ious, viz_save_dir, prefix="val")
    
    # --- Do a final train stats save ---
    save_train_stats(train_losses, train_accs, val_losses, val_accs, args)


if __name__ == "__main__":
    main()