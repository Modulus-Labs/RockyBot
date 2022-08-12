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

      <div className="App-header">

        {/* Left major section */}
        <div style={{ flex: 1, display: "flex", backgroundColor: "pink", flexDirection: "column" }}>
          {/* Rockefeller Bot 0.1.0 title */}
          <p>
            {"Rockefeller Bot 0.1.0"}
          </p>
          {/* by Modulus Labs */}
          <p>
            {"By Modulus Labs"}
          </p>
          {/* Current value */}
          <p>
            {`Current Value: $${value}`}
          </p>
        </div>

        {/* Right major section */}
        <div style={{ flex: 1, display: "flex", backgroundColor: "darkgrey", flexDirection: "column" }}>

          {/* Survived for _ days so far */}
          <div style={{ flex: 1, display: "flex", backgroundColor: "lightgreen", flexDirection: "column" }}>
            <p>
              {"Survived for:"}
            </p>
            <p>
              {`${numDaysAlive} Days`}
            </p>
            <p>
              {"\n(so far)"}
            </p>
          </div>

          {/* Twitter button */}
          <div>
            {/* target=_blank opens link in new tab */}
            <a href="https://twitter.com/ModulusLabs" target="_blank">
              <button>
                {"Twitter"}
              </button>
            </a>
          </div>
        </div>

      </div>

      {/* For middle section */}
      <div className="Middle-section">
        {/* Rocky performance graph */}
        <div style={{ flex: 1, display: "flex", backgroundColor: "grey" }}>
          <p>
            {"TODO(ryancao)!"}
          </p>
        </div>

        {/* Rocky actions table */}
        <div style={{ flex: 1, display: "flex", backgroundColor: "purple" }}>
          <RenderActionContributionList contributionActionList={actionListData} />
        </div>

        {/* Contribution leaderboard */}
        <div style={{ flex: 1, display: "flex", backgroundColor: "lightgrey" }}>
          <RenderActionContributionList contributionActionList={contributionListData} />
        </div>
      </div>

      {/* For lower section */}
      <div className="Bottom-section">

        {/* Text block describing Rocky */}
        <div style={{ backgroundColor: "white" }}>
          <p>
            {"Welcome to the world's first fully on-chain AI trading bot"}
          </p>
          <p>
            {"The Rockefeller Bot (or Rocky) is the world's first \"fully on-chain\" AI trading bot. This means that Rocky is both trustless and autonomous, making decisions by himself without a central authority, much like a DeFi protocol."}
          </p>
          <p>
            {"Using zero-knowledge cryptography, proofs of Rocky's trading model — his brains, his model inputs — his diet, and his model weights — his mood, are all logged and validated on the Ethereum blockchain. This is possible thanks to StarkNet, Starkware's impressive L2 roll-up."}
          </p>
          <p>
            {"For more on how Rocky works, forking your own Rocky, as well as all things on-chain AI, check us out on Medium or get in touch via Twitter or Discord!"}
          </p>
        </div>

        {/* Connect wallet / contribute */}
        <div style={{ backgroundColor: "pink", flexDirection: "column", display: "flex" }}>

          {/* Connect wallet button */}
          <button>
            {"Connect wallet"}
          </button>

          {/* Donate this amount of {ETH, USDC} */}
          <div>
            <input
              type="number"
              step="0.01"
              min={0}
              value={`${donateValue}`}
              onChange={(newAmt) => setDonateValue(parseFloat(newAmt.target.value))} />
            <select name="donateType" id="donateType">
              <option value="ETH">{"ETH"}</option>
              <option value="USDC">{"USDC"}</option>
            </select>
          </div>

          {/* Donate button */}
          <button>
            {"Donate now!"}
          </button>

        </div>

      </div>

      {/* For footer */}
      <div className="footer">
        <p>
          This is the footer
        </p>
      </div>

    </div>
  );
}

export default App;
