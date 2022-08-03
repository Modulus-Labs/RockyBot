import torch
import numpy as np
import torch.nn as nn
import torch.nn.functional as F

import constants

class Simple_3_Layer_NN(nn.Module):
    """
    3-Layer regression NN for ETH/BTC dataset.
    """
    def __init__(self, dataset_ref, h1_dim=32, h2_dim=32):

        super(Simple_3_Layer_NN, self).__init__()

        # --- Save the dims ---
        self.x_dim = dataset_ref.get_input_dim()
        self.out_dim = dataset_ref.get_output_dim()
        self.h1_dim, self.h2_dim = h1_dim, h2_dim

        # --- Layers ---
        self.linear_1 = nn.Linear(in_features=self.x_dim, out_features=self.h1_dim)
        self.activ_1 = nn.ReLU()
        self.linear_2 = nn.Linear(in_features=self.h1_dim, out_features=self.h2_dim)
        self.activ_2 = nn.ReLU()
        self.linear_3 = nn.Linear(in_features=self.h2_dim, out_features=self.out_dim)

    def forward(self, x):
        h1 = self.activ_1(self.linear_1(x))
        h2 = self.activ_2(self.linear_2(h1))
        out = self.linear_3(h2)
        return out


class Simple_3_Layer_Classifier(nn.Module):
    """
    3-Layer classifier for ETH/BTC dataset.
    """
    def __init__(self, dataset_ref, h1_dim=128, h2_dim=64):

        super(Simple_3_Layer_Classifier, self).__init__()

        # --- Save the dims ---
        self.x_dim = dataset_ref.get_input_dim()
        self.out_dim = dataset_ref.get_output_dim()
        self.h1_dim, self.h2_dim = h1_dim, h2_dim

        # --- Layers ---
        self.linear_1 = nn.Linear(in_features=self.x_dim, out_features=self.h1_dim)
        self.activ_1 = nn.ReLU()
        self.linear_2 = nn.Linear(in_features=self.h1_dim, out_features=self.h2_dim)
        self.activ_2 = nn.ReLU()
        self.linear_3 = nn.Linear(in_features=self.h2_dim, out_features=self.out_dim)

    def forward(self, x):
        h1 = self.activ_1(self.linear_1(x))
        h2 = self.activ_2(self.linear_2(h1))
        out = self.linear_3(h2)
        return out


class Simple_5_Layer_Classifier(nn.Module):
    """
    5-Layer classifier for ETH/BTC dataset.
    """
    def __init__(self, dataset_ref, h1_dim=128, h2_dim=128, h3_dim=64, h4_dim=64):

        super(Simple_5_Layer_Classifier, self).__init__()

        # --- Save the dims ---
        self.x_dim = dataset_ref.get_input_dim()
        self.out_dim = dataset_ref.get_output_dim()
        self.h1_dim, self.h2_dim, self.h3_dim, self.h4_dim = h1_dim, h2_dim, h3_dim, h4_dim

        # --- Layers ---
        self.linear_1 = nn.Linear(in_features=self.x_dim, out_features=self.h1_dim)
        self.activ_1 = nn.ReLU()
        self.linear_2 = nn.Linear(in_features=self.h1_dim, out_features=self.h2_dim)
        self.activ_2 = nn.ReLU()
        self.linear_3 = nn.Linear(in_features=self.h2_dim, out_features=self.h3_dim)
        self.activ_3 = nn.ReLU()
        self.linear_4 = nn.Linear(in_features=self.h3_dim, out_features=self.h4_dim)
        self.activ_4 = nn.ReLU()
        self.linear_5 = nn.Linear(in_features=self.h4_dim, out_features=self.out_dim)

    def forward(self, x):
        h1 = self.activ_1(self.linear_1(x))
        h2 = self.activ_2(self.linear_2(h1))
        h3 = self.activ_3(self.linear_3(h2))
        h4 = self.activ_4(self.linear_4(h3))
        out = self.linear_5(h4)
        return out


# --- For argparse ---
MODEL_TYPES = {
    constants.SIMPLE_3_LAYER_NN: Simple_3_Layer_NN,
    constants.SIMPLE_3_LAYER_CLASSIFIER: Simple_3_Layer_Classifier,
    constants.SIMPLE_5_LAYER_CLASSIFIER: Simple_5_Layer_Classifier,
}