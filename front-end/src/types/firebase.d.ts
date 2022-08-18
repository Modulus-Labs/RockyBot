import { Timestamp } from "firebase/firestore";

export type RockyStatusDocument = {
    current_usdc: string,
    current_weth: string,
    net_worth: string,
    timestamp: Timestamp
}

export type RockyTradesDocument = {
    action_type: "BUY" | "SELL",
    amount: string,
    timestamp: Timestamp
}

export type RockyDonationsDocument = {
    amount: string,
    contributor_address: string,
    timestamp: Timestamp,
    token: "USDC" | "WETH"
}