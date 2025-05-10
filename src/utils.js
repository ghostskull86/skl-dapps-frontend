import { InjectedConnector } from '@web3-react/injected-connector';
import { ethers } from 'ethers';

export const injected = new InjectedConnector({ 
  supportedChainIds: [1080] // Chain ID Monad Testnet
});

export const formatAddress = (address) => {
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

export const loadContract = async (contractName, provider) => {
  const contractData = require(`./contracts/${contractName}.json`);
  const contract = new ethers.Contract(
    contractData.address,
    contractData.abi,
    provider
  );
  return contract;
};