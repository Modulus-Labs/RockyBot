import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

const dummyActionText: ActionContributionListData[] = [
  {
    actionText: "Rocky buys 0.02 ETH",
    dataText: "1h"
  },
  {
    actionText: "Rocky buys 0.02 ETH",
    dataText: "1h"
  },
  {
    actionText: "Rocky buys 0.02 ETH",
    dataText: "1h"
  },
  {
    actionText: "Rocky buys 0.02 ETH",
    dataText: "1h"
  },
];

const dummyContributionText: ActionContributionListData[] = [
  {
    actionText: "nayroac.eth",
    dataText: "0.002 ETH"
  },
  {
    actionText: "nayroac.eth",
    dataText: "0.002 ETH"
  },
  {
    actionText: "nayroac.eth",
    dataText: "0.002 ETH"
  },
  {
    actionText: "nayroac.eth",
    dataText: "0.002 ETH"
  },
]

interface ActionContributionListData {
  actionText: string;
  dataText: string;
}

interface RenderActionContributionListProps {
  contributionActionList: ActionContributionListData[];
}

type donateType = "ETH" | "USDC";

const ActionContributionListItem = ({ actionText, dataText }: ActionContributionListData) => {
  return (
    <div>
      <p>
        {`${actionText} --> ${dataText}`}
      </p>
    </div>
  )
}

