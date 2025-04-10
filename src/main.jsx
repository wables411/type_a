import React from 'react';
import ReactDOM from 'react-dom/client';
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import { Network } from '@aptos-labs/ts-sdk';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <AptosWalletAdapterProvider
    dappConfig={{ network: Network.TESTNET }}
    optInWallets={['Petra']}
    autoConnect={false}
    onError={(error) => console.error('Wallet adapter error:', error)}
  >
    <App />
  </AptosWalletAdapterProvider>
);