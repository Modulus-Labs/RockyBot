// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';
import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';

enum TradeInstruction {
    BUY,
    SELL
}

interface IStarknetCore {
    /**
      Sends a message to an L2 contract.

      Returns the hash of the message.
    */
    function sendMessageToL2(
        uint256 toAddress,
        uint256 selector,
        uint256[] calldata payload
    ) external returns (bytes32);

    /**
      Consumes a message that was sent from an L2 contract.

      Returns the hash of the message.
    */
    function consumeMessageFromL2(uint256 fromAddress, uint256[] calldata payload)
        external
        returns (bytes32);
}


contract RockafellerBotL1 is Ownable {
    ISwapRouter public immutable swapRouter;
    IStarknetCore public immutable starknetCore;
    IERC20 public immutable token;

    uint256 public l2ContractAddress;

    uint public currentAmountUSDC;
    uint public currentAmountWEth;

    address public constant WETH9 = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;

    //mainnet
    //address public constant USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
    //goerli
    address public constant USDC = 0x07865c6E87B9F70255377e024ace6630C1Eaa37F;

    uint24 public constant poolFee = 3000;

    event receivedFunds(address sender, uint amount); //events that will be picked up by firebase
    event executedTrade(TradeInstruction instruction, uint amount);

    constructor(uint256 _l2ContractAddress, ISwapRouter _swapRouter, IStarknetCore _starknetCore, IERC20 _token) payable {
        swapRouter = _swapRouter;
        starknetCore = _starknetCore;

        l2ContractAddress = _l2ContractAddress;

        token = _token;

        //TransferHelper.safeTransferFrom(USDC, msg.sender, address(this), _amount);

        currentAmountUSDC = 0;
        currentAmountWEth = 0;
    }

    function updateL2Contract(uint256 _l2ContractAddress) public onlyOwner {
        l2ContractAddress = _l2ContractAddress;
    }

    function withdrawl(uint amount) public onlyOwner {
        token.transfer(msg.sender, amount);
        currentAmountUSDC -= amount;
        //TransferHelper.safeTransferFrom(USDC, address(this), msg.sender, amount);
    }

    function receiveInstruction(TradeInstruction instruction, uint amount) public onlyOwner {
        //add checks to make sure only L2 can call this
        uint256[] memory payload = new uint256[](2);
        payload[0] = instruction == TradeInstruction.BUY ? 0 : 1;
        payload[1] = amount;

        starknetCore.consumeMessageFromL2(l2ContractAddress, payload);

        if(instruction == TradeInstruction.BUY) {
            buyWEth(amount);
        }
        else if(instruction == TradeInstruction.SELL) {
            sellWEth(amount);
        }
        //check what the instruction is and call the relevant function
        emit executedTrade(instruction, amount);
    }

    function buyWEth(uint amount) private {
        //initiate swap on uniswap USDC -> WEth
        // Approve the router to spend DAI.
        TransferHelper.safeApprove(USDC, address(swapRouter), amount);

        ISwapRouter.ExactInputSingleParams memory params =
            ISwapRouter.ExactInputSingleParams({
                tokenIn: USDC,
                tokenOut: WETH9,
                fee: poolFee,
                recipient: msg.sender,
                deadline: block.timestamp,
                amountIn: amount,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });
        currentAmountUSDC -= amount;
        currentAmountWEth += swapRouter.exactInputSingle(params);
    }

    function sellWEth(uint amount) private {
        //initiate swap on uniswap WEth -> USDC
        // Approve the router to spend DAI.

        TransferHelper.safeApprove(USDC, address(swapRouter), amount);

        ISwapRouter.ExactInputSingleParams memory params =
            ISwapRouter.ExactInputSingleParams({
                tokenIn: WETH9,
                tokenOut: USDC,
                fee: poolFee,
                recipient: msg.sender,
                deadline: block.timestamp,
                amountIn: amount,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });
        currentAmountWEth -= amount;
        currentAmountUSDC += swapRouter.exactInputSingle(params);

    }

    function addFunds(uint amount) public payable {
        token.transferFrom(msg.sender, address(this), amount);
        currentAmountUSDC += amount;
        //TransferHelper.safeTransferFrom(USDC, msg.sender, address(this), amount);
        emit receivedFunds(msg.sender, amount);
    }
}
