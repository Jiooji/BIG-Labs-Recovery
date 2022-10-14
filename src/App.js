import React, { useState, useRef, useEffect } from 'react';
import './style.css';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import { one_error_allwords } from './test.js';
import Modal from 'react-bootstrap/Modal';
import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';
import ProgressBar from 'react-bootstrap/ProgressBar';


const App = () => {
  const words = "decline ignore great ostrich piano torch whip scorpion actor hard path riot ancient sleep zero dial present insane vivid embark combine pulse latin tuition";
  const [width, setWidth] = useState("");
  const [width1, setWidth1] = useState("");
  const [height, setHeight] = useState("");
  const [height1, setHeight1] = useState("");
  const [address, setAddress] = useState("");
  const [seed, setSeed] = useState("");
  const [show, setShow] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const handleClose = () => {
    setShow(false);
    setProgress(-1);
  };
  const handleClick = () => {
    one_error_allwords(seed, words, address, (iteration) => {setPercentage(iteration);}).then((response) => {
      setResult(response);
      setShow(true);
      console.log(response);
    })
    loadProgressBar();
  }

function loadProgressBar() {
  setInterval(function () {
    let val = percentage;
    console.log(val);
    if (val >= 100) {
      val = 100;
      clearInterval();
    }

    setProgress(val)
  }, 1000);
}

  const [result, setResult] = useState("");
  const [showtool, setShowtool] = useState(false);
  const [progress, setProgress] = useState(-1);
  const target = useRef(null);

  function copytxt(result) {  
    navigator.clipboard.writeText(result).then();
  }

  return(
    <div className="App">
    <Container className="center">
    <p>Recover your Cryptø</p>
    <><input id = "address" type = "text" 
        onChange={(event) => setAddress(event.target.value)}
        onBlur={(event) => {
          if (event.target.value === '') {
            setWidth('300px');
            setHeight('30px');
          } else {
            setHeight('45px');
          }
        }}
        onFocus={() => { setWidth('500px'); setHeight('45px'); }} style={{ width: width, height: height }}
        placeholder="Enter address..." />
        <input className="custom-input" id = "seed" type = "text"
          onChange={(event) => setSeed(event.target.value)}
          onBlur={(event) => {
            if (event.target.value === '') {
            setWidth1('300px');
              setHeight1('30px');
            } else {
              setHeight1('45px');
            }
           }}
        onFocus={() => { setWidth1('100%'); setHeight1('45px'); }} style={{ width: width1, height: height1 }}
        placeholder="Enter seed phrase..." /></>
    <Button style={{marginTop: 15}} class="pt-5" variant="success" size="lg" disabled={!address || !seed}
      onClick={handleClick}>
      Run
    </Button>
    <ProgressBar animated now={progress} variant="primary" style={{marginTop: 30, height: 20, width: 700, backgroundColor: "grey"}}/>
    <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
      <Modal.Header closeButton>
      <Modal.Title id="contained-modal-title-vcenter">
        This should be your seedphrase! 😎
      </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {result}
      </Modal.Body>
      <Modal.Footer>
        <Button ref={target} variant="success" onClick={() => { copytxt(result); setShowtool(!showtool);}}>
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
    </Container>
    </div>
  );
}
export default App;