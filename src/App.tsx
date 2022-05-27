import React, { useState, useRef } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { ethers, BigNumber } from 'ethers';

import './App.css';

const FREE_ADDRESS = '0x4089b4000291a4e7c15714a1f1e630f4845ed645';

function App() {
  const [account, setAccount] = useState<string | undefined>();
  const [signer, setSigner] = useState<any | undefined>();
  const [erc20, setErc20] = useState<any | undefined>();
  const [freeBalance, setFreeBalance] = useState<string | undefined>();
  const mintAmountRef = useRef<HTMLInputElement>();

  const connectWallet = async () => {
    if (!window.ethereum) {
      window.alert('Please install MetaMask');
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const accounts = await provider.send('eth_requestAccounts', []);
    const currSigner = provider.getSigner();
    if (accounts.length) {
      setAccount(accounts[0]);
    }
    setSigner(currSigner);
  };

  const connectToContract = async () => {
    const abi = [
      'function balanceOf(address owner) view returns (uint256)',
      'function mint(address to, uint256 amount) public',
    ];

    const erc20Contract = new ethers.Contract(FREE_ADDRESS, abi, signer);
    const balance = await erc20Contract.balanceOf(signer.getAddress());
    setErc20(erc20Contract);
    setFreeBalance(ethers.utils.formatUnits(balance, 18));
  };

  const mintToken = async () => {
    const amount = parseInt(mintAmountRef.current?.value || '', 10);
    if (amount) {
      await erc20.mint(signer.getAddress(), BigNumber.from(10).pow(18).mul(amount));
    }
  };

  return (
    <div className="App">
      <p>
        Wallet Address:
        {account || '**Connect wallet**'}
      </p>
      <p>
        Free token balance:
        {freeBalance || '**Connect contract**'}
      </p>
      <br />
      <br />
      <Stack spacing={2} direction="row" justifyContent="center">
        <Button
          variant="outlined"
          onClick={connectWallet}
        >
          Connect Wallet
        </Button>
        <Button
          variant="contained"
          onClick={connectToContract}
          disabled={!account}
        >
          Connect Contract
        </Button>
        <Button
          variant="contained"
          onClick={mintToken}
          disabled={!freeBalance}
        >
          Mint Token/s
        </Button>
        <TextField
          inputRef={mintAmountRef}
          placeholder="Amount to mint"
          type="number"
        />
      </Stack>
    </div>
  );
}

export default App;
