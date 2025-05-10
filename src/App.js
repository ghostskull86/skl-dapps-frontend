import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SendMessage from './pages/SendMessage';
import Wallet from './pages/Wallet';

function getLibrary(provider) {
  return new ethers.providers.Web3Provider(provider);
}

function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/send" element={<SendMessage />} />
          <Route path="/wallet" element={<Wallet />} />
        </Routes>
      </Router>
    </Web3ReactProvider>
  );
}

export default App;