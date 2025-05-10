import React, { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Paper, 
  CircularProgress 
} from '@mui/material';
import SkullToken from '../contracts/SkullToken.json';

const MessageForm = () => {
  const { library, account } = useWeb3React();
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [tokenAmount, setTokenAmount] = useState('');
  const [ethFee, setEthFee] = useState('0.001');
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const signer = library.getSigner();
      const contract = new ethers.Contract(
        SkullToken.address,
        SkullToken.abi,
        signer
      );

      const tx = await contract.sendMessage(
        recipient,
        message,
        ethers.utils.parseUnits(tokenAmount, 18),
        { value: ethers.utils.parseEther(ethFee) }
      );

      await tx.wait();
      setTxHash(tx.hash);
      setRecipient('');
      setMessage('');
      setTokenAmount('');
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 500, mx: 'auto', my: 4 }}>
      <Typography variant="h5" gutterBottom>
        Send Message with SKL
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Recipient Address"
          variant="outlined"
          fullWidth
          margin="normal"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          required
        />
        <TextField
          label="Message"
          variant="outlined"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <TextField
          label="SKL Token Amount"
          variant="outlined"
          fullWidth
          margin="normal"
          type="number"
          value={tokenAmount}
          onChange={(e) => setTokenAmount(e.target.value)}
          required
        />
        <TextField
          label="ETH Fee"
          variant="outlined"
          fullWidth
          margin="normal"
          type="number"
          value={ethFee}
          onChange={(e) => setEthFee(e.target.value)}
          required
          helperText="50% goes to owner, 50% burned"
        />
        <Box sx={{ mt: 2 }}>
          {loading ? (
            <CircularProgress />
          ) : (
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={!account}
            >
              Send Message
            </Button>
          )}
        </Box>
        {txHash && (
          <Typography variant="body2" sx={{ mt: 2 }}>
            Transaction: <a 
              href={`https://testnet-explorer.monad.xyz/tx/${txHash}`} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              View on Explorer
            </a>
          </Typography>
        )}
        {!account && (
          <Typography color="error" sx={{ mt: 1 }}>
            Please connect your wallet first
          </Typography>
        )}
      </form>
    </Paper>
  );
};

export default MessageForm;