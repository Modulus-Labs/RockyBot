import numpy as np
import csv
import json
import pandas as pd
from datetime import datetime, timedelta

from constants import RAW_DATA_FILE, PROCESSED_DATA_FILE, RANDOM_SEED


# Reads the CSV file, removes the price data that comes at the 30 minute mark, and adds the next hour price as a label
def process_csv():
    with open(RAW_DATA_FILE) as data_file:
        # --- Read CSV file ---
        df = pd.read_csv(data_file)

        # --- Remove the rows that have the 30 minute mark ---
        df = df[df['time_period_start'].str.contains('30:00') == False]

        # Add three new columns for the next hour, day, and week prices
        df['near_nexthourprice'] = 0.0
        df['near_nextdayprice'] = 0.0
        df['near_nextweekprice'] = 0.0


        # --- Add the next hour, day, and week prices ---
        for index, _ in df.iterrows():
            # --- Get the next hour price ---
            next_hour = index + 1
            if next_hour >= len(df):
                break
            df.iloc[index, df.columns.get_loc('near_nexthourprice')] = df.iloc[next_hour, df.columns.get_loc('price_close')]

            # --- Get the next day price ---
            next_day = index + 24
            if next_day >= len(df):
                break
            df.iloc[index,  df.columns.get_loc('near_nextdayprice')] = df.iloc[next_day, df.columns.get_loc('price_close')]

            # # --- Get the next week price ---
            next_week = index + 168
            if next_week >= len(df):
                break
            df.iloc[index, df.columns.get_loc('near_nextweekprice')] = df.iloc[next_week, df.columns.get_loc('price_close')]

        # Clean those rows that have no next hour, day, or week price
        df = df[df['near_nexthourprice'] != 0.0]

        # --- Save to CSV file ---
        df.to_csv('NEAR_USDT_pricedata_processed.csv', index=False)

# TODO: Add data points that are correlated with the NEAR price
def read_data_from_csv():
    
    # --- Cols 0 is the timestamp we are interested in --
    # --- Cols 10-12 are the labels we are interested in ---
    
    # These are the column descriptions 
    idx_to_field_data = list()
    idx_to_field_labels = list()

    # These are the actual data points
    data_features = list()
    labels = list()
    
    # TODO: Add data points that are correlated with the NEAR price
    with open(PROCESSED_DATA_FILE, newline="") as data_file:
        data_reader = csv.reader(data_file, delimiter=",")
        for idx, row in enumerate(data_reader):
            if idx == 0:
                idx_to_field_data = row[1:10]
                idx_to_field_labels = row[10:]
            else:
                # Check whether the data has holes in it
                skip = False
                for x in row:
                    if x == "":
                        skip = True
                        break

                    if float(x) > 1e10:
                        skip = True
                        break
                
                if skip:
                    continue
                else:
                    row_features = list(float(x) for x in (row[1:10]))
                    row_labels = list(float(x) for x in row[10:])
                    data_features.append(row_features)
                    labels.append(row_labels)

    data_features = np.asarray(data_features)
    labels = np.asarray(labels)

    # --- Check for infinities ---
    for idx, row in enumerate(data_features):
        if np.sum(row > 1e8) > 0:
            print(idx, row)
    print()
    for idx, row in enumerate(labels):
        if np.sum(row > 1e8) > 0:
            print(idx, row)
    
    return idx_to_field_data, idx_to_field_labels, np.asarray(data_features), np.asarray(labels)


def preprocess_data(idx_to_field_data, idx_to_field_labels, data_features, labels):
    """
    > Cuts BTC prices in the future from features
    > Creates new label column (i.e. price from 1 hour later)
    """
    # --- Cuts BTC prices in the future from features ---
    data_features = np.transpose(np.transpose(data_features)[:-3])
    idx_to_field_data = idx_to_field_data[:-3]

    # --- Creates new label (ETH price 1 hour later) ---
    new_row = np.transpose(labels)[0][1:]
    new_row = new_row.reshape(1, len(np.transpose(labels)[0]) - 1)
    labels = np.transpose(np.concatenate([np.transpose(labels[:-1]), new_row]))
    data_features = data_features[:-1]
    
    return idx_to_field_data, idx_to_field_labels, data_features, labels


