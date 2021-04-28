import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";
import {TransitivePath} from "../processes/transferCircles";

export async function requestPathToRecipient (context:{data:{safeAddress:string; amount?:string, recipientAddress:string}}) {
    const circlesValueInWei = RpcGateway.get().utils
      .toWei(context.data.amount?.toString() ?? "0", "ether")
      .toString();

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "from": context.data.safeAddress,
      "to": context.data.recipientAddress,
      "value": circlesValueInWei.toString()
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw
    };

    const response = await fetch("https://pathfinder.exinto.de/flow", requestOptions)
    const result = await response.json();

    console.log("Transitive path is: ", result);

    return <TransitivePath>result;
}