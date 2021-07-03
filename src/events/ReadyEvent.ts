import { IEvent } from "../../typings";
import Rendang from "../structures/Rendang";

export default class ReadyEvent implements IEvent {
    readonly name = "ready";
    constructor(private client: Rendang) {}

    public execute(): void {
        this.client.logger.info(`${this.client.user!.username} is ready to serve ${this.client.users.cache.size - 1} users on ${this.client.guilds.cache.size} guilds in `
        + `${this.client.channels.cache.filter(ch => ch.type === "text").size} text channels `
        + `and ${this.client.channels.cache.filter(ch => ch.type === "voice").size} voice channels!`);
        return undefined;
    }
}
