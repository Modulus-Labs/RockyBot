import argparse
import constants
import datasets
import models

def get_train_args():
    """
    Args for `train.py`.
    """
    parser = argparse.ArgumentParser()

    # --- Dataset ---
    parser.add_argument("--dataset", type=str, 
                        help=f"Dataset/task type. Choices are {list(dataset.DATASETS.keys())}", 
                        default=constants.HOUR_DAY_WEEK_TASK)

    # --- Model ---
    parser.add_argument("--model-type", type=str, required=True, 
                        help=f"Model type. Choices are {models.MODEL_TYPES}.")

    # --- Hyperparams ---
    parser.add_argument("--batch-size", type=int, default=constants.DEFAULT_BATCH_SIZE)
    parser.add_argument("--lr", type=float, default=constants.DEFAULT_TRAIN_LR)
    parser.add_argument("--num-epochs", type=int, default=constants.DEFAULT_TRAIN_EPOCHS)
    parser.add_argument("--optimizer", type=str, default=constants.DEFAULT_OPTIM)
    # parser.add_argument("--pos-weight", type=float, default=constants.DEFAULT_POS_WEIGHT)

    # --- Save dir ---
    parser.add_argument("--model-name", type=str, required=True, help="Where to save model weights")
    
    # --- Other ---
    parser.add_argument("--eval-every", type=int, default=1, help="Eval every n epochs.")
    parser.add_argument("--save-every", type=int, default=1, help="Save every n epochs.")
    parser.add_argument("--print-every", type=int, default=1, help="Print every n epochs.")
    # parser.add_argument("--print-every-train-minibatch", type=int, default=500, help="Print stats every n train minibatches.")
    # parser.add_argument("--print-every-eval-minibatch", type=int, default=100, help="Print stats every n eval minibatches.")

    args = parser.parse_args()
    return args


def get_classify_eval_args():
    """
    Args for `classify_eval.py`.
    """
    parser = argparse.ArgumentParser()

    # --- Model ---
    parser.add_argument("--model-type", type=str, required=True, help=f"Model type. Choices are {constants.MODEL_TYPES}.")

    # --- Hyperparams ---
    parser.add_argument("--batch-size", type=int, default=constants.DEFAULT_BATCH_SIZE)
    # parser.add_argument("--pos-weight", type=float, default=constants.DEFAULT_POS_WEIGHT)

    # --- Save dir ---
    parser.add_argument("--model-name", type=str, required=True, help="Where to load model weights")

    # --- Dataset ---
    parser.add_argument("--dataset", type=str, 
                        help=f"Dataset/task type. Choices are {list(dataset.DATASETS.keys())}", 
                        default=constants.HOUR_DAY_WEEK_TASK)
    
    # --- Other ---
    parser.add_argument("--print-every-minibatch", type=int, default=100, help="Print stats every n minibatches.")
    
    
    args = parser.parse_args()
    return args