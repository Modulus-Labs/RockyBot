import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import modulusLabsLogo from './Modulus_Labs_Logo.png';
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import { data, data01, data02, data03, data06 } from "./sample_data";

const dummyActionText: ActionContributionListData[] = [
  {
    actionText: "Rocky buys 0.02 ETH",
    dataText: "1h",
    isAction: true
  },
  {
    actionText: "Rocky buys 0.02 ETH",
    dataText: "1h",
    isAction: true
  },
  {
    actionText: "Rocky buys 0.02 ETH",
    dataText: "1h",
    isAction: true
  },
  {
    actionText: "Rocky buys 0.02 ETH",
    dataText: "1h",
    isAction: true
  },
  {
    actionText: "Rocky buys 0.02 ETH",
    dataText: "1h",
    isAction: true
  },
  {
    actionText: "Rocky buys 0.02 ETH",
    dataText: "1h",
    isAction: true
  },
  {
    actionText: "Rocky buys 0.02 ETH",
    dataText: "1h",
    isAction: true
  },
];

const dummyContributionText: ActionContributionListData[] = [
  {
    actionText: "nayroac.eth",
    dataText: "0.002 ETH",
    isAction: false
  },
  {
    actionText: "nayroac.eth",
    dataText: "0.002 ETH",
    isAction: false
  },
  {
    actionText: "nayroac.eth",
    dataText: "0.002 ETH",
    isAction: false
  },
  {
    actionText: "nayroac.eth",
    dataText: "0.002 ETH",
    isAction: false
  },
  {
    actionText: "nayroac.eth",
    dataText: "0.002 ETH",
    isAction: false
  },
  {
    actionText: "nayroac.eth",
    dataText: "0.002 ETH",
    isAction: false
  },
]

interface ActionContributionListData {
  actionText: string;
  dataText: string;
  isAction: boolean;
}

interface RenderActionContributionListProps {
  contributionActionList: ActionContributionListData[];
}

type donateType = "ETH" | "USDC";

