import { Client, ClientOptions, Collection, Snowflake } from "discord.js";
import { resolve } from "path";
import * as request from "superagent";
import config from "../config.json";
import EventsLoader from "./Events";
import ModulesLoader from "./Modules";
import Util from "./Util";
import CommandsHandler from "./Commands";
import { IGuildManager, IUserManager, EventProp, CommandComponent, HelpMeta, IDatabases } from "../typings";
import { LogWrapper } from "./LogWrapper";
import { Adapter as DatabaseAdapter } from "../database";

// Extending DiscordJS structures
import "../structures/User";
import "../structures/Guild";
import "../structures/GuildMember";
import "../structures/Message";

export default class BotClient extends Client {
    readonly config = config;
    readonly request = request;
    public guilds!: IGuildManager;
    public users!: IUserManager;
    readonly events: Collection<string, EventProp> = new Collection();
    readonly commands: Collection<string | undefined, CommandComponent | undefined> = new Collection();
    readonly aliases: Collection<string | undefined, string> = new Collection();
    readonly categories: Collection<string, Collection<string | undefined, CommandComponent | undefined>> = new Collection();
    readonly helpMeta: Collection<string, HelpMeta> = new Collection();
    readonly cooldowns: Collection<string, Collection<Snowflake, number>> = new Collection();
    readonly util = new Util(this);
    readonly commandsHandler = new CommandsHandler(this);
    readonly loader = {events: new EventsLoader(this, resolve(__dirname, "..", "events")), modules: new ModulesLoader(this, resolve(__dirname, "..", "commands"))};
    readonly log = new LogWrapper(this.config.botName).logger;
    readonly db: IDatabases;
    constructor(opt: ClientOptions) {
        super(opt);
        this.db = {
            Adapter: new DatabaseAdapter(process.env.MONGODB_URI as string, {}).connect(),
        };
    }

    public build(token: string | undefined): BotClient {
        this.loader.events.build();
        this.on("ready", () => this.loader.modules.build());
        this.login(token);
        return this;
    }
}
