import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";
import './App.css';

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        await provider.send("eth_requestAccounts", []);
        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });
        
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        console.log(address);
        setAccount(address);

        const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
        const contract = new ethers.Contract(
          contractAddress,
          Upload.abi,
          signer
        );
        setContract(contract);
        setProvider(provider);
      } else {
        alert("Metamask is not installed!");
      }
    };
    initialize();
  }, []); // Bağımlılık dizisi eklenmiştir

 
  return (
      <>
      {!modalOpen && (
        <button className="share" onClick={() => setModalOpen(true)}>
          Share
        </button>
      )}
      {modalOpen && (
        <Modal setModalOpen={setModalOpen} contract={contract}></Modal>
      )}
  
        <div className="App">
          <h1 style={{ color: "black" }}>SkyChain 3.0</h1>
          <div class="bg"></div>
          <div class="bg bg2"></div>
          <div class="bg bg3"></div>
  
          <p style={{ color: "black" }}>
            Account : {account ? account : "Not connected"}
          </p>
          <FileUpload account={account}
          provider={provider}
          contract={contract}></FileUpload>
          <Display account={account}contract={contract}></Display>
          
        </div>
      </>
  );
}

export default App;