def playground(idx_to_field_data, idx_to_field_labels, data_features, labels):
    """
    Messing around with the dataset to determine bins for classification.
    """
    # --- Cuts BTC prices in the future from features ---
    data_features = np.transpose(np.transpose(data_features)[:-3])
    idx_to_field_data = idx_to_field_data[:-3]

    # --- Creates new label (6 hours later) ---
    new_row = np.transpose(labels)[0][5:]
    new_row = new_row.reshape(1, len(np.transpose(labels)[0]) - 5)
    labels = np.transpose(np.concatenate([np.transpose(labels[:-5]), new_row]))
    data_features = data_features[:-5]

    # --- Time to make buckets ---
    hour = {"less": list(), "more": list()}
    day = {"less": list(), "more": list()}
    week = {"less": list(), "more": list()}
    
    # --- Compare ETH prices now vs. later ---
    for idx, (data, label) in enumerate(zip(data_features, labels)):

        if label[0] - data[0] < 0:
            hour["less"].append(label[0] - data[0])
        else:
            hour["more"].append(label[0] - data[0])
        
        if label[1] - data[0] < 0:
            day["less"].append(label[1] - data[0])
        else:
            day["more"].append(label[1] - data[0])

        if label[2] - data[0] < 0:
            week["less"].append(label[2] - data[0])
        else:
            week["more"].append(label[2] - data[0])
    
    hour_less_stats = len(hour["less"]), np.mean(hour["less"])
    hour_more_stats = len(hour["more"]), np.mean(hour["more"])
    day_less_stats = len(day["less"]), np.mean(day["less"])
    day_more_stats = len(day["more"]), np.mean(day["more"])
    week_less_stats = len(week["less"]), np.mean(week["less"])
    week_more_stats = len(week["more"]), np.mean(hour["more"])
    print(f"hour less: {hour_less_stats}")
    print(f"hour more: {hour_more_stats}")
    print(f"day less: {day_less_stats}")
    print(f"day more: {day_more_stats}")
    print(f"week less: {week_less_stats}")
    print(f"week more: {week_more_stats}")
    
    # --- Do histogram ---
    six_hour_hist_bins = [-1500, -100, -50, -30, -15, -5, 0, 5, 15, 30, 50, 100, 1500]
    print(six_hour_hist_bins)

    six_hour_diff = np.transpose(data_features)[0] - np.transpose(labels)[3]
    print()
    print(np.min(six_hour_diff))
    print(np.max(six_hour_diff))
    print(np.mean(six_hour_diff))
    print(np.std(six_hour_diff))
    print()
    
    eth_prices = np.transpose(data_features)[0]
    six_hour_later_eth_prices = np.transpose(labels)[3]
    print(np.min(eth_prices))
    print(np.max(eth_prices))
    print(np.mean(eth_prices))
    print(np.std(eth_prices))

    six_hour_hist = np.histogram(np.transpose(data_features)[0] - np.transpose(labels)[3],
                                 bins=six_hour_hist_bins)
    
    print()
    print(hour_hist[0])
    print(hour_hist[1])
    print()
    print(six_hour_hist[0])
    print(six_hour_hist[1])
    print()
    print(day_hist[0])
    print(day_hist[1])
    print()
    print(week_hist[0])
    print(week_hist[1])
    print()
    
    exit()


