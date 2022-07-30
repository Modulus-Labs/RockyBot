import numpy as np
import csv
import json
import os

import constants


def read_data_from_csv():
    
    idx_to_field_data = list()
    idx_to_field_labels = list()
    data_features = list()
    labels = list()
    
    with open(constants.RAW_DATA_FILE, newline="") as data_file:
        data_reader = csv.reader(data_file, delimiter=",")
        for idx, row in enumerate(data_reader):
            if idx == 0:
                idx_to_field_data = row[:6] + row[9:]
                idx_to_field_labels = row[6:9]
            else:
                data_features.append(row[:6] + row[9:])
                labels.append(row[6:9])
    
    return idx_to_field_data, idx_to_field_labels, np.asarray(data_features), np.asarray(labels)


def process_save_data(idx_to_field_data, idx_to_field_labels, data_features, labels):
    
    # --- Doing a 10 to 1 split ---
    val_indices = np.random.choice(range(len(data_features)), int(len(data_features) / 10), replace=False)
    
    # --- Extract elements ---
    val_features = data_features[val_indices]
    val_labels = labels[val_indices]

    train_mask = np.ones(len(data_features), bool)
    train_mask[val_indices] = False
    train_features = data_features[train_mask]
    train_labels = labels[train_mask]
    
    # --- Save to files ---
    train_features_save_path = os.path.join(constants.DATASET_DIR, constants.TRAIN_DATASET_FILENAME)
    train_labels_save_path = os.path.join(constants.DATASET_DIR, constants.VAL_DATASET_FILENAME)
    val_features_save_path = os.path.join(constants.DATASET_DIR, constants.TRAIN_LABELS_FILENAME)
    val_labels_save_path = os.path.join(constants.DATASET_DIR, constants.VAL_LABELS_FILENAME)
    
    print(f"Saving to {train_features_save_path}...")
    with open(train_features_save_path, "wb") as f:
        np.save(f, train_features)

    print(f"Saving to {train_labels_save_path}...")
    with open(train_labels_save_path, "wb") as f:
        np.save(f, train_labels)
        
    print(f"Saving to {val_features_save_path}...")
    with open(val_features_save_path, "wb") as f:
        np.save(f, val_features)

    print(f"Saving to {val_labels_save_path}...")
    with open(val_labels_save_path, "wb") as f:
        np.save(f, val_labels)
        
    # --- Inverting idx_to_field lists ---
    features_to_idx = dict()
    for idx, feature in enumerate(idx_to_field_data):
        features_to_idx[feature] = idx
    
    labels_to_idx = dict()
    for idx, label in enumerate(idx_to_field_labels):
        labels_to_idx[label] = idx
    
    # --- Save labels/features + associated indices ---
    features_to_indices_save_path = os.path.join(constants.DATASET_DIR, constants.FEATURES_TO_IDX_FILENAME)
    print(f"Saving to {features_to_indices_save_path}...")
    with open(features_to_indices_save_path, "w") as f:
        json.dump(features_to_idx, f)
    
    labels_to_indices_save_path = os.path.join(constants.DATASET_DIR, constants.LABELS_TO_IDX_FILENAME)
    print(f"Saving to {labels_to_indices_save_path}...")
    with open(labels_to_indices_save_path, "w") as f:
        json.dump(labels_to_idx, f)

    print("All done!")


if __name__ == "__main__":
    
    # --- For consistency ---
    np.random.seed(constants.RANDOM_SEED)
    idx_to_field_data, idx_to_field_labels, data_features, labels = read_data_from_csv()
    process_save_data(idx_to_field_data, idx_to_field_labels, data_features, labels)