import { ClientEvents } from "discord.js";

export interface IEvent {
    readonly name: keyof ClientEvents;
    execute(...args: ClientEvents[IEvent["name"]]): void;
}