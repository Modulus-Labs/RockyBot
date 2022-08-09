%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.starknet.common.messages import send_message_to_l1
from starkware.cairo.common.math_cmp import is_le
from starkware.starknet.common.syscalls import get_caller_address
from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.registers import get_fp_and_pc
from starkware.cairo.common.serialize import serialize_word
from starkware.cairo.common.math import assert_nn_le
from starkware.cairo.common.math import signed_div_rem

const PRICE_DOWN_MAX = 0
const PRICE_DOWN_EXTREME = 1
const PRICE_DOWN_LARGE = 2
const PRICE_DOWN_MID = 3
const PRICE_DOWN_SMALL = 4
const PRICE_DOWN_MIN = 5
const PRICE_UP_MIN = 6
const PRICE_UP_SMALL = 7
const PRICE_UP_MID = 8
const PRICE_UP_LARGE = 9
const PRICE_UP_EXTREME = 10
const PRICE_UP_MAX = 11

const BUY_STRATEGY = 0
const SELL_STRATEGY = 1
const NULL_STRATEGY = 2

const WETH_DECIMALS = 18
const USDC_DECIMALS = 6

const L1_CONTRACT_ADDRESS = (
    0x2Db8c2615db39a5eD8750B87aC8F217485BE11EC)

@storage_var
func owner() -> (owner_address: felt):
end

@event
func strategy_sent_to_l2(strategy: felt, amount: felt):
end

@constructor
func constructor{
    syscall_ptr : felt*,
    pedersen_ptr : HashBuiltin*,
    range_check_ptr,
}():
    let (_owner) = get_caller_address()
    owner.write(value=_owner)
    return ()
end

