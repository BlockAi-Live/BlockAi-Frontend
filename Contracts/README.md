# BlockAi Smart Contracts

Complete documentation for the BlockAi protocol's on-chain contracts. This repository contains the Solidity source code, test suites, and deployment scripts for both the **BlockAi ERC20 Token** and the **Genesis Pass NFT**.

---

## Overview

The BlockAi protocol consists of two primary smart contracts:

1. **BlockAi Token (BLKAI)** – A fixed-supply ERC20 token with gasless approval support
2. **Genesis Pass NFT** – A limited-edition ERC721 NFT that serves as an access pass and membership credential

Both contracts are designed for production use and integrate seamlessly with the BlockAi frontend via thirdweb SDK for GenesisNFT.

---

## BlockAi ERC20 Token

### Contract Details

| Property | Value |
|----------|-------|
| **Contract Name** | `BlockAi` |
| **Symbol** | `BLKAI` |
| **Decimals** | `18` |
| **Standard** | ERC20 + ERC20Permit (EIP-2612) |
| **Total Supply** | `1,000,000,000 BLKAI` (1 billion tokens) |
| **Supply Type** | Fixed, immutable, non-inflationary |
| **File Location** | `src/blkai.sol` |
| **License** | MIT |

### Token Specifications

#### Supply Characteristics

- **Total Supply**: `1,000,000,000 * 10^18` wei (1 billion BLKAI tokens)
- **Supply Model**: All tokens are minted once during contract deployment to the founder address
- **Immutability**: 
  - No `mint()` function exists
  - No `burn()` function exists
  - Supply cannot be increased or decreased after deployment
  - No admin, owner, or minter roles
- **Distribution**: The founder address receives the entire supply and is responsible for:
  - Team allocations
  - Treasury reserves
  - Liquidity provision (DEXes like Uniswap)
  - Presale/ICO distributions
  - Airdrops and community rewards

#### Token Features

1. **Standard ERC20 Functionality**
   - `transfer(address to, uint256 amount)` – Transfer tokens to another address
   - `transferFrom(address from, address to, uint256 amount)` – Transfer tokens on behalf of another address
   - `approve(address spender, uint256 amount)` – Approve a spender to transfer tokens
   - `balanceOf(address account)` – Query token balance
   - `allowance(address owner, address spender)` – Query allowance

2. **ERC20Permit (EIP-2612) – Gasless Approvals**
   - `permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s)` – Approve tokens via off-chain signature
   - `nonces(address owner)` – Get the current nonce for permit signatures
   - `DOMAIN_SEPARATOR()` – Get the EIP-712 domain separator
   - Enables gasless token approvals for better UX

3. **Standard ERC20 Metadata**
   - `name()` → `"BlockAi"`
   - `symbol()` → `"BLKAI"`
   - `decimals()` → `18`
   - `totalSupply()` → `1_000_000_000 * 1e18`

### Constructor

```solidity
constructor(address founder)
```

- **Parameters**:
  - `founder` (address): The address that receives all 1 billion BLKAI tokens
- **Requirements**:
  - `founder` cannot be the zero address
- **Behavior**:
  - Mints `TOTAL_SUPPLY` to `founder`
  - Initializes ERC20Permit with domain name `"BlockAi"`
  - No further tokens can ever be created

### Security & Invariants

- **Supply Invariant**: `totalSupply() == TOTAL_SUPPLY` (permanently)
- **No Centralization**: No admin functions, no pause mechanism, no upgradeability
- **OpenZeppelin Audited**: Built on OpenZeppelin's `ERC20Permit` contract
- **Zero Address Protection**: Constructor reverts if founder is `address(0)`

---

## Genesis Pass NFT

### Contract Details

| Property | Value |
|----------|-------|
| **Contract Type** | `DropERC721` (thirdweb) |
| **Contract Version** | `4` |
| **Standard** | ERC721A (gas-optimized) + ERC2981 (royalties) |
| **Deployment** | Deployed via thirdweb (not from this repo) |
| **Reference Implementation** | `src/DropERC721.sol` |
| **License** | Apache-2.0 |

### NFT Specifications

#### Supply & Pricing

- **Maximum Supply**: Configurable via `maxTotalSupply` (100)
- **Minting Model**: Claim-based drop with configurable claim conditions
- **Pricing**: Set per claim phase via `setClaimConditions()` ~$30

#### Features

1. **Lazy Minting**
   - `lazyMint(uint256 amount, string baseURIForTokens, bytes encryptedBaseURI)` – Batch mint NFTs without immediate token ID assignment
   - Only accounts with `MINTER_ROLE` can lazy mint
   - Supports delayed reveal via encrypted base URI

