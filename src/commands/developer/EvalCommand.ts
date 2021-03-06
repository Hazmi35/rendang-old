/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-eval */
import BaseCommand from "../../structures/BaseCommand";
import BotClient from "../../handlers/BotClient";
import { IMessage, CommandComponent } from "../../typings";
import { MessageEmbed } from "discord.js";
import { parse as parseUrl } from "url";

export default class EvalCommand extends BaseCommand {
    constructor(client: BotClient, readonly _config: CommandComponent["_config"]) {
        super(client, _config, {
            aliases: ["ev", "js-exec", "e", "evaluate"],
            cooldown: 0,
            devOnly: true
        }, {
            name: "eval",
            description: "Only the developer can use this command.",
            usage: "{prefix}eval <some js code>"
        });
    }

    public async execute(message: IMessage): Promise<IMessage> {
        const msg = message;
        const client = this.client;

        const embed = new MessageEmbed()
            .setColor("GREEN")
            .addField("Input", "```js\n" + message.args.join(" ") + "```");

        try {
            const code = message.args.slice(0).join(" ");
            if (!code) return this.invalid(message, "No js code was provided");
            let evaled;
            if (message.flag.includes("silent") && message.flag.includes("async")) {
                await eval(`(async function() {
                        ${code}
                    })()`);
                return message;
            } else if (message.flag.includes("async")) {
                evaled = await eval(`(async function() {
                        ${code}
                    })()`);
            } else if (message.flag.includes("silent")) {
                await eval(code);
                return message;
            } else evaled = await eval(code);

            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled, {
                    depth: 0
                });

            const output = this.clean(evaled);
            if (output.length > 1024) {
                const hastebin = await message.client.util.hastebin(output);
                embed.addField("Output", hastebin);
            } else embed.addField("Output", "```js\n" + output + "```");
            message.channel.send(embed);
        } catch (e) {
            const error = this.clean(e);
            if (error.length > 1024) {
                const hastebin = await message.client.util.hastebin(error);
                embed.addField("Error", hastebin);
            } else embed.addField("Error", "```js\n" + error + "```");
            message.channel.send(embed);
        }

        return message;
    }

    private clean(text: string): string {
        if (typeof text === "string") {
            return text
                .replace(new RegExp(process.env.DISCORD_TOKEN!, "g"), "[REDACTED]")
                .replace(new RegExp(parseUrl(process.env.MONGODB_URI!).auth!, "g"), "[REDACTED]")
                .replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        } else return text;
    }
}