@external
func calculateStrategy{
    syscall_ptr : felt*,
    pedersen_ptr : HashBuiltin*,
    range_check_ptr,
}(remaining_weth: felt, remaining_usdc: felt, weth_price_ratio: felt, x_data_ptr_len : felt,
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
    scale_factor : felt,) -> (strategy: felt, amount: felt):
    alloc_locals
    let (_owner) = owner.read()
    let (msg_sender) = get_caller_address()
    assert _owner = msg_sender
    let (weights_len, weights) = three_layer_nn(x_data_ptr_len, x_data_ptr, a_num_rows, a_num_cols, a_data_ptr_len, a_data_ptr, 
        a_bias_ptr_len, a_bias_ptr, b_num_rows, b_num_cols, b_data_ptr_len, b_data_ptr, b_bias_ptr_len, b_bias_ptr,
        c_num_rows, c_num_cols, c_data_ptr_len, c_data_ptr, c_bias_ptr_len, c_bias_ptr, scale_factor)
    let (temp) = getMaxWeight(weights_len, weights, 0, 0)
    #local max_index: felt
    #assert max_index = temp
    let (max_index) = alloc()
    assert [max_index] = temp
    let (amount: felt*) = alloc()
    let (strategy: felt*) = alloc()

    let amount_usdc_max = 200000000
    let amount_usdc_extreme = 100000000
    let amount_usdc_large = 50000000

    let amount_weth_max = amount_usdc_max * weth_price_ratio
    let amount_weth_extreme = amount_usdc_extreme * weth_price_ratio
    let amount_weth_large = amount_usdc_large * weth_price_ratio

    let (is_overflow_weth_max) = is_le(remaining_weth, amount_weth_max)
    let (is_overflow_weth_extreme) = is_le(remaining_weth, amount_weth_extreme)
    let (is_overflow_weth_large) = is_le(remaining_weth, amount_weth_large)

    let (is_overflow_usdc_large) = is_le(remaining_usdc, amount_usdc_large)
    let (is_overflow_usdc_extreme) = is_le(remaining_usdc, amount_usdc_extreme)
    let (is_overflow_usdc_max) = is_le(remaining_usdc, amount_usdc_max)

    if [max_index] == PRICE_DOWN_MAX:
        if is_overflow_weth_max == 1:
            assert [amount] = remaining_weth
        else:
            assert [amount] = amount_weth_max
        end
        assert [strategy] = SELL_STRATEGY
    end
    if [max_index] == PRICE_DOWN_EXTREME:
        if is_overflow_weth_extreme == 1:
            assert [amount] = remaining_weth
        else:
            assert [amount] = amount_weth_extreme
        end
        assert [strategy] = SELL_STRATEGY
    end
    if [max_index] == PRICE_DOWN_LARGE:
        if is_overflow_weth_large == 1:
            assert [amount] = remaining_weth
        else:
            assert [amount] = amount_weth_large
        end
        assert [strategy] = SELL_STRATEGY
    end
    if [max_index] == PRICE_DOWN_MID:
       # assert [strategy] = SELL_STRATEGY
       return (strategy=NULL_STRATEGY, amount=0)
    end
    if [max_index] == PRICE_DOWN_SMALL:
        #assert [strategy] = SELL_STRATEGY
        return (strategy=NULL_STRATEGY, amount=0)
    end
    if [max_index] == PRICE_DOWN_MIN:
        #assert [strategy] = SELL_STRATEGY
        return (strategy=NULL_STRATEGY, amount=0)
    end
    if [max_index] == PRICE_UP_MIN:
        #assert [strategy] = BUY_STRATEGY
        return (strategy=NULL_STRATEGY, amount=0)
    end
    if [max_index] == PRICE_UP_SMALL:
        #assert [strategy] = BUY_STRATEGY
        return (strategy=NULL_STRATEGY, amount=0)
    end
    if [max_index] == PRICE_UP_MID:
        #assert [strategy] = BUY_STRATEGY
        return (strategy=NULL_STRATEGY, amount=0)
    end
    if [max_index] == PRICE_UP_LARGE:
        if is_overflow_usdc_large == 1:
            assert [amount] = remaining_usdc
        else:
            assert [amount] = amount_usdc_large
        end
        assert [strategy] = BUY_STRATEGY
    end
    if [max_index] == PRICE_UP_EXTREME:
        if is_overflow_usdc_extreme == 1:
            assert [amount] = remaining_usdc
        else:
            assert [amount] = amount_usdc_extreme
        end
        assert [strategy] = BUY_STRATEGY
    end
    if [max_index] == PRICE_UP_MAX:
        if is_overflow_usdc_max == 1:
            assert [amount] = remaining_usdc
        else:
            assert [amount] = amount_usdc_max
        end
        assert [strategy] = BUY_STRATEGY
    end

    let (message_payload : felt*) = alloc()
    assert message_payload[0] = [strategy]
    assert message_payload[1] = [amount]
    send_message_to_l1(
        to_address=L1_CONTRACT_ADDRESS,
        payload_size=2,
        payload=message_payload,
    )
    strategy_sent_to_l2.emit(strategy=[strategy], amount=[amount])
    return (strategy=[strategy], amount=[amount])
end

func getMaxWeight{range_check_ptr}(weights_len: felt, weights: felt*, curr_check: felt, curr_max_index: felt) -> (max_index: felt):
    if curr_check == weights_len:
        return (max_index=curr_max_index)
    else:
        let (is_max) = is_le(weights[curr_max_index], weights[curr_check])
        if is_max == 1:
            return getMaxWeight(weights_len, weights, curr_check+1, curr_check)
        end
        return getMaxWeight(weights_len, weights, curr_check+1, curr_max_index)
    end
end

