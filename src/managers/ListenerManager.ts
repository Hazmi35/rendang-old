/* eslint-disable @typescript-eslint/unbound-method */
import Rendang from "../structures/Rendang";
import { IEvent } from "typings";
import { readdirSync } from "fs";

export default class ListenerManager {
    constructor(public client: Rendang) {}

    public add(event: IEvent): Rendang {
        this.client.logger.info(`Listener #${this.listenerCount(event.name)} for event '${event.name}'`);
        return this.client.addListener(event.name, (...args: any) => event.execute(...args));
    }
    public emit(eventName: IEvent["name"]): any {
        return this.client.emit(eventName);
    }
    public listenerCount(eventName: IEvent["name"]): number {
        return this.client.listenerCount(eventName);
    }
    public listeners(eventName: IEvent["name"]): Function[] {
        return this.client.listeners(eventName);
    }
    public load(path: string): Rendang {
        const eventFiles: string[] = readdirSync(path);
        for (const eventFile of eventFiles) {
            const event = new (require(`${path}/${eventFile}`).default)(this.client);
            this.add(event);
        }
        return this.client;
    }
    public remove(eventName: IEvent["name"]): Rendang {
        return this.client.removeListener(eventName, () => this.client.logger.info(`Listener ${this.listenerCount(eventName)} for event '${eventName}' has been removed`));
    }
    public reload(path: string, eventName?: IEvent["name"]): Rendang {
        const eventFiles: string[] = [];
        if (!eventName) readdirSync(path).forEach(e => eventFiles.push(e));
        for (const eventFile of eventFiles) {
            const event = new (require(`${path}/${eventFile}`).default)(this.client);
            this.add(event);
        }
        return this.client;
    }
}
