# Testing Guide - Sepolia Blockchain Integration

Your smart contract has been deployed at:
**`0xd9145CCE52D386f254917e481eB44e9943F39138`**

View it on Etherscan: https://sepolia.etherscan.io/address/0xd9145CCE52D386f254917e481eB44e9943F39138

## How to Test IP Registration

### Step 1: Connect to the Application

1. Open your application in a browser with MetaMask installed
2. Make sure MetaMask is set to **Sepolia Test Network**
3. Connect with your admin account: `0xEf1A91cCb29C85135EA58F6f800B6e66a5459589`
4. You should see the green "Smart Contract Deployed" banner showing your contract address

### Step 2: Register an IP Right

Fill out the registration form with the following test data:

**IP Title:** "Revolutionary AI Algorithm"

**Category:** Patent

**Applicant Address:** Use any valid Ethereum address (examples):
- Your own address
- Test address: `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1`
- Another test address: `0x5B38Da6a701c568545dCfcB03FcB875f56beddC4`

**Description:**
```
A novel machine learning algorithm that improves processing efficiency by 300%. 
This patented technology uses advanced neural networks and optimization techniques.
Patent pending - Priority Date: January 8, 2026
```

**Upload Documentation:** Any PDF or image file (test file)

**Owner Address:** Will automatically show your admin address

### Step 3: Submit the Transaction

1. Click "Register IP Right on Blockchain"
2. **MetaMask popup will appear** - Review the transaction details
3. Click **"Confirm"** in MetaMask
4. Wait 15-30 seconds for the transaction to be mined
5. You'll see the success screen with:
   - ✅ Transaction Hash (real Sepolia transaction)
   - 🕐 Registration Timestamp
   - 🔗 Link to verify on Etherscan

### Step 4: Verify on Etherscan

After successful registration:

1. Click the **"Verify on Etherscan"** button
2. You'll be taken to Sepolia Etherscan
3. You should see:
   - ✅ Transaction Status: Success
   - 📦 Block Number
   - ⏰ Timestamp
   - ⛽ Gas Used
   - 📝 Input Data (your registration details)
   - 📋 Logs (IPRegistered event)

## What to Look For on Etherscan

### Transaction Page

When you view the transaction on Etherscan, verify:

1. **Status:** Green checkmark with "Success"
2. **To:** Your contract address `0xd9145CCE52D386f254917e481eB44e9943F39138`
3. **From:** Your admin address `0xEf1A91cCb29C85135EA58F6f800B6e66a5459589`
4. **Value:** 0 ETH (we're just registering data)
5. **Transaction Fee:** Small amount of Sepolia ETH (gas cost)

### Logs Tab

Click on "Logs" to see the emitted event:

- **Event:** `IPRegistered`
- **Topics:**
  - IP ID (number)
  - Owner address
  - Applicant address
- **Data:**
  - Title
  - IPFS Hash
  - Registration timestamp

## Browser Console Logs

Open Developer Tools (F12) → Console to see detailed logs:

```
Starting blockchain registration...
Contract Address: 0xd9145CCE52D386f254917e481eB44e9943F39138
Connected to network: sepolia Chain ID: 11155111n
Contract instance created
Calling registerIP function...
Transaction sent! Hash: 0xabcd...
Waiting for confirmation...
Transaction confirmed!
Block Number: 12345678
Gas Used: 123456
```

## Common Issues & Solutions

### ❌ "MetaMask is not installed"
→ Install MetaMask extension and refresh the page

### ❌ "Please switch to Sepolia Test Network"
→ In MetaMask, switch network to "Sepolia Test Network"

### ❌ "Insufficient Sepolia ETH for gas fees"
→ Get free Sepolia ETH from:
- https://sepoliafaucet.com/
- https://www.alchemy.com/faucets/ethereum-sepolia

### ❌ "Only the admin account can register IP rights"
→ Make sure you're connected with: `0xEf1A91cCb29C85135EA58F6f800B6e66a5459589`

### ❌ "Transaction was rejected in MetaMask"
→ You clicked "Reject" - try again and click "Confirm"

### ❌ "Invalid applicant Ethereum address format"
→ Make sure the applicant address starts with "0x" and is 42 characters long

## Expected Results

✅ **Success Screen Shows:**
- Green checkmark icon
- "IP Right Registered Successfully!"
- Real transaction hash (starts with 0x)
- Timestamp of registration
- "Verify on Etherscan" button

✅ **On Etherscan You See:**
- Transaction with "Success" status
- Your registration data in the logs
- Proof that the data is permanently on the blockchain

✅ **Contract Interaction:**
- All data is stored immutably on Sepolia
- Anyone can verify the transaction
- The IP registration cannot be modified or deleted

## Multiple Registrations

You can register multiple IP rights:
- Each gets a unique IP ID (1, 2, 3, ...)
- Each gets a unique transaction hash
- All are independently verifiable on Etherscan
- Each registration costs a small amount of gas

## Next Steps

After successful testing:

1. ✅ IP registrations are working on Sepolia blockchain
2. ✅ All transactions are verifiable on Etherscan
3. ✅ Data is immutably stored on-chain
4. ✅ System is ready for production use (on testnet)

For production deployment to Ethereum mainnet:
- Deploy contract to mainnet (costs real ETH)
- Update CONTRACT_ADDRESS to mainnet address
- Change all Etherscan links from `sepolia.etherscan.io` to `etherscan.io`
- Be aware: Mainnet gas fees are REAL and cost real money!

## Support

If you encounter any issues:
1. Check browser console (F12) for error messages
2. Verify you're on Sepolia network
3. Confirm you have enough Sepolia ETH for gas
4. Make sure you're using the admin account
5. Try refreshing the page and reconnecting MetaMask

Happy testing! 🚀