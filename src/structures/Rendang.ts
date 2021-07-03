/* eslint-disable no-underscore-dangle */
import { Client, ClientOptions } from "discord.js";
import config from "../config";
import { resolve } from "path";
import * as superagent from "superagent";
import { LogWrapper } from "../utils/LogWrapper";
import ListenerManager from "../managers/ListenerManager";

// Extending DiscordJS structures
// still none yet.

export default class Rendang extends Client {
    readonly config = config;
    readonly request = superagent;
    readonly logger = new LogWrapper(this.config.botName).logger;
    readonly events = new ListenerManager(this);
    constructor(options?: ClientOptions) { super(options); }

    public async build(token: string): Promise<Rendang> {
        this.events.load(resolve(__dirname, "..", "events"));
        await this.login(token);
        return this;
    }
}