func ryansFunc{syscall_ptr: felt*,
    range_check_ptr,
}() -> (weights_len: felt, weights: felt*):
    let (return_vector : felt*) = alloc()
    assert return_vector[PRICE_DOWN_MAX] = 0
    assert return_vector[PRICE_DOWN_EXTREME] = 0
    assert return_vector[PRICE_DOWN_LARGE] = 0
    assert return_vector[PRICE_DOWN_MID] = 0
    assert return_vector[PRICE_DOWN_SMALL] = 0
    assert return_vector[PRICE_DOWN_MIN] = 0
    assert return_vector[PRICE_UP_MIN]  = 0
    assert return_vector[PRICE_UP_SMALL] = 0
    assert return_vector[PRICE_UP_MID] = 0
    assert return_vector[PRICE_UP_LARGE] = 0
    assert return_vector[PRICE_UP_EXTREME] = 0
    assert return_vector[PRICE_UP_MAX] = 1
    return (weights_len=12, weights=return_vector)
end

# ------------------------------------ Data structs ------------------------------------
struct FlattenedMatrix:
    member data : felt*
    member num_rows : felt
    member num_cols : felt
end
struct BasicVector:
    member data_len : felt
    member data_ptr : felt*
end
# ------------------------------------ Relu ------------------------------------
# --- Performs a relu (taken directly from GuiltyGyoza; all credit to him!) ---
func _relu{range_check_ptr}(x : felt) -> (y : felt):
    let (bool_pos) = is_le(0, x)
    let y = bool_pos * x
    return (y=y)
end
# --- Recursive helper. Iterated index is `idx` ---
func _vector_relu{range_check_ptr}(x_vec : BasicVector, result_vec : BasicVector, idx : felt):
    if idx == x_vec.data_len:
        return ()
    end
    # --- Compute, assign, and recurse ---
    let (relu_x : felt) = _relu(x_vec.data_ptr[idx])
    assert result_vec.data_ptr[idx] = relu_x
    _vector_relu(x_vec=x_vec, result_vec=result_vec, idx=idx + 1)
    return ()
end
# --- Wrapper fn + sanitycheck ---
# @view
func vector_relu{range_check_ptr}(x_vec : BasicVector, result_vec : BasicVector):
    # --- Sanitycheck ---
    assert x_vec.data_len = result_vec.data_len
    # --- Kick off the recursion ---
    _vector_relu(x_vec=x_vec, result_vec=result_vec, idx=0)
    return ()
end
# ------------------------------------ Matvmul ------------------------------------
# --- Computes dot product of an entire matrix row (dot) vector ---
func compute_matrow_dot_vector(
    flattened_matrix : FlattenedMatrix, vector : BasicVector, row : felt, col : felt
) -> (result : felt):
    alloc_locals
    # --- Reached end of matrix ---
    if col == flattened_matrix.num_cols:
        return (0)
    end
    # --- Single multiplication based on offset ---
    local matrix_weight = flattened_matrix.data[flattened_matrix.num_cols * row + col]
    local result = matrix_weight * vector.data_ptr[col]
    # --- Recurse over rest of row/vector ---
    let (rest) = compute_matrow_dot_vector(
        flattened_matrix=flattened_matrix, vector=vector, row=row, col=col + 1
    )
    # --- Result is the sum ---
    return (result + rest)
end
func compute_matvmul_by_row(
    flattened_matrix : FlattenedMatrix,
    vector : BasicVector,
    result_vector : BasicVector,
    row : felt,
):
    # --- End of matrix ---
    if row == flattened_matrix.num_rows:
        return ()
    end
    # --- Compute row dot product ---
    let (row_result) = compute_matrow_dot_vector(
        flattened_matrix=flattened_matrix, vector=vector, row=row, col=0
    )
    # --- Perform assignment with offset and recurse ---
    assert result_vector.data_ptr[row] = row_result
    compute_matvmul_by_row(
        flattened_matrix=flattened_matrix, vector=vector, result_vector=result_vector, row=row + 1
    )
    return ()
end
func compute_matvmul(
    flattened_matrix : FlattenedMatrix, vector : BasicVector, result_vector : BasicVector
):
    # --- Multiply first row by vector. Write result into first result_vector slot. ---
    # --- Recurse on row number until it equals m ---
    compute_matvmul_by_row(
        flattened_matrix=flattened_matrix, vector=vector, result_vector=result_vector, row=0
    )
    return ()
