// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License

import { Activity, ActivityTypes } from "botbuilder";

export namespace ActivityExtensions {
    export function createReply(source: Activity, text?: string, local?: string): Activity {
        const reply = text || "";
        return {
            channelId: source.channelId,
            conversation: source.conversation,
            from: source.recipient,
            label: source.label,
            locale: local,
            recipient: source.from,
            replyToId: source.id,
            serviceUrl: source.serviceUrl,
            text: reply,
            timestamp: new Date(),
            type: ActivityTypes.Message,
            valueType: source.valueType,
            localTimezone: source.localTimezone,
            listenFor: source.listenFor,
            semanticAction: source.semanticAction,
        };
    }

    export function isStartActivity(activity: Activity): boolean {
        switch (activity.channelId){           
            case "skype":{
                if(activity.type == ActivityTypes.ContactRelationUpdate && activity.action == "add"){
                    return true;
                }
                return false;
            };
            case "directline":
            case "emulator":
            case "webchat":
            case "msteams":{
                if(activity.type == ActivityTypes.ConversationUpdate){
                    if(activity.membersAdded && activity.membersAdded.some(m => m.id == activity.recipient.id)){
                        // When bot is added to the conversation (triggers start only once per conversation)
                        return true;
                    }
                }
                return false;
            };
            default:
                return false;                
        }
    }
}