def process_playground_task(idx_to_field_data, 
                            idx_to_field_labels, 
                            data_features, 
                            labels):
    """
    Subject to change -- Ryan will mess with this until it works.
    
    Previously1: Classification task for {sparse, dense}-loss LSTM
    Previously2: Regression task for feedforward NN
    Currently: Classification task again for feedforward network
    """
    
    # --- Remove BTC prices from future and add in 1-hour-ahead data ---
    idx_to_field_data, idx_to_field_labels, data_features, labels = \
        preprocess_data(idx_to_field_data, idx_to_field_labels, data_features, labels)

    # --- Cuts remainder of BTC features from features ---
    data_features = np.transpose(np.transpose(data_features)[:-5])
    idx_to_field_data = idx_to_field_data[:-5]
    
    # --- Cuts everything but ETH prices from features ---
    data_features = np.transpose(np.transpose(data_features)[:1])
    
    # --- Creates new dataset by taking cuts from features ---
    # (L, D) -- for LSTM
    # new_data_features = list()
    # for idx in range(len(data_features) - 36):
    #     new_data_features.append(data_features[idx:idx + 36])
    # new_data_features = np.stack(new_data_features)
    # labels = labels[:-36]
    # print(new_data_features.shape)
    # print(labels.shape)
    # --------------------------------------------------------
    
    # --- Creates new feature sets (Eth price DIFFS from 0-35 hours ago) ---
    NUM_HOURS_BACK = 36
    all_eth_hours_ago = list()
    for ago in range(1, NUM_HOURS_BACK):
        eth_hours_ago = np.transpose(data_features)[0][:-ago][NUM_HOURS_BACK - ago:]
        eth_hours_ago = eth_hours_ago.reshape(1, len(eth_hours_ago))
        all_eth_hours_ago.append(eth_hours_ago)

    new_data_features = np.transpose(np.concatenate(
        [np.transpose(data_features[NUM_HOURS_BACK:])] + all_eth_hours_ago
    ))
    labels = labels[NUM_HOURS_BACK:]
    
    # --- Renormalizes each row ---
    for idx in range(len(new_data_features)):
        new_data_features[idx] = new_data_features[idx][0] - new_data_features[idx]

    # ----------------------------------------------------------------
    
    # --- Adding to the idx to field data ---
    # for ago in range(1, 25):
    #     idx_to_field_data.append(f"Eth price {ago} hours ago")
    # idx_to_field_data.append("eth_price_six_hours_ago")
    # idx_to_field_data.append("eth_price_twelve_hours_ago")
    # idx_to_field_data.append("eth_price_eighteen_hours_ago")
    # idx_to_field_data.append("eth_price_twentyfour_hours_ago")

    # --- Picks ONLY the 1-hours-ahead price data delta as labels ---
    labels = np.transpose(labels)[3] - np.transpose(labels)[0]
    
    # --- Performs binning ---
    # bins = [-1800, -15, -5, 0, 5, 15, 1800]
    # six_hour_hist_bins = bins
    six_hour_hist_bins = [-1800, -30, -20, -10, -5, -2, 0, 2, 5, 10, 20, 30, 1800]
    new_labels = list()
    for label_idx, label in enumerate(labels):
        for bin_idx in range(len(six_hour_hist_bins) - 1):
            if label >= six_hour_hist_bins[bin_idx] and label < six_hour_hist_bins[bin_idx + 1]:
                new_labels.append(bin_idx)
                break

    new_labels = np.asarray(new_labels, dtype=np.int64)
    
    # --- New labels which are a sequence of the original labels ---
    # new_data_features = new_data_features[:-1]
    # temp_label_list = list()
    # for idx in range(len(new_labels) - 36 - 1):
    #     temp_label_list.append(new_labels[idx + 1:idx + 36 + 1])
    # new_labels = np.stack(temp_label_list)
    # print(new_data_features.shape)
    # print(new_labels.shape)
    # --------------------------------------------------------------

    # --- Doing a 10 to 1 (non-random) split ---
    split_idx = int(len(new_data_features) * 9 / 10)

    # --- Extract elements ---
    val_features = new_data_features[split_idx:]
    val_labels = new_labels[split_idx:]
    train_features = new_data_features[:split_idx]
    train_labels = new_labels[:split_idx]

    # --- Return the bins as the new label fields ---
    return train_features, train_labels, val_features, val_labels, idx_to_field_data, six_hour_hist_bins


