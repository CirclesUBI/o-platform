import {MyInbox} from "../stores/inbox";
import {MarkAsReadDocument, MarkAsReadMutationVariables, MarkAsReadResult, ProfileEvent} from "../api/data/types";
import {ApiClient} from "../apiConnection";

export function markAsRead(event:ProfileEvent) {
    if (!event || !event.unread) return;

    event.unread = false;
    ApiClient.mutate<MarkAsReadResult, MarkAsReadMutationVariables>(
        MarkAsReadDocument, {
            entryIds: [event.unread_marker_id]
        }).then(_ => {
        MyInbox.update({
            type: event.type,
            transaction_hash: event.transaction_hash,
        });
    });
}
