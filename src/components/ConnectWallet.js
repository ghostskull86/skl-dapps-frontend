import React from 'react';
import { useWeb3React } from '@web3-react/core';
import { injected } from '../utils';
import { Button, Typography, Box } from '@mui/material';

const ConnectWallet = () => {
  const { activate, deactivate, active, account } = useWeb3React();

  const connect = async () => {
    try {
      await activate(injected);
    } catch (ex) {
      console.log(ex);
    }
  };

  const disconnect = () => {
    deactivate();
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {active ? (
        <>
          <Typography variant="body1">
            Connected: {account.substring(0, 6)}...{account.substring(account.length - 4)}
          </Typography>
          <Button variant="contained" color="error" onClick={disconnect}>
            Disconnect
          </Button>
        </>
      ) : (
        <Button variant="contained" color="primary" onClick={connect}>
          Connect Wallet
        </Button>
      )}
    </Box>
  );
};

export default ConnectWallet;