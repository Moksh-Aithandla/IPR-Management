// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title IPRightsRegistry
 * @dev Smart contract for registering and managing intellectual property rights on Sepolia
 * 
 * ⚠️ IMPORTANT: ENABLE OPTIMIZER BEFORE DEPLOYMENT
 * 
 * DEPLOYMENT INSTRUCTIONS:
 * 1. Go to https://remix.ethereum.org/
 * 2. Create a new file named "IPRightsRegistry.sol" and paste this contract
 * 3. Click "Solidity Compiler" icon (left sidebar)
 * 4. ⚠️ CRITICAL: Click "Advanced Configurations" dropdown
 * 5. ⚠️ Enable "Enable optimization" checkbox
 * 6. Set "Runs" to 200 (default)
 * 7. Click "Compile IPRightsRegistry.sol"
 * 8. Switch to "Deploy & Run Transactions" tab
 * 9. Select "Injected Provider - MetaMask" as environment
 * 10. Make sure MetaMask is on Sepolia Test Network
 * 11. Click "Deploy"
 * 12. Confirm transaction in MetaMask
 * 13. Copy the deployed contract address
 * 14. Update CONTRACT_ADDRESS in /utils/blockchain.ts with your deployed address
 * 
 * Without the optimizer enabled, you'll get error: "max initcode size exceeded"
 */

contract IPRightsRegistry {
    struct IPRight {
        string title;
        string description;
        string ipfsHash;
        string category;
        address owner;
        address applicant;
        uint256 registrationDate;
        bool isActive;
    }
    
    mapping(uint256 => IPRight) public ipRights;
    uint256 public ipCounter;
    
    address public admin;
    
    event IPRegistered(
        uint256 indexed ipId,
        string title,
        address indexed owner,
        address indexed applicant,
        string ipfsHash,
        uint256 registrationDate
    );
    
    event IPTransferred(
        uint256 indexed ipId,
        address indexed from,
        address indexed to,
        uint256 transferDate
    );
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }
    
    constructor() {
        admin = msg.sender;
        ipCounter = 0;
    }
    
    function registerIP(
        string memory _title,
        string memory _description,
        string memory _ipfsHash,
        string memory _category,
        address _applicant
    ) public onlyAdmin returns (uint256) {
        ipCounter++;
        
        ipRights[ipCounter] = IPRight({
            title: _title,
            description: _description,
            ipfsHash: _ipfsHash,
            category: _category,
            owner: msg.sender,
            applicant: _applicant,
            registrationDate: block.timestamp,
            isActive: true
        });
        
        emit IPRegistered(
            ipCounter,
            _title,
            msg.sender,
            _applicant,
            _ipfsHash,
            block.timestamp
        );
        
        return ipCounter;
    }
    
    function transferIP(uint256 _ipId, address _newOwner) public onlyAdmin {
        require(ipRights[_ipId].isActive, "IP right does not exist");
        require(_newOwner != address(0), "Invalid address");
        
        ipRights[_ipId].owner = _newOwner;
        
        emit IPTransferred(_ipId, msg.sender, _newOwner, block.timestamp);
    }
    
    function getIPRight(uint256 _ipId) public view returns (
        string memory title,
        string memory description,
        string memory ipfsHash,
        string memory category,
        address owner,
        address applicant,
        uint256 registrationDate,
        bool isActive
    ) {
        IPRight memory ip = ipRights[_ipId];
        return (
            ip.title,
            ip.description,
            ip.ipfsHash,
            ip.category,
            ip.owner,
            ip.applicant,
            ip.registrationDate,
            ip.isActive
        );
    }
}