import { CompareTrustRelationsDocument, CompareTrustRelationsQueryVariables, CompareTrustRelationsResult, Profile } from "./api/data/types";
import { me } from "./stores/me";
import { ApiClient } from "./apiConnection";
import { fSetTrust } from "../dapps/o-banking/processes/setTrust";
import { Environment } from "./environment";
import { get } from 'svelte/store'

export class FollowTrust {
  static readonly shortIntervalInMilliseconds = 6000;
  static readonly longIntervalInMilliseconds = 1000 * 60 * 5;

  private intervalInMilliseconds = FollowTrust.shortIntervalInMilliseconds;
  private intervalHandle: any;
  private isWorking = false;

  constructor() { }

  reset() {
    this.stop();
    this.intervalInMilliseconds = FollowTrust.shortIntervalInMilliseconds;
    this.start();
  }

  start() {
    // console.log(`FollowTrust is started.`);

    this.intervalHandle = setInterval(() => {
      // console.log(`FollowTrust is running. (isWorking: ${this.isWorking})`);
      const $me = get(me)

      if (this.isWorking || !$me?.id) {
        return;
      }
      this.followTrust()
        .then((transactionHash) => {
          if (transactionHash) {
            // console.log(`FollowTrust is done: (transactionHash: ${transactionHash}). Using short interval.`);
            this.stop();
            this.intervalInMilliseconds = FollowTrust.shortIntervalInMilliseconds;
            this.start();
          } else {
            // console.log(`FollowTrust is done. Currently no trust changes. Using long interval.`);
            this.stop();
            this.intervalInMilliseconds = FollowTrust.longIntervalInMilliseconds;
            this.start();
          }
          // console.log(`FollowTrust is done. (transactionHash: ${transactionHash ?? 'no work'})`);
          this.isWorking = false;
        })
        .catch((e) => {
          // console.log(`FollowTrust is done with error.`)
          console.error(e);
          this.isWorking = false;
        });
    }, this.intervalInMilliseconds);
  }

  stop() {
    // console.log(`FollowTrust is stopped.`);
    if (!this.intervalHandle) {
      throw new Error(`FollowTrust is not running.`);
    }
    clearInterval(this.intervalHandle);
  }

  private async followTrust() {
    let $me: Profile;
    me.subscribe((me) => ($me = me))();
    // console.log(`FollowTrust is running for ${$me?.circlesAddress}`);

    if (!$me) {
      throw new Error(`$me is not yet initialized.`);
    }

    const diff = await ApiClient.query<CompareTrustRelationsResult, CompareTrustRelationsQueryVariables>(CompareTrustRelationsDocument, {
      canSendTo: $me.circlesAddress,
      compareWith: [],
    });

    const plans = diff.diffs.map((d) => {
      return {
        canSendTo: d.canSendTo,
        add: d.differences.filter((p) => p.operation == "add").map((o) => o.user),
        remove: d.differences.filter((p) => p.operation == "remove").map((o) => o.user),
        keep: d.differences.filter((p) => p.operation == "keep").map((o) => o.user),
      };
    });

    if (plans.length == 0) {
      return undefined;
    }

    const plan = plans.shift();
    if (plan.add.length == 0) {
      return undefined;
    }

    const key = sessionStorage.getItem("circlesKey");
    if (!key) {
      throw new Error(`Key is not unlocked.`);
    }

    const addTrustToUser = plan.add.shift();
    const followTrust = await fSetTrust({
      data: {
        privateKey: key,
        hubAddress: Environment.circlesHubAddress,
        safeAddress: plan.canSendTo,
        trustLimit: 100,
        trustReceiver: addTrustToUser,
      },
      dirtyFlags: {},
      messages: {},
      onlyThesePages: undefined,
    });

    // console.log(`Follow trusted: `, followTrust);

    return followTrust.transactionHash;
  }
}
