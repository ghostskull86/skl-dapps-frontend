import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { 
  Box, 
  Typography, 
  Paper, 
  CircularProgress,
  Button 
} from '@mui/material';
import ConnectWallet from '../components/ConnectWallet';
import SkullToken from '../contracts/SkullToken.json';

const Wallet = () => {
  const { account, library } = useWeb3React();
  const [balance, setBalance] = useState(null);
  const [sklBalance, setSklBalance] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBalances = async () => {
      if (!account || !library) return;
      
      setLoading(true);
      try {
        // ETH Balance
        const ethBalance = await library.getBalance(account);
        setBalance(ethers.utils.formatEther(ethBalance));
        
        // SKL Balance
        const contract = new ethers.Contract(
          SkullToken.address,
          SkullToken.abi,
          library
        );
        const sklBal = await contract.balanceOf(account);
        setSklBalance(ethers.utils.formatUnits(sklBal, 18));
      } catch (error) {
        console.error("Error fetching balances:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalances();
  }, [account, library]);

  const handleMint = async () => {
    if (!account || !library) return;
    
    setLoading(true);
    try {
      const signer = library.getSigner();
      const contract = new ethers.Contract(
        SkullToken.address,
        SkullToken.abi,
        signer
      );
      
      const tx = await contract.mint(account, ethers.utils.parseUnits("1000", 18));
      await tx.wait();
      
      // Refresh balances
      const sklBal = await contract.balanceOf(account);
      setSklBalance(ethers.utils.formatUnits(sklBal, 18));
    } catch (error) {
      console.error("Error minting tokens:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!account) {
    return (
      <Box sx={{ p: 3 }}>
        <ConnectWallet />
        <Typography align="center" sx={{ mt: 4 }}>
          Connect your wallet to view your balances
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <ConnectWallet />
      <Paper elevation={3} sx={{ p: 3, maxWidth: 500, mx: 'auto', my: 4 }}>
        <Typography variant="h5" gutterBottom>
          Your Wallet
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <Typography variant="body1" paragraph>
              <strong>ETH Balance:</strong> {balance}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>SKL Balance:</strong> {sklBalance}
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleMint}
              disabled={loading}
            >
              Mint 1000 SKL (Owner Only)
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default Wallet;