2. **Claim Conditions (Drop Mechanism)**
   - `setClaimConditions(ClaimCondition[] phases, bool resetClaimEligibility)` – Set claim phases with:
     - Start timestamp
     - Maximum claimable supply per phase
     - Quantity limit per wallet
     - Price per token
     - Currency (native or ERC20)
   - `claim(address receiver, uint256 quantity, address currency, uint256 pricePerToken, AllowlistProof proof, bytes data)` – Claim NFTs according to active phase

3. **Standard ERC721 Functions**
   - `balanceOf(address owner)` – Query NFT balance
   - `ownerOf(uint256 tokenId)` – Query NFT owner
   - `tokenURI(uint256 tokenId)` – Get metadata URI
   - `burn(uint256 tokenId)` – Burn an NFT (if approved)

### Initialization

The contract is upgradeable and initialized via `initialize()`:

```solidity
function initialize(
    address _defaultAdmin,
    string memory _name,
    string memory _symbol,
    string memory _contractURI,
    address[] memory _trustedForwarders,
    address _saleRecipient,
    address _royaltyRecipient,
    uint128 _royaltyBps,
    uint128 _platformFeeBps,
    address _platformFeeRecipient
) external initializer
```

**Parameters**:
- `_defaultAdmin`: Admin address (receives `DEFAULT_ADMIN_ROLE`)
- `_name`: NFT collection name
- `_symbol`: NFT collection symbol
- `_contractURI`: Contract-level metadata URI
- `_trustedForwarders`: Addresses for meta-transactions (ERC2771)
- `_saleRecipient`: Primary sale recipient
- `_royaltyRecipient`: Royalty recipient address
- `_royaltyBps`: Royalty basis points (e.g., 500 = 5%)
- `_platformFeeBps`: Platform fee basis points
- `_platformFeeRecipient`: Platform fee recipient

### Key Functions

| Function | Description | Access |
|----------|-------------|--------|
| `lazyMint()` | Batch mint NFTs with base URI | `MINTER_ROLE` |
| `setClaimConditions()` | Configure claim phases | `DEFAULT_ADMIN_ROLE` |
| `claim()` | Claim NFTs according to active phase | Public |
| `setMaxTotalSupply()` | Set global max supply cap | `DEFAULT_ADMIN_ROLE` |
| `reveal()` | Reveal encrypted metadata | `METADATA_ROLE` |
| `burn()` | Burn an NFT | Owner or approved |

---

## Architecture & Design

### BlockAi Token Design Philosophy

- **Simplicity**: Minimal contract with no admin functions or upgradeability
- **Immutability**: Fixed supply ensures predictable tokenomics
- **Gas Efficiency**: Standard ERC20 with permit support for gasless approvals
- **Security**: Built on audited OpenZeppelin contracts

### Genesis Pass Design Philosophy

- **Gas Optimization**: Uses ERC721A for batch minting efficiency
- **User Experience**: Claim-based drops with configurable phases and allowlists
- **Revenue**: Built-in royalty and platform fee mechanisms

### Contract Interaction

- **Genesis Pass → BLKAI**: Genesis Pass holders may receive BLKAI token allocations (handled off-chain or via separate contracts)
- **Frontend Integration**: Both contracts integrate with the BlockAi frontend via thirdweb SDK
- **Deployment**: Genesis Pass is deployed via thirdweb; BlockAi token is deployed directly

---

## Testing

### Test Suite Overview

The contracts include comprehensive test suites written in Foundry:

| Test Suite | File | Tests | Coverage |
|------------|------|-------|----------|
| **BlockAi Token** | `test/blkai.t.sol` | 44 tests | ERC20, Permit, Transfers, Approvals, Fuzz |
| **DropERC721** | `test/DropERC721.t.sol` | 12 tests | Initialization, Lazy Mint, Claims, Access Control |

**Total: 56 tests, all passing**

### Running Tests

```bash
cd Contracts

# Run all tests
forge test

# Run with verbosity
forge test -v
forge test -vv

# Run specific test suite
forge test --match-contract BlockAiTest
forge test --match-contract DropERC721Test

# Run specific test
forge test --match-test test_Initialization
```

### Test Coverage Details

#### BlockAi Token Tests (`test/blkai.t.sol`)

**Categories**:
- ✅ Deployment & Initial State (6 tests)
- ✅ ERC20 Transfers (7 tests)
- ✅ Approvals & TransferFrom (8 tests)
- ✅ ERC20Permit (6 tests)
- ✅ Edge Cases & Invariants (15 tests)
- ✅ Fuzz Tests (3 tests)