def process_classification_task(idx_to_field_data, 
                                idx_to_field_labels, 
                                data_features, 
                                labels):
    """
    (-6, -12, -18, -24) hour ETH price dataset which asks network to predict, for each bucket of
    time period (hour, day, week), whether/how much future ETH prices will
    go up or down.
    """
    
    # --- Remove BTC prices from future and add in 6-hours-ahead data ---
    idx_to_field_data, idx_to_field_labels, data_features, labels = preprocess_data(idx_to_field_data, 
                                                                                    idx_to_field_labels, 
                                                                                    data_features, 
                                                                                    labels)

    # --- Creates new feature sets (Eth price from 1-24 hours ago) ---
    all_eth_hours_ago = list()
    for ago in range(1, 25):
        eth_hours_ago = np.transpose(data_features)[0][:-ago][24 - ago:]
        eth_hours_ago = eth_hours_ago.reshape(1, len(eth_hours_ago))
        all_eth_hours_ago.append(eth_hours_ago)

    # eth_six_hours_ago = np.transpose(data_features)[0][:-6][18:]
    # eth_twelve_hours_ago = np.transpose(data_features)[0][:-12][12:]
    # eth_eighteen_hours_ago = np.transpose(data_features)[0][:-18][6:]
    # eth_twentyfour_hours_ago = np.transpose(data_features)[0][:-24]

    # eth_six_hours_ago = eth_six_hours_ago.reshape(1, len(eth_six_hours_ago))
    # eth_twelve_hours_ago = eth_twelve_hours_ago.reshape(1, len(eth_twelve_hours_ago))
    # eth_eighteen_hours_ago = eth_eighteen_hours_ago.reshape(1, len(eth_eighteen_hours_ago))
    # eth_twentyfour_hours_ago = eth_twentyfour_hours_ago.reshape(1, len(eth_twentyfour_hours_ago))

    data_features = np.transpose(np.concatenate(
        [np.transpose(data_features[24:])] + all_eth_hours_ago
        
    ))
    labels = labels[24:]
    
    # --- Adding to the idx to field data ---
    for ago in range(1, 25):
        idx_to_field_data.append(f"Eth price {ago} hours ago")
    # idx_to_field_data.append("eth_price_six_hours_ago")
    # idx_to_field_data.append("eth_price_twelve_hours_ago")
    # idx_to_field_data.append("eth_price_eighteen_hours_ago")
    # idx_to_field_data.append("eth_price_twentyfour_hours_ago")

    # --- Picks ONLY the 6-hours-ahead price data delta as labels ---
    labels = np.transpose(labels)[3] - np.transpose(labels)[0]
    six_hour_hist_bins = [-1800, -100, -50, -30, -15, -5, 0, 5, 15, 30, 50, 100, 1800]
    new_labels = list()
    for label_idx, label in enumerate(labels):
        for bin_idx in range(len(six_hour_hist_bins) - 1):
            if label >= six_hour_hist_bins[bin_idx] and label < six_hour_hist_bins[bin_idx + 1]:
                new_labels.append(bin_idx)
                break

    new_labels = np.asarray(new_labels, dtype=np.int64)

    # --- Doing a 10 to 1 (non-random) split ---
    split_idx = int(len(data_features) * 9 / 10)

    # --- Extract elements ---
    val_features = data_features[split_idx:]
    val_labels = new_labels[split_idx:]
    train_features = data_features[:split_idx]
    train_labels = new_labels[:split_idx]

    # --- Return the bins as the new label fields ---
    return train_features, train_labels, val_features, val_labels, idx_to_field_data, six_hour_hist_bins


def process_classification_no_context_task(idx_to_field_data, 
                                           idx_to_field_labels, 
                                           data_features, 
                                           labels):
    """
    No-context dataset which asks network to predict, for each bucket of
    time period (hour, day, week), whether/how much future ETH prices will
    go up or down.
    """
    
    # --- Remove BTC prices from future and add in 6-hours-ahead data ---
    idx_to_field_data, idx_to_field_labels, data_features, labels = preprocess_data(idx_to_field_data, 
                                                                                    idx_to_field_labels, 
                                                                                    data_features, 
                                                                                    labels)
    
    # --- Picks ONLY the 6-hours-ahead price data delta as labels ---
    labels = np.transpose(labels)[3] - np.transpose(labels)[0]
    six_hour_hist_bins = [-1800, -100, -50, -30, -15, -5, 0, 5, 15, 30, 50, 100, 1800]
    new_labels = list()
    for label_idx, label in enumerate(labels):
        for bin_idx in range(len(six_hour_hist_bins) - 1):
            if label >= six_hour_hist_bins[bin_idx] and label < six_hour_hist_bins[bin_idx + 1]:
                new_labels.append(bin_idx)
                break

    new_labels = np.asarray(new_labels, dtype=np.int64)

    # --- Doing a 10 to 1 (non-random) split ---
    split_idx = int(len(data_features) * 9 / 10)

    # --- Extract elements ---
    val_features = data_features[split_idx:]
    val_labels = new_labels[split_idx:]
    train_features = data_features[:split_idx]
    train_labels = new_labels[:split_idx]

    # --- Return the bins as the new label fields ---
    return train_features, train_labels, val_features, val_labels, idx_to_field_data, six_hour_hist_bins


