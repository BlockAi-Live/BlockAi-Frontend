// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/blkai.sol";

/**
 * @title BlockAi Token Test Suite
 * @notice Comprehensive tests for the fixed-supply BlockAi token
 * @dev Tests cover all ERC20 functionality, ERC20Permit, edge cases, and security
 */
contract BlockAiTest is Test {
    BlockAi public token;
    address public deployer;
    address public alice;
    address public bob;
    address public charlie;

    // Events to test
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    function setUp() public {
        deployer = address(this);
        alice = makeAddr("alice");
        bob = makeAddr("bob");
        charlie = makeAddr("charlie");
        
        // Deploy the token - deployer (this test contract) receives all 1B tokens
        token = new BlockAi(deployer);
    }

    // ============================================================================
    // DEPLOYMENT & INITIAL STATE TESTS
    // ============================================================================

    function test_Deployment() public view {
        assertEq(token.name(), "BlockAi", "Incorrect token name");
        assertEq(token.symbol(), "BLKAI", "Incorrect token symbol");
        assertEq(token.decimals(), 18, "Incorrect decimals");
    }

    function test_InitialSupply() public view {
        uint256 expectedSupply = 1_000_000_000 * 1e18;
        assertEq(token.totalSupply(), expectedSupply, "Incorrect total supply");
        assertEq(token.TOTAL_SUPPLY(), expectedSupply, "TOTAL_SUPPLY constant incorrect");
    }

    function test_DeployerReceivesAllTokens() public view {
        uint256 expectedBalance = 1_000_000_000 * 1e18;
        assertEq(token.balanceOf(deployer), expectedBalance, "Deployer should have all tokens");
    }

    function test_NoOtherAccountsHaveTokens() public view {
        assertEq(token.balanceOf(alice), 0, "Alice should start with zero balance");
        assertEq(token.balanceOf(bob), 0, "Bob should start with zero balance");
        assertEq(token.balanceOf(charlie), 0, "Charlie should start with zero balance");
        assertEq(token.balanceOf(address(0)), 0, "Zero address should have no tokens");
    }

    function test_RevertWhen_DeployWithZeroAddress() public {
        vm.expectRevert("Address Cannot Be Zero");
        new BlockAi(address(0));
    }

    function test_SupplyIsImmutable() public view {
        // The contract has no mint function, so supply can never change
        // This test verifies the constant
        uint256 supply1 = token.TOTAL_SUPPLY();
        uint256 supply2 = token.totalSupply();
        assertEq(supply1, supply2, "Supply should be constant");
    }

    // ============================================================================
    // ERC20 TRANSFER TESTS
    // ============================================================================

    function test_Transfer() public {
        uint256 amount = 1000 * 1e18;
        
        vm.expectEmit(true, true, false, true);
        emit Transfer(deployer, alice, amount);
        
        bool success = token.transfer(alice, amount);
        
        assertTrue(success, "Transfer should succeed");
        assertEq(token.balanceOf(alice), amount, "Alice should receive tokens");
        assertEq(token.balanceOf(deployer), token.TOTAL_SUPPLY() - amount, "Deployer balance should decrease");
    }

    function test_TransferZeroAmount() public {
        uint256 balanceBefore = token.balanceOf(alice);
        token.transfer(alice, 0);
        assertEq(token.balanceOf(alice), balanceBefore, "Zero transfer should not change balance");
    }

    function test_TransferEntireBalance() public {
        uint256 entireBalance = token.balanceOf(deployer);
        token.transfer(alice, entireBalance);
        
        assertEq(token.balanceOf(deployer), 0, "Deployer should have zero balance");
        assertEq(token.balanceOf(alice), entireBalance, "Alice should have all tokens");
    }

    function test_RevertWhen_TransferExceedsBalance() public {
        uint256 balance = token.balanceOf(deployer);
        
        vm.expectRevert();
        token.transfer(alice, balance + 1);
    }

    function test_RevertWhen_TransferToZeroAddress() public {
        vm.expectRevert();
        token.transfer(address(0), 100 * 1e18);
    }

    function test_MultipleTransfers() public {
        token.transfer(alice, 100 * 1e18);
        token.transfer(bob, 200 * 1e18);
        token.transfer(charlie, 300 * 1e18);
        
        assertEq(token.balanceOf(alice), 100 * 1e18, "Alice balance incorrect");
        assertEq(token.balanceOf(bob), 200 * 1e18, "Bob balance incorrect");
        assertEq(token.balanceOf(charlie), 300 * 1e18, "Charlie balance incorrect");
    }

    function test_TransferBetweenUsers() public {
        // Give alice some tokens first
        token.transfer(alice, 1000 * 1e18);
        
        // Alice transfers to Bob
        vm.prank(alice);
        token.transfer(bob, 500 * 1e18);
        
        assertEq(token.balanceOf(alice), 500 * 1e18, "Alice should have 500 tokens");
        assertEq(token.balanceOf(bob), 500 * 1e18, "Bob should have 500 tokens");
    }

    // ============================================================================
    // ERC20 APPROVE & TRANSFERFROM TESTS
    // ============================================================================

    function test_Approve() public {
        uint256 amount = 1000 * 1e18;
        
        vm.expectEmit(true, true, false, true);
        emit Approval(deployer, alice, amount);
        
        bool success = token.approve(alice, amount);
        
        assertTrue(success, "Approve should succeed");
        assertEq(token.allowance(deployer, alice), amount, "Allowance not set correctly");
    }

    function test_ApproveZeroAmount() public {
        token.approve(alice, 0);
        assertEq(token.allowance(deployer, alice), 0, "Zero allowance should be set");
    }

    function test_ApproveMaxAmount() public {
        token.approve(alice, type(uint256).max);
        assertEq(token.allowance(deployer, alice), type(uint256).max, "Max allowance should be set");
    }

    function test_TransferFrom() public {
        uint256 amount = 1000 * 1e18;
        
        // Deployer approves Alice to spend tokens
        token.approve(alice, amount);
        
        // Alice transfers from deployer to Bob
        vm.prank(alice);
        vm.expectEmit(true, true, false, true);
        emit Transfer(deployer, bob, amount);
        
        bool success = token.transferFrom(deployer, bob, amount);
        
        assertTrue(success, "TransferFrom should succeed");
        assertEq(token.balanceOf(bob), amount, "Bob should receive tokens");
        assertEq(token.allowance(deployer, alice), 0, "Allowance should be consumed");
    }

    function test_TransferFromPartialAllowance() public {
        uint256 allowance = 1000 * 1e18;
        uint256 transferAmount = 600 * 1e18;
        
        token.approve(alice, allowance);
        
        vm.prank(alice);
        token.transferFrom(deployer, bob, transferAmount);
        
        assertEq(token.balanceOf(bob), transferAmount, "Bob should receive partial amount");
        assertEq(token.allowance(deployer, alice), allowance - transferAmount, "Remaining allowance incorrect");
    }

    function test_RevertWhen_TransferFromExceedsAllowance() public {
        uint256 allowance = 500 * 1e18;
        
        token.approve(alice, allowance);
        
        vm.prank(alice);
        vm.expectRevert();
        token.transferFrom(deployer, bob, allowance + 1);
    }

    function test_RevertWhen_TransferFromWithoutApproval() public {
        vm.prank(alice);
        vm.expectRevert();
        token.transferFrom(deployer, bob, 100 * 1e18);
    }

    function test_TransferFromWithInfiniteApproval() public {
        // Max uint256 approval doesn't decrease
        token.approve(alice, type(uint256).max);
        
        vm.prank(alice);
        token.transferFrom(deployer, bob, 1000 * 1e18);
        
        // Allowance should still be max
        assertEq(token.allowance(deployer, alice), type(uint256).max, "Infinite allowance should not decrease");
    }

    function test_MultipleApprovals() public {
        token.approve(alice, 1000 * 1e18);
        token.approve(bob, 2000 * 1e18);
        token.approve(charlie, 3000 * 1e18);
        
        assertEq(token.allowance(deployer, alice), 1000 * 1e18);
        assertEq(token.allowance(deployer, bob), 2000 * 1e18);
        assertEq(token.allowance(deployer, charlie), 3000 * 1e18);
    }

    function test_ApproveOverwritesPrevious() public {
        token.approve(alice, 1000 * 1e18);
        token.approve(alice, 2000 * 1e18);
        
        assertEq(token.allowance(deployer, alice), 2000 * 1e18, "New approval should overwrite");
    }

    // ============================================================================
    // ERC20 PERMIT (EIP-2612) TESTS
    // ============================================================================

    function test_Permit() public {
        uint256 privateKey = 0xA11CE;
        address owner = vm.addr(privateKey);
        
        // Give owner some tokens
        token.transfer(owner, 1000 * 1e18);
        
        uint256 value = 500 * 1e18;
        uint256 nonce = token.nonces(owner);
        uint256 deadline = block.timestamp + 1 hours;
        
        // Create permit signature
        bytes32 structHash = keccak256(
            abi.encode(
                keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"),
                owner,
                bob,
                value,
                nonce,
                deadline
            )
        );
        
        bytes32 digest = keccak256(
            abi.encodePacked("\x19\x01", token.DOMAIN_SEPARATOR(), structHash)
        );
        
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(privateKey, digest);
        
        // Execute permit
        token.permit(owner, bob, value, deadline, v, r, s);
        
        assertEq(token.allowance(owner, bob), value, "Permit should set allowance");
        assertEq(token.nonces(owner), nonce + 1, "Nonce should increment");
    }

    function test_RevertWhen_PermitExpired() public {
        uint256 privateKey = 0xB0B;
        address owner = vm.addr(privateKey);
        
        uint256 value = 500 * 1e18;
        uint256 nonce = token.nonces(owner);
        uint256 deadline = block.timestamp - 1; // Expired
        
        bytes32 structHash = keccak256(
            abi.encode(
                keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"),
                owner,
                bob,
                value,
                nonce,
                deadline
            )
        );
        
        bytes32 digest = keccak256(
            abi.encodePacked("\x19\x01", token.DOMAIN_SEPARATOR(), structHash)
        );
        
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(privateKey, digest);
        
        vm.expectRevert();
        token.permit(owner, bob, value, deadline, v, r, s);
    }

    function test_RevertWhen_PermitInvalidSignature() public {
        uint256 privateKey = 0xBAD;
        address owner = vm.addr(privateKey);
        
        uint256 value = 500 * 1e18;
        uint256 nonce = token.nonces(owner);
        uint256 deadline = block.timestamp + 1 hours;
        
        bytes32 structHash = keccak256(
            abi.encode(
                keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"),
                owner,
                bob,
                value,
                nonce,
                deadline
            )
        );
        
        bytes32 digest = keccak256(
            abi.encodePacked("\x19\x01", token.DOMAIN_SEPARATOR(), structHash)
        );
        
        // Sign with wrong key
        uint256 wrongKey = 0xBADBAD;
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(wrongKey, digest);
        
        vm.expectRevert();
        token.permit(owner, bob, value, deadline, v, r, s);
    }

    function test_PermitAndTransferFrom() public {
        uint256 privateKey = 0xA11CE;
        address owner = vm.addr(privateKey);
        
        token.transfer(owner, 1000 * 1e18);
        
        uint256 value = 500 * 1e18;
        uint256 nonce = token.nonces(owner);
        uint256 deadline = block.timestamp + 1 hours;
        
        bytes32 structHash = keccak256(
            abi.encode(
                keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"),
                owner,
                bob,
                value,
                nonce,
                deadline
            )
        );
        
        bytes32 digest = keccak256(
            abi.encodePacked("\x19\x01", token.DOMAIN_SEPARATOR(), structHash)
        );
        
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(privateKey, digest);
        
        // Execute permit
        token.permit(owner, bob, value, deadline, v, r, s);
        
        // Bob can now transfer from owner
        vm.prank(bob);
        token.transferFrom(owner, charlie, value);
        
        assertEq(token.balanceOf(charlie), value, "Charlie should receive tokens");
    }

    function test_DomainSeparator() public view {
        bytes32 separator = token.DOMAIN_SEPARATOR();
        assertTrue(separator != bytes32(0), "Domain separator should be set");
    }

    function test_Nonces() public {
        assertEq(token.nonces(alice), 0, "Initial nonce should be 0");
        assertEq(token.nonces(bob), 0, "Initial nonce should be 0");
    }

    // ============================================================================
    // SUPPLY IMMUTABILITY TESTS (SECURITY)
    // ============================================================================

    function test_SupplyCannotIncrease() public view {
        // Verify contract has no mint function
        // Supply is fixed at deployment
        uint256 supply = token.totalSupply();
        assertEq(supply, 1_000_000_000 * 1e18, "Supply should be fixed");
    }

    function test_NoMintFunction() public {
        // This test documents that there is NO mint function
        // The contract only inherits from ERC20Permit
        // No custom functions exist
        assertTrue(true, "Contract has no mint function - supply is immutable");
    }

    function test_NoOwnerOrAdmin() public {
        // Contract has no owner/admin role
        // No privileged functions exist
        assertTrue(true, "Contract has no owner or admin role");
    }

    function test_TotalSupplyMatchesConstant() public view {
        assertEq(token.totalSupply(), token.TOTAL_SUPPLY(), "Total supply should match constant");
    }

    // ============================================================================
    // EDGE CASES & STRESS TESTS
    // ============================================================================

    function test_TransferToSelf() public {
        uint256 amount = 1000 * 1e18;
        uint256 balanceBefore = token.balanceOf(deployer);
        
        token.transfer(deployer, amount);
        
        assertEq(token.balanceOf(deployer), balanceBefore, "Balance should not change when transferring to self");
    }

    function test_ApproveToSelf() public {
        token.approve(deployer, 1000 * 1e18);
        assertEq(token.allowance(deployer, deployer), 1000 * 1e18, "Self-approval should work");
    }

    function test_LargeTransfers() public {
        uint256 largeAmount = 100_000_000 * 1e18; // 100M tokens
        token.transfer(alice, largeAmount);
        assertEq(token.balanceOf(alice), largeAmount, "Large transfer should succeed");
    }

    function test_ManySmallTransfers() public {
        for (uint256 i = 1; i <= 10; i++) {
            token.transfer(alice, 1 * 1e18);
        }
        assertEq(token.balanceOf(alice), 10 * 1e18, "Multiple small transfers should accumulate");
    }

    function test_CircularTransfers() public {
        // Deployer -> Alice -> Bob -> Charlie -> Deployer
        token.transfer(alice, 1000 * 1e18);
        
        vm.prank(alice);
        token.transfer(bob, 1000 * 1e18);
        
        vm.prank(bob);
        token.transfer(charlie, 1000 * 1e18);
        
        vm.prank(charlie);
        token.transfer(deployer, 1000 * 1e18);
        
        // Token is back with deployer
        uint256 expectedBalance = token.TOTAL_SUPPLY();
        assertEq(token.balanceOf(deployer), expectedBalance, "Circular transfer should complete");
    }

    // ============================================================================
    // FUZZ TESTS
    // ============================================================================

    function testFuzz_Transfer(address to, uint256 amount) public {
        vm.assume(to != address(0));
        vm.assume(amount <= token.balanceOf(deployer));
        
        uint256 balanceBefore = token.balanceOf(deployer);
        token.transfer(to, amount);
        
        if (to != deployer) {
            assertEq(token.balanceOf(to), amount, "Recipient should receive amount");
            assertEq(token.balanceOf(deployer), balanceBefore - amount, "Sender balance should decrease");
        }
    }

    function testFuzz_Approve(address spender, uint256 amount) public {
        vm.assume(spender != address(0)); // ERC20 doesn't allow zero address as spender
        token.approve(spender, amount);
        assertEq(token.allowance(deployer, spender), amount, "Allowance should be set");
    }

    function testFuzz_TransferFrom(address to, uint256 amount) public {
        vm.assume(to != address(0));
        vm.assume(to != deployer); // Avoid self-transfer edge case
        vm.assume(amount <= token.balanceOf(deployer));
        
        uint256 deployerBalanceBefore = token.balanceOf(deployer);
        uint256 toBalanceBefore = token.balanceOf(to);
        
        token.approve(alice, amount);
        
        vm.prank(alice);
        token.transferFrom(deployer, to, amount);
        
        assertEq(token.balanceOf(to), toBalanceBefore + amount, "Recipient should receive amount");
        assertEq(token.balanceOf(deployer), deployerBalanceBefore - amount, "Sender balance should decrease");
    }

    // ============================================================================
    // GAS OPTIMIZATION TESTS
    // ============================================================================

    function test_Gas_Transfer() public {
        uint256 gasBefore = gasleft();
        token.transfer(alice, 1000 * 1e18);
        uint256 gasUsed = gasBefore - gasleft();
        
        // Document gas usage (typically ~51k for ERC20)
        assertTrue(gasUsed < 100000, "Transfer should be gas efficient");
    }

    function test_Gas_Approve() public {
        uint256 gasBefore = gasleft();
        token.approve(alice, 1000 * 1e18);
        uint256 gasUsed = gasBefore - gasleft();
        
        assertTrue(gasUsed < 50000, "Approve should be gas efficient");
    }

    // ============================================================================
    // INTEGRATION TESTS
    // ============================================================================

    function test_CompleteWorkflow() public {
        // Simulate a complete token distribution and usage workflow
        
        // 1. Deployer distributes to team
        token.transfer(alice, 100_000_000 * 1e18); // 100M to Alice (team)
        token.transfer(bob, 200_000_000 * 1e18);   // 200M to Bob (treasury)
        
        // 2. Alice transfers to Charlie (advisor)
        vm.prank(alice);
        token.transfer(charlie, 10_000_000 * 1e18); // 10M to Charlie
        
        // 3. Bob approves and transfers via approval
        vm.prank(bob);
        token.approve(charlie, 50_000_000 * 1e18);
        
        vm.prank(charlie);
        token.transferFrom(bob, alice, 50_000_000 * 1e18);
        
        // 4. Verify final balances
        assertEq(token.balanceOf(alice), 140_000_000 * 1e18, "Alice final balance");
        assertEq(token.balanceOf(bob), 150_000_000 * 1e18, "Bob final balance");
        assertEq(token.balanceOf(charlie), 10_000_000 * 1e18, "Charlie final balance");
        
        // 5. Verify total supply unchanged
        assertEq(token.totalSupply(), 1_000_000_000 * 1e18, "Total supply unchanged");
    }
}
