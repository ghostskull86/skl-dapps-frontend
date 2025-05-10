import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { 
  List, 
  ListItem, 
  ListItemText, 
  Typography, 
  Paper,
  Divider 
} from '@mui/material';
import SkullToken from '../contracts/SkullToken.json';

const MessageList = () => {
  const { library, account } = useWeb3React();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!account || !library) return;
      
      try {
        const contract = new ethers.Contract(
          SkullToken.address,
          SkullToken.abi,
          library
        );

        // Filter untuk pesan masuk dan keluar
        const filterIncoming = contract.filters.MessageSent(null, account);
        const filterOutgoing = contract.filters.MessageSent(account, null);
        
        const [incoming, outgoing] = await Promise.all([
          contract.queryFilter(filterIncoming),
          contract.queryFilter(filterOutgoing)
        ]);

        const allMessages = [...incoming, ...outgoing]
          .map(event => ({
            sender: event.args.sender,
            recipient: event.args.recipient,
            message: event.args.message,
            tokenAmount: ethers.utils.formatUnits(event.args.tokenAmount, 18),
            txHash: event.transactionHash,
            timestamp: new Date(event.getBlock().timestamp * 1000)
          }))
          .sort((a, b) => b.timestamp - a.timestamp);

        setMessages(allMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [account, library]);

  if (!account) {
    return (
      <Typography align="center" sx={{ mt: 4 }}>
        Connect your wallet to view messages
      </Typography>
    );
  }

  if (loading) {
    return <Typography align="center" sx={{ mt: 4 }}>Loading messages...</Typography>;
  }

  if (messages.length === 0) {
    return <Typography align="center" sx={{ mt: 4 }}>No messages found</Typography>;
  }

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto', my: 4 }}>
      <Typography variant="h5" gutterBottom>
        Your Messages
      </Typography>
      <List>
        {messages.map((msg, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={
                  <>
                    {msg.sender === account ? (
                      <Typography>
                        To: <strong>{msg.recipient.substring(0, 6)}...{msg.recipient.substring(msg.recipient.length - 4)}</strong>
                      </Typography>
                    ) : (
                      <Typography>
                        From: <strong>{msg.sender.substring(0, 6)}...{msg.sender.substring(msg.sender.length - 4)}</strong>
                      </Typography>
                    )}
                  </>
                }
                secondary={
                  <>
                    <Typography component="span" display="block">
                      {msg.message}
                    </Typography>
                    <Typography component="span" display="block" variant="body2" color="text.secondary">
                      Sent {msg.tokenAmount} SKL |{' '}
                      <a 
                        href={`https://testnet-explorer.monad.xyz/tx/${msg.txHash}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        View Transaction
                      </a>
                    </Typography>
                  </>
                }
              />
            </ListItem>
            {index < messages.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default MessageList;