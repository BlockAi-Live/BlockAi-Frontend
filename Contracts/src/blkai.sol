// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

/**
 * @title BlockAi
 * @notice Fixed-supply ERC20 token with gasless approval support (EIP-2612)
 * @dev IMPORTANT: This token has a permanently fixed supply of 1,000,000,000 tokens.
 *      
 *      SUPPLY CHARACTERISTICS:
 *      - Total supply: 1,000,000,000 BLKAI (1 billion tokens)
 *      - All tokens minted once during contract deployment
 *      - Supply is immutable and can NEVER be increased
 *      - No mint function exists in this contract
 *      - No admin, owner, or minter roles exist
 *      - No mechanism to create additional tokens
 *      
 *      FEATURES:
 *      - Standard ERC20 functionality (transfer, approve, transferFrom)
 *      - EIP-2612 Permit: Gasless approvals via off-chain signatures
 *      - 18 decimals (standard)
 */
contract BlockAi is ERC20Permit {
    
    /// @notice Total and maximum supply of BLKAI tokens (immutable constant)
    /// @dev This represents 1 billion tokens with 18 decimals
    ///      This is the only supply that will ever exist - no inflation possible
    uint256 public constant TOTAL_SUPPLY = 1_000_000_000 * 1e18;

    /**
     * @notice Constructs the BlockAi token and mints the entire fixed supply
     * @dev Mints all 1,000,000,000 BLKAI tokens to the specified founder address
     *      After this constructor executes, no additional tokens can ever be created
     *      
     * @param founder The address that will receive all tokens (cannot be zero address)
     *      
     *      The founder receives all tokens and is responsible for distribution via:
     *      - Manual transfers to team/advisors/treasury
     *      - Adding liquidity to DEXes (Uniswap, etc.)
     *      - Presale/ICO contracts
     *      - Airdrops
     *      
     *      This is a one-time operation that cannot be repeated
     */
    constructor(address founder) ERC20("BlockAi", "BLKAI") ERC20Permit("BlockAi") {
        require(founder != address(0), "Address Cannot Be Zero");
        _mint(founder, TOTAL_SUPPLY);
    }

}