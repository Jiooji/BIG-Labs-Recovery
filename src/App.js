import React, { useState, useRef } from "react";
import Button from "react-bootstrap/Button";
import { Container } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Overlay from "react-bootstrap/Overlay";
import Tooltip from "react-bootstrap/Tooltip";
import ProgressBar from "react-bootstrap/ProgressBar";
import { MnemonicKey, LCDClient } from "@terra-money/terra.js";
import { network } from "@cosmostation/cosmosjs";

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
  const [showtool, setShowtool] = useState("");
  const [button, setButton] = useState("");
  const [progress, setProgress] = useState(-1);
  const chainTerra = new LCDClient("https://pisco-lcd.terra.dev/", "pisco-1");
  const chainCosmos = network("https://stargate.cosmos.network/","cosmoshub-4");
  const target = useRef(null);

  const handleClose = () => {
    setShow(false);
    setProgress(-1);
  };

  const get_seed_phrase = (seed, address) => {
    if (checkseed(seed, address)) {
      setProgress(100);
      setShow(true);
      setResult(seed);
      setHeader("This should be your seedphrase! 😎");
      setButton(true);
      return;
    }

    const worker = new Worker("recover.js");
    worker.onmessage = (message) => {
      const response = message.data;

      if (response.seed && checkseed(response.seed, address)) {
          setProgress(100);
          setShow(true);
          setResult(response.seed);
          setHeader("This should be your seedphrase! 😎");
          setButton(true);
          worker.terminate();
      } else if (response.percentage > -1) {
        setProgress(response.percentage);
      } else if (response.result === false) {
        setProgress(100);
        setShow(true);
        setResult("Complexity too high");
        setHeader("We could not recover your wallet... 🥲");
        setButton(false);
        worker.terminate();
      }
    }
    worker.postMessage({ seed: seed });
  }

  const handleClick = () => {
    if (address.includes("terra") || address.includes("cosmos")) {
      get_seed_phrase(seed, address);
    } else {
      setShow(true);
      setResult("Incompatible Blockchain.");
      setHeader("No result... 🫠");
      setButton(false);
    }
  };

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

  return (
    <>
      <Container className="center">
        <p className="title">Recover your Cryptø</p>
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
            setWidth("450px");
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
            setWidth1("1200px");
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
      <Container className="names">
        <h1>Powered by: </h1>
        {
          ["0x7183", "toran777", "Demennu", "Jiooji"].map(element => (
            <a key={element} href={"https://github.com/" + element} rel="noopener noreferrer" target="_blank">
              {element}
            </a>
          ))
        }
      </Container>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">{header}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{result}</Modal.Body>
        <Modal.Footer>
          <Button
            ref={target}
            variant="success"
            disabled={!button}
            onClick={() => {
              copytxt(result);
              setShowtool(!showtool);
              setButton(false);
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
    </>
  );
};
export default App;