end
# ------------------------------------ Vector add ------------------------------------
# --- Adds two vectors together and stores the result ---
func vec_add{range_check_ptr}(v1 : BasicVector, v2 : BasicVector, result : BasicVector):
    # --- Sanitycheck ---
    assert v1.data_len = v2.data_len
    # --- Base: Just return ---
    if v1.data_len == 0:
        return ()
    end
    # --- Call internal add fn ---
    _vec_add(v1=v1, v2=v2, result=result, idx=0)
    return ()
end
# --- Iterating over idx ---
func _vec_add{range_check_ptr}(
    v1 : BasicVector, v2 : BasicVector, result : BasicVector, idx : felt
):
    if idx == result.data_len:
        return ()
    end
    # --- Do assignment, then recurse ---
    assert result.data_ptr[idx] = v1.data_ptr[idx] + v2.data_ptr[idx]
    _vec_add(v1=v1, v2=v2, result=result, idx=idx + 1)
    return ()
end
# ------------------------------------ Scale vector ------------------------------------
# --- Helper ---
func _scale_vector{range_check_ptr}(
    v : BasicVector, scaled_v : BasicVector, scale_factor : felt, idx : felt
):
    if idx == v.data_len:
        return ()
    end
    # --- 10^24 ~ 2^80 ---
    # Note that RC_BOUND = 2**128
    let (quotient : felt, remainder : felt) = signed_div_rem(
        value=v.data_ptr[idx], div=scale_factor, bound=1000000000000000000000000
    )
    assert scaled_v.data_ptr[idx] = quotient
    _scale_vector(v=v, scaled_v=scaled_v, scale_factor=scale_factor, idx=idx + 1)
    return ()
end
# --- Wrapper ---
func scale_vector{range_check_ptr}(v : BasicVector, scaled_v : BasicVector, scale_factor : felt):
    # --- Sanitycheck ---
    assert v.data_len = scaled_v.data_len
    # --- Kick off recursive helper ---
    _scale_vector(v=v, scaled_v=scaled_v, scale_factor=scale_factor, idx=0)
    return ()
end
# ------------------------------------ Linear layer ------------------------------------
# --- Idea here is to ---
# a) couple the matmul and bias ops
# b) perform re-scaling (since we're multiplying)
# c) take care of intermediate reps
func linear1d_forward{range_check_ptr}(
    x : BasicVector,
    a : FlattenedMatrix,
    a_bias : BasicVector,
    out : BasicVector,
    scale_factor : felt,
):
    alloc_locals
    # --- Sanitycheck (TODO: Is this necessary?) ---
    assert a.num_cols = x.data_len
    assert a.num_rows = out.data_len
    assert a.num_rows = a_bias.data_len
    # --- Alloc intermediate repr ---
    let (post_weights : felt*) = alloc()
    local post_weights_vec : BasicVector = BasicVector(data_len=a.num_rows, data_ptr=post_weights)
    let (scaled_post_weights : felt*) = alloc()
    local scaled_post_weights_vec : BasicVector = BasicVector(data_len=a.num_rows, data_ptr=scaled_post_weights)
    # --- Perform matvmul ---
    compute_matvmul(flattened_matrix=a, vector=x, result_vector=post_weights_vec)
    # --- Perform re-scaling ---
    scale_vector(v=post_weights_vec, scaled_v=scaled_post_weights_vec, scale_factor=scale_factor)
    # --- Add bias ---
    vec_add(v1=scaled_post_weights_vec, v2=a_bias, result=out)
    return ()
