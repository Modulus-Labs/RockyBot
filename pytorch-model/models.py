import torch
import numpy as np
import torch.nn as nn
import torch.nn.functional as F

class Simple_3_Layer_NN(nn.Module):
    """
    3-Layer regression NN for ETH/BTC dataset.
    """
    def __init__(self, x_dim, h1_dim=32, h2_dim=32, out_dim=3):

        super(Simple_3_Layer_NN, self).__init__()

        # --- Save the dims ---
        self.x_dim, self.h1_dim, self.h2_dim, self.out_dim = x_dim, h1_dim, h2_dim, out_dim

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


# --- For argparse ---
MODEL_TYPES = {
    'simple_3_layer_nn': Simple_3_Layer_NN,
}