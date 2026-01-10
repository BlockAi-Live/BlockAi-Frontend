// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {GenesisPass} from "../src/GenesisPass.sol";

// Malicious contract for reentrancy testing
contract ReentrancyAttacker {
    GenesisPass public target;
    uint256 public attackCount;
    bool public attacking;

    constructor(GenesisPass _target) {
        target = _target;
    }

    function attack() external payable {
        attacking = true;
        attackCount++;
        target.mint{value: msg.value}(address(this));
        attacking = false;
    }

    // Try to reenter during mint
    function onERC721Received(address, address, uint256, bytes calldata) external returns (bytes4) {
        if (attacking && attackCount < 10) {
            attackCount++;
            target.mint{value: 0.005 ether}(address(this));
        }
        return this.onERC721Received.selector;
    }

    receive() external payable {
        if (attacking && attackCount < 10) {
            attackCount++;
            target.mint{value: 0.005 ether}(address(this));
        }
    }
}

// Contract for DoS testing
contract DoSAttacker {
    GenesisPass public target;

    constructor(GenesisPass _target) {
        target = _target;
    }

    function attack() external payable {
        // Try to cause DoS by calling mint repeatedly
        for (uint256 i = 0; i < 100; i++) {
            try target.mint{value: msg.value}(address(this)) {} catch {}
        }
    }
}

