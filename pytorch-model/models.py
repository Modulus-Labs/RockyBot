import torch
import numpy as np
import torch.nn as nn
import torch.nn.functional as F

import constants

class Simple_3_Layer_NN(nn.Module):
    """
    3-Layer regression NN for ETH/BTC dataset.
    """
    def __init__(self, dataset_ref, h1_dim=128, h2_dim=128):

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


class Simple_5_Layer_NN(nn.Module):
    """
    5-Layer regression NN for ETH/BTC dataset.
    """
    def __init__(self, dataset_ref, h1_dim=128, h2_dim=128, h3_dim=128, h4_dim=128):

        super(Simple_5_Layer_NN, self).__init__()

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
    def __init__(self, dataset_ref, h1_dim=128, h2_dim=256, h3_dim=256, h4_dim=128):

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


class Simple_LSTM_Classifier(nn.Module):
    """
    LSTM-based classifier for ETH/BTC dataset.
    
    > Note that we are letting the LSTM have its independent h- and c-dims, and
    are then taking the outputs and projecting them onto our classification.
    > We are also taking only the final layer to train our network.
    
    From torch docs:
    rnn = nn.LSTM(input_size=10, hidden_size=20, num_layers=2)
    input = torch.randn(5, 3, 10)
    h0 = torch.randn(2, 3, 20)
    c0 = torch.randn(2, 3, 20)
    output, (hn, cn) = rnn(input, (h0, c0))
    """
    def __init__(self, dataset_ref, c_dim=256):

        super(Simple_LSTM_Classifier, self).__init__()

        # --- Save the dims ---
        self.in_dim = dataset_ref.get_input_dim()
        self.out_dim = dataset_ref.get_output_dim()
        self.c_dim = c_dim
        
        print(self.in_dim, self.out_dim, self.c_dim)
        
        # --- Layers ---
        self.lstm = nn.LSTM(input_size=self.in_dim, hidden_size=self.c_dim)
        self.output_projection = nn.Linear(in_features=self.c_dim, out_features=self.out_dim)

    def forward(self, x):
        # --- x \in (N, L, H_dim) ---
        # --- outputs \in (L, N, H_dim) ---
        x = torch.transpose(x, 0, 1)
        outputs, (h_n, c_n) = self.lstm(x)
        
        # --- Only classify the last layer ---
        out = self.output_projection(outputs)
        
        # --- out: (L, N, output_dim) ---
        # --- First transpose: (N, L, output_dim)
        # --- second transpose (N, output_dim, L) ---
        return torch.transpose(torch.transpose(out, 0, 1), 1, 2)


# --- For argparse ---
MODEL_TYPES = {
    constants.SIMPLE_3_LAYER_NN: Simple_3_Layer_NN,
    constants.SIMPLE_5_LAYER_NN: Simple_5_Layer_NN,
    constants.SIMPLE_3_LAYER_CLASSIFIER: Simple_3_Layer_Classifier,
    constants.SIMPLE_5_LAYER_CLASSIFIER: Simple_5_Layer_Classifier,
    constants.SIMPLE_LSTM: Simple_LSTM_Classifier,
}