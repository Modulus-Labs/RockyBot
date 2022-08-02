import argparse
import constants
import datasets
import models

def get_help_string(desc, choices=None, default=None):
    ret = ""
    ret += desc + " "
    if choices is not None:
        ret += f"Choices are {choices}. "
    if default is not None:
        ret += f"Default is {default}."
    return ret

def get_train_args():
    """
    Args for `train.py`.
    """
    parser = argparse.ArgumentParser()

    # --- Dataset ---
    parser.add_argument("--dataset", type=str, 
                        help=get_help_string("Dataset/task type.", 
                                             choices=list(datasets.DATASETS.keys()), 
                                             default=constants.HOUR_DAY_WEEK_TASK),
                        default=constants.HOUR_DAY_WEEK_TASK)

    # --- Model ---
    parser.add_argument("--model-type", type=str,
                        help=get_help_string("Model type.",
                                             choices=list(models.MODEL_TYPES.keys()),
                                             default=constants.SIMPLE_3_LAYER_NN),
                        default=constants.SIMPLE_3_LAYER_NN
                       )

    # --- Hyperparams ---
    parser.add_argument("--batch-size", type=int, 
                        help=get_help_string("Batch size.", 
                                             choices=None, 
                                             default=constants.DEFAULT_BATCH_SIZE),
                        default=constants.DEFAULT_BATCH_SIZE)
    parser.add_argument("--lr", type=float, 
                        help=get_help_string("Learning rate.", 
                                             choices=None, 
                                             default=constants.DEFAULT_TRAIN_LR),
                        default=constants.DEFAULT_TRAIN_LR)
    parser.add_argument("--num-epochs", type=int, 
                        help=get_help_string("Num train epochs.", 
                                             choices=None, 
                                             default=constants.DEFAULT_TRAIN_EPOCHS),
                        default=constants.DEFAULT_TRAIN_EPOCHS)
    parser.add_argument("--optimizer", type=str, 
                        help=get_help_string("Optimizer.", 
                                             choices=None, 
                                             default=constants.DEFAULT_OPTIM),
                        default=constants.DEFAULT_OPTIM)
    # parser.add_argument("--pos-weight", type=float, default=constants.DEFAULT_POS_WEIGHT)

    # --- Save dir ---
    parser.add_argument("--model-name", type=str, required=True, 
                        help="Where to save model weights.")
    
    # --- Other ---
    parser.add_argument("--eval-every", type=int, default=constants.DEFAULT_EVAL_EVERY, 
                        help=get_help_string("Eval every n epochs.", 
                                             choices=None, 
                                             default=constants.DEFAULT_EVAL_EVERY))
    parser.add_argument("--save-every", type=int, default=constants.DEFAULT_SAVE_EVERY, 
                        help=get_help_string("Save every n epochs.", 
                                             choices=None, 
                                             default=constants.DEFAULT_SAVE_EVERY))
    parser.add_argument("--print-every", type=int, default=constants.DEFAULT_PRINT_EVERY, 
                        help=get_help_string("Print every n epochs.", 
                                             choices=None, 
                                             default=constants.DEFAULT_PRINT_EVERY))
    parser.add_argument("--print-every-train-minibatch", type=int, 
                        default=constants.DEFAULT_PRINT_EVERY_MINIBATCH,
                        help=get_help_string("Print stats every n train minibatches.",
                                             choices=None,
                                             default=constants.DEFAULT_PRINT_EVERY_MINIBATCH))
    parser.add_argument("--print-every-eval-minibatch", type=int, 
                        default=constants.DEFAULT_PRINT_EVERY_MINIBATCH,
                        help=get_help_string("Print stats every n eval minibatches.",
                                             choices=None,
                                             default=constants.DEFAULT_PRINT_EVERY_MINIBATCH))

    args = parser.parse_args()
    return args


def get_eval_args():
    """
    Args for `eval.py`.
    """
    parser = argparse.ArgumentParser()

    # --- Model ---
    parser.add_argument("--model-type", type=str,
                        help=get_help_string("Model type.",
                                             choices=list(models.MODEL_TYPES.keys()),
                                             default=constants.SIMPLE_3_LAYER_NN),
                        default=constants.SIMPLE_3_LAYER_NN
                       )

    # --- Hyperparams ---
    parser.add_argument("--batch-size", type=int, 
                        help=get_help_string("Batch size.", 
                                             choices=None, 
                                             default=constants.DEFAULT_BATCH_SIZE),
                        default=constants.DEFAULT_BATCH_SIZE)

    # --- Save dir ---
    parser.add_argument("--model-name", type=str, required=True, help="Where to load model weights from.")

    # --- Dataset ---
    parser.add_argument("--dataset", type=str, 
                        help=get_help_string("Dataset/task type.", 
                                             choices=list(datasets.DATASETS.keys()), 
                                             default=constants.HOUR_DAY_WEEK_TASK),
                        default=constants.HOUR_DAY_WEEK_TASK)
    
    # --- Other ---
    parser.add_argument("--print-every-minibatch", type=int, 
                        default=constants.DEFAULT_EVAL_PRINT_EVERY_MINIBATCH, 
                        help=get_help_string("Print stats every n minibatches.",
                                             choices=None,
                                             default=constants.DEFAULT_EVAL_PRINT_EVERY_MINIBATCH))
    
    
    args = parser.parse_args()
    return args