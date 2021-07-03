/* import Rendang from "../structures/Rendang";
import { readdir } from "fs";
import { Collection } from "discord.js";

export default class CommandsManager {
    readonly commands: Collection<string, CommandComponent> = new Collection();
    readonly aliases: Collection<string, string> = new Collection();
    readonly categories: Collection<string, Collection<string, CommandComponent>> = new Collection();
    readonly helpMeta: Collection<string, HelpMeta> = new Collection();
    readonly cooldowns: Collection<string, Collection<Snowflake, number>> = new Collection();
    constructor(public client: Rendang) {}

    public load(path: string): void {
        readdir(path, (err, categoriesRaw: string[]) => {
            if (err) {
                this.client.log.error("MODULES_LOADER_ERR: ", err);
            }
            const categories = categoriesRaw.filter(c => !c.endsWith(".schema"));
            this.client.log.info(`Found ${categories.length} categories.`);
            categories.forEach(category => {
                const moduleConf: ModuleConf = require(`${this.path}/${category}/module.json`);
                moduleConf.path = `${this.path}/${category}`;
                moduleConf.cmds = [];
                if (!moduleConf) return undefined;
                this.client.commandsHandler.helpMeta.set(category, moduleConf);
                readdir(`${this.path}/${category}`, (err, filesRaw: string[]) => {
                    const files = filesRaw.filter(f => f.endsWith("js") || f.endsWith(".ts"));
                    if (err) this.client.log.error("MODULES_LOADER_ERR: ", err);
                    this.client.log.info(`Found ${files.length} command(s) from ${category}`);
                    const disabledCommands: string[] = [];
                    files.forEach(file => {
                        const prop: CommandComponent = new (require(`${this.path}/${category}/${file}`).default)(this.client, { category, path: `${this.path}/${category}/${file}`});
                        if (prop.conf.disable) disabledCommands.push(prop.help.name);
                        this.client.commandsHandler.commands.set(prop.help.name, prop);
                        prop.conf.aliases!.forEach(alias => {
                            this.client.commandsHandler.aliases.set(alias, prop.help.name);
                        });
                        moduleConf.cmds.push(prop.help.name);
                    });
                    if (disabledCommands.length !== 0) this.client.log.info(`There are ${disabledCommands.length} command(s) disabled.`);
                    this.client.commandsHandler.categories.set(category, this.client.commandsHandler.commands.filter((cmd: CommandComponent | undefined) => cmd!.help.category === category));
                });
            });
        });
        return this.client;
    }
} */