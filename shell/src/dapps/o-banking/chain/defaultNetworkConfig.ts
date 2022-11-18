import {CirclesNetworkConfig} from "./circlesNetworkConfig";
import {
  CRC_ABI,
  CRC_HUB_ADDRESS,
  HUB_ABI,
  MULTI_SEND_ABI,
  MULTI_SEND_ADDRESS,
  MULTI_SEND_CALL_ONLY_ABI,
  MULTI_SEND_CALL_ONLY_ADDRESS,
  RPC_ENDPOINT, SAFE_MASTER_COPY_ABI,
  SAFE_MASTER_COPY_ADDRESS, SAFE_PROXY_FACTORY_ABI,
  SAFE_PROXY_FACTORY_ADDRESS
} from "./consts";

export const defaultNetworkConfig: CirclesNetworkConfig = {
  rpcUrl: RPC_ENDPOINT,
  crcTokenAbi: CRC_ABI,
  crcHubAddress: CRC_HUB_ADDRESS,
  crcHubAbi: HUB_ABI,
  safeMasterCopyAddress: SAFE_MASTER_COPY_ADDRESS,
  safeMasterCopyAbi: SAFE_MASTER_COPY_ABI,
  safeProxyFactoryAddress: SAFE_PROXY_FACTORY_ADDRESS,
  safeProxyFactoryAbi: SAFE_PROXY_FACTORY_ABI,
  multiSendAddress: MULTI_SEND_ADDRESS,
  multiSendAbi: MULTI_SEND_ABI,
  multiSendCallOnlyAbi: MULTI_SEND_CALL_ONLY_ABI,
  multiSendCallOnlyAddress: MULTI_SEND_CALL_ONLY_ADDRESS
};