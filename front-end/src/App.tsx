import React, { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import modulusLabsLogo from './Modulus_Labs_Logo.png';
import { Area, AreaChart, CartesianGrid, Label, Legend, Line, LineChart, Tooltip, TooltipProps, XAxis, YAxis } from 'recharts';
import { ActionContributionListData, data06, RockyGraphData } from "./sample_data";
import { connectWallet, donateToRocky, DonationToken } from './util/interact';
import Modal from 'react-modal';
import emoji from "node-emoji";

import { initializeApp } from "firebase/app";
import { getFirestore, Firestore, collection, getDocs } from "firebase/firestore";
import firebase_key from "./firebase_apikey.json";
import { RockyDonationsDocument, RockyStatusDocument, RockyTradesDocument } from './types/firebase';
import { convertToHumanUnits, getNumDaysSince, getShortDateRepr, getShorthandTimeIntervalString, roundNumber, truncateAddr } from './util/utils';
import { DefaultTooltipContent } from 'recharts/lib/component/DefaultTooltipContent';

// --- To estimate leaderboard contribution ---
const WETH_USDC_CONVERSION_RATE = 1900;

const firebaseConfig = {
  apiKey: firebase_key.key,
  authDomain: "rockefellerbot.firebaseapp.com",
  projectId: "rockefellerbot",
  storageBucket: "rockefellerbot.appspot.com",
  messagingSenderId: "441044501776",
  appId: "1:441044501776:web:ab0078ee1140cdd7d05195",
};

interface RenderActionContributionListProps {
  contributionActionList: ActionContributionListData[];
}

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

  // --- For header ---
  const [value, setValue] = useState<number>(0);
  const [numDaysAlive, setNumDaysAlive] = useState<number>(0);
  const [percentChange, setPercentChange] = useState<number>(0);

  // --- For middle section ---
  const [rockyStatusData, setRockyStatusData] = useState<RockyGraphData[]>([]);
  const [actionListData, setActionListData] = useState<ActionContributionListData[]>([]);
  const [contributionListData, setContributionListData] = useState<ActionContributionListData[]>([]);

  // --- For wallet/donation stuff ---
  const [donateValue, setDonateValue] = useState<number>(0.001);
  const [donateType, setDonateType] = useState<DonationToken>("WETH");
  const [walletAddr, setWalletAddr] = useState<string>("");

  // --- Modal state variables ---
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [modalText, setModalText] = useState<string>("");
  const [modalDismissVisible, setModalDismissVisible] = useState<boolean>(true);

  // --- Firebase storage ---
  const firebaseDbRef = useRef<Firestore | null>(null);

  useEffect(useCallback(() => {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    firebaseDbRef.current = db;
    loadDonationData();
    loadActionData();
    loadNetWorth();
  }, []), []);

  // --- Data loading ---
  const compareDonations = (d1: RockyDonationsDocument, d2: RockyDonationsDocument): number => {
    // --- First convert to "native" units ---
    const d1HumanAmt = convertToHumanUnits(parseFloat(d1.amount), d1.token);
    const d2HumanAmt = convertToHumanUnits(parseFloat(d2.amount), d2.token);
    // --- Convert into equivalent USDC amounts ---
    const d1USDCAmt = d1.token === "USDC" ? d1HumanAmt : d1HumanAmt * WETH_USDC_CONVERSION_RATE;
    const d2USDCAmt = d2.token === "USDC" ? d2HumanAmt : d2HumanAmt * WETH_USDC_CONVERSION_RATE;
    return d1USDCAmt > d2USDCAmt ? -1 : 1;
  }

  const loadDonationData = () => {
    if (firebaseDbRef.current != null) {
      getDocs(collection(firebaseDbRef.current, "rocky_donations"))
        .then((result) => {

          // --- Sort by raw data first ---
          const rockyDonationsList: RockyDonationsDocument[] = result.docs.map((doc) => {
            return (doc.data() as RockyDonationsDocument);
          });
          rockyDonationsList.sort(compareDonations);

          // --- Convert ---
          let loadedDonationsList: ActionContributionListData[] = [];
          rockyDonationsList.map((rawDonationEntry) => {
            const humanUnitsDonationAmt = convertToHumanUnits(parseFloat(rawDonationEntry.amount), rawDonationEntry.token);
            const donationEntry: ActionContributionListData = {
              actionText: truncateAddr(rawDonationEntry.contributor_address),
              dataText: `${humanUnitsDonationAmt} ${rawDonationEntry.token}`,
              isAction: false,
              timestamp: rawDonationEntry.timestamp.toDate(),
            }
            loadedDonationsList.push(donationEntry);
          });
          // --- Sort + set current list ---
          setContributionListData(loadedDonationsList);
        })
        .catch((error) => {
          console.error("Error in getting rocky_donations collection");
          console.error(error);
        });
    } else {
      console.error("Couldn\'t connect to firebase");
    }
  }

  const loadActionData = () => {
    if (firebaseDbRef.current != null) {
      getDocs(collection(firebaseDbRef.current, "rocky_trades"))
        .then((result) => {
          // --- Read in all donations and process each one ---
          let loadedTradesList: ActionContributionListData[] = [];
          result.forEach((doc) => {
            const rawTradeEntry: RockyTradesDocument = (doc.data() as RockyTradesDocument);
            const actionText = rawTradeEntry.action_type === "HOLD" ? `HOLD position` : `${rawTradeEntry.action_type} $${roundNumber(parseFloat(rawTradeEntry.amount), 2)} worth of WETH`;
            const tradeEntry: ActionContributionListData = {
              actionText: actionText,
              dataText: getShorthandTimeIntervalString(rawTradeEntry.timestamp.toDate(), false),
              isAction: true,
              timestamp: rawTradeEntry.timestamp.toDate(),
            }
            loadedTradesList.push(tradeEntry);
          });
          // --- Sort + set current list ---
          loadedTradesList.sort((a, b) => { return a.timestamp > b.timestamp ? -1 : 1 });
          setActionListData(loadedTradesList);
        })
        .catch((error) => {
          console.error("Error in getting rocky_trades collection");
          console.error(error);
        });
    } else {
      console.error("Couldn\'t connect to firebase");
    }
  }

  const loadNetWorth = () => {
    if (firebaseDbRef.current != null) {
      getDocs(collection(firebaseDbRef.current, "rocky_status"))
        .then((result) => {
          // --- Read in all donations and process each one ---
          let rockyStatusList: RockyGraphData[] = [];
          result.forEach((doc) => {
            const rawStatusEntry: RockyStatusDocument = (doc.data() as RockyStatusDocument);
            const netWorthUSDC = parseFloat(rawStatusEntry.net_worth);
            const humanAmtUSDC = convertToHumanUnits(parseFloat(rawStatusEntry.current_usdc), "USDC");
            const WETHValueInUSDC = netWorthUSDC - humanAmtUSDC;
            const statusEntry: RockyGraphData = {
              timestamp: rawStatusEntry.timestamp.toDate(),
              WETH: WETHValueInUSDC,
              USDC: humanAmtUSDC,
              netWorthUSDC: netWorthUSDC,
              displayTimestamp: "",
            }
            rockyStatusList.push(statusEntry);
          });
          // --- Sort + set current list ---
          rockyStatusList.sort((a, b) => { return a.timestamp > b.timestamp ? 1 : -1 });
          rockyStatusList.forEach((statusEntry) => {
            statusEntry.displayTimestamp = getShortDateRepr(statusEntry.timestamp);
          });
          setRockyStatusData(rockyStatusList);
          // --- Set status, percent change, # of days alive ---
          setValue(rockyStatusList[rockyStatusList.length - 1].netWorthUSDC);
          if (rockyStatusList.length > 1) {
            const prevStatus = rockyStatusList[rockyStatusList.length - 2];
            const curStatus = rockyStatusList[rockyStatusList.length - 1];
            if (prevStatus.netWorthUSDC > 0) {
              const percentChange = 100 * (curStatus.netWorthUSDC - prevStatus.netWorthUSDC) / prevStatus.netWorthUSDC;
              setPercentChange(roundNumber(percentChange));
            }
            const firstStatus = rockyStatusList[0];
            setNumDaysAlive(getNumDaysSince(firstStatus.timestamp, curStatus.timestamp));
          }
        })
        .catch((error) => {
          console.error("Error in getting rocky_donations collection");
          console.error(error);
        });
    } else {
      console.error("Couldn\'t connect to firebase");
    }
  }

  // --- Components ---
  const RenderActionContributionList = (contributionActionListProps: RenderActionContributionListProps) => {
    return (
      <ul style={{ width: "100%", maxHeight: "240px", overflow: "hidden", overflowY: "scroll", padding: 0, margin: 0, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
        {contributionActionListProps.contributionActionList.map((listItem, _) => {
          return <ActionContributionListItem
            actionText={listItem.actionText}
            dataText={listItem.dataText}
            isAction={listItem.isAction}
            timestamp={listItem.timestamp} />
        }
        )}
      </ul>
    );
  }

  const openModalWithOptions = (text: string, canDismiss: boolean) => {
    setModalText(text);
    setModalDismissVisible(canDismiss);
    setModalIsOpen(true);
  }

  const ModalComponent = () => {
    return (
      <div>
        <Modal
          ariaHideApp={false}
          isOpen={modalIsOpen}
          style={{
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
              maxWidth: "50%",
            },
          }}
        >
          <div style={{ flex: 1, display: "flex", alignItems: "center", flexDirection: "column" }}>
            <span style={{ fontSize: 15, marginBottom: 10 }}>{modalText}</span>
            {
              modalDismissVisible ?
                <button
                  style={{ backgroundColor: "transparent", borderRadius: 10, borderColor: "black", padding: 5, fontSize: 15, borderWidth: 1 }}
                  onClick={() => { setModalIsOpen(false) }}>{"Okay"}</button>
                :
                <></>
            }
          </div>
        </Modal>
      </div>
    );
  }

  // --- Button pressing functions ---

  const onClickConnectWalletButton = async () => {
    const { status, address } = await connectWallet();

    if (address != null) {
      openModalWithOptions(`Wallet ${truncateAddr(address)} has been connected!`, true);
      setWalletAddr(address);
    } else {
      openModalWithOptions(`${status}`, true);
    }
  }

  const onClickDonateButton = async () => {
    if (walletAddr === "") {
      openModalWithOptions("Love the enthusiasm! Please connect your Metamask wallet to donate " + emoji.get("smile"), true);
      return;
    }
    if (donateType === "WETH" && donateValue < 0.001) {
      openModalWithOptions("Error: Can't donate less than 0.001 WETH " + emoji.get("pensive"), true);
      return;
    }
    else if (donateType === "USDC" && donateValue < 1) {
      openModalWithOptions("Error: Can't donate less than 1 USDC " + emoji.get("pensive"), true);
      return;
    }
    await donateToRocky(donateType, donateValue, openModalWithOptions);
  }

  return (
    <div className="App">

      <div className="App-header" style={{ display: "flex", flex: 10, borderBottomStyle: "solid", borderBottomWidth: 1, borderBottomColor: "grey", paddingLeft: 20, paddingRight: 20, alignItems: "center" }}>

        {/* Left major section */}
        <div style={{ flex: 45, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>

          <div style={{ display: "flex", flexDirection: "row" }}>
            {/* Rockefeller Bot 0.1.0 title */}
            <span style={{ color: "black", fontSize: 50, marginBottom: 5, fontFamily: "cursive", marginRight: 20 }}>
              {"Rockefeller Bot 0.1.0 "}
            </span>
            {/* by Modulus Labs */}
            <a href="https://www.moduluslabs.xyz/" target={"_blank"}>
              <img src={modulusLabsLogo} width={300} height={50} style={{ marginTop: 15 }} />
            </a>
          </div>

          {/* Current value */}
          <span style={{ color: "black", fontSize: 30, }}>
            {`Current Value: `}<span style={{ color: percentChange > 0 ? "green" : "red" }}>{`$${roundNumber(value, 2)} (${percentChange > 0 ? "+" : ""}${percentChange}%)`}</span>
          </span>
        </div>

        {/* Right major section */}
        <div style={{ flex: 20, display: "flex", flexDirection: "row", alignItems: "center" }}>

          {/* Buttons container */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <a href="https://github.com/Modulus-Labs/RockyBot" target={"_blank"}
              style={{ flex: 25, borderRadius: 10, borderStyle: "solid", borderWidth: 1, borderColor: "black", backgroundColor: "transparent", cursor: "pointer", alignSelf: "stretch", marginBottom: 10, textDecoration: "none", paddingBottom: 5, paddingTop: 5 }}>
              <span style={{ fontSize: 15, color: "black" }}>
                {"GitHub"}
              </span>
            </a>
            <a href="https://voyager.online/contract/0x0196f582862a43c06888485d6c2258a0d594eac6da3741b95a93f89b1cfd2bf9#messages" target={"_blank"}
              style={{ flex: 25, borderRadius: 10, borderStyle: "solid", borderWidth: 1, borderColor: "black", backgroundColor: "transparent", cursor: "pointer", alignSelf: "stretch", marginBottom: 10, textDecoration: "none", paddingBottom: 5, paddingTop: 5 }}>
              <span style={{ fontSize: 15, color: "black" }}>
                {"L2 Contract"}
              </span>
            </a>
            <a href="https://etherscan.io/address/0x3804d8a14b6a2bdcf3ecace58d713dc783a8f2de" target={"_blank"}
              style={{ flex: 25, borderRadius: 10, borderStyle: "solid", borderWidth: 1, borderColor: "black", backgroundColor: "transparent", cursor: "pointer", alignSelf: "stretch", textDecoration: "none", paddingBottom: 5, paddingTop: 5 }}>
              <span style={{ fontSize: 15, color: "black" }}>
                {"L1 Contract"}
              </span>
            </a>
          </div>

          {/* Survived for _ days so far */}
          <div style={{ flex: 1, display: "flex", width: "fit-content", flexDirection: "column", borderStyle: "solid", borderRadius: 15, margin: 15, padding: 15, borderWidth: 1 }}>
            <span style={{ margin: 0 }}>
              {"Survived for:"}
            </span>
            <span style={{ margin: 0, fontSize: 40, color: "green" }}>
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

          {/* Graph component */}
          <div style={{ flex: 4, display: "flex" }}>
            <AreaChart width={580} height={250} data={rockyStatusData}
              margin={{ top: 10, bottom: 20, left: 15 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="displayTimestamp" >
                <Label value="Timestamp" offset={-10} position="insideBottom" style={{ textAnchor: "middle" }} />
              </XAxis>
              <YAxis domain={[0, (dataMax: number) => Math.round(dataMax + 100)]}>
                <Label value="Value (USD)" angle={-90} position={"insideLeft"} style={{ textAnchor: "middle" }} />
              </YAxis>
              <Tooltip />
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="netWorthUSDC" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
              <Area type="monotone" dataKey="WETH" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)" />
            </AreaChart>
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
          <div style={{ flex: 10, display: "flex" }}>
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
          <div style={{ flex: 10, display: "flex" }}>
            <RenderActionContributionList contributionActionList={contributionListData} />
          </div>
        </div>
      </div>

      {/* For lower section */}
      <div className="Bottom-section" style={{ flex: 15, display: "flex", flexDirection: "row", backgroundColor: "lightgrey" }}>

        {/* Text block describing Rocky */}
        <div style={{ flex: 25, display: "flex", borderStyle: "solid", borderRadius: 15, margin: 10, padding: 20, borderWidth: 1, flexDirection: "column", backgroundColor: "white" }}>
          <span style={{ margin: 0, textAlign: "start", marginBottom: 10, fontSize: 30, fontWeight: "bold" }}>
            {"Welcome to the world's first fully on-chain AI trading bot!"}
          </span>
          <span style={{ margin: 0, textAlign: "start", marginBottom: 10, fontSize: 16 }}>
            {"The Rockefeller Bot (or Rocky) is the world's first \"fully on-chain\" AI trading bot. This means that Rocky is both "}
            <span style={{ fontStyle: "italic" }}>{"trustless and autonomous"}</span>
            {", making decisions by himself without a central authority, much like a DeFi protocol."}
          </span>
          <span style={{ margin: 0, textAlign: "start", marginBottom: 10, fontSize: 16 }}>
            {"Using zero-knowledge cryptography, proofs of Rocky's trading model — his brains, his model inputs — his diet, and his model weights — his mood, are all logged and validated on the Ethereum blockchain. This is possible thanks to StarkNet, Starkware's impressive L2 roll-up."}
          </span>
          <span style={{ margin: 0, textAlign: "start", fontSize: 16 }}>
            {"For more on how Rocky works, forking your own Rocky ("}
            <a href={"https://github.com/Modulus-Labs/RockyBot"} target="_blank">{"GitHub here!"}</a>
            {"), as well as all things on-chain AI, check us out on "}
            <a href={"https://medium.com/@ModulusLabs"} target="_blank">{"Medium"}</a>
            {" or get in touch via "}
            <a href={"https://twitter.com/ModulusLabs"} target="_blank">{"Twitter"}</a>
            {" or "}
            <a href={"https://t.co/KlRkssrQhz"} target="_blank">{"Discord"}</a>
            {"!"}
          </span>
        </div>

        {/* Connect wallet / contribute */}
        <div style={{ flex: 10, display: "flex", backgroundColor: "white", borderStyle: "solid", borderRadius: 15, margin: 10, padding: 20, borderWidth: 1, flexDirection: "column", alignItems: "center" }}>

          {/* Connect wallet button */}
          {walletAddr === "" ?
            <button
              style={{ flex: 25, borderRadius: 10, borderStyle: "solid", borderWidth: 1, borderColor: "black", backgroundColor: "transparent", cursor: "pointer", alignSelf: "stretch", marginBottom: 10 }}
              onClick={onClickConnectWalletButton}>
              <span style={{ fontSize: 15, color: "black" }}>
                {"CONNECT WALLET"}
              </span>
            </button>
            :
            <span style={{ flex: 25, fontSize: 20, color: "green", }}>
              {`Connected: ${truncateAddr(walletAddr)}`}
            </span>
          }

          {/* Donate this amount of {ETH, USDC} */}
          <div style={{ flex: 10, display: "flex", flexDirection: "row", alignSelf: "stretch", marginBottom: 10 }}>
            <input
              style={{ flex: 1, display: "flex" }}
              type="number"
              step={donateType === "WETH" ? "0.0001" : "0.5"}
              min={0}
              value={`${donateValue}`}
              onChange={(newAmt) => setDonateValue(parseFloat(newAmt.target.value))} />
            <select name="donateType" id="donateType" value={donateType}
              onChange={(event) => {
                setDonateType((event.target.value) as DonationToken);
                setDonateValue(event.target.value === "WETH" ? 0.001 : 1);
              }}>
              <option value="WETH">{"WETH"}</option>
              <option value="USDC">{"USDC"}</option>
            </select>
          </div>

          {/* Donate button */}
          <button style={{ flex: 25, borderRadius: 10, borderStyle: "solid", borderWidth: 1, borderColor: "black", backgroundColor: "transparent", cursor: "pointer", paddingLeft: 20, paddingRight: 20, alignSelf: "stretch", marginBottom: 10 }}
            onClick={onClickDonateButton}>
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
            {" as a thank you for joining the first ever on-chain AI project " + emoji.get("open_mouth")}
          </span>

        </div>

      </div>

      {/* For footer */}
      <div className="footer" style={{ flex: 1, display: "flex" }}>
        <span style={{ padding: 10 }}>
          {"\u00A9 2022 Modulus Labs. All Rights Reserved."}
        </span>
        <ModalComponent />
      </div>
    </div>
  );
}

export default App;