end
# ------------------------------------ 3-layer nn ------------------------------------
# --- Parameters ---
# x: Input data vector
# a: First matrix
# b: Second matrix
# --- Architecture ---
# c @ relu(b @ relu(a @ x + a_bias) + b_bias) + c_bias
func three_layer_nn{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
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
) -> (output_data_ptr_len : felt, output_data_ptr : felt*):
    alloc_locals
    # --- Sanitycheck part 1: Matrix shapes ---
    assert a_data_ptr_len = a_num_rows * a_num_cols
    assert b_data_ptr_len = b_num_rows * b_num_cols
    assert c_data_ptr_len = c_num_rows * c_num_cols
    # --- Sanitycheck part 2: Dimensional analysis ---
    assert a_num_cols = x_data_ptr_len
    assert a_num_rows = b_num_cols
    assert b_num_rows = c_num_cols
    # --- Construct data structures ---
    local a_matrix : FlattenedMatrix = FlattenedMatrix(
        data=a_data_ptr, num_rows=a_num_rows, num_cols=a_num_cols
        )
    local a_bias : BasicVector = BasicVector(
        data_len=a_bias_ptr_len, data_ptr=a_bias_ptr
        )
    local b_matrix : FlattenedMatrix = FlattenedMatrix(
        data=b_data_ptr, num_rows=b_num_rows, num_cols=b_num_cols
        )
    local b_bias : BasicVector = BasicVector(
        data_len=b_bias_ptr_len, data_ptr=b_bias_ptr
        )
    local c_matrix : FlattenedMatrix = FlattenedMatrix(
        data=c_data_ptr, num_rows=c_num_rows, num_cols=c_num_cols
        )
    local c_bias : BasicVector = BasicVector(
        data_len=c_bias_ptr_len, data_ptr=c_bias_ptr
        )
    # --- Construct input/intermediate data structures ---
    let (x1_data_ptr : felt*) = alloc()  # After first linear layer
    let (x1_relu_data_ptr : felt*) = alloc()  # After first relu
    let (x2_data_ptr : felt*) = alloc()  # After second linear layer
    let (x2_relu_data_ptr : felt*) = alloc()  # After second relu
    let (x3_data_ptr : felt*) = alloc()  # After third linear layer
    local x : BasicVector = BasicVector(
        data_len=x_data_ptr_len, data_ptr=x_data_ptr
        )
    local x1 : BasicVector = BasicVector(
        data_len=a_num_rows, data_ptr=x1_data_ptr
        )
    local x1_relu : BasicVector = BasicVector(
        data_len=a_num_rows, data_ptr=x1_relu_data_ptr
        )
    local x2 : BasicVector = BasicVector(
        data_len=b_num_rows, data_ptr=x2_data_ptr
        )
    local x2_relu : BasicVector = BasicVector(
        data_len=b_num_rows, data_ptr=x2_relu_data_ptr
        )
    local x3 : BasicVector = BasicVector(
        data_len=c_num_rows, data_ptr=x3_data_ptr
        )
    # --- First layer ---
    linear1d_forward(x=x, a=a_matrix, a_bias=a_bias, out=x1, scale_factor=scale_factor)
    # --- Compute first relu ---
    vector_relu(x_vec=x1, result_vec=x1_relu)
    # -- Second layer: Matmul, then add bias ---
    linear1d_forward(x=x1_relu, a=b_matrix, a_bias=b_bias, out=x2, scale_factor=scale_factor)
    # --- Compute second relu ---
    vector_relu(x_vec=x2, result_vec=x2_relu)
    # --- Third layer: Matmul, then add bias ---
    linear1d_forward(x=x2_relu, a=c_matrix, a_bias=c_bias, out=x3, scale_factor=scale_factor)
    # --- Return output ---
    # TODO(ryancao): NOTE that the output is `scale_factor` times too large!
    # This doesn't matter for classification but may affect a regression
    # or other kind of model. Can either re-scale here or post-compute
    # (to preserve precision).
    return (output_data_ptr_len=x3.data_len, output_data_ptr=x3.data_ptr)
end