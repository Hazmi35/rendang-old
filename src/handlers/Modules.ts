import { readdir } from "fs";
import BotClient from "./BotClient";
import { CommandComponent, ModuleConf } from "../typings";

export default class ModulesLoader {
    constructor(private client: BotClient, readonly path: string) {}

    public build(): BotClient {
        readdir(this.path, (err, categoriesRaw: string[]) => {
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
}
