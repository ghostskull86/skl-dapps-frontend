import React from 'react';
import { Box } from '@mui/material';
import ConnectWallet from '../components/ConnectWallet';
import MessageForm from '../components/MessageForm';

const SendMessage = () => {
  return (
    <Box sx={{ p: 3 }}>
      <ConnectWallet />
      <MessageForm />
    </Box>
  );
};

export default SendMessage;