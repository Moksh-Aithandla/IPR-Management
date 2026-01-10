# Admin Configuration

## Current Admin Address

**Admin MetaMask Account:** `0xEf1A91cCb29C85135EA58F6f800B6e66a5459589`

This is the **only** account authorized to:
- ✅ Access the IP Rights Management system
- ✅ Register new IP rights on the blockchain
- ✅ Transfer IP ownership
- ✅ Deploy the smart contract

## Important Notes

### Security
- Only this specific MetaMask address can access the admin dashboard
- Anyone connecting with a different address will see "Access Denied"
- The admin address is hardcoded in `/App.tsx`

### Smart Contract
- When deploying the smart contract, you **must** use this admin address
- The contract's `admin` variable will be set to the deployer's address
- Only this address can call admin-restricted functions on the blockchain

### Testing
- Make sure MetaMask is connected to: `0xEf1A91cCb29C85135EA58F6f800B6e66a5459589`
- Ensure you have Sepolia ETH in this account for gas fees
- Keep the private key secure - never share it!

## Changing the Admin Address

If you need to change the admin address in the future:

### 1. Update Frontend (`/App.tsx`)
```typescript
// Line 7
const ADMIN_ADDRESS = '0xYourNewAddressHere';
```

### 2. Re-deploy Smart Contract
- You must deploy a **new** smart contract with the new admin address
- The contract sets admin = msg.sender (the deployer)
- Update `CONTRACT_ADDRESS` in `/utils/blockchain.ts` with the new contract address

### 3. Update Documentation
Update the admin address in:
- `/DEPLOYMENT_GUIDE.md`
- `/TESTING_GUIDE.md`
- `/ADMIN_CONFIG.md` (this file)

### 4. Important Warning ⚠️
- You **cannot** change the admin on an already-deployed contract
- The contract's admin is immutable (set in constructor)
- You must deploy a completely new contract instance

## Previous Admin Address

For reference, the previous admin address was:
- ~~`0x13591389EE06948758541b38547a37FB9483F2f4`~~ (DEPRECATED)

## Network Configuration

- **Network:** Sepolia Test Network
- **Chain ID:** 11155111 (0xaa36a7 in hex)
- **RPC URL:** https://rpc.sepolia.org
- **Block Explorer:** https://sepolia.etherscan.io

## Get Sepolia ETH

Free Sepolia ETH faucets for the admin account:
- https://sepoliafaucet.com/
- https://www.alchemy.com/faucets/ethereum-sepolia
- https://cloud.google.com/application/web3/faucet/ethereum/sepolia

## Security Best Practices

1. **Never** share your private key or seed phrase
2. **Always** verify you're on Sepolia (not mainnet) before transactions
3. **Double-check** recipient addresses before transfers
4. **Keep** your MetaMask password secure
5. **Enable** MetaMask's phishing detection
6. **Use** a hardware wallet for production/mainnet

## Support

If you need to verify the current admin address:
1. Check `/App.tsx` line 7
2. Or call the `admin()` function on your deployed contract
3. It should return: `0xEf1A91cCb29C85135EA58F6f800B6e66a5459589`

Last Updated: January 8, 2026
