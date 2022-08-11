import json
import subprocess
import os
import boto3
TEST_CONTRACT_8_ADDR = "0x03850a70be09eecac8b291112c0b28cf0799de385a2c22ad409761b750c70ef5"
TEST_CONTRACT_REAL_ADDR = "0x067ac66e2fe22627bb900cc61152b7db3a7ec31d82d1577bfc54790341899921"
ABI_8_FILEPATH = "./ryan_test_contract_8_deploy_abi.json"
ABI_REAL_FILEPATH = "../L2ContractHelper/compiled/contract_abi.json"
SCALE_FACTOR = 1e8
LOAD_DIR = 'jsonModelData'


def read_most_recent_data_file():
    """
    Reads most recent match file (sorts by timestamp).
    Assumes at least one valid file exists in `jsonPrices/` dir.
    """
    client = boto3.client('s3')
    #print(os.environ['environment'])
    env = "dev"
    details_raw = client.get_object(
        Bucket='rocky-modeldatabucket',
        Key=os.path.join(env, 'current.json')
        # Key=os.environ['environment'] + "/current.json"
    )
    #print(details_raw)
    details = json.load(details_raw['Body'])
    file_key = os.path.join(details['pathPrefix'], details['fileName'])
    # file_key = f"{details['pathPrefix']}/{LOAD_DIR}/{details['fileName']}"
    f = client.get_object(Bucket='rocky-modeldatabucket', Key=file_key)['Body']
    return json.load(f)


def get_cairo_command(contract_addr,
                      abi_filepath,
                      fn_name,
                      args=None,
                      invocation_type="call"):
    ret = f"starknet {invocation_type} --address {contract_addr} --abi {abi_filepath} --function {fn_name} "
    if args is not None:
        ret += f"--inputs {args}"
    return ret

def get_flattened_arr(arr):
    return " ".join(str(int(x)) for x in list(arr))

def test_trading_bot_three_layer_nn(a_weights,
                                    a_bias,
                                    b_weights,
                                    b_bias,
                                    c_weights,
                                    c_bias,
                                    x,
                                    price_ratio,
                                    remaining_usdc,
                                    remaining_weth,
                                    invoke=True):
    """
    x_data_ptr_len : felt,
    x_data_ptr : felt*,
    a_num_rows : felt,
    a_num_cols : felt,
    a_data_ptr_len : felt,
    a_data_ptr : felt*,
    a_bias_ptr_len : felt,
    a_bias_ptr : felt*,
    b_num_rows : felt,
    b_num_cols : felt,
    b_data_ptr_len : felt,
    b_data_ptr : felt*,
    b_bias_ptr_len : felt,
    b_bias_ptr : felt*,
    c_num_rows : felt,
    c_num_cols : felt,
    c_data_ptr_len : felt,
    c_data_ptr : felt*,
    c_bias_ptr_len : felt,
    c_bias_ptr : felt*,
    scale_factor : felt,
    """
    # --- Parameter for calling the matvmul function ---
    input_str = f"{remaining_weth} {remaining_usdc} {price_ratio} "
    # --- Construct input data ---
    input_str += f"36 "
    input_str += get_flattened_arr(x) + " "
    # --- Construct a ---
    input_str += f"128 36 {128 * 36} "
    input_str += get_flattened_arr(a_weights) + " "
    # --- Construct a bias ---
    input_str += f"128 "
    input_str += get_flattened_arr(a_bias) + " "
    # --- Construct b ---
    input_str += f"64 128 {64 * 128} "
    input_str += get_flattened_arr(b_weights) + " "
    # --- Construct b bias ---
    input_str += f"64 "
    input_str += get_flattened_arr(b_bias) + " "
    # --- Construct c ---
    input_str += f"12 64 {12 * 64} "
    input_str += get_flattened_arr(c_weights) + " "
    # --- Construct c bias ---
    input_str += f"12 "
    input_str += get_flattened_arr(c_bias) + " "
    # --- Scale factor ---
    input_str += str(int(SCALE_FACTOR))
    # --- Construct cairo command string ---
    cairo_command = get_cairo_command(
        contract_addr=TEST_CONTRACT_REAL_ADDR,
        abi_filepath=ABI_REAL_FILEPATH,
        fn_name="calculateStrategy",
        args=input_str,
        invocation_type="invoke" if invoke else "call")
    #print(f"Executing command: {cairo_command}")
    # --- Execute ---
    result = subprocess.run(cairo_command.split(" "), capture_output=True)
    print(result)
if __name__ == "__main__":
    # test_matvmul()
    # test_two_layer_nn()
    model_data = read_most_recent_data_file()
    #print(model_data['data'])
    # generate_params_json_trading_bot_three_layer_nn(a_weights, a_bias,
    #                                                 b_weights, b_bias,
    #                                                 c_weights, c_bias)
    test_trading_bot_three_layer_nn(model_data['a_data_ptr'],
                                    model_data['a_bias_ptr'],
                                    model_data['b_data_ptr'],
                                    model_data['b_bias_ptr'],
                                    model_data['c_data_ptr'],
                                    model_data['c_bias_ptr'],
                                    model_data['data'],
                                    model_data['price_ratio'],
                                    model_data['remaining_usdc'],
                                    model_data['remaining_weth'],
                                    invoke=True)
    # a_weights, a_bias, b_weights, b_bias, mnist_data = load_mist_torch_weights(
    # )
    # test_two_layer_nn(a_weights,
    #                   a_bias,
    #                   b_weights,
    #                   b_bias,
    #                   mnist_data,
    #                   invoke=False)