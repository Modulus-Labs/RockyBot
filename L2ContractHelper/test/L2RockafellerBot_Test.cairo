# %lang starknet
%builtins output range_check

from starkware.cairo.common.cairo_builtins import HashBuiltin
# from starkware.starknet.common.messages import send_message_to_l1
from starkware.cairo.common.math_cmp import is_le
# from starkware.starknet.common.syscalls import get_caller_address
from starkware.cairo.common.alloc import alloc

from starkware.cairo.common.serialize import serialize_word

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

# const L1_CONTRACT_ADDRESS = (
#     0x2Db8c2615db39a5eD8750B87aC8F217485BE11EC)

# @storage_var
# func owner() -> (owner_address: felt):
# end

# @storage_var
# func usdc() -> (usdc_amount: felt):
# end

# @storage_var
# func weth() -> (weth_amount: felt):
# end


# @constructor
# func constructor{
#     syscall_ptr : felt*,
#     pedersen_ptr : HashBuiltin*,
#     range_check_ptr,
# }(starting_amount: felt):
#     let (_owner) = get_caller_address()
#     owner.write(value=_owner)
#     usdc.write(value=starting_amount)
#     weth.write(value=0)
#     return ()
# end

func main{output_ptr: felt*, range_check_ptr}():
    calculateStrategy(1000000000000000000, 300000000, 606826000)
    return ()
end

# @external
func calculateStrategy{output_ptr: felt*,
    #syscall_ptr : felt*,
    #pedersen_ptr : HashBuiltin*,
    range_check_ptr,
}(remaining_weth: felt, remaining_usdc: felt, weth_price_ratio: felt) -> (strategy: felt, amount: felt):
    alloc_locals
    let _owner = 0x7881018A79686bF07b1476864215E070D1Fe33C5
    let msg_sender = 0x7881018A79686bF07b1476864215E070D1Fe33C5
    assert _owner = msg_sender
    let (weights_len, weights) = ryansFunc()
    let (temp) = getMaxWeight(weights_len, weights, 0, 0)
    #local max_index: felt
    #assert max_index = temp
    let (max_index) = alloc()
    assert [max_index] = temp
    serialize_word([max_index])
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

    let (message_payload: felt*) = alloc()
    assert message_payload[0] = [strategy]
    assert message_payload[1] = [amount]
    # send_message_to_l1(
    #     to_address=L1_CONTRACT_ADDRESS,
    #     payload_size=2,
    #     payload=message_payload,
    # )
    serialize_word([strategy])
    serialize_word([amount])
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

func ryansFunc{#syscall_ptr: felt*,
    #pedersen_ptr : HashBuiltin*,
    range_check_ptr,
}() -> (weights_len: felt, weights: felt*):
    let (return_vector : felt*) = alloc()
    assert return_vector[PRICE_DOWN_MAX] = 12
    assert return_vector[PRICE_DOWN_EXTREME] = 20
    assert return_vector[PRICE_DOWN_LARGE] = 10
    assert return_vector[PRICE_DOWN_MID] = 9
    assert return_vector[PRICE_DOWN_SMALL] = 8
    assert return_vector[PRICE_DOWN_MIN] = 7
    assert return_vector[PRICE_UP_MIN]  = 6
    assert return_vector[PRICE_UP_SMALL] = 5
    assert return_vector[PRICE_UP_MID] = 4
    assert return_vector[PRICE_UP_LARGE] = 3
    assert return_vector[PRICE_UP_EXTREME] = 2
    assert return_vector[PRICE_UP_MAX] = 30
    return (weights_len=12, weights=return_vector)
end