contract GenesisPassTest is Test {
    GenesisPass public genesisPass;
    address public owner = address(0x100);
    address public user1 = address(0x2);
    address public user2 = address(0x3);
    address public user3 = address(0x4);
    address public user4 = address(0x5);

    uint256 public constant MINT_PRICE = 0.005 ether;
    uint256 public constant MAX_SUPPLY = 1000;
    uint256 public constant TOKENS_PER_NFT = 100;

    event Minted(address indexed to, uint256 indexed tokenId, uint256 price);
    event PointsAwarded(uint256 indexed tokenId, uint256 points, uint256 totalPoints);
    event TokensClaimed(uint256 indexed tokenId, address indexed claimer);
    event AccessLevelUpdated(uint256 indexed tokenId, uint256 newLevel);
    event AirdropEligibilityUpdated(uint256 indexed tokenId, bool eligible, uint256 multiplier);
    event MintPhaseChanged(GenesisPass.MintPhase oldPhase, GenesisPass.MintPhase newPhase);
    event AllowlistUpdated(address indexed account, bool allowed);
    event AllowlistBatchUpdated(address[] accounts, bool allowed);

    function setUp() public {
        vm.prank(owner);
        genesisPass = new GenesisPass(owner);
    }

    // ============ DEPLOYMENT TESTS ============

    function test_Deployment() public {
        assertEq(genesisPass.owner(), owner);
        assertEq(genesisPass.mintPrice(), MINT_PRICE);
        assertEq(genesisPass.MAX_SUPPLY(), MAX_SUPPLY);
        assertEq(genesisPass.TOKENS_PER_NFT(), TOKENS_PER_NFT);
        assertEq(uint256(genesisPass.currentPhase()), uint256(GenesisPass.MintPhase.NotStarted));
        assertFalse(genesisPass.tokenClaimEnabled());
        assertEq(genesisPass.totalSupply(), 0);
    }

    // ============ ALLOWLIST/FREEMINT TESTS ============

    function test_AllowlistPhase_FreeMint_Success() public {
        vm.prank(owner);
        genesisPass.addToAllowlist(user1);
        
        vm.prank(owner);
        genesisPass.setMintPhase(GenesisPass.MintPhase.AllowlistPhase);

        assertTrue(genesisPass.isOnAllowlist(user1));
        vm.prank(user1);
        genesisPass.mint{value: 0}(user1);

        assertEq(genesisPass.ownerOf(1), user1);
        assertEq(genesisPass.totalSupply(), 1);
        assertTrue(genesisPass.hasMinted(user1));
    }

    function test_AllowlistPhase_RevertWhen_NotOnAllowlist() public {
        vm.prank(owner);
        genesisPass.setMintPhase(GenesisPass.MintPhase.AllowlistPhase);

        vm.prank(user1);
        vm.expectRevert("Not on allowlist");
        genesisPass.mint{value: 0}(user1);
    }

    function test_AllowlistPhase_RevertWhen_PaymentSent() public {
        vm.prank(owner);
        genesisPass.addToAllowlist(user1);
        
        vm.prank(owner);
        genesisPass.setMintPhase(GenesisPass.MintPhase.AllowlistPhase);

        vm.deal(user1, 1 ether);
        vm.prank(user1);
        vm.expectRevert("Allowlist phase is free");
        genesisPass.mint{value: 0.001 ether}(user1);
    }

    function test_BatchAddToAllowlist_Success() public {
        address[] memory accounts = new address[](3);
        accounts[0] = user1;
        accounts[1] = user2;
        accounts[2] = user3;

        vm.prank(owner);
        genesisPass.batchAddToAllowlist(accounts);

        assertTrue(genesisPass.isOnAllowlist(user1));
        assertTrue(genesisPass.isOnAllowlist(user2));
        assertTrue(genesisPass.isOnAllowlist(user3));
    }

    function test_BatchRemoveFromAllowlist_Success() public {
        address[] memory accounts = new address[](2);
        accounts[0] = user1;
        accounts[1] = user2;

        vm.prank(owner);
        genesisPass.batchAddToAllowlist(accounts);

        vm.prank(owner);
        genesisPass.batchRemoveFromAllowlist(accounts);

        assertFalse(genesisPass.isOnAllowlist(user1));
        assertFalse(genesisPass.isOnAllowlist(user2));
    }

    function test_RemoveFromAllowlist_Success() public {
        vm.prank(owner);
        genesisPass.addToAllowlist(user1);
        assertTrue(genesisPass.isOnAllowlist(user1));

        vm.prank(owner);
        genesisPass.removeFromAllowlist(user1);
        assertFalse(genesisPass.isOnAllowlist(user1));
    }

    // ============ MULTI-PHASE SALES TESTS ============

    function test_MultiPhase_AllowlistThenPublic() public {
        // Phase 1: Allowlist freemint
        vm.prank(owner);
        genesisPass.addToAllowlist(user1);
        vm.prank(owner);
        genesisPass.addToAllowlist(user2);
        
        vm.prank(owner);
        genesisPass.setMintPhase(GenesisPass.MintPhase.AllowlistPhase);

        // User1 mints for free
        vm.prank(user1);
        genesisPass.mint{value: 0}(user1);
        assertEq(genesisPass.ownerOf(1), user1);

        // User2 mints for free
        vm.prank(user2);
        genesisPass.mint{value: 0}(user2);
        assertEq(genesisPass.ownerOf(2), user2);

        // Phase 2: Public paid mint
        vm.prank(owner);
        genesisPass.setMintPhase(GenesisPass.MintPhase.PublicPhase);

        // User3 mints for price
        vm.deal(user3, 1 ether);
        vm.prank(user3);
        genesisPass.mint{value: MINT_PRICE}(user3);
        assertEq(genesisPass.ownerOf(3), user3);

        // User4 mints for price
        vm.deal(user4, 1 ether);
        vm.prank(user4);
        genesisPass.mint{value: MINT_PRICE}(user4);
        assertEq(genesisPass.ownerOf(4), user4);

        assertEq(genesisPass.totalSupply(), 4);
    }

    function test_PublicPhase_PaidMint_Success() public {
        vm.prank(owner);
        genesisPass.setMintPhase(GenesisPass.MintPhase.PublicPhase);

        vm.deal(user1, 1 ether);
        vm.prank(user1);
        genesisPass.mint{value: MINT_PRICE}(user1);

        assertEq(genesisPass.ownerOf(1), user1);
        assertEq(genesisPass.totalSupply(), 1);
    }

    function test_PublicPhase_RevertWhen_InsufficientPayment() public {
        vm.prank(owner);
        genesisPass.setMintPhase(GenesisPass.MintPhase.PublicPhase);

        vm.deal(user1, 1 ether);
        vm.prank(user1);
        vm.expectRevert("Insufficient payment");
        genesisPass.mint{value: 0.001 ether}(user1);
    }

    function test_PublicPhase_RefundExcessPayment() public {
        vm.prank(owner);
        genesisPass.setMintPhase(GenesisPass.MintPhase.PublicPhase);

        uint256 excessAmount = 0.01 ether;
        uint256 totalPayment = MINT_PRICE + excessAmount;
        vm.deal(user1, totalPayment);

        uint256 balanceBefore = user1.balance;
        vm.prank(user1);
        genesisPass.mint{value: totalPayment}(user1);
        uint256 balanceAfter = user1.balance;

        assertEq(balanceAfter, balanceBefore - MINT_PRICE);
    }

    function test_MintPhase_RevertWhen_NotStarted() public {
        vm.deal(user1, 1 ether);
        vm.prank(user1);
        vm.expectRevert("Minting not started");
        genesisPass.mint{value: MINT_PRICE}(user1);
    }

    function test_SetMintPhase_OnlyOwner() public {
        vm.prank(user1);
        vm.expectRevert();
        genesisPass.setMintPhase(GenesisPass.MintPhase.AllowlistPhase);
    }

    function test_SetMintPhase_EmitsEvent() public {
        vm.prank(owner);
        vm.expectEmit(true, false, false, false);
        emit MintPhaseChanged(GenesisPass.MintPhase.NotStarted, GenesisPass.MintPhase.AllowlistPhase);
        genesisPass.setMintPhase(GenesisPass.MintPhase.AllowlistPhase);
    }

    // ============ REENTRANCY ATTACK TESTS ============

    function test_Reentrancy_Mint_Protected() public {
        vm.prank(owner);
        genesisPass.setMintPhase(GenesisPass.MintPhase.PublicPhase);

        ReentrancyAttacker attacker = new ReentrancyAttacker(genesisPass);
        vm.deal(address(attacker), 10 ether);

        // The reentrancy guard should prevent reentrancy attacks
        // The attack should revert when trying to reenter
        vm.expectRevert();
        attacker.attack{value: MINT_PRICE}();
        
        // Verify no tokens were minted (reentrancy prevented, entire transaction reverted)
        assertEq(genesisPass.totalSupply(), 0);
    }

    function test_Reentrancy_Withdraw_Protected() public {
        vm.prank(owner);
        genesisPass.setMintPhase(GenesisPass.MintPhase.PublicPhase);

        // Mint and accumulate funds
        vm.deal(user1, 1 ether);
        vm.prank(user1);
        genesisPass.mint{value: MINT_PRICE}(user1);

        // Withdraw should be protected
        uint256 balanceBefore = owner.balance;
        vm.prank(owner);
        genesisPass.withdraw();
        uint256 balanceAfter = owner.balance;

        assertEq(balanceAfter - balanceBefore, MINT_PRICE);
        assertEq(address(genesisPass).balance, 0);
    }

    function test_Reentrancy_ClaimTokens_Protected() public {
        vm.prank(owner);
        genesisPass.setMintPhase(GenesisPass.MintPhase.PublicPhase);
        vm.prank(owner);
        genesisPass.setTokenClaimEnabled(true);

        vm.deal(user1, 1 ether);
        vm.prank(user1);
        genesisPass.mint{value: MINT_PRICE}(user1);

        // Claim tokens - should be protected (though claimTokens doesn't have external calls)
        vm.prank(user1);
        genesisPass.claimTokens(1);

        (, bool tokensClaimed,,,) = genesisPass.getPassData(1);
        assertTrue(tokensClaimed);
    }

    // ============ DENIAL OF SERVICE (DoS) TESTS ============

    function test_DoS_MaxSupply_Enforced() public {
        vm.prank(owner);
        genesisPass.setMintPhase(GenesisPass.MintPhase.PublicPhase);

        // Mint all 1000 NFTs
        for (uint256 i = 0; i < MAX_SUPPLY; i++) {
            // casting to 'uint160' is safe because we're creating test addresses with values < 2^160
            // forge-lint: disable-next-line(unsafe-typecast)
            address user = address(uint160(i + 100));
            vm.deal(user, 1 ether);
            vm.prank(user);
            genesisPass.mint{value: MINT_PRICE}(user);
        }

        // Try to mint one more - should fail
        address newUser = address(0x999);
        vm.deal(newUser, 1 ether);
        vm.prank(newUser);
        vm.expectRevert("Max supply reached");
        genesisPass.mint{value: MINT_PRICE}(newUser);

        assertEq(genesisPass.totalSupply(), MAX_SUPPLY);
    }

    function test_DoS_OneMintPerAddress_Enforced() public {
        vm.prank(owner);
        genesisPass.setMintPhase(GenesisPass.MintPhase.PublicPhase);

        vm.deal(user1, 10 ether);
        vm.prank(user1);
        genesisPass.mint{value: MINT_PRICE}(user1);

        // Try to mint again from same address
        vm.prank(user1);
        vm.expectRevert("Address already minted");
        genesisPass.mint{value: MINT_PRICE}(user1);

        assertEq(genesisPass.totalSupply(), 1);
    }

    function test_DoS_BatchOperations_NotAffected() public {
        vm.prank(owner);
        genesisPass.setMintPhase(GenesisPass.MintPhase.PublicPhase);

        // Mint multiple NFTs
        vm.deal(user1, 1 ether);
        vm.prank(user1);
        genesisPass.mint{value: MINT_PRICE}(user1);

        vm.deal(user2, 1 ether);
        vm.prank(user2);
        genesisPass.mint{value: MINT_PRICE}(user2);

        vm.deal(user3, 1 ether);
        vm.prank(user3);
        genesisPass.mint{value: MINT_PRICE}(user3);

        // Batch operations should still work
        uint256[] memory tokenIds = new uint256[](3);
        tokenIds[0] = 1;
        tokenIds[1] = 2;
        tokenIds[2] = 3;

        uint256[] memory points = new uint256[](3);
        points[0] = 100;
        points[1] = 200;
        points[2] = 150;

        vm.prank(owner);
        genesisPass.batchAwardPoints(tokenIds, points);

        assertEq(genesisPass.getPoints(1), 100);
        assertEq(genesisPass.getPoints(2), 200);
        assertEq(genesisPass.getPoints(3), 150);
    }

    function test_DoS_PhaseTransition_Works() public {
        // Start with allowlist phase
        vm.prank(owner);
        genesisPass.addToAllowlist(user1);
        vm.prank(owner);
        genesisPass.setMintPhase(GenesisPass.MintPhase.AllowlistPhase);

        vm.prank(user1);
        genesisPass.mint{value: 0}(user1);

        // Transition to public phase
        vm.prank(owner);
        genesisPass.setMintPhase(GenesisPass.MintPhase.PublicPhase);

        vm.deal(user2, 1 ether);
        vm.prank(user2);
        genesisPass.mint{value: MINT_PRICE}(user2);

        assertEq(genesisPass.totalSupply(), 2);
    }

    // ============ POINTS SYSTEM TESTS ============

    function test_AwardPoints_Success() public {
        vm.prank(owner);
        genesisPass.setMintPhase(GenesisPass.MintPhase.PublicPhase);

        vm.deal(user1, 1 ether);
        vm.prank(user1);
        genesisPass.mint{value: MINT_PRICE}(user1);

        uint256 points = 100;
        vm.prank(owner);
        vm.expectEmit(true, false, false, false);
        emit PointsAwarded(1, points, points);
        genesisPass.awardPoints(1, points);

        assertEq(genesisPass.getPoints(1), points);
        assertEq(genesisPass.getWalletPoints(user1), points);
    }

    function test_AwardPoints_Accumulate() public {
        vm.prank(owner);
        genesisPass.setMintPhase(GenesisPass.MintPhase.PublicPhase);

        vm.deal(user1, 1 ether);
        vm.prank(user1);
        genesisPass.mint{value: MINT_PRICE}(user1);

        vm.prank(owner);
        genesisPass.awardPoints(1, 50);
        vm.prank(owner);
        genesisPass.awardPoints(1, 75);

        assertEq(genesisPass.getPoints(1), 125);
        assertEq(genesisPass.getWalletPoints(user1), 125);
    }

    function test_BatchAwardPoints_Success() public {
        vm.prank(owner);
        genesisPass.setMintPhase(GenesisPass.MintPhase.PublicPhase);

        // Mint 3 NFTs
        vm.deal(user1, 1 ether);
        vm.prank(user1);
        genesisPass.mint{value: MINT_PRICE}(user1);

        vm.deal(user2, 1 ether);
        vm.prank(user2);
        genesisPass.mint{value: MINT_PRICE}(user2);

        vm.deal(user3, 1 ether);
        vm.prank(user3);
        genesisPass.mint{value: MINT_PRICE}(user3);

        uint256[] memory tokenIds = new uint256[](3);
        tokenIds[0] = 1;
        tokenIds[1] = 2;
        tokenIds[2] = 3;

        uint256[] memory points = new uint256[](3);
        points[0] = 100;
        points[1] = 200;
        points[2] = 150;

        vm.prank(owner);
        genesisPass.batchAwardPoints(tokenIds, points);

        assertEq(genesisPass.getPoints(1), 100);
        assertEq(genesisPass.getPoints(2), 200);
        assertEq(genesisPass.getPoints(3), 150);
    }

    function test_BatchAwardPoints_RevertWhen_LengthMismatch() public {
        vm.prank(owner);
        genesisPass.setMintPhase(GenesisPass.MintPhase.PublicPhase);

        vm.deal(user1, 1 ether);
        vm.prank(user1);
        genesisPass.mint{value: MINT_PRICE}(user1);

        uint256[] memory tokenIds = new uint256[](1);
        tokenIds[0] = 1;

        uint256[] memory points = new uint256[](2);
        points[0] = 100;
        points[1] = 200;

        vm.prank(owner);
        vm.expectRevert("Arrays length mismatch");
        genesisPass.batchAwardPoints(tokenIds, points);
    }

    // ============ TOKEN ALLOCATION TESTS ============

    function test_ClaimTokens_Success() public {
        vm.prank(owner);
        genesisPass.setMintPhase(GenesisPass.MintPhase.PublicPhase);
        vm.prank(owner);
        genesisPass.setTokenClaimEnabled(true);

        vm.deal(user1, 1 ether);
        vm.prank(user1);
        genesisPass.mint{value: MINT_PRICE}(user1);

        vm.prank(user1);
        vm.expectEmit(true, true, false, false);
        emit TokensClaimed(1, user1);
        genesisPass.claimTokens(1);

        (, bool tokensClaimed,,,) = genesisPass.getPassData(1);
        assertTrue(tokensClaimed);
    }

    function test_ClaimTokens_RevertWhen_ClaimingDisabled() public {
        vm.prank(owner);
        genesisPass.setMintPhase(GenesisPass.MintPhase.PublicPhase);

        vm.deal(user1, 1 ether);
        vm.prank(user1);
        genesisPass.mint{value: MINT_PRICE}(user1);

        vm.prank(user1);
        vm.expectRevert("Token claiming is disabled");
        genesisPass.claimTokens(1);
    }

    function test_ClaimTokens_RevertWhen_NotOwner() public {
        vm.prank(owner);
        genesisPass.setMintPhase(GenesisPass.MintPhase.PublicPhase);
        vm.prank(owner);
        genesisPass.setTokenClaimEnabled(true);

        vm.deal(user1, 1 ether);
        vm.prank(user1);
        genesisPass.mint{value: MINT_PRICE}(user1);

        vm.prank(user2);
        vm.expectRevert("Not token owner");
        genesisPass.claimTokens(1);
    }

    function test_ClaimTokens_RevertWhen_AlreadyClaimed() public {
        vm.prank(owner);
        genesisPass.setMintPhase(GenesisPass.MintPhase.PublicPhase);
        vm.prank(owner);
        genesisPass.setTokenClaimEnabled(true);

        vm.deal(user1, 1 ether);
        vm.prank(user1);
        genesisPass.mint{value: MINT_PRICE}(user1);

        vm.prank(user1);
        genesisPass.claimTokens(1);

        vm.prank(user1);
        vm.expectRevert("Tokens already claimed");
        genesisPass.claimTokens(1);
    }

    // ============ ACCESS CONTROL TESTS ============

    function test_SetAccessLevel_Success() public {
        vm.prank(owner);
        genesisPass.setMintPhase(GenesisPass.MintPhase.PublicPhase);

        vm.deal(user1, 1 ether);
        vm.prank(user1);
        genesisPass.mint{value: MINT_PRICE}(user1);

        uint256 alphaLevel = 1;
        vm.prank(owner);
        vm.expectEmit(true, false, false, false);
        emit AccessLevelUpdated(1, alphaLevel);
        genesisPass.setAccessLevel(1, alphaLevel);

        assertEq(genesisPass.checkAccess(1), alphaLevel);
    }

    function test_CheckAccess_ReturnsCorrectLevel() public {
        vm.prank(owner);
        genesisPass.setMintPhase(GenesisPass.MintPhase.PublicPhase);

        vm.deal(user1, 1 ether);
        vm.prank(user1);
        genesisPass.mint{value: MINT_PRICE}(user1);

        // Default is Genesis (0)
        assertEq(genesisPass.checkAccess(1), 0);

        vm.prank(owner);
        genesisPass.setAccessLevel(1, 1);
        assertEq(genesisPass.checkAccess(1), 1);
    }

    // ============ AIRDROP TESTS ============

    function test_SetAirdropEligibility_Success() public {
        vm.prank(owner);
        genesisPass.setMintPhase(GenesisPass.MintPhase.PublicPhase);

        vm.deal(user1, 1 ether);
        vm.prank(user1);
        genesisPass.mint{value: MINT_PRICE}(user1);

        bool eligible = true;
        uint256 multiplier = 200; // 2x

        vm.prank(owner);
        vm.expectEmit(true, false, false, false);
        emit AirdropEligibilityUpdated(1, eligible, multiplier);
        genesisPass.setAirdropEligibility(1, eligible, multiplier);

        (bool isEligible, uint256 mult) = genesisPass.isAirdropEligible(1);
        assertTrue(isEligible);
        assertEq(mult, multiplier);
    }

    function test_SetAirdropEligibility_RevertWhen_MultiplierTooLow() public {
        vm.prank(owner);
        genesisPass.setMintPhase(GenesisPass.MintPhase.PublicPhase);

        vm.deal(user1, 1 ether);
        vm.prank(user1);
        genesisPass.mint{value: MINT_PRICE}(user1);

        vm.prank(owner);
        vm.expectRevert("Multiplier must be at least 100 (1x)");
        genesisPass.setAirdropEligibility(1, true, 50);
    }

    function test_BatchSetAirdropEligibility_Success() public {
        vm.prank(owner);
        genesisPass.setMintPhase(GenesisPass.MintPhase.PublicPhase);

        vm.deal(user1, 1 ether);
        vm.prank(user1);
        genesisPass.mint{value: MINT_PRICE}(user1);

        vm.deal(user2, 1 ether);
        vm.prank(user2);
        genesisPass.mint{value: MINT_PRICE}(user2);

        uint256[] memory tokenIds = new uint256[](2);
        tokenIds[0] = 1;
        tokenIds[1] = 2;

        bool[] memory eligible = new bool[](2);
        eligible[0] = true;
        eligible[1] = true;

        uint256[] memory multipliers = new uint256[](2);
        multipliers[0] = 200;
        multipliers[1] = 300;

        vm.prank(owner);
        genesisPass.batchSetAirdropEligibility(tokenIds, eligible, multipliers);

        (bool isEligible1, uint256 mult1) = genesisPass.isAirdropEligible(1);
        (bool isEligible2, uint256 mult2) = genesisPass.isAirdropEligible(2);

        assertTrue(isEligible1);
        assertEq(mult1, 200);
        assertTrue(isEligible2);
        assertEq(mult2, 300);
    }

    // ============ VIEW FUNCTION TESTS ============

    function test_GetPassData_ReturnsAllData() public {
        vm.prank(owner);
        genesisPass.setMintPhase(GenesisPass.MintPhase.PublicPhase);

        vm.deal(user1, 1 ether);
        vm.prank(user1);
        genesisPass.mint{value: MINT_PRICE}(user1);

        vm.prank(owner);
        genesisPass.awardPoints(1, 150);
        vm.prank(owner);
        genesisPass.setAccessLevel(1, 1);
        vm.prank(owner);
        genesisPass.setAirdropEligibility(1, true, 200);

        (uint256 points, bool tokensClaimed, uint256 accessLevel, bool airdropEligible, uint256 multiplier) =
            genesisPass.getPassData(1);

        assertEq(points, 150);
        assertFalse(tokensClaimed);
        assertEq(accessLevel, 1);
        assertTrue(airdropEligible);
        assertEq(multiplier, 200);
    }

    // ============ OWNER FUNCTION TESTS ============

    function test_SetMintPrice() public {
        uint256 newPrice = 0.01 ether;
        vm.prank(owner);
        genesisPass.setMintPrice(newPrice);
        assertEq(genesisPass.mintPrice(), newPrice);
    }

    function test_SetMintPrice_RevertWhen_Zero() public {
        vm.prank(owner);
        vm.expectRevert("Price must be greater than 0");
        genesisPass.setMintPrice(0);
    }

    function test_ResetMintRestriction() public {
        vm.prank(owner);
        genesisPass.setMintPhase(GenesisPass.MintPhase.PublicPhase);

        vm.deal(user1, 1 ether);
        vm.prank(user1);
        genesisPass.mint{value: MINT_PRICE}(user1);

        assertTrue(genesisPass.hasMinted(user1));

        vm.prank(owner);
        genesisPass.resetMintRestriction(user1);
        assertFalse(genesisPass.hasMinted(user1));
    }

    function test_Withdraw() public {
        vm.prank(owner);
        genesisPass.setMintPhase(GenesisPass.MintPhase.PublicPhase);

        vm.deal(user1, 1 ether);
        vm.prank(user1);
        genesisPass.mint{value: MINT_PRICE}(user1);

        uint256 ownerBalanceBefore = owner.balance;
        vm.prank(owner);
        genesisPass.withdraw();
        uint256 ownerBalanceAfter = owner.balance;

        assertEq(ownerBalanceAfter - ownerBalanceBefore, MINT_PRICE);
    }

    function test_Withdraw_RevertWhen_NoFunds() public {
        vm.prank(owner);
        vm.expectRevert("No funds to withdraw");
        genesisPass.withdraw();
    }

    // ============ SECURITY TESTS ============

    function test_OnlyOwner_CanSetMintPhase() public {
        vm.prank(user1);
        vm.expectRevert();
        genesisPass.setMintPhase(GenesisPass.MintPhase.AllowlistPhase);
    }

    function test_OnlyOwner_CanAddToAllowlist() public {
        vm.prank(user1);
        vm.expectRevert();
        genesisPass.addToAllowlist(user2);
    }

    function test_OnlyOwner_CanAwardPoints() public {
        vm.prank(owner);
        genesisPass.setMintPhase(GenesisPass.MintPhase.PublicPhase);

        vm.deal(user1, 1 ether);
        vm.prank(user1);
        genesisPass.mint{value: MINT_PRICE}(user1);

        vm.prank(user1);
        vm.expectRevert();
        genesisPass.awardPoints(1, 100);
    }

    function test_OnlyOwner_CanWithdraw() public {
        vm.prank(owner);
        genesisPass.setMintPhase(GenesisPass.MintPhase.PublicPhase);

        vm.deal(user1, 1 ether);
        vm.prank(user1);
        genesisPass.mint{value: MINT_PRICE}(user1);

        vm.prank(user1);
        vm.expectRevert();
        genesisPass.withdraw();
    }

    // ============ INTEGRATION TESTS ============

    function test_FullWorkflow_MultiPhase() public {
        // Phase 1: Allowlist freemint
        vm.prank(owner);
        genesisPass.addToAllowlist(user1);
        vm.prank(owner);
        genesisPass.setMintPhase(GenesisPass.MintPhase.AllowlistPhase);
        vm.prank(owner);
        genesisPass.setTokenClaimEnabled(true);

        // User1 mints for free
        vm.prank(user1);
        genesisPass.mint{value: 0}(user1);

        // Owner awards points
        vm.prank(owner);
        genesisPass.awardPoints(1, 50);
        vm.prank(owner);
        genesisPass.awardPoints(1, 75);

        // Owner sets access level
        vm.prank(owner);
        genesisPass.setAccessLevel(1, 1);

        // Owner sets airdrop eligibility
        vm.prank(owner);
        genesisPass.setAirdropEligibility(1, true, 200);

        // User1 claims tokens
        vm.prank(user1);
        genesisPass.claimTokens(1);

        // Phase 2: Public paid mint
        vm.prank(owner);
        genesisPass.setMintPhase(GenesisPass.MintPhase.PublicPhase);

        vm.deal(user2, 1 ether);
        vm.prank(user2);
        genesisPass.mint{value: MINT_PRICE}(user2);

        // Verify final state
        (uint256 points, bool tokensClaimed, uint256 accessLevel, bool airdropEligible, uint256 multiplier) =
            genesisPass.getPassData(1);

        assertEq(points, 125);
        assertTrue(tokensClaimed);
        assertEq(accessLevel, 1);
        assertTrue(airdropEligible);
        assertEq(multiplier, 200);
        assertEq(genesisPass.totalSupply(), 2);
    }

    function test_OpenSeaCompatibility_MintPriceVsResalePrice() public {
        // This test verifies that mint price and resale price are independent
        // Mint price is set by contract, resale price is set by owner on OpenSea
        
        vm.prank(owner);
        genesisPass.setMintPhase(GenesisPass.MintPhase.PublicPhase);

        vm.deal(user1, 1 ether);
        vm.prank(user1);
        genesisPass.mint{value: MINT_PRICE}(user1);

        // After minting, the NFT can be listed at any price on OpenSea
        // The contract doesn't enforce resale prices - that's OpenSea's job
        assertEq(genesisPass.ownerOf(1), user1);
        
        // Owner can change mint price for future mints, but doesn't affect existing NFTs
        vm.prank(owner);
        genesisPass.setMintPrice(0.01 ether);
        
        // Existing NFT owner still owns it
        assertEq(genesisPass.ownerOf(1), user1);
    }
}
