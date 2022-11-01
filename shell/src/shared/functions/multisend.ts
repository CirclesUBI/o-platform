import {GnosisSafeProxy} from "@o-platform/o-circles/dist/safe/gnosisSafeProxy";
import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";
import {SafeOps} from "@o-platform/o-circles/dist/model/safeOps";
import {BN} from "ethereumjs-util";
import {ZERO_ADDRESS} from "@o-platform/o-circles/dist/consts";
import {
  encodeMulti,
  encodeSingle,
  OperationType,
  TransactionInput
} from "ethers-multisend";

export async function multisend(input:TransactionInput[]) {
  let id = 0;
  const metaTransactions = input.map(o => encodeSingle({
    ...o,
    id: (id++).toString()
  }));
  const multiTx = encodeMulti(metaTransactions);
  const safeProxy = new GnosisSafeProxy(RpcGateway.get(), "0xde374ece6fa50e781e81aac78e811b33d16912c7");
  const result = await safeProxy.execTransactionTxData(sessionStorage.getItem("circlesKey"), {
    data: multiTx.data,
    operation: multiTx.operation == OperationType.Call ? SafeOps.CALL : SafeOps.DELETECALL,
    to: multiTx.to,
    value: new BN(multiTx.value),
    gasToken: ZERO_ADDRESS,
    refundReceiver: ZERO_ADDRESS
  });

  const receipt = await RpcGateway.get().eth.sendSignedTransaction(result);
  return receipt;
}