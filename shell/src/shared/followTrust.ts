import {
    CompareTrustRelationsDocument,
    CompareTrustRelationsQueryVariables,
    CompareTrustRelationsResult,
    Profile
} from "./api/data/types";
import {me} from "./stores/me";
import {ApiClient} from "./apiConnection";
import {fSetTrust} from "../dapps/o-banking/processes/setTrust";
import {Environment} from "./environment";

export class FollowTrust {

    static readonly shortIntervalInMilliseconds = 6000;
    static readonly longIntervalInMilliseconds = 1000 * 60 * 5;

    private intervalInMilliseconds = FollowTrust.shortIntervalInMilliseconds;
    private intervalHandle: any;
    private isWorking = false;

    private constructor() {
    }

    static readonly instance = new FollowTrust();

    isRunning() {
        return !!this.intervalHandle;
    }

    reset(interval?:number) {
        console.log(`Resetting FollowTrust to ${interval == FollowTrust.longIntervalInMilliseconds ? 'long' : 'short'} interval.`);
        this.stop();
        this.intervalInMilliseconds = interval ? interval : FollowTrust.shortIntervalInMilliseconds;
        this.start();
    }

    start() {
        if (this.intervalHandle) {
            return;
        }
        console.log(`FollowTrust is started with ${this.intervalInMilliseconds == FollowTrust.longIntervalInMilliseconds ? 'long' : 'short'} interval.`);

        this.intervalHandle = setInterval(() => {
            console.log(`FollowTrust is running. (isWorking: ${this.isWorking})`);
            if (this.isWorking) {
                return;
            }
            this.followTrust()
                .then((transactionHash) => {
                    if (transactionHash) {
                        console.log(`FollowTrust is done: (transactionHash: ${transactionHash}). Using short interval.`);
                        this.reset(FollowTrust.shortIntervalInMilliseconds);
                    } else {
                        console.log(`FollowTrust is done. Currently no trust changes. Using long interval.`);
                        this.reset(FollowTrust.longIntervalInMilliseconds);
                    }
                    this.isWorking = false;
                })
                .catch((e) => {
                    console.log(`FollowTrust is done with error.`)
                    console.error(e);
                    this.isWorking = false;
                });
        }, this.intervalInMilliseconds);
    }

    stop() {
        if (!this.intervalHandle){
            return;
        }
        clearInterval(this.intervalHandle);
        this.intervalHandle = undefined;
        console.log(`FollowTrust is stopped.`);
    }

    private async followTrust() {
        let $me: Profile;
        me.subscribe((me) => $me = me)();
        console.log(`FollowTrust is running for ${$me?.circlesAddress}`);

        if (!$me) {
            throw new Error(`$me is not yet initialized.`);
        }

        try {
            const diff = await ApiClient.query<CompareTrustRelationsResult, CompareTrustRelationsQueryVariables>(CompareTrustRelationsDocument, {
                canSendTo: $me.circlesAddress,
                compareWith: []
            });

            const plans = diff.diffs.map(d => {
                return {
                    canSendTo: d.canSendTo,
                    add: d.differences.filter(p => p.operation == "add").map(o => o.user),
                    remove: d.differences.filter(p => p.operation == "remove").map(o => o.user),
                    keep: d.differences.filter(p => p.operation == "keep").map(o => o.user),
                }
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
                onlyThesePages: undefined
            });

            console.log(`Follow trusted: `, followTrust);

            return followTrust.transactionHash;
        } catch (e) {
            console.error(`Follow trust encountered an error. Switching to the long interval.`, e);
            this.reset(FollowTrust.longIntervalInMilliseconds);
            return undefined;
        }
    }
}