function App() {

  const [value, setValue] = useState<number>(1800.09);
  const [numDaysAlive, setNumDaysAlive] = useState<number>(3);
  const [actionListData, setActionListData] = useState<ActionContributionListData[]>(dummyActionText);
  const [contributionListData, setContributionListData] = useState<ActionContributionListData[]>(dummyContributionText);
  const [donateValue, setDonateValue] = useState<number>(0.01);
  const [donateType, setDonateType] = useState<donateType>("ETH");

  const RenderActionContributionList = (contributionActionListProps: RenderActionContributionListProps) => {
    return (
      <div>
        {contributionActionListProps.contributionActionList.map((listItem, _) => (
          <ActionContributionListItem actionText={listItem.actionText} dataText={listItem.dataText} />
        ))}
      </div>
    );
  }


  return (
    <div className="App">

      <div className="App-header" style={{ display: "flex", flex: 10 }}>

        {/* Left major section */}
        <div style={{ flex: 45, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          {/* Rockefeller Bot 0.1.0 title */}
          {/* petrona */}
          <p style={{ color: "black", fontSize: 50, margin: 5, fontFamily: "cursive" }}>
            {"Rockefeller Bot 0.1.0"}
          </p>
          {/* by Modulus Labs */}
          <p style={{ color: "grey", fontSize: 30, margin: 5 }}>
            {"by Modulus Labs"}
          </p>
          {/* Current value */}
          <p style={{ color: "black", fontSize: 40, margin: 5, fontFamily: "serif" }}>
            {`Current Value: `}<span style={{ color: "red" }}>{`$${value} (USDC + ETH)`}</span>
          </p>
        </div>

        {/* Right major section */}
        <div style={{ flex: 10, display: "flex", flexDirection: "column", alignItems: "center" }}>

          {/* Survived for _ days so far */}
          <div style={{ flex: 1, display: "flex", width: "fit-content", flexDirection: "column", borderStyle: "solid", borderRadius: 15, margin: 15, padding: 15, borderWidth: 1 }}>
            <p style={{ margin: 0 }}>
              {"Survived for:"}
            </p>
            <p style={{ margin: 0, fontSize: 40, color: "lightgreen" }}>
              {`${numDaysAlive} Days`}
            </p>
            <p style={{ margin: 0 }}>
              {"\n(so far)"}
            </p>
          </div>

          {/* Twitter button */}
          <div style={{ flex: 1, display: "flex", }}>
            {/* target=_blank opens link in new tab */}
            <a href="https://twitter.com/ModulusLabs" target="_blank">
              <button style={{ paddingLeft: 20, paddingRight: 20, marginBottom: 10, backgroundColor: "#222222", borderRadius: 10, borderColor: "#444444" }}>
                <p style={{ color: "#eeeeee" }}>
                  {"Twitter"}
                </p>
              </button>
            </a>
          </div>
        </div>

      </div>

      {/* For middle section */}
      <div className="Middle-section" style={{ display: "flex", flex: 20, flexDirection: "row" }}>
        {/* Rocky performance graph */}
        <div style={{ flex: 2, display: "flex", backgroundColor: "grey", borderStyle: "solid", borderRadius: 15, margin: 10, padding: 10, borderWidth: 1 }}>
          <p>
            {"TODO(ryancao)!"}
          </p>
        </div>

        {/* Rocky actions table */}
        <div style={{ flex: 1, display: "flex", backgroundColor: "purple", borderStyle: "solid", borderRadius: 15, margin: 10, padding: 10, borderWidth: 1 }}>
          <RenderActionContributionList contributionActionList={actionListData} />
        </div>

        {/* Contribution leaderboard */}
        <div style={{ flex: 1, display: "flex", backgroundColor: "lightgreen", borderStyle: "solid", borderRadius: 15, margin: 10, padding: 10, borderWidth: 1 }}>
          <RenderActionContributionList contributionActionList={contributionListData} />
        </div>
      </div>

      {/* For lower section */}
      <div className="Bottom-section" style={{ flex: 15, display: "flex", flexDirection: "row", backgroundColor: "lightgrey" }}>

        {/* Text block describing Rocky */}
        <div style={{ flex: 20, display: "flex", borderStyle: "solid", borderRadius: 15, margin: 10, padding: 20, borderWidth: 1, flexDirection: "column", backgroundColor: "white" }}>
          <span style={{ margin: 0, textAlign: "start", marginBottom: 10, fontSize: 30, fontFamily: "serif" }}>
            {"Welcome to "}
            <span style={{ fontWeight: "bold" }}>{"the world's first fully on-chain AI "}</span>
            {"trading bot!"}
          </span>
          <span style={{ margin: 0, textAlign: "start", marginBottom: 10, fontFamily: "serif", fontSize: 18 }}>
            {"The Rockefeller Bot (or Rocky) is the world's first \"fully on-chain\" AI trading bot. This means that Rocky is both "}
            <span style={{ fontStyle: "italic" }}>{"trustless and autonomous"}</span>
            {", making decisions by himself without a central authority, much like a DeFi protocol."}
          </span>
          <span style={{ margin: 0, textAlign: "start", marginBottom: 10, fontFamily: "serif", fontSize: 18 }}>
            {"Using zero-knowledge cryptography, proofs of Rocky's trading model — his brains, his model inputs — his diet, and his model weights — his mood, are all logged and validated on the Ethereum blockchain. This is possible thanks to StarkNet, Starkware's impressive L2 roll-up."}
          </span>
          <span style={{ margin: 0, textAlign: "start", fontFamily: "serif", fontSize: 18 }}>
            {"For more on how Rocky works, forking your own Rocky, as well as all things on-chain AI, check us out on "}
            <a href={"https://medium.com/@ModulusLabs"} target="_blank">{"Medium"}</a>
            {" or get in touch via Twitter or Discord!"}
          </span>
        </div>

        {/* Connect wallet / contribute */}
        <div style={{ flex: 1, display: "flex", backgroundColor: "white", borderStyle: "solid", borderRadius: 15, margin: 10, padding: 20, borderWidth: 1, flexDirection: "column", alignItems: "center" }}>

          {/* Connect wallet button */}
          <button
            style={{ flex: 25, borderRadius: 10, borderStyle: "solid", borderWidth: 1, borderColor: "black", backgroundColor: "transparent", cursor: "pointer", alignSelf: "stretch", marginBottom: 10 }}
            onClick={() => { }}>
            <span style={{ fontSize: 15, color: "black" }}>
              {"CONNECT WALLET"}
            </span>
          </button>

          {/* Donate this amount of {ETH, USDC} */}
          <div style={{ flex: 10, display: "flex", flexDirection: "row", alignSelf: "stretch", marginBottom: 10 }}>
            <input
              style={{ flex: 1, display: "flex" }}
              type="number"
              step="0.01"
              min={0}
              value={`${donateValue}`}
              onChange={(newAmt) => setDonateValue(parseFloat(newAmt.target.value))} />
            <select name="donateType" id="donateType" onSelect={() => { }}>
              <option value="ETH">{"ETH"}</option>
              <option value="USDC">{"USDC"}</option>
            </select>
          </div>

          {/* Donate button */}
          <button style={{ flex: 25, borderRadius: 10, borderStyle: "solid", borderWidth: 1, borderColor: "black", backgroundColor: "transparent", cursor: "pointer", paddingLeft: 20, paddingRight: 20, alignSelf: "stretch", marginBottom: 10 }}>
            <span style={{ fontSize: 15, color: "black" }}>
              {"DONATE"}
            </span>
          </button>

          {/* Text about proof-of-concept */}
          <span style={{ flex: 40, marginLeft: 20, marginRight: 20 }}>
            {"Rocky is a proof of concept, and thus we expect him to"}
            <span style={{ textDecoration: "underline" }}>{" lose all of his money. "}</span>
            {"Nonetheless, you will recieve an NFT for "}
            <span style={{ textDecoration: "underline" }}>{"donations of any amount"}</span>
            {" as a thank you for joining the first ever on-chain AI project :)"}
          </span>

        </div>

      </div>

      {/* For footer */}
      <div className="footer" style={{ flex: 1, display: "flex" }}>
        <span style={{ padding: 10 }}>
          {"\u00A9 2022 Modulus Labs. All Rights Reserved."}
        </span>
      </div>

    </div>
  );
}

export default App;
