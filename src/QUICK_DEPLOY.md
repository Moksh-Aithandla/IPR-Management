# ⚡ Quick Deploy Checklist

## Problem: "max initcode size exceeded" 

**Solution:** Enable the optimizer! ✅

## 🚀 Deploy in 5 Steps

### 1️⃣ Open Remix
→ https://remix.ethereum.org/

### 2️⃣ Create & Paste Contract
- Create file: `IPRightsRegistry.sol`
- Copy/paste from `/contracts/IPRightsRegistry.sol`

### 3️⃣ ⚠️ ENABLE OPTIMIZER (Critical!)
```
Solidity Compiler Tab
  ↓
Advanced Configurations
  ↓
☑️ Enable optimization  ← CHECK THIS!
Runs: 200
```

### 4️⃣ Compile
- Click "Compile IPRightsRegistry.sol"
- Wait for ✅ green checkmark

### 5️⃣ Deploy
- Deploy tab
- Environment: "Injected Provider - MetaMask"
- Network: Sepolia
- Click "Deploy"
- Confirm in MetaMask
- Copy contract address

### 6️⃣ Update Code
```typescript
// In /utils/blockchain.ts
export const CONTRACT_ADDRESS = "0xYourAddressHere";
```

## ✅ Success Indicators

- ✅ No "max initcode size" error
- ✅ MetaMask shows reasonable gas fee
- ✅ Contract deploys in ~15-30 seconds
- ✅ You get a contract address (0x...)

## 📖 Full Guides

- **Full Instructions:** `/DEPLOYMENT_GUIDE.md`
- **Optimizer Fix:** `/OPTIMIZER_FIX.md`
- **Testing Guide:** `/TESTING_GUIDE.md`

## 🆘 Quick Troubleshooting

| Error | Solution |
|-------|----------|
| max initcode size exceeded | Enable optimizer! |
| Insufficient funds | Get Sepolia ETH from faucet |
| User rejected | Click "Confirm" in MetaMask |
| Wrong network | Switch to Sepolia in MetaMask |
| Only admin can... | Connect with admin account |

## 🎯 Remember

**ALWAYS** enable the optimizer before deploying!

Without optimizer: ❌ 60,166 bytes (too big!)
With optimizer: ✅ ~30,000 bytes (perfect!)
