import argparse
import requests

import sys
import datetime
import os
sys.path.append('../pytorch-model')

# Import the constants
from constants import API_URL, TIME_START, EXCHANGE
from dotenv import load_dotenv

# TODO: The asset data needs to come from the DEX, not from a CEX
# Get the data from the API
def get_asset_data(asset_name_one="", asset_name_two=""):
    
    # Throw an error if the user doesn't provide two asset names
    if asset_name_one == "" or asset_name_two == "":
        raise ValueError("Please provide two asset names")
    
    # Read the API key from the environment variable    
    API_KEY = os.environ.get('COINAPI_KEY')
    
    # Start with the first timestamp
    time = TIME_START

    # TODO: Likely, this will run out requests, so for that you should probably get a PAID COINAPI_KEY
    while True:
        # Get the data from the API
        url = (API_URL + f"{EXCHANGE}_{asset_name_one}_{asset_name_two}"
        f"/history?apikey={API_KEY}&period_id=30MIN&time_start={time}")
        print(url)

        # Make the request
        r = requests.get(url)

        # Check if the request was successful
        if r.status_code != 200:
            raise ValueError(f"Request failed with status code {r.status_code}")
        
        # If there is no csv file, create one
        if not os.path.isfile(f"{asset_name_one}_{asset_name_two}_pricedata.csv"):
            with open(f"{asset_name_one}_{asset_name_two}_pricedata.csv", "w") as f:
                f.write("time_period_start,time_period_end,time_open,time_close,price_open,price_high,price_low,price_close,volume_traded,trades_count\n")
        
        # Write the data to the csv file
        with open(f"{asset_name_one}_{asset_name_two}_pricedata.csv", "a") as f:
            for line in r.json():
                f.write(f"{line['time_period_start']},{line['time_period_end']},{line['time_open']},{line['time_close']},{line['price_open']},{line['price_high']},{line['price_low']},{line['price_close']},{line['volume_traded']},{line['trades_count']}\n")

        # If the request returned an empty list, then we have reached the end of the data, so let's pick the next time
        if r.json() == []:
            last_record_time = time
            time_obj = datetime.datetime.fromisoformat(last_record_time.replace('Z', '+00:00'))
            new_time_obj = time_obj + datetime.timedelta(minutes=30) # Add 30 minutes
            time = new_time_obj.isoformat().replace('+00:00', 'Z') # Convert back to string
        else:
            # Get the last record's time
            time = r.json()[-1]['time_period_end']

if __name__ == '__main__':
    # Load the environment variables§
    load_dotenv()

    # Read the terminal
    parser = argparse.ArgumentParser(description='Get asset data from the API')
    parser.add_argument('--asset_name_one', type=str, help='The first asset name')
    parser.add_argument('--asset_name_two', type=str, help='The second asset name')
    args = parser.parse_args()

    # Get the data
    get_asset_data(args.asset_name_one, args.asset_name_two)
