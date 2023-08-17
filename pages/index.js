import {useState, useEffect} from "react";
import {ethers} from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [add, setAnd] = useState(undefined);
  const [sub, setXor] = useState(undefined);
  const [mult, setOr] = useState(undefined);
  const [inputA, setInputA] = useState("");
  const [inputB, setInputB] = useState("");

  
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const atmABI = atm_abi.abi;

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
      window.ethereum.on("accountsChanged", (accounts) => {
        handleAccount(accounts);
      });
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({method: "eth_accounts"});
      handleAccount(accounts);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    
    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  }

  const getBalance = async() => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());

      if (balance >= ethers.utils.parseEther('2')) {
        setShowImage(true);
      }
    }
  }

  const deposit = async() => {
    if (atm) {
      // let tx = await atm.deposit(1);
      let tx = await atm.deposit(1, { gasLimit: 300000 }); 
      await tx.wait()
      getBalance();
    }
  }


  const withdraw = async() => {
    if (atm) {
      let tx = await atm.withdraw(1);
      await tx.wait()
      getBalance();
    }
  }
  
  const and = async () => {
      if (atm) {
        const a = parseInt(inputA);
        const b = parseInt(inputB);
        const answer = await atm.andOperation(a,b);
        setAnd(answer);
      }
  }  
  const xor = async () => {
    if (atm) {
      const a = parseInt(inputA);
      const b = parseInt(inputB);
      const answer = await atm.xorOperation(a,b);
      setXor(answer);
    }
  }
  const or = async () => {
    if (atm) {
      const a = parseInt(inputA);
      const b = parseInt(inputB);
      const answer = await atm.orOperation(a,b);
      setOr(answer);
    }
  }
  const handleInputAChange = (event) => {
    setInputA(event.target.value);
  };

  const handleInputBChange = (event) => {
    setInputB(event.target.value);
  };

  
  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>
    }

    if (balance == undefined) {
      getBalance();
    }

    return (
      <>
        <div>
          <p style={{ fontFamily: "Sans-serif" }}>Your Account: {account}</p>
          <p style={{ fontFamily: "Sans-serif" }}>Your Balance: {balance}</p>
         
  
          <button style={{ backgroundColor: "#4FC0D0" }} onClick={deposit}>
            Deposit 1 ETH
          </button>
          <button style={{ backgroundColor: "#1B6B93" }} onClick={withdraw}>
            Withdraw 1 ETH
          </button>
          
        </div>
  
        <div>
          <h2>Calculator</h2>

          <input
            type="number"
            placeholder="Enter value A"
            value={inputA}
            onChange={handleInputAChange}
          />
          <input
            type="number"
            placeholder="Enter value B"
            value={inputB}
            onChange={handleInputBChange}
          />
  
          <button style={{ backgroundColor: "#91C8E4" }} onClick={and}>
            AND
          </button>
          <button style={{ backgroundColor: "#749BC2" }} onClick={or}>
            OR
          </button>
          <button style={{ backgroundColor: "#4682A9" }} onClick={xor}>
            XOR
          </button>
          
          <p style={{ fontFamily: "Sans-serif" }}>AND: {add ? add.toString() : ""}</p>
          <p style={{ fontFamily: "Sans-serif" }}>OR: {sub ? sub.toString() : ""}</p>
          <p style={{ fontFamily: "Sans-serif" }}>XOR: {mult ? mult.toString() : ""}</p>

        </div>
      </>
    );
    
  }

  useEffect(() => {
    getWallet();
    
  }, []);

  return (
    <main className="container">
      <header><h1>Welcome Gauri's ATM</h1></header>
      {initUser()}
     
      <style jsx>{`
        .container {
          text-align: center;
          font-family: "Lucida Console", "Courier New", monospace;
          content = "Hello World ";
          
        }
        
      `}
      </style>
    </main>
  )
}
