import {readable} from "svelte/store";
import {MyInbox} from "./inbox";
import {EventType, SortOrder} from "../api/data/types";

const unreadEventInbox = new MyInbox(
    SortOrder.Desc,
    50,
    [EventType.CrcHubTransfer, EventType.CrcMinting, EventType.CrcTrust, EventType.InvitationRedeemed, EventType.Erc20Transfer],
    {
        unreadOnly: true
    });

export const unreadEventCount = readable(0, (set) => {
    const sub = unreadEventInbox.subscribe((events:any) => {
        // console.log("Unread events", events);
        set(events?.events?.length ?? 0);
    });

    return () => {
        sub?.unsubscribe();
    }
});
