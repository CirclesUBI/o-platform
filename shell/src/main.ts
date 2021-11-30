import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {IShell} from "./shell";
import {ProcessContext} from "@o-platform/o-process/dist/interfaces/processContext";
import App from "src/App.svelte";
dayjs.extend(relativeTime)

// TODO: Use a service like 'https://github.com/ipfs/js-ipfs/blob/6870873f0696bb5d8d91fce4a4ef1f7420443993/packages/ipfs-message-port-server/src/server.js#L134'
//       to share data between different app domains.
declare global {
  interface Window {
    o: IShell
  }
}

export enum Role {
  User = 'USER',
  Admin = 'ADMIN'
}

export async function getProcessContext(): Promise<ProcessContext<any>> {
  return <ProcessContext<any>>{
    data: {}
  };
}

export default new App({
  target: document.body,
});