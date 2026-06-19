import { getAddress } from "viem";

/** EigenLayer mainnet contracts — [eigenlayer-contracts README](https://github.com/Layr-Labs/eigenlayer-contracts) */
export const DELEGATION_MANAGER = getAddress(
  "0x39053d51b77dc0d36036fc1fcc8cb819df8ef37a",
);

export const STRATEGY_MANAGER = getAddress(
  "0x858646372cc42e1a627fce94aa7a7033e7cf075a",
);

export const EIGEN_POD_MANAGER = getAddress(
  "0x91e677b07f7af907ec9a428aafa9fc14a0d3a338",
);

export const delegationManagerAbi = [
  {
    type: "function",
    name: "getDepositedShares",
    stateMutability: "view",
    inputs: [{ name: "staker", type: "address" }],
    outputs: [
      { name: "strategies", type: "address[]" },
      { name: "shares", type: "uint256[]" },
    ],
  },
] as const;

export const strategyAbi = [
  {
    type: "function",
    name: "sharesToUnderlyingView",
    stateMutability: "view",
    inputs: [{ name: "amountShares", type: "uint256" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "underlyingToken",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
  },
] as const;

export const eigenPodManagerAbi = [
  {
    type: "function",
    name: "podOwnerDepositShares",
    stateMutability: "view",
    inputs: [{ name: "podOwner", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

/** 1 EigenLayer pod deposit share = 1 gwei of restaked beacon chain ETH. */
export const EIGENPOD_SHARES_TO_WEI = 1_000_000_000n;
