import {CirclesNetworkConfig} from "./circlesNetworkConfig";
import {
  CRC_ABI,
  HUB_ABI,
  MULTI_SEND_ABI,
  MULTI_SEND_ADDRESS,
  MULTI_SEND_CALL_ONLY_ABI,
  MULTI_SEND_CALL_ONLY_ADDRESS,
  SAFE_MASTER_COPY_ABI,
  SAFE_PROXY_FACTORY_ABI
} from "./consts";
import {Environment} from "../../../shared/environment";

export const defaultNetworkConfig: CirclesNetworkConfig = {
  rpcUrl: Environment.xdaiRpcGatewayUrl,
  crcTokenAbi: CRC_ABI,
  crcHubAddress: Environment.circlesHubAddress,
  crcHubAbi: HUB_ABI,
  safeMasterCopyAddress: Environment.masterSafeAddress,
  safeMasterCopyAbi: SAFE_MASTER_COPY_ABI,
  safeProxyFactoryAddress: Environment.safeProxyFactoryAddress,
  safeProxyFactoryAbi: SAFE_PROXY_FACTORY_ABI,
  multiSendAddress: MULTI_SEND_ADDRESS,
  multiSendAbi: MULTI_SEND_ABI,
  multiSendCallOnlyAbi: MULTI_SEND_CALL_ONLY_ABI,
  multiSendCallOnlyAddress: MULTI_SEND_CALL_ONLY_ADDRESS,
  chainId: 100
};