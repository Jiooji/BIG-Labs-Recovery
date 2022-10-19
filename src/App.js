import React, { useState, useRef } from "react";
import Button from "react-bootstrap/Button";
import { Container } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Overlay from "react-bootstrap/Overlay";
import Tooltip from "react-bootstrap/Tooltip";
import ProgressBar from "react-bootstrap/ProgressBar";
import { MnemonicKey, LCDClient } from "@terra-money/terra.js";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";

const App = () => {
  const [width, setWidth] = useState("");
  const [width1, setWidth1] = useState("");
  const [height, setHeight] = useState("");
  const [height1, setHeight1] = useState("");
  const [address, setAddress] = useState("");
  const [seed, setSeed] = useState("");
  const [show, setShow] = useState(false);
  const [result, setResult] = useState("");
  const [header, setHeader] = useState("");
  const [showtool, setShowtool] = useState(false);
  const [progress, setProgress] = useState(-1);
  const target = useRef(null);

  const handleClose = () => {
    setShow(false);
    setProgress(-1);
  };

  const handleClick = () => {
    if (address.includes("terra") || address.includes("cosmos")) {
      const worker = new Worker("recover.js");
      const params = { seed: seed, address: address };
      worker.postMessage(params);
      worker.onmessage = async (message) => {
        const r = message.data;
        if (r.percentage >= 0) setProgress(r.percentage);
        else if (r.seed) {
          const value = await checkseed(r.seed, address);
          if (value) {
            setProgress(100);
            worker.terminate();
            setShow(true);
            setResult(r.seed);
            setHeader("This should be your seedphrase! 😎")
          }
        } else if (r.result === false) {
          setProgress(100);
          worker.terminate();
          setShow(true);
          setResult("Complexity too high");
          setHeader("We could not recover your wallet... 🥲")
        }
      };
    } else {
      setShow(true);
      setResult("Incompatible Blockchain.");
      setHeader("No result... 🫠");
    }
  };

  function copytxt(result) {
    navigator.clipboard.writeText(result).then();
  }

  async function checkseed(seed, address) {
    let chain;
    var possaddress;
    if (address.includes("terra")) {
      chain = new LCDClient("https://pisco-lcd.terra.dev/", "pisco-1");
      const key = new MnemonicKey({ mnemonic: seed });
      const wallet = chain.wallet(key);
      possaddress = wallet.key.accAddress;
    } else if (address.includes("cosmos")) {
      try {
        const wallet = await DirectSecp256k1HdWallet.fromMnemonic(seed);
        const [firstAccount] = await wallet.getAccounts();
        possaddress = firstAccount.address;
        console.log(firstAccount);
      } catch {
        return false;
      }
    } else {
      return false;
    }
    return possaddress === address;
  }

  return (
    <div className="App">
      <Container className="center">
        <p>Recover your Cryptø</p>
        <input
          type="text"
          placeholder="Enter address..."
          style={{ width: width, height: height }}
          onChange={(event) => setAddress(event.target.value)}
          onBlur={(event) => {
            if (event.target.value === "") {
              setWidth("300px");
              setHeight("30px");
            } else {
              setHeight("45px");
            }
          }}
          onFocus={() => {
            setWidth("500px");
            setHeight("45px");
          }}
        />
        <input
          className="custom-input"
          type="text"
          placeholder="Enter seed phrase..."
          style={{ width: width1, height: height1 }}
          onChange={(event) => setSeed(event.target.value)}
          onBlur={(event) => {
            if (event.target.value === "") {
              setWidth1("300px");
              setHeight1("30px");
            } else {
              setHeight1("45px");
            }
          }}
          onFocus={() => {
            setWidth1("100%");
            setHeight1("45px");
          }}
        />
        <Button
          variant="success"
          size="lg"
          disabled={!address || !seed}
          style={{ marginTop: 15 }}
          onClick={handleClick}
        >
          Run
        </Button>
        {progress > -1 ? (
          <ProgressBar
            animated
            now={progress}
            variant="primary"
            style={{
              marginTop: 30,
              height: 20,
              width: 700,
              backgroundColor: "grey",
            }}
          ></ProgressBar>
        ) : (
          <div></div>
        )}
      </Container>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {header}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{result}</Modal.Body>
        <Modal.Footer>
          <Button
            ref={target}
            variant="success"
            onClick={() => {
              copytxt(result);
              setShowtool(!showtool);
            }}
          >
            Copy seedphrase
          </Button>
          <Overlay target={target.current} show={showtool} placement="top">
            {(props) => (
              <Tooltip id="overlay-example" {...props}>
                Copied!
              </Tooltip>
            )}
          </Overlay>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default App;
