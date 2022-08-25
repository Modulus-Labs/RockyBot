export type RockyStatusDocument = {
    current_usdc: string,
    current_weth: string,
    net_worth: string,
    timestamp: Date
}

export type RockyTradesDocument = {
    action_type: "BUY" | "SELL" | "HOLD",
    amount: string,
    timestamp: Date
}

export type RockyDonationsDocument = {
    amount: string,
    contributor_address: string,
    timestamp: Date,
    token: "USDC" | "WETH"
}