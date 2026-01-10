import { ethers } from "ethers@6.13.0";

// ⚠️ IMPORTANT: Update this with your deployed contract address!
// After deploying in Remix (WITH OPTIMIZER ENABLED), paste your contract address here
// Current address: 0xd9145CCE52D386f254917e481eB44e9943F39138
// See /DEPLOYMENT_GUIDE.md and /OPTIMIZER_FIX.md for deployment instructions
export const CONTRACT_ADDRESS =
  "0xd9145CCE52D386f254917e481eB44e9943F39138";

// Smart Contract ABI
export const CONTRACT_ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "ipId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "title",
        type: "string",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "applicant",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "ipfsHash",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "registrationDate",
        type: "uint256",
      },
    ],
    name: "IPRegistered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "ipId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "transferDate",
        type: "uint256",
      },
    ],
    name: "IPTransferred",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_title",
        type: "string",
      },
      {
        internalType: "string",
        name: "_description",
        type: "string",
      },
      {
        internalType: "string",
        name: "_ipfsHash",
        type: "string",
      },
      {
        internalType: "string",
        name: "_category",
        type: "string",
      },
      {
        internalType: "address",
        name: "_applicant",
        type: "address",
      },
    ],
    name: "registerIP",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_ipId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_newOwner",
        type: "address",
      },
    ],
    name: "transferIP",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_ipId",
        type: "uint256",
      },
    ],
    name: "getIPRight",
    outputs: [
      {
        internalType: "string",
        name: "title",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "string",
        name: "ipfsHash",
        type: "string",
      },
      {
        internalType: "string",
        name: "category",
        type: "string",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "applicant",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "registrationDate",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isActive",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "admin",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ipCounter",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export async function getContract() {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  
  // Verify network
  const network = await provider.getNetwork();
  const chainIdStr = network.chainId.toString();
  console.log('Connected to network:', network.name, 'Chain ID:', chainIdStr);
  
  if (network.chainId !== 11155111n) {
    throw new Error("Please switch to Sepolia Test Network in MetaMask");
  }
  
  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    CONTRACT_ABI,
    signer,
  );

  return contract;
}

export async function registerIPOnBlockchain(
  title: string,
  description: string,
  ipfsHash: string,
  category: string,
  applicantAddress: string,
) {
  try {
    console.log('Starting blockchain registration...');
    console.log('Contract Address:', CONTRACT_ADDRESS);
    console.log('Title:', title);
    console.log('Category:', category);
    console.log('Applicant:', applicantAddress);
    
    const contract = await getContract();
    console.log('Contract instance created');

    // Call the smart contract function
    console.log('Calling registerIP function...');
    const tx = await contract.registerIP(
      title,
      description,
      ipfsHash,
      category,
      applicantAddress,
    );
    
    console.log('Transaction sent! Hash:', tx.hash);
    console.log('Waiting for confirmation...');

    // Wait for transaction to be mined
    const receipt = await tx.wait();
    
    console.log('Transaction confirmed!');
    console.log('Block Number:', receipt.blockNumber?.toString());
    console.log('Gas Used:', receipt.gasUsed?.toString());

    return {
      success: true,
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber?.toString() || '0',
      gasUsed: receipt.gasUsed?.toString() || '0',
      timestamp: Date.now(),
    };
  } catch (error: any) {
    // Safely extract error message without triggering BigInt serialization
    let errorMessage = 'Failed to register on blockchain';
    
    try {
      if (error?.code === 'ACTION_REJECTED') {
        errorMessage = 'Transaction was rejected in MetaMask';
      } else if (error?.code === 'INSUFFICIENT_FUNDS') {
        errorMessage = 'Insufficient Sepolia ETH for gas fees. Get free ETH from a faucet.';
      } else if (error?.message && typeof error.message === 'string') {
        if (error.message.includes('only admin')) {
          errorMessage = 'Only the admin account can register IP rights';
        } else {
          errorMessage = error.message;
        }
      } else if (error?.reason && typeof error.reason === 'string') {
        errorMessage = error.reason;
      }
    } catch (e) {
      // If accessing error properties fails, use default message
      errorMessage = 'Failed to register on blockchain';
    }
    
    console.error("Blockchain registration error:", errorMessage);
    throw new Error(errorMessage);
  }
}

export async function transferIPOnBlockchain(
  ipId: number,
  newOwnerAddress: string,
) {
  try {
    const contract = await getContract();

    const tx = await contract.transferIP(ipId, newOwnerAddress);
    const receipt = await tx.wait();

    return {
      success: true,
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber?.toString() || '0',
      gasUsed: receipt.gasUsed?.toString() || '0',
      timestamp: Date.now(),
    };
  } catch (error: any) {
    // Safely extract error message without triggering BigInt serialization
    let errorMessage = 'Failed to transfer on blockchain';
    
    try {
      if (error?.code === 'ACTION_REJECTED') {
        errorMessage = 'Transaction was rejected in MetaMask';
      } else if (error?.message && typeof error.message === 'string') {
        errorMessage = error.message;
      } else if (error?.reason && typeof error.reason === 'string') {
        errorMessage = error.reason;
      }
    } catch (e) {
      errorMessage = 'Failed to transfer on blockchain';
    }
    
    console.error("Blockchain transfer error:", errorMessage);
    throw new Error(errorMessage);
  }
}