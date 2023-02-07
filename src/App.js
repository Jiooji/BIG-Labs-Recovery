import React, { useState, useRef } from "react";
import Overlay from "react-bootstrap/Overlay";
import Tooltip from "react-bootstrap/Tooltip";
import { MnemonicKey, LCDClient } from "@terra-money/terra.js";
import { network } from "@cosmostation/cosmosjs";

const App = () => {
  const [address, setAddress] = useState("");
  const [seed, setSeed] = useState("");
  const [close, setClose] = useState(false);
  const [show, setShow] = useState(false);
  const [result, setResult] = useState("");
  const [header, setHeader] = useState("");
  const [showtool, setShowtool] = useState(false);
  const [showhelp, setShowHelp] = useState(false);
  const [button, setButton] = useState("");
  const [seedcheck, setSeedcheck] = useState(false);
  const [addrcheck, setAddrcheck] = useState(false);
  const [help, setHelp] = useState(false);
  const [runbutton, setRunButton] = useState(true);
  const chainTerra = new LCDClient("https://pisco-lcd.terra.dev/", "pisco-1");
  const chainCosmos = network(
    "https://stargate.cosmos.network/",
    "cosmoshub-4"
  );
  const buttonCopy = useRef(null);
  const svgTarget = useRef(null);
  const [donationbutton, setDonationButton] = useState(false);
  const myAddrTool = useRef(null);
  const myAddr = "terra13z2gepfvs586rux0cf90pk0d42876fd9tfvvgq";
  const myDiscord = useRef(null);
  const myDiscordtxt = "Jiooji#3287";
  const [tooladdr, setToolAddr] = useState(false);
  const [tooldiscord, setToolDiscord] = useState(false);

  const get_seed_phrase = (seed, address) => {
    setRunButton(false);
    if (checkseed(seed, address)) {
      setRunButton(false);
      setClose(false);
      setShow(true);
      setResult(seed);
      setHeader("This should be your seedphrase!");
      setButton(true);
      return;
    }

    const worker = new Worker("recover.js");
    worker.onmessage = (message) => {
      const response = message.data;

      if (response.seed && checkseed(response.seed, address)) {
        setClose(false);
        setShow(true);
        setResult(response.seed);
        setHeader("This should be your seedphrase!");
        setButton(true);
        worker.terminate();
      } else if (response.result === false) {
        setShowHelp(false);
        setShow(true);
        setClose(false);
        setResult(
          "Double check your address and each word of your seedphrase."
        );
        setHeader("We could not recover your wallet...");
        setButton(false);
        worker.terminate();
      }
    };
    worker.postMessage({ seed: seed });
  };

  const handleClick = () => {
    setHelp(false);
    if (address.includes("terra") || address.includes("cosmos")) {
      get_seed_phrase(seed, address);
    } else {
      setRunButton(false);
      setClose(false);
      setShow(true);
      setResult("Incompatible Blockchain.");
      setHeader("No result...");
      setButton(false);
    }
  };

  function checkAddr(eventAddr) {
    if (eventAddr.includes("terra")) {
      setAddrcheck(true);
      setHelp(true);
    } else if (eventAddr.includes("cosmos")) {
      setAddrcheck(true);
      setHelp(false);
    } else {
      setHelp(false);
    }

    return addrcheck;
  }

  function copytxt(result) {
    navigator.clipboard.writeText(result).then();
  }

  function checkseed(seed, address) {
    let possaddress;
    if (address.includes("terra")) {
      const key = new MnemonicKey({ mnemonic: seed });
      const wallet = chainTerra.wallet(key);
      possaddress = wallet.key.accAddress;
    } else if (address.includes("cosmos")) {
      try {
        possaddress = chainCosmos.getAddress(seed);
      } catch {
        return false;
      }
    } else {
      return false;
    }
    return possaddress === address;
  }

  function wordCount(eventSeed) {
    let totalCount = 0;
    let words = eventSeed.split(" ");
    words.forEach(function(word) {
      if (word.length > 0) {
        totalCount++;
      }
    });

    if (totalCount === 24) {
      setSeedcheck(true);
    } else {
      setSeedcheck(false);
    }

    return seedcheck;
  }

  function Modal() {
    return (
      <div className="posabsolute">
        <div className="bgmodal fullmodal">
          <div className="mymodaltitle">
            <p className="modaltitlecontent">{header}</p>
            <svg
              className="svgclose"
              onClick={handleClose}
              width="25"
              height="25"
              viewBox="4 4 16 16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div className="content">
            <p>{result}</p>
          </div>
          <div className="modalbutton">
            <button
              ref={buttonCopy}
              className="buttonmodal"
              onClick={() => {
                setShowtool(!showtool);
                copytxt(result);
                setButton(false);
              }}
              disabled={!button}
            >
              Copy seed phrase
            </button>
            <Overlay target={buttonCopy} show={showtool} placement="right">
              {(props) => (
                <Tooltip id="overlay-example" {...props}>
                  Copied!
                </Tooltip>
              )}
            </Overlay>
          </div>
        </div>
      </div>
    );
  }

  function handleClose() {
    setRunButton(true);
    setShow(false);
    setClose(true);
    setShowtool(false);
  }

  function svgHelpPop() {
    setShowHelp(true);

    return showhelp;
  }

  function svgHelpLeave() {
    setShowHelp(false);

    return showhelp;
  }

  function buttonDonations() {
    setDonationButton(true);

    return donationbutton;
  }

  function toolTipDono() {
    setShowtool(false);

    return showtool;
  }

  function toolDisc() {
    setToolDiscord(false);

    return tooldiscord;
  }

  function toolAddr() {
    setToolAddr(false);

    return tooladdr;
  }

  return (
    <>
      <div className="posabsolute">
        <div className="div1 bg">
          <div className="posabsolute">
            <a href="https://biglabs.eu" target="_blank">
              <img
                className="div2 slide-in-blurred-bottom"
                src="BigLabs logo.png"
                alt="BigLabs logo"
              />
              <address className="labs disinlineblock flicker-in-1">
                Labs
              </address>
            </a>
          </div>
          <div className="div3 bgcard">
            <p className="title">Recover your wallet</p>
            <input
              type="text"
              placeholder="Enter address..."
              onChange={(eventAddr) => {
                setAddress(eventAddr.target.value);
                checkAddr(eventAddr.target.value);
              }}
              onPaste={(eventAddr) => {
                setAddress(eventAddr.target.value);
                checkAddr(eventAddr.target.value);
              }}
            />
            {help ? (
              <div className="svghelp">
                <svg
                  onMouseOver={svgHelpPop}
                  onMouseLeave={svgHelpLeave}
                  ref={svgTarget}
                  width="26px"
                  height="26px"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 6a3.939 3.939 0 0 0-3.934 3.934h2C10.066 8.867 10.934 8 12 8s1.934.867 1.934 1.934c0 .598-.481 1.032-1.216 1.626a9.208 9.208 0 0 0-.691.599c-.998.997-1.027 2.056-1.027 2.174V15h2l-.001-.633c.001-.016.033-.386.441-.793.15-.15.339-.3.535-.458.779-.631 1.958-1.584 1.958-3.182A3.937 3.937 0 0 0 12 6zm-1 10h2v2h-2z" />
                  <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
                </svg>
                <Overlay target={svgTarget} show={showhelp} placement="right">
                  {(props) => (
                    <Tooltip id="overlay-example" {...props}>
                      Recovering wallet on Terra may take a while, like... a
                      lot. Please be patient and sorry for the wait.
                    </Tooltip>
                  )}
                </Overlay>
              </div>
            ) : (
              <div></div>
            )}
            <input
              type="text"
              placeholder="Enter seed phrase..."
              onChange={(eventSeed) => {
                setSeed(eventSeed.target.value);
                wordCount(eventSeed.target.value);
              }}
              onPaste={(eventSeed) => {
                setSeed(eventSeed.target.value);
                wordCount(eventSeed.target.value);
              }}
            />
            {runbutton ? (
              <div>
                <button
                  onClick={() => {
                    handleClick();
                    svgHelpLeave();
                  }}
                  className="buttonrun"
                  disabled={
                    !address || !seed || !runbutton || !seedcheck || !addrcheck
                  }
                >
                  Run
                </button>
              </div>
            ) : (
              <div className="scale-in-center">
                <span class="loader"></span>
              </div>
            )}
            {show ? (
              <div className="posabsolute center bounce-in-top">
                <Modal></Modal>
              </div>
            ) : (
              <div></div>
            )}
            {close ? (
              <div class="posabsolute center slide-out-top">
                <Modal></Modal>
              </div>
            ) : (
              <div></div>
            )}
          </div>
          <div className="contactus">
            Contact Us:
            <a
              href="https://mail.google.com/mail/u/0/?fs=1&tf=cm&source=mailto&to=support@biglabs.eu"
              target="_blank"
            >
              mail
            </a>
            | Discord:
            <a
              ref={myDiscord}
              onClick={() => {
                setToolDiscord(!tooldiscord);
                copytxt(myDiscordtxt);
              }}
              onMouseLeave={toolDisc}
              className="textaddr"
            >
              {myDiscordtxt}
            </a>
            <Overlay target={myDiscord} show={tooldiscord} placement="top">
              {(props) => (
                <Tooltip id="overlay-example" {...props}>
                  Copied!
                </Tooltip>
              )}
            </Overlay>
          </div>
          {donationbutton ? (
            <div className="donation">
              <div className="textapp">
                If you recovered your wallet or appreciated the effort and want
                to support Us you can consider making a donation.
                <a
                  ref={myAddrTool}
                  onClick={() => {
                    setToolAddr(!tooladdr);
                    copytxt(myAddr);
                  }}
                  onMouseLeave={toolAddr}
                  className="textaddr"
                >
                  {" "}
                  {myAddr}
                </a>{" "}
                <Overlay target={myAddrTool} show={tooladdr} placement="bottom">
                  {(props) => (
                    <Tooltip id="overlay-example" {...props}>
                      Copied!
                    </Tooltip>
                  )}
                </Overlay>
              </div>
            </div>
          ) : (
            <div class="donationbutton vibrate-1" onClick={buttonDonations}>
              Click Me!
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default App;