def process_hdw_no_context_task(idx_to_field_data, idx_to_field_labels, data_features, labels):
    """
    No-context dataset which asks network to regress future ETH prices, given
    a snapshot of current prices.
    
    Also cuts the last three columns (BTC prices in the future) from data_features.
    """
    
    # --- Cuts BTC prices in the future from features ---
    data_features = np.transpose(np.transpose(data_features)[:-3])
    idx_to_field_data = idx_to_field_data[:-3]
    
    # --- Doing a 10 to 1 (non-random) split ---
    split_idx = int(len(data_features) * 9 / 10)
    
    # --- Extract elements ---
    val_features = data_features[split_idx:]
    val_labels = labels[split_idx:]
    train_features = data_features[:split_idx]
    train_labels = labels[:split_idx]
    
    return train_features, train_labels, val_features, val_labels, idx_to_field_data, idx_to_field_labels


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
    
    return train_features, train_labels, val_features, val_labels, idx_to_field_data, idx_to_field_labels


def process_save_data(train_features, 
                      train_labels, 
                      val_features, 
                      val_labels, 
                      idx_to_field_data, 
                      idx_to_field_labels, 
                      task_type):
    
    # --- Save to files ---
    train_features_save_path = constants.get_dataset_filepath(
        task_type, constants.TRAIN_DATASET_FILENAME, create=True)
    train_labels_save_path = constants.get_dataset_filepath(
        task_type, constants.TRAIN_LABELS_FILENAME, create=True)
    val_features_save_path = constants.get_dataset_filepath(
        task_type, constants.VAL_DATASET_FILENAME, create=True)
    val_labels_save_path = constants.get_dataset_filepath(
        task_type, constants.VAL_LABELS_FILENAME, create=True)
    
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
    features_to_indices_save_path = constants.get_dataset_filepath(
        task_type, constants.FEATURES_TO_IDX_FILENAME, create=True)
    print(f"Saving to {features_to_indices_save_path}...")
    with open(features_to_indices_save_path, "w") as f:
        json.dump(features_to_idx, f)
    
    labels_to_indices_save_path = constants.get_dataset_filepath(
        task_type, constants.LABELS_TO_IDX_FILENAME, create=True)
    print(f"Saving to {labels_to_indices_save_path}...")
    with open(labels_to_indices_save_path, "w") as f:
        json.dump(labels_to_idx, f)

    print("All done!")


if __name__ == "__main__":

    # --- Process CSV ---
    process_csv()
    
    # --- For consistency ---
    np.random.seed(RANDOM_SEED)
    
    # # --- Create folders ---
    # save_dir = os.path.join(constants.DATASET_DIR, constants.HDW_NO_CONTEXT_TASK)
    # if not os.path.isdir(save_dir):
    #     os.makedirs(save_dir)
    
    # --- Read data ---
    idx_to_field_data, idx_to_field_labels, data_features, labels = read_data_from_csv()
    
    # # --- Grab features/labels ---
    # train_features, train_labels, val_features, val_labels, idx_to_field_data, idx_to_field_labels = \
    # process_playground_task(idx_to_field_data, idx_to_field_labels, data_features, labels)

    # # --- Save data to file ---
    # process_save_data(train_features, 
    #                   train_labels, 
    #                   val_features, 
    #                   val_labels, 
    #                   idx_to_field_data,
    #                   idx_to_field_labels,
    #                   task_type=constants.PLAYGROUND_TASK)