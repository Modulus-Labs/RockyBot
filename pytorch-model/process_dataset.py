import numpy as np
import csv
import json
import os

import constants


def read_data_from_csv():
    
    # --- Cols 0 and 9 are timestamps ---
    # --- Cols 6-8 are labels ---
    
    # TODO(ryancao)!
    # --- Cols 15-17 are Bitcoin prices, but in the future :'( ---
    
    idx_to_field_data = list()
    idx_to_field_labels = list()
    data_features = list()
    labels = list()
    
    with open(constants.RAW_DATA_FILE, newline="") as data_file:
        data_reader = csv.reader(data_file, delimiter=",")
        for idx, row in enumerate(data_reader):
            if idx == 0:
                idx_to_field_data = row[1:6] + row[10:]
                idx_to_field_labels = row[6:9]
            else:
                # --- Data has some holes in it ---
                if row[6] == "" or row[7] == "" or row[8] == "":
                    continue
                skip = False
                for x in row[1:9] + row[10:]:
                    if float(x) > 1e10:
                        skip = True
                if skip:
                    continue

                row_features = list(float(x) for x in (row[1:6] + row[10:]))
                row_labels = list(float(x) for x in row[6:9])
                data_features.append(row_features)
                labels.append(row_labels)

    data_features = np.asarray(data_features) / 1000
    labels = np.asarray(labels) / 1000

    # --- Check for infinities ---
    for idx, row in enumerate(data_features):
        if np.sum(row > 1e8) > 0:
            print(idx, row)
    print()
    for idx, row in enumerate(labels):
        if np.sum(row > 1e8) > 0:
            print(idx, row)
    
    return idx_to_field_data, idx_to_field_labels, np.asarray(data_features), np.asarray(labels)


def process_hour_day_week_task(idx_to_field_data, idx_to_field_labels, data_features, labels):
    
    # --- Doing a 10 to 1 (random) split ---
    val_indices = np.random.choice(range(len(data_features)), 
                                   int(len(data_features) / 10), 
                                   replace=False)
    
    # --- Extract elements ---
    val_features = data_features[val_indices]
    val_labels = labels[val_indices]

    train_mask = np.ones(len(data_features), bool)
    train_mask[val_indices] = False
    train_features = data_features[train_mask]
    train_labels = labels[train_mask]
    
    return train_features, train_labels, val_features, val_labels


def process_save_data(train_features, train_labels, val_features, val_labels, task_type):
    
    # --- Save to files ---
    train_features_save_path = constants.get_dataset_train_filepath(task_type)
    train_labels_save_path = constants.get_dataset_train_labelpath(task_type)
    val_features_save_path = constants.get_dataset_val_filepath(task_type)
    val_labels_save_path = constants.get_dataset_val_labelpath(task_type)
    
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
    features_to_indices_save_path = constants.get_dataset_features_to_idx_path(task_type)
    print(f"Saving to {features_to_indices_save_path}...")
    with open(features_to_indices_save_path, "w") as f:
        json.dump(features_to_idx, f)
    
    labels_to_indices_save_path = constants.get_dataset_labels_to_idx_path(task_type)
    print(f"Saving to {labels_to_indices_save_path}...")
    with open(labels_to_indices_save_path, "w") as f:
        json.dump(labels_to_idx, f)

    print("All done!")


if __name__ == "__main__":
    
    # --- For consistency ---
    np.random.seed(constants.RANDOM_SEED)
    
    # --- Read data ---
    idx_to_field_data, idx_to_field_labels, data_features, labels = read_data_from_csv()
    
    # --- Grab features/labels ---
    train_features, train_labels, val_features, val_labels = \
    process_hour_day_week_task(idx_to_field_data, 
                               idx_to_field_labels, 
                               data_features, 
                               labels)
    
    # --- Save data to file ---
    process_save_data(train_features, 
                      train_labels, 
                      val_features, 
                      val_labels, 
                      task_type=constants.HOUR_DAY_WEEK_TASK)