const ActionContributionListItem = ({ actionText, dataText, isAction }: ActionContributionListData) => {
  return (
    <li style={{ borderBottomStyle: "solid", borderBottomColor: "grey", borderBottomWidth: 1, flex: 1, display: "flex", flexDirection: "row", margin: 0 }}>
      <span style={{ flex: isAction ? 5 : 2, display: "flex", margin: 12 }}>
        {`${actionText}`}
      </span>
      <span style={{ flex: isAction ? 1 : 2, display: "flex", margin: 12, justifyContent: "flex-end" }}>
        {`${dataText}`}
      </span>
    </li>
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
      <ul style={{ width: "100%", maxHeight: "200px", overflow: "hidden", overflowY: "scroll", padding: 0, margin: 0, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
        {contributionActionListProps.contributionActionList.map((listItem, _) => {
          return <ActionContributionListItem actionText={listItem.actionText} dataText={listItem.dataText} isAction={listItem.isAction} />
        }
        )}
      </ul>
    );
  }


  return (
    <div className="App">

      <div className="App-header" style={{ display: "flex", flex: 10, borderBottomStyle: "solid", borderBottomWidth: 1, borderBottomColor: "grey", padding: 20 }}>

        {/* Left major section */}
        <div style={{ flex: 45, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>

          <div style={{ display: "flex", flexDirection: "row" }}>
            {/* Rockefeller Bot 0.1.0 title */}
            <span style={{ color: "black", fontSize: 50, marginBottom: 5, fontFamily: "cursive", marginRight: 20 }}>
              {"Rockefeller Bot 0.1.0 "}
            </span>
            {/* by Modulus Labs */}
            <img src={modulusLabsLogo} width={300} height={50} style={{ marginTop: 15 }} />
          </div>


          {/* Current value */}
          <span style={{ color: "black", fontSize: 40, fontFamily: "serif" }}>
            {`Current Value: `}<span style={{ color: "red" }}>{`$${value} (USDC + ETH)`}</span>
          </span>
        </div>

        {/* Right major section */}
        <div style={{ flex: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>

          {/* Survived for _ days so far */}
          <div style={{ flex: 1, display: "flex", width: "fit-content", flexDirection: "column", borderStyle: "solid", borderRadius: 15, margin: 15, padding: 15, borderWidth: 1 }}>
            <span style={{ margin: 0 }}>
              {"Survived for:"}
            </span>
            <span style={{ margin: 0, fontSize: 40, color: "lightgreen" }}>
              {`${numDaysAlive} Days`}
            </span>
            <span style={{ margin: 0 }}>
              {"\n(so far)"}
            </span>
          </div>

        </div>

      </div>

      {/* For middle section */}
      <div className="Middle-section" style={{ display: "flex", flex: 20, flexDirection: "row" }}>
        {/* Rocky performance graph */}
        <div style={{ flex: 2, display: "flex", borderStyle: "solid", borderRadius: 15, margin: 10, borderWidth: 1, flexDirection: "column" }}>

          {/* For title element */}
          <div style={{ flex: 1, display: "flex", borderBottomStyle: "solid", borderBottomWidth: 1, padding: 10, }}>
            <span style={{ fontSize: 20, fontWeight: "bold" }}>
              {"Rocky Performance:"}
            </span>
          </div>

          <div style={{ flex: 4, display: "flex" }}>
            <LineChart width={600} height={250} data={data06}
              margin={{ top: 10, bottom: 10 }}>
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="net_worth_USDC" stroke="#8884d8" dot={false} />
              <Line type="monotone" dataKey="ETH" stroke="#82ca9d" dot={false} />
            </LineChart>
          </div>
        </div>

        {/* Rocky actions table */}
        <div style={{ flex: 1, display: "flex", borderStyle: "solid", borderRadius: 15, margin: 10, borderWidth: 1, flexDirection: "column" }}>
          {/* For title element */}
          <div style={{ flex: 1, display: "flex", borderBottomStyle: "solid", borderBottomWidth: 1, padding: 10, }}>
            <span style={{ fontSize: 20, fontWeight: "bold" }}>
              {"Rocky Actions:"}
            </span>
          </div>
          {/* For list element */}
          <div style={{ flex: 4, display: "flex" }}>
            <RenderActionContributionList contributionActionList={actionListData} />
          </div>
        </div>

        {/* Contribution leaderboard */}
        <div style={{ flex: 1, display: "flex", borderStyle: "solid", borderRadius: 15, margin: 10, borderWidth: 1, flexDirection: "column" }}>
          {/* For title element */}
          <div style={{ flex: 1, display: "flex", borderBottomStyle: "solid", borderBottomWidth: 1, padding: 10, }}>
            <span style={{ fontSize: 20, fontWeight: "bold" }}>
              {"Contribution Leaderboard:"}
            </span>
          </div>
          {/* For list element */}
          <div style={{ flex: 4, display: "flex" }}>
            <RenderActionContributionList contributionActionList={contributionListData} />
          </div>
        </div>
      </div>

      {/* For lower section */}
      <div className="Bottom-section" style={{ flex: 15, display: "flex", flexDirection: "row", backgroundColor: "lightgrey" }}>

        {/* Text block describing Rocky */}
        <div style={{ flex: 25, display: "flex", borderStyle: "solid", borderRadius: 15, margin: 10, padding: 20, borderWidth: 1, flexDirection: "column", backgroundColor: "white" }}>
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
        <div style={{ flex: 10, display: "flex", backgroundColor: "white", borderStyle: "solid", borderRadius: 15, margin: 10, padding: 20, borderWidth: 1, flexDirection: "column", alignItems: "center" }}>

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
            {"Rocky is a proof of concept, and thus we expect him to "}
            <span style={{ textDecoration: "underline" }}>{"lose all of his money. "}</span>
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