**Key Test Cases**:
- `test_Deployment()` – Verifies name, symbol, decimals
- `test_InitialSupply()` – Confirms 1B token supply
- `test_Transfer()` – Standard transfer functionality
- `test_Permit()` – Gasless approval via permit
- `test_SupplyIsImmutable()` – Ensures no mint function exists
- `testFuzz_Transfer()` – Fuzz testing for transfers

#### DropERC721 Tests (`test/DropERC721.t.sol`)

**Categories**:
- ✅ Initialization (1 test)
- ✅ Lazy Minting (2 tests)
- ✅ Claim Conditions & Claims (4 tests)
- ✅ Max Supply Enforcement (1 test)
- ✅ Metadata & Burning (2 tests)
- ✅ Access Control (2 tests)

**Key Test Cases**:
- `test_Initialization()` – Verifies proxy initialization
- `test_LazyMint()` – Tests batch minting
- `test_SetClaimConditions_AndClaim()` – Full claim flow
- `test_ClaimRespectsQuantityLimit()` – Per-wallet limits
- `test_Burn()` – NFT burning functionality

---

## Deployment

### BlockAi Token Deployment

**Deployment Method**: Direct deployment (non-upgradeable)

```solidity
// Deploy with founder address
BlockAi token = new BlockAi(founderAddress);
```

### Genesis Pass Deployment

**Deployment Method**: Deployed via thirdweb (not from this repo)

**Note**: The Genesis Pass contract is already deployed and managed via thirdweb. The source code in `src/DropERC721.sol` is for **reference and maintenance only**.

**Deployment Script**: `script/Deploy.s.sol` (stub – contract already deployed)

---

## Contract Specifications

### BlockAi Token

| Specification | Value |
|---------------|-------|
| **Contract Name** | `BlockAi` |
| **Symbol** | `BLKAI` |
| **Decimals** | `18` |
| **Total Supply** | `1,000,000,000 BLKAI` |
| **Supply Type** | Fixed, immutable |
| **Standards** | ERC20, ERC20Permit (EIP-2612) |
| **Upgradeable** | No |
| **Pausable** | No |
| **Mintable** | No |
| **Burnable** | No |
| **Admin Functions** | None |

### Genesis Pass NFT

| Specification | Value |
|---------------|-------|
| **Contract Type** | `DropERC721` |
| **Contract Version** | `4` |
| **Standards** | ERC721A, ERC2981, ERC2771 |
| **Upgradeable** | Yes (via proxy) |
| **Minting Model** | Lazy mint + claim-based drop |
| **Max Supply** | Configurable (set by admin) |
| **Royalties** | Configurable (ERC2981) |
| **Platform Fees** | 50 bps default + configurable |
| **Access Control** | Role-based (DEFAULT_ADMIN_ROLE, MINTER_ROLE, METADATA_ROLE, TRANSFER_ROLE) |

---

## File Structure

```
Contracts/
├── src/
│   ├── blkai.sol              # BlockAi ERC20 token contract
│   └── DropERC721.sol         # Genesis Pass reference implementation
├── test/
│   ├── blkai.t.sol            # BlockAi token test suite (44 tests)
│   └── DropERC721.t.sol       # DropERC721 test suite (12 tests)
├── script/
│   └── Deploy.s.sol           # Deployment script (stub)
├── foundry.toml               # Foundry configuration
├── README.md                  # This file
```

---

## Dependencies

### Foundry Dependencies

- `forge-std` – Foundry standard library
- `openzeppelin-contracts` – OpenZeppelin contracts (ERC20Permit)
- `openzeppelin-contracts-upgradeable` – Upgradeable contracts (for DropERC721)

### Node.js Dependencies (for thirdweb contracts)

- `@thirdweb-dev/contracts` – Thirdweb contract implementations
- `@openzeppelin/contracts-upgradeable` – Upgradeable OpenZeppelin contracts
- `erc721a-upgradeable` – Gas-optimized ERC721 implementation

**Installation**:
```bash
# From repo root
pnpm install

# Or
npm install
```

---

## Security Considerations

### BlockAi Token

- ✅ **Fixed Supply**: No inflation risk
- ✅ **No Admin Functions**: Fully decentralized
- ✅ **OpenZeppelin Audited**: Built on battle-tested contracts
- ✅ **Zero Address Protection**: Constructor validates founder address

### Genesis Pass

- ⚠️ **Upgradeable**: Admin can upgrade implementation (ensure admin is multisig)
- ⚠️ **Role-Based Access**: Secure role management is critical
- ✅ **Thirdweb Audited**: Uses audited thirdweb contracts
- ✅ **Claim Conditions**: Configurable limits prevent abuse

---

## License

- **BlockAi Token**: MIT License
- **Genesis Pass (DropERC721)**: Apache-2.0 License

---