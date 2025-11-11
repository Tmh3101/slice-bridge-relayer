import type { Abi } from "viem";

/**
 * BridgeMinterLens ABI Fragment
 * - Hàm dùng trong flow: mintTo, burnToBsc, pause/unpause, setFee
 * - Các view/role helpers: hasRole, grantRole (tiện lúc setup), processed
 * - Events: Minted, Burned
 */
export const BRIDGE_MINTER_ABI = [
  // ========== write ==========
  {
    type: "function",
    name: "mintTo",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "srcTxHash", type: "bytes32" },
      { name: "srcChainId", type: "uint256" },
      { name: "srcNonce", type: "uint256" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "burnToBsc",
    stateMutability: "nonpayable",
    inputs: [
      { name: "amount", type: "uint256" },
      { name: "toOnBsc", type: "address" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "pause",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  {
    type: "function",
    name: "unpause",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  {
    type: "function",
    name: "setFee",
    stateMutability: "nonpayable",
    inputs: [
      { name: "_feeBps", type: "uint256" },
      { name: "_treasury", type: "address" },
    ],
    outputs: [],
  },

  // ========== role helpers ==========
  {
    type: "function",
    name: "grantRole",
    stateMutability: "nonpayable",
    inputs: [
      { name: "role", type: "bytes32" },
      { name: "account", type: "address" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "revokeRole",
    stateMutability: "nonpayable",
    inputs: [
      { name: "role", type: "bytes32" },
      { name: "account", type: "address" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "hasRole",
    stateMutability: "view",
    inputs: [
      { name: "role", type: "bytes32" },
      { name: "account", type: "address" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },

  // ========== views ==========
  {
    type: "function",
    name: "processed",
    stateMutability: "view",
    inputs: [
      { name: "srcChainId", type: "uint256" },
      { name: "srcTxHash", type: "bytes32" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "feeBps",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "treasury",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
  },

  // ========== events ==========
  {
    type: "event",
    name: "Minted",
    inputs: [
      { name: "to", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
      { name: "srcTxHash", type: "bytes32", indexed: true },
      { name: "srcNonce", type: "uint256", indexed: false },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Burned",
    inputs: [
      { name: "from", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
      { name: "toOnBsc", type: "address", indexed: true },
      { name: "nonce", type: "uint256", indexed: false },
    ],
    anonymous: false,
  },
] as const satisfies Abi;
