// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import {DropERC721} from "thirdweb-contracts/prebuilts/drop/DropERC721.sol";
import {IDrop} from "thirdweb-contracts/extension/interface/IDrop.sol";
import {IClaimCondition} from "thirdweb-contracts/extension/interface/IClaimCondition.sol";
import {ERC1967Proxy} from "openzeppelin-contracts/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract DropERC721Test is Test {
    DropERC721 public drop;
    address public admin;
    address public minter;
    address public alice;
    address public bob;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;

    function setUp() public {
        admin = address(this);
        minter = makeAddr("minter");
        alice = makeAddr("alice");
        bob = makeAddr("bob");

        DropERC721 implementation = new DropERC721();
        address[] memory trustedForwarders;
        bytes memory initData = abi.encodeWithSelector(
            DropERC721.initialize.selector,
            admin,
            "Test Drop",
            "TDROP",
            "ipfs://QmContractURI",
            trustedForwarders,
            admin,
            admin,
            uint128(500),
            uint128(0),
            admin
        );
        ERC1967Proxy proxy = new ERC1967Proxy(address(implementation), initData);
        drop = DropERC721(address(proxy));
        drop.grantRole(MINTER_ROLE, minter);
    }

    function test_Initialization() public view {
        assertEq(drop.name(), "Test Drop");
        assertEq(drop.symbol(), "TDROP");
        assertEq(drop.contractType(), bytes32("DropERC721"));
        assertEq(drop.contractVersion(), 4);
        assertTrue(drop.hasRole(DEFAULT_ADMIN_ROLE, admin));
        assertTrue(drop.hasRole(MINTER_ROLE, minter));
        assertEq(drop.nextTokenIdToMint(), 0);
        assertEq(drop.nextTokenIdToClaim(), 0);
        assertEq(drop.totalMinted(), 0);
    }

    function test_LazyMint() public {
        vm.prank(minter);
        uint256 batchId = drop.lazyMint(10, "ipfs://QmBase/", "");
        assertEq(batchId, 10);
        assertEq(drop.nextTokenIdToMint(), 10);
        assertEq(drop.nextTokenIdToClaim(), 0);
    }

    function test_RevertWhen_NonMinterLazyMints() public {
        vm.prank(alice);
        vm.expectRevert();
        drop.lazyMint(5, "ipfs://QmBase/", "");
    }

    function test_SetClaimConditions_AndClaim() public {
        vm.prank(minter);
        drop.lazyMint(100, "ipfs://QmBase/", "");

        IClaimCondition.ClaimCondition[] memory conditions = new IClaimCondition.ClaimCondition[](1);
        conditions[0] = IClaimCondition.ClaimCondition({
            startTimestamp: uint256(block.timestamp),
            maxClaimableSupply: 100,
            supplyClaimed: 0,
            quantityLimitPerWallet: 5,
            merkleRoot: bytes32(0),
            pricePerToken: 0,
            currency: address(0),
            metadata: ""
        });

        drop.setClaimConditions(conditions, false);

        IDrop.AllowlistProof memory proof;
        proof.proof = new bytes32[](0);
        proof.quantityLimitPerWallet = 0;
        proof.pricePerToken = 0;
        proof.currency = address(0);

        vm.prank(alice);
        drop.claim(alice, 3, address(0), 0, proof, "");

        assertEq(drop.balanceOf(alice), 3);
        assertEq(drop.ownerOf(0), alice);
        assertEq(drop.ownerOf(1), alice);
        assertEq(drop.ownerOf(2), alice);
        assertEq(drop.nextTokenIdToClaim(), 3);
        assertEq(drop.totalMinted(), 3);
    }

    function test_ClaimRespectsQuantityLimit() public {
        vm.prank(minter);
        drop.lazyMint(20, "ipfs://QmBase/", "");

        IClaimCondition.ClaimCondition[] memory conditions = new IClaimCondition.ClaimCondition[](1);
        conditions[0] = IClaimCondition.ClaimCondition({
            startTimestamp: uint256(block.timestamp),
            maxClaimableSupply: 20,
            supplyClaimed: 0,
            quantityLimitPerWallet: 2,
            merkleRoot: bytes32(0),
            pricePerToken: 0,
            currency: address(0),
            metadata: ""
        });
        drop.setClaimConditions(conditions, false);

        IDrop.AllowlistProof memory proof;
        proof.proof = new bytes32[](0);
        proof.quantityLimitPerWallet = 0;
        proof.pricePerToken = 0;
        proof.currency = address(0);

        vm.prank(alice);
        drop.claim(alice, 2, address(0), 0, proof, "");
        assertEq(drop.balanceOf(alice), 2);

        vm.prank(alice);
        vm.expectRevert();
        drop.claim(alice, 1, address(0), 0, proof, "");
    }

    function test_RevertWhen_ClaimWithoutCondition() public {
        vm.prank(minter);
        drop.lazyMint(10, "ipfs://QmBase/", "");

        IDrop.AllowlistProof memory proof;
        proof.proof = new bytes32[](0);
        proof.quantityLimitPerWallet = 0;
        proof.pricePerToken = 0;
        proof.currency = address(0);

        vm.prank(alice);
        vm.expectRevert();
        drop.claim(alice, 1, address(0), 0, proof, "");
    }

    function test_RevertWhen_ClaimMoreThanLazyMinted() public {
        vm.prank(minter);
        drop.lazyMint(5, "ipfs://QmBase/", "");

        IClaimCondition.ClaimCondition[] memory conditions = new IClaimCondition.ClaimCondition[](1);
        conditions[0] = IClaimCondition.ClaimCondition({
            startTimestamp: uint256(block.timestamp),
            maxClaimableSupply: 100,
            supplyClaimed: 0,
            quantityLimitPerWallet: 100,
            merkleRoot: bytes32(0),
            pricePerToken: 0,
            currency: address(0),
            metadata: ""
        });
        drop.setClaimConditions(conditions, false);

        IDrop.AllowlistProof memory proof;
        proof.proof = new bytes32[](0);
        proof.quantityLimitPerWallet = 0;
        proof.pricePerToken = 0;
        proof.currency = address(0);

        vm.prank(alice);
        vm.expectRevert();
        drop.claim(alice, 10, address(0), 0, proof, "");
    }

    function test_SetMaxTotalSupply() public {
        drop.setMaxTotalSupply(50);
        assertEq(drop.maxTotalSupply(), 50);

        vm.prank(minter);
        drop.lazyMint(100, "ipfs://QmBase/", "");

        IClaimCondition.ClaimCondition[] memory conditions = new IClaimCondition.ClaimCondition[](1);
        conditions[0] = IClaimCondition.ClaimCondition({
            startTimestamp: uint256(block.timestamp),
            maxClaimableSupply: 100,
            supplyClaimed: 0,
            quantityLimitPerWallet: 100,
            merkleRoot: bytes32(0),
            pricePerToken: 0,
            currency: address(0),
            metadata: ""
        });
        drop.setClaimConditions(conditions, false);

        IDrop.AllowlistProof memory proof;
        proof.proof = new bytes32[](0);
        proof.quantityLimitPerWallet = 0;
        proof.pricePerToken = 0;
        proof.currency = address(0);

        vm.prank(alice);
        drop.claim(alice, 50, address(0), 0, proof, "");
        assertEq(drop.totalMinted(), 50);

        vm.prank(bob);
        vm.expectRevert();
        drop.claim(bob, 1, address(0), 0, proof, "");
    }

    function test_TokenURI() public {
        vm.prank(minter);
        drop.lazyMint(5, "ipfs://QmBase/", "");

        IClaimCondition.ClaimCondition[] memory conditions = new IClaimCondition.ClaimCondition[](1);
        conditions[0] = IClaimCondition.ClaimCondition({
            startTimestamp: uint256(block.timestamp),
            maxClaimableSupply: 5,
            supplyClaimed: 0,
            quantityLimitPerWallet: 5,
            merkleRoot: bytes32(0),
            pricePerToken: 0,
            currency: address(0),
            metadata: ""
        });
        drop.setClaimConditions(conditions, false);

        IDrop.AllowlistProof memory proof;
        proof.proof = new bytes32[](0);
        proof.quantityLimitPerWallet = 0;
        proof.pricePerToken = 0;
        proof.currency = address(0);

        vm.prank(alice);
        drop.claim(alice, 1, address(0), 0, proof, "");

        assertEq(drop.tokenURI(0), "ipfs://QmBase/0");
    }

    function test_Burn() public {
        vm.prank(minter);
        drop.lazyMint(5, "ipfs://QmBase/", "");

        IClaimCondition.ClaimCondition[] memory conditions = new IClaimCondition.ClaimCondition[](1);
        conditions[0] = IClaimCondition.ClaimCondition({
            startTimestamp: uint256(block.timestamp),
            maxClaimableSupply: 5,
            supplyClaimed: 0,
            quantityLimitPerWallet: 5,
            merkleRoot: bytes32(0),
            pricePerToken: 0,
            currency: address(0),
            metadata: ""
        });
        drop.setClaimConditions(conditions, false);

        IDrop.AllowlistProof memory proof;
        proof.proof = new bytes32[](0);
        proof.quantityLimitPerWallet = 0;
        proof.pricePerToken = 0;
        proof.currency = address(0);

        vm.prank(alice);
        drop.claim(alice, 2, address(0), 0, proof, "");

        vm.prank(alice);
        drop.burn(0);

        assertEq(drop.balanceOf(alice), 1);
        vm.expectRevert();
        drop.ownerOf(0);
    }

    function test_NonAdminCannotSetClaimConditions() public {
        IClaimCondition.ClaimCondition[] memory conditions = new IClaimCondition.ClaimCondition[](1);
        conditions[0] = IClaimCondition.ClaimCondition({
            startTimestamp: uint256(block.timestamp),
            maxClaimableSupply: 10,
            supplyClaimed: 0,
            quantityLimitPerWallet: 10,
            merkleRoot: bytes32(0),
            pricePerToken: 0,
            currency: address(0),
            metadata: ""
        });

        vm.prank(alice);
        vm.expectRevert();
        drop.setClaimConditions(conditions, false);
    }

    function test_NonAdminCannotSetMaxTotalSupply() public {
        vm.prank(alice);
        vm.expectRevert();
        drop.setMaxTotalSupply(100);
    }
}
