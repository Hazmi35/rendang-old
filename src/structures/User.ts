import { Structures } from "discord.js";
import BotClient from "../handlers/BotClient";
import { IUser } from "../typings";

Structures.extend("User", DJSUser => {
    class User extends DJSUser implements IUser {
        readonly isDev: boolean;
        constructor(client: BotClient, data: object) {
            super(client, data);
            this.isDev = client.config.devs.includes(this.id);
        }
    }

    return User;
});
