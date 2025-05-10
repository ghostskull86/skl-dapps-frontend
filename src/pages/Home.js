import React from 'react';
import { Box, Typography } from '@mui/material';
import ConnectWallet from '../components/ConnectWallet';
import MessageList from '../components/MessageList';

const Home = () => {
  return (
    <Box sx={{ p: 3 }}>
      <ConnectWallet />
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mt: 4 }}>
        SKL Messaging DApp
      </Typography>
      <Typography variant="body1" paragraph align="center">
        Send messages and SKL tokens on Monad Testnet
      </Typography>
      <MessageList />
    </Box>
  );
};

export default Home;