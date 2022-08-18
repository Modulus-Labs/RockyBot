export interface ActionContributionListData {
  actionText: string;
  dataText: string;
  isAction: boolean;
  timestamp: Date;
}

export interface RockyGraphData {
  timestamp: Date,
  WETH: number,
  USDC: number,
  netWorthUSDC: number,
  displayTimestamp: string,
}

export const dummyActionText: ActionContributionListData[] = [
  {
    actionText: "Rocky buys 0.02 ETH",
    dataText: "1h",
    isAction: true,
    timestamp: new Date(),
  },
  {
    actionText: "Rocky buys 0.02 ETH",
    dataText: "1h",
    isAction: true,
    timestamp: new Date(),
  },
  {
    actionText: "Rocky buys 0.02 ETH",
    dataText: "1h",
    isAction: true,
    timestamp: new Date(),
  },
  {
    actionText: "Rocky buys 0.02 ETH",
    dataText: "1h",
    isAction: true,
    timestamp: new Date(),
  },
  {
    actionText: "Rocky buys 0.02 ETH",
    dataText: "1h",
    isAction: true,
    timestamp: new Date(),
  },
  {
    actionText: "Rocky buys 0.02 ETH",
    dataText: "1h",
    isAction: true,
    timestamp: new Date(),
  },
  {
    actionText: "Rocky buys 0.02 ETH",
    dataText: "1h",
    isAction: true,
    timestamp: new Date(),
  },
];

export const dummyContributionText: ActionContributionListData[] = [
  {
    actionText: "nayroac.eth",
    dataText: "0.002 ETH",
    isAction: false,
    timestamp: new Date(),
  },
  {
    actionText: "nayroac.eth",
    dataText: "0.002 ETH",
    isAction: false,
    timestamp: new Date(),
  },
  {
    actionText: "nayroac.eth",
    dataText: "0.002 ETH",
    isAction: false,
    timestamp: new Date(),
  },
  {
    actionText: "nayroac.eth",
    dataText: "0.002 ETH",
    isAction: false,
    timestamp: new Date(),
  },
  {
    actionText: "nayroac.eth",
    dataText: "0.002 ETH",
    isAction: false,
    timestamp: new Date(),
  },
  {
    actionText: "nayroac.eth",
    dataText: "0.002 ETH",
    isAction: false,
    timestamp: new Date(),
  },
]

function decimalRound(d: number): number {
  return Math.round(d * 100) / 100.0;
}

let data05 = [];
let curUsdcTotal = 500.00;
let curEthTotal = 0.4;
let usdcEthExchangeRate = 1800;
let curNetWorthUsdc = curUsdcTotal + curEthTotal * usdcEthExchangeRate;
let curDate = new Date();
for (let i: number = 0; i < 100; ++i) {

  // --- Enter last entry ---
  const newDataEntry = {
    timestamp: curDate.toISOString(),
    ETH: decimalRound(curEthTotal * usdcEthExchangeRate),
    net_worth_USDC: decimalRound(curNetWorthUsdc)
  };
  data05.push(newDataEntry);

  // --- Compute amount to trade ---
  const exchangeAmtUsdc = Math.random() * 200 - 100;

  // --- Exchanging USDC --> ETH ---
  if (exchangeAmtUsdc > 0 && exchangeAmtUsdc <= curUsdcTotal) {
    curUsdcTotal -= exchangeAmtUsdc;
    curEthTotal += exchangeAmtUsdc * (1 / usdcEthExchangeRate);
  }

  // --- Exchanging ETH --> USDC ---
  else if (exchangeAmtUsdc < 0 && -exchangeAmtUsdc * (1 / usdcEthExchangeRate) <= curEthTotal) {
    curEthTotal += exchangeAmtUsdc * (1 / usdcEthExchangeRate);
    curUsdcTotal += -exchangeAmtUsdc;
  }

  // --- Move the exchange rate slightly ---
  usdcEthExchangeRate += Math.random() * 40 - 20;

  // --- Compute the new total net worth ---
  curNetWorthUsdc = curUsdcTotal + usdcEthExchangeRate * curEthTotal;

  // --- Add an hour to the timestamp ---
  curDate.setTime(curDate.getTime() + (60 * 60 * 1000));
}

export const data06 